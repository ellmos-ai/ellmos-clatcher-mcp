#!/usr/bin/env node
/**
 * Clatcher MCP Server (Claude + Patcher)
 *
 * Best-of MCP: Only tools that extend Claude Code beyond its built-in
 * capabilities (Read/Write/Edit/Glob/Grep/Bash). No redundant file I/O.
 *
 * Tools:
 *   fix_json        - Repair broken JSON (comments, trailing commas, single quotes)
 *   fix_encoding    - Fix encoding issues (BOM, broken UTF-8, cp1252 artifacts)
 *   fix_umlauts     - Fix German broken umlauts (Ã¤ → ä, etc.)
 *   convert_format  - JSON ↔ YAML ↔ TOML ↔ XML ↔ CSV ↔ INI conversion
 *   detect_dupes    - Find duplicate files by content hash
 *   folder_diff     - Snapshot-based directory comparison
 *   batch_rename    - Pattern-based file renaming (regex, prefix, suffix, counter)
 *   archive         - Create/extract/list ZIP archives
 *   checksum        - File hash (SHA256, MD5, SHA1, SHA512)
 *   cleanup_file    - Remove BOM, trailing whitespace, fix line endings
 *   scan_emoji      - Find emojis in code files
 *   regex_test      - Test regex patterns against text
 *
 * Copyright (c) 2026 Lukas (BACH). MIT License.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as fs from "fs/promises";
import * as fsSync from "fs";
import * as path from "path";
import * as crypto from "crypto";
import * as os from "os";
import { exec } from "child_process";
import { promisify } from "util";
import * as yaml from "js-yaml";
import * as toml from "smol-toml";
import { XMLParser, XMLBuilder } from "fast-xml-parser";
import AdmZip from "adm-zip";

const execAsync = promisify(exec);

const server = new McpServer({
  name: "ellmos-clatcher-mcp",
  version: "1.0.0",
});

// ============================================================================
// Helpers
// ============================================================================

function norm(p: string): string { return path.normalize(p); }

async function exists(p: string): Promise<boolean> {
  try { await fs.access(p); return true; } catch { return false; }
}

function fmtSize(bytes: number): string {
  const u = ["B", "KB", "MB", "GB"];
  let i = 0, s = bytes;
  while (s >= 1024 && i < u.length - 1) { s /= 1024; i++; }
  return `${s.toFixed(1)} ${u[i]}`;
}

function ok(text: string) { return { content: [{ type: "text" as const, text }] }; }
function err(text: string) { return { isError: true as const, content: [{ type: "text" as const, text }] }; }

// ============================================================================
// Tool 1: fix_json
// ============================================================================

// @ts-ignore: MCP SDK Zod type depth
server.tool(
  "fix_json",
  "Repair broken JSON: strip comments, fix trailing commas, convert single quotes, remove BOM/NUL. Supports dry_run mode.",
  {
    path: z.string().describe("Path to the JSON file"),
    dry_run: z.boolean().default(true).describe("true = analyze only, false = write repaired file"),
  },
  async ({ path: filePath, dry_run }) => {
    try {
      const fp = norm(filePath);
      if (!await exists(fp)) return err(`File not found: ${fp}`);

      let content = await fs.readFile(fp, "utf-8");
      const fixes: string[] = [];

      // BOM
      if (content.charCodeAt(0) === 0xFEFF) { content = content.slice(1); fixes.push("BOM removed"); }
      // NUL bytes
      if (content.includes("\0")) { content = content.replace(/\0/g, ""); fixes.push("NUL bytes removed"); }
      // Single-line comments
      const c1 = content;
      content = content.replace(/^\s*\/\/.*$/gm, "");
      if (content !== c1) fixes.push("Single-line comments removed");
      // Block comments
      const c2 = content;
      content = content.replace(/\/\*[\s\S]*?\*\//g, "");
      if (content !== c2) fixes.push("Block comments removed");
      // Trailing commas
      const c3 = content;
      content = content.replace(/,\s*([\]}])/g, "$1");
      if (content !== c3) fixes.push("Trailing commas removed");
      // Single quotes → double quotes (naive but effective for config files)
      const c4 = content;
      content = content.replace(/'/g, '"');
      if (content !== c4) fixes.push("Single quotes → double quotes");

      // Validate
      let valid = false;
      let parseErr = "";
      try { JSON.parse(content); valid = true; } catch (e: any) { parseErr = e.message; }

      if (fixes.length === 0 && valid) return ok(`**${path.basename(fp)}** -- valid JSON, no repairs needed.`);

      if (!dry_run && fixes.length > 0) {
        await fs.writeFile(fp, content, "utf-8");
      }

      const lines = [
        `**${path.basename(fp)}** -- ${dry_run ? "Analysis" : "Repaired"}`,
        "", "Fixes:", ...fixes.map(f => `  - ${f}`), "",
        valid ? "Result: valid JSON" : `Result: still invalid -- ${parseErr}`,
      ];
      return ok(lines.join("\n"));
    } catch (e: any) { return err(e.message); }
  }
);

// ============================================================================
// Tool 2: fix_encoding
// ============================================================================

// @ts-ignore: MCP SDK Zod type depth
server.tool(
  "fix_encoding",
  "Fix encoding issues: detect and repair BOM, broken UTF-8, cp1252 artifacts. Common on Windows.",
  {
    path: z.string().describe("Path to the file"),
    dry_run: z.boolean().default(true).describe("true = analyze only, false = write fixed file"),
  },
  async ({ path: filePath, dry_run }) => {
    try {
      const fp = norm(filePath);
      if (!await exists(fp)) return err(`File not found: ${fp}`);

      const buf = await fs.readFile(fp);
      let content = buf.toString("utf-8");
      const fixes: string[] = [];

      // BOM
      if (content.charCodeAt(0) === 0xFEFF) { content = content.slice(1); fixes.push("UTF-8 BOM removed"); }
      // Common cp1252 → UTF-8 mojibake patterns (double-encoded UTF-8)
      const replacements: [RegExp, string, string][] = [
        [/\u00C3\u00A4/g, "\u00E4", "double-encoded ae -> \u00E4"],
        [/\u00C3\u00B6/g, "\u00F6", "double-encoded oe -> \u00F6"],
        [/\u00C3\u00BC/g, "\u00FC", "double-encoded ue -> \u00FC"],
        [/\u00C3\u00A9/g, "\u00E9", "double-encoded e-acute -> \u00E9"],
        [/\u00C3\u00A8/g, "\u00E8", "double-encoded e-grave -> \u00E8"],
        [/\u00C3\u00A0/g, "\u00E0", "double-encoded a-grave -> \u00E0"],
      ];
      // Additional patterns using string-based regex for C1 control chars
      const c1Patterns: [string, string, string][] = [
        ["\u00C3\u0084", "\u00C4", "double-encoded Ae -> \u00C4"],
        ["\u00C3\u0096", "\u00D6", "double-encoded Oe -> \u00D6"],
        ["\u00C3\u009C", "\u00DC", "double-encoded Ue -> \u00DC"],
        ["\u00C3\u009F", "\u00DF", "double-encoded sz -> \u00DF"],
      ];
      for (const [search, repl, desc] of c1Patterns) {
        if (content.includes(search)) {
          content = content.split(search).join(repl);
          fixes.push(desc);
        }
      }
      for (const [re, repl, desc] of replacements) {
        const before = content;
        content = content.replace(re, repl);
        if (content !== before) fixes.push(desc);
      }
      // Replacement character
      if (content.includes("\uFFFD")) { fixes.push("Warning: contains \uFFFD replacement characters (data loss possible)"); }
      // NUL bytes
      if (content.includes("\0")) { content = content.replace(/\0/g, ""); fixes.push("NUL bytes removed"); }

      if (fixes.length === 0) return ok(`**${path.basename(fp)}** -- no encoding issues found.`);

      if (!dry_run) await fs.writeFile(fp, content, "utf-8");

      return ok([
        `**${path.basename(fp)}** -- ${dry_run ? "Analysis" : "Fixed"}`,
        "", ...fixes.map(f => `  - ${f}`),
      ].join("\n"));
    } catch (e: any) { return err(e.message); }
  }
);

// ============================================================================
// Tool 3: fix_umlauts
// ============================================================================

// @ts-ignore: MCP SDK Zod type depth
server.tool(
  "fix_umlauts",
  "Fix broken German umlauts from double-encoding or cp1252 artifacts (Ã¤→ä, Ã¶→ö, etc.)",
  {
    path: z.string().describe("Path to the file"),
    dry_run: z.boolean().default(true).describe("true = analyze only"),
  },
  async ({ path: filePath, dry_run }) => {
    try {
      const fp = norm(filePath);
      if (!await exists(fp)) return err(`File not found: ${fp}`);

      let content = await fs.readFile(fp, "utf-8");
      const fixes: string[] = [];
      let totalFixes = 0;

      // Double-encoded UTF-8 (most common)
      const umlautMap: [RegExp, string, string][] = [
        [/Ã¤/g, "ä", "Ã¤→ä"], [/Ã¶/g, "ö", "Ã¶→ö"], [/Ã¼/g, "ü", "Ã¼→ü"],
        [/Ã„/g, "Ä", "Ã„→Ä"], [/Ã–/g, "Ö", "Ã–→Ö"], [/Ãœ/g, "Ü", "Ãœ→Ü"],
        [/ÃŸ/g, "ß", "ÃŸ→ß"], [/Ã©/g, "é", "Ã©→é"], [/Ã¨/g, "è", "Ã¨→è"],
      ];
      // HTML entities
      const htmlMap: [RegExp, string, string][] = [
        [/&auml;/gi, "ä", "&auml;→ä"], [/&ouml;/gi, "ö", "&ouml;→ö"],
        [/&uuml;/gi, "ü", "&uuml;→ü"], [/&Auml;/gi, "Ä", "&Auml;→Ä"],
        [/&Ouml;/gi, "Ö", "&Ouml;→Ö"], [/&Uuml;/gi, "Ü", "&Uuml;→Ü"],
        [/&szlig;/gi, "ß", "&szlig;→ß"],
      ];
      // ae/oe/ue digraphs (only in obvious patterns, conservative)
      const digraphMap: [RegExp, string, string][] = [
        [/\bae\b/g, "ä", "ae→ä (standalone)"],
        [/\boe\b/g, "ö", "oe→ö (standalone)"],
        [/\bue\b/g, "ü", "ue→ü (standalone)"],
      ];

      for (const maps of [umlautMap, htmlMap]) {
        for (const [re, repl, desc] of maps) {
          const matches = content.match(re);
          if (matches) {
            content = content.replace(re, repl);
            totalFixes += matches.length;
            fixes.push(`${desc} (${matches.length}x)`);
          }
        }
      }

      if (fixes.length === 0) return ok(`**${path.basename(fp)}** -- no umlaut issues found.`);

      if (!dry_run) await fs.writeFile(fp, content, "utf-8");

      return ok([
        `**${path.basename(fp)}** -- ${dry_run ? "Analysis" : "Fixed"}`,
        `${totalFixes} replacements:`, ...fixes.map(f => `  - ${f}`),
      ].join("\n"));
    } catch (e: any) { return err(e.message); }
  }
);

// ============================================================================
// Tool 4: convert_format
// ============================================================================

// @ts-ignore: MCP SDK Zod type depth
server.tool(
  "convert_format",
  "Convert between data formats: JSON, YAML, TOML, XML, CSV, INI. Reads input file and writes output file.",
  {
    input_path: z.string().describe("Source file path"),
    output_path: z.string().describe("Target file path"),
    input_format: z.enum(["json", "yaml", "toml", "xml", "csv", "ini"]).describe("Source format"),
    output_format: z.enum(["json", "yaml", "toml", "xml", "csv", "ini"]).describe("Target format"),
  },
  async ({ input_path, output_path, input_format, output_format }) => {
    try {
      const inPath = norm(input_path);
      const outPath = norm(output_path);
      if (!await exists(inPath)) return err(`File not found: ${inPath}`);

      const raw = await fs.readFile(inPath, "utf-8");
      let data: any;

      // Parse input
      switch (input_format) {
        case "json": data = JSON.parse(raw); break;
        case "yaml": data = yaml.load(raw); break;
        case "toml": data = toml.parse(raw); break;
        case "xml": data = new XMLParser({ ignoreAttributes: false }).parse(raw); break;
        case "csv": {
          const lines = raw.trim().split("\n");
          if (lines.length < 2) return err("CSV needs at least header + 1 data row");
          const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));
          data = lines.slice(1).map(line => {
            const vals = line.split(",").map(v => v.trim().replace(/^"|"$/g, ""));
            const obj: Record<string, string> = {};
            headers.forEach((h, i) => obj[h] = vals[i] || "");
            return obj;
          });
          break;
        }
        case "ini": {
          const result: Record<string, Record<string, string>> = {};
          let section = "DEFAULT";
          for (const line of raw.split("\n")) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith(";") || trimmed.startsWith("#")) continue;
            const secMatch = trimmed.match(/^\[(.+)\]$/);
            if (secMatch) { section = secMatch[1]; result[section] = result[section] || {}; continue; }
            const kvMatch = trimmed.match(/^([^=]+)=(.*)$/);
            if (kvMatch) { result[section] = result[section] || {}; result[section][kvMatch[1].trim()] = kvMatch[2].trim(); }
          }
          data = result;
          break;
        }
      }

      // Serialize output
      let output: string;
      switch (output_format) {
        case "json": output = JSON.stringify(data, null, 2); break;
        case "yaml": output = yaml.dump(data, { lineWidth: 120, noRefs: true }); break;
        case "toml":
          if (typeof data !== "object" || data === null || Array.isArray(data))
            return err("TOML requires an object as root element");
          output = toml.stringify(data); break;
        case "xml":
          output = new XMLBuilder({ ignoreAttributes: false, format: true }).build(data); break;
        case "csv": {
          if (!Array.isArray(data)) return err("CSV output requires array of objects");
          const keys = Object.keys(data[0] || {});
          const rows = [keys.join(","), ...data.map((row: any) => keys.map(k => `"${String(row[k] ?? "").replace(/"/g, '""')}"`).join(","))];
          output = rows.join("\n");
          break;
        }
        case "ini": {
          if (typeof data !== "object" || Array.isArray(data)) return err("INI requires an object");
          const parts: string[] = [];
          for (const [sec, vals] of Object.entries(data)) {
            if (typeof vals === "object" && vals !== null) {
              parts.push(`[${sec}]`);
              for (const [k, v] of Object.entries(vals)) parts.push(`${k} = ${v}`);
              parts.push("");
            }
          }
          output = parts.join("\n");
          break;
        }
        default: return err(`Unsupported output format: ${output_format}`);
      }

      await fs.writeFile(outPath, output, "utf-8");
      const stats = await fs.stat(outPath);
      return ok(`Converted ${input_format.toUpperCase()} → ${output_format.toUpperCase()}\n  Source: ${inPath}\n  Target: ${outPath} (${fmtSize(stats.size)})`);
    } catch (e: any) { return err(e.message); }
  }
);

// ============================================================================
// Tool 5: detect_dupes
// ============================================================================

// @ts-ignore: MCP SDK Zod type depth
server.tool(
  "detect_dupes",
  "Find duplicate files in a directory by content hash (SHA256). Groups files with identical content.",
  {
    directory: z.string().describe("Directory to scan"),
    recursive: z.boolean().default(true).describe("Scan subdirectories"),
    min_size: z.number().default(1).describe("Minimum file size in bytes (skip empty files)"),
    extensions: z.string().optional().describe("Comma-separated file extensions to check (e.g. 'py,js,ts'). Empty = all files"),
  },
  async ({ directory, recursive, min_size, extensions }) => {
    try {
      const dir = norm(directory);
      if (!await exists(dir)) return err(`Directory not found: ${dir}`);

      const extFilter = extensions ? new Set(extensions.split(",").map(e => "." + e.trim().replace(/^\./, ""))) : null;

      // Collect files
      async function collectFiles(d: string): Promise<string[]> {
        const entries = await fs.readdir(d, { withFileTypes: true });
        const files: string[] = [];
        for (const entry of entries) {
          const full = path.join(d, entry.name);
          if (entry.isDirectory() && recursive) {
            if (entry.name.startsWith(".") || entry.name === "node_modules" || entry.name === "__pycache__") continue;
            files.push(...await collectFiles(full));
          } else if (entry.isFile()) {
            if (extFilter && !extFilter.has(path.extname(entry.name).toLowerCase())) continue;
            try {
              const st = await fs.stat(full);
              if (st.size >= min_size) files.push(full);
            } catch { /* skip inaccessible */ }
          }
        }
        return files;
      }

      const files = await collectFiles(dir);

      // Group by size first (optimization)
      const sizeMap = new Map<number, string[]>();
      for (const f of files) {
        const st = await fs.stat(f);
        const arr = sizeMap.get(st.size) || [];
        arr.push(f);
        sizeMap.set(st.size, arr);
      }

      // Hash only files with same size
      const hashMap = new Map<string, string[]>();
      let hashedCount = 0;
      for (const [, group] of sizeMap) {
        if (group.length < 2) continue;
        for (const f of group) {
          const buf = await fs.readFile(f);
          const hash = crypto.createHash("sha256").update(buf).digest("hex");
          const arr = hashMap.get(hash) || [];
          arr.push(f);
          hashMap.set(hash, arr);
          hashedCount++;
        }
      }

      // Filter to actual duplicates
      const dupes: { hash: string; files: string[]; size: number }[] = [];
      let totalWasted = 0;
      for (const [hash, group] of hashMap) {
        if (group.length < 2) continue;
        const size = (await fs.stat(group[0])).size;
        dupes.push({ hash, files: group, size });
        totalWasted += size * (group.length - 1);
      }

      if (dupes.length === 0) return ok(`No duplicates found.\nScanned: ${files.length} files, hashed: ${hashedCount}`);

      const totalDupeFiles = dupes.reduce((s, d) => s + d.files.length, 0);
      const lines = [
        "**Duplicate Files Found**", "",
        `| Metric | Value |`, `|---|---|`,
        `| Files scanned | ${files.length} |`,
        `| Duplicate groups | ${dupes.length} |`,
        `| Duplicate files | ${totalDupeFiles} |`,
        `| Wasted space | ${fmtSize(totalWasted)} |`,
      ];

      for (let i = 0; i < Math.min(dupes.length, 25); i++) {
        const d = dupes[i];
        lines.push("", `**Group ${i + 1}** (${fmtSize(d.size)}, ${d.files.length} copies):`);
        for (const f of d.files) lines.push(`  - ${path.relative(dir, f)}`);
      }
      if (dupes.length > 25) lines.push("", `... and ${dupes.length - 25} more groups`);

      return ok(lines.join("\n"));
    } catch (e: any) { return err(e.message); }
  }
);

// ============================================================================
// Tool 6: folder_diff
// ============================================================================

// @ts-ignore: MCP SDK Zod type depth
server.tool(
  "folder_diff",
  "Compare two directories, or take a snapshot and compare on next call. Shows new, modified, and deleted files.",
  {
    directory: z.string().describe("Directory to compare/snapshot"),
    compare_to: z.string().optional().describe("Second directory to compare against. Omit for snapshot mode."),
  },
  async ({ directory, compare_to }) => {
    try {
      const dir = norm(directory);
      if (!await exists(dir)) return err(`Directory not found: ${dir}`);

      async function scanDir(d: string): Promise<Map<string, { size: number; mtime: number }>> {
        const result = new Map<string, { size: number; mtime: number }>();
        async function walk(current: string) {
          const entries = await fs.readdir(current, { withFileTypes: true });
          for (const entry of entries) {
            if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
            const full = path.join(current, entry.name);
            if (entry.isDirectory()) { await walk(full); continue; }
            if (entry.isFile()) {
              const st = await fs.stat(full);
              result.set(path.relative(d, full), { size: st.size, mtime: st.mtimeMs });
            }
          }
        }
        await walk(d);
        return result;
      }

      if (compare_to) {
        // Direct comparison of two directories
        const dir2 = norm(compare_to);
        if (!await exists(dir2)) return err(`Directory not found: ${dir2}`);

        const [mapA, mapB] = await Promise.all([scanDir(dir), scanDir(dir2)]);
        const onlyA: string[] = [], onlyB: string[] = [], modified: string[] = [], same: string[] = [];

        for (const [file, infoA] of mapA) {
          const infoB = mapB.get(file);
          if (!infoB) onlyA.push(file);
          else if (infoA.size !== infoB.size) modified.push(file);
          else same.push(file);
        }
        for (const file of mapB.keys()) {
          if (!mapA.has(file)) onlyB.push(file);
        }

        const lines = [
          `**Folder Diff**`, "",
          `| | |`, `|---|---|`,
          `| Dir A | ${dir} |`, `| Dir B | ${dir2} |`,
          `| Only in A | ${onlyA.length} |`, `| Only in B | ${onlyB.length} |`,
          `| Modified (size differs) | ${modified.length} |`, `| Same | ${same.length} |`,
        ];
        if (onlyA.length) { lines.push("", "**Only in A:**"); for (const f of onlyA.slice(0, 30)) lines.push(`  - ${f}`); }
        if (onlyB.length) { lines.push("", "**Only in B:**"); for (const f of onlyB.slice(0, 30)) lines.push(`  - ${f}`); }
        if (modified.length) { lines.push("", "**Modified:**"); for (const f of modified.slice(0, 30)) lines.push(`  - ${f}`); }
        return ok(lines.join("\n"));
      } else {
        // Snapshot mode
        const snapshotDir = path.join(os.tmpdir(), "clatcher-snapshots");
        await fs.mkdir(snapshotDir, { recursive: true });
        const snapshotFile = path.join(snapshotDir, Buffer.from(dir).toString("base64url") + ".json");

        const current = await scanDir(dir);
        const currentObj = Object.fromEntries(current);

        if (!await exists(snapshotFile)) {
          await fs.writeFile(snapshotFile, JSON.stringify(currentObj), "utf-8");
          return ok(`**Snapshot created** for ${path.basename(dir)}\nFiles: ${current.size}\nSnapshot: ${snapshotFile}\n\nCall again to see changes.`);
        }

        const previous = new Map(Object.entries(JSON.parse(await fs.readFile(snapshotFile, "utf-8"))));
        const newFiles: string[] = [], modified: string[] = [], deleted: string[] = [];

        for (const [file, info] of current) {
          const prev = previous.get(file) as any;
          if (!prev) newFiles.push(file);
          else if (prev.size !== info.size || prev.mtime !== info.mtime) modified.push(file);
        }
        for (const file of previous.keys()) {
          if (!current.has(file as string)) deleted.push(file as string);
        }

        // Update snapshot
        await fs.writeFile(snapshotFile, JSON.stringify(currentObj), "utf-8");

        if (!newFiles.length && !modified.length && !deleted.length)
          return ok(`**No changes** in ${path.basename(dir)} (${current.size} files)`);

        const lines = [
          `**Changes in ${path.basename(dir)}**`, "",
          `| Type | Count |`, `|---|---|`,
          `| New | ${newFiles.length} |`, `| Modified | ${modified.length} |`,
          `| Deleted | ${deleted.length} |`, `| Unchanged | ${current.size - newFiles.length - modified.length} |`,
        ];
        if (newFiles.length) { lines.push("", "**New:**"); for (const f of newFiles.slice(0, 30)) lines.push(`  + ${f}`); }
        if (modified.length) { lines.push("", "**Modified:**"); for (const f of modified.slice(0, 30)) lines.push(`  ~ ${f}`); }
        if (deleted.length) { lines.push("", "**Deleted:**"); for (const f of deleted.slice(0, 30)) lines.push(`  - ${f}`); }
        return ok(lines.join("\n"));
      }
    } catch (e: any) { return err(e.message); }
  }
);

// ============================================================================
// Tool 7: batch_rename
// ============================================================================

// @ts-ignore: MCP SDK Zod type depth
server.tool(
  "batch_rename",
  "Rename multiple files using regex pattern, prefix/suffix, or counter. Always preview first with dry_run=true.",
  {
    directory: z.string().describe("Directory containing files to rename"),
    pattern: z.string().describe("Regex pattern to match in filenames"),
    replacement: z.string().describe("Replacement string ($1, $2 for capture groups)"),
    extensions: z.string().optional().describe("Comma-separated extensions to filter (e.g. 'jpg,png')"),
    dry_run: z.boolean().default(true).describe("true = preview only"),
  },
  async ({ directory, pattern, replacement, extensions, dry_run }) => {
    try {
      const dir = norm(directory);
      if (!await exists(dir)) return err(`Directory not found: ${dir}`);

      const re = new RegExp(pattern);
      const extFilter = extensions ? new Set(extensions.split(",").map(e => "." + e.trim().replace(/^\./, ""))) : null;

      const entries = await fs.readdir(dir, { withFileTypes: true });
      const renames: { from: string; to: string }[] = [];

      for (const entry of entries) {
        if (!entry.isFile()) continue;
        if (extFilter && !extFilter.has(path.extname(entry.name).toLowerCase())) continue;
        if (!re.test(entry.name)) continue;
        const newName = entry.name.replace(re, replacement);
        if (newName !== entry.name) renames.push({ from: entry.name, to: newName });
      }

      if (renames.length === 0) return ok(`No files match pattern /${pattern}/ in ${dir}`);

      if (dry_run) {
        const lines = [`**Preview** (${renames.length} renames):`, ""];
        for (const r of renames.slice(0, 50)) lines.push(`  ${r.from} → ${r.to}`);
        if (renames.length > 50) lines.push(`  ... and ${renames.length - 50} more`);
        lines.push("", "Set dry_run=false to execute.");
        return ok(lines.join("\n"));
      }

      let success = 0;
      const errors: string[] = [];
      for (const r of renames) {
        try {
          await fs.rename(path.join(dir, r.from), path.join(dir, r.to));
          success++;
        } catch (e: any) { errors.push(`${r.from}: ${e.message}`); }
      }

      const lines = [`**Renamed ${success}/${renames.length} files**`];
      if (errors.length) { lines.push("", "Errors:"); for (const e of errors) lines.push(`  - ${e}`); }
      return ok(lines.join("\n"));
    } catch (e: any) { return err(e.message); }
  }
);

// ============================================================================
// Tool 8: archive
// ============================================================================

// @ts-ignore: MCP SDK Zod type depth
server.tool(
  "archive",
  "Create, extract, or list ZIP archives.",
  {
    action: z.enum(["create", "extract", "list"]).describe("Operation"),
    archive_path: z.string().describe("Path to the ZIP file"),
    source_paths: z.array(z.string()).optional().describe("Files/directories to add (for create)"),
    extract_to: z.string().optional().describe("Extraction directory (for extract)"),
  },
  async ({ action, archive_path, source_paths, extract_to }) => {
    try {
      const archPath = norm(archive_path);

      if (action === "create") {
        if (!source_paths?.length) return err("source_paths required for create");
        const zip = new AdmZip();
        for (const src of source_paths) {
          const srcPath = norm(src);
          const stat = await fs.stat(srcPath);
          if (stat.isDirectory()) {
            zip.addLocalFolder(srcPath, path.basename(srcPath));
          } else {
            zip.addLocalFile(srcPath);
          }
        }
        zip.writeZip(archPath);
        const info = await fs.stat(archPath);
        return ok(`Archive created: ${archPath}\nSize: ${fmtSize(info.size)}\nEntries: ${source_paths.length}`);
      }

      if (action === "extract") {
        if (!await exists(archPath)) return err(`Archive not found: ${archPath}`);
        const target = norm(extract_to || path.dirname(archPath));
        const zip = new AdmZip(archPath);
        zip.extractAllTo(target, true);
        return ok(`Extracted: ${archPath}\nTo: ${target}\nEntries: ${zip.getEntries().length}`);
      }

      if (action === "list") {
        if (!await exists(archPath)) return err(`Archive not found: ${archPath}`);
        const zip = new AdmZip(archPath);
        const entries = zip.getEntries();
        const lines = [`**${path.basename(archPath)}** (${entries.length} entries):`, ""];
        let totalSize = 0;
        for (const e of entries.slice(0, 100)) {
          lines.push(`  ${e.isDirectory ? "📁" : "📄"} ${e.entryName} (${fmtSize(e.header.size)})`);
          totalSize += e.header.size;
        }
        if (entries.length > 100) lines.push(`  ... and ${entries.length - 100} more`);
        lines.push("", `Total uncompressed: ${fmtSize(totalSize)}`);
        return ok(lines.join("\n"));
      }

      return err("Invalid action");
    } catch (e: any) { return err(e.message); }
  }
);

// ============================================================================
// Tool 9: checksum
// ============================================================================

// @ts-ignore: MCP SDK Zod type depth
server.tool(
  "checksum",
  "Calculate file hash (SHA256, MD5, SHA1, SHA512). Optionally verify against expected hash.",
  {
    path: z.string().describe("Path to the file"),
    algorithm: z.enum(["sha256", "md5", "sha1", "sha512"]).default("sha256"),
    expected: z.string().optional().describe("Expected hash to verify against"),
  },
  async ({ path: filePath, algorithm, expected }) => {
    try {
      const fp = norm(filePath);
      if (!await exists(fp)) return err(`File not found: ${fp}`);
      const buf = await fs.readFile(fp);
      const hash = crypto.createHash(algorithm).update(buf).digest("hex");
      let result = `**${path.basename(fp)}**\nAlgorithm: ${algorithm.toUpperCase()}\nHash: ${hash}`;
      if (expected) {
        const match = hash.toLowerCase() === expected.toLowerCase();
        result += `\nExpected: ${expected}\nResult: ${match ? "MATCH" : "MISMATCH"}`;
      }
      return ok(result);
    } catch (e: any) { return err(e.message); }
  }
);

// ============================================================================
// Tool 10: cleanup_file
// ============================================================================

// @ts-ignore: MCP SDK Zod type depth
server.tool(
  "cleanup_file",
  "Remove BOM, trailing whitespace, fix line endings, remove NUL bytes. Configurable per-option.",
  {
    path: z.string().describe("Path to the file"),
    remove_bom: z.boolean().default(true),
    remove_trailing_whitespace: z.boolean().default(true),
    normalize_line_endings: z.enum(["lf", "crlf", "none"]).default("lf"),
    remove_nul_bytes: z.boolean().default(true),
    ensure_final_newline: z.boolean().default(true),
    dry_run: z.boolean().default(true),
  },
  async ({ path: filePath, remove_bom, remove_trailing_whitespace, normalize_line_endings, remove_nul_bytes, ensure_final_newline, dry_run }) => {
    try {
      const fp = norm(filePath);
      if (!await exists(fp)) return err(`File not found: ${fp}`);
      let content = await fs.readFile(fp, "utf-8");
      const fixes: string[] = [];

      if (remove_bom && content.charCodeAt(0) === 0xFEFF) { content = content.slice(1); fixes.push("BOM removed"); }
      if (remove_nul_bytes && content.includes("\0")) { content = content.replace(/\0/g, ""); fixes.push("NUL bytes removed"); }
      if (remove_trailing_whitespace) {
        const before = content;
        content = content.replace(/[ \t]+$/gm, "");
        if (content !== before) fixes.push("Trailing whitespace removed");
      }
      if (normalize_line_endings === "lf") {
        const before = content;
        content = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
        if (content !== before) fixes.push("Line endings → LF");
      } else if (normalize_line_endings === "crlf") {
        const before = content;
        content = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n").replace(/\n/g, "\r\n");
        if (content !== before) fixes.push("Line endings → CRLF");
      }
      if (ensure_final_newline && content.length > 0 && !content.endsWith("\n")) {
        content += normalize_line_endings === "crlf" ? "\r\n" : "\n";
        fixes.push("Final newline added");
      }

      if (fixes.length === 0) return ok(`**${path.basename(fp)}** -- already clean.`);
      if (!dry_run) await fs.writeFile(fp, content, "utf-8");
      return ok([`**${path.basename(fp)}** -- ${dry_run ? "Preview" : "Cleaned"}`, ...fixes.map(f => `  - ${f}`)].join("\n"));
    } catch (e: any) { return err(e.message); }
  }
);

// ============================================================================
// Tool 11: scan_emoji
// ============================================================================

// @ts-ignore: MCP SDK Zod type depth
server.tool(
  "scan_emoji",
  "Scan code files for emoji characters. Useful for finding accidental emojis in source code.",
  {
    directory: z.string().describe("Directory to scan"),
    extensions: z.string().default("py,js,ts,json,md,txt,yaml,yml,toml").describe("Comma-separated file extensions"),
    recursive: z.boolean().default(true),
  },
  async ({ directory, extensions, recursive }) => {
    try {
      const dir = norm(directory);
      if (!await exists(dir)) return err(`Directory not found: ${dir}`);

      const extSet = new Set(extensions.split(",").map(e => "." + e.trim().replace(/^\./, "")));
      const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{200D}\u{20E3}\u{FE0F}]/gu;

      const results: { file: string; line: number; emoji: string; text: string }[] = [];
      const emojiCount = new Map<string, number>();

      async function scan(d: string) {
        const entries = await fs.readdir(d, { withFileTypes: true });
        for (const entry of entries) {
          const full = path.join(d, entry.name);
          if (entry.isDirectory()) {
            if (recursive && !entry.name.startsWith(".") && entry.name !== "node_modules") await scan(full);
            continue;
          }
          if (!extSet.has(path.extname(entry.name).toLowerCase())) continue;
          try {
            const content = await fs.readFile(full, "utf-8");
            const lines = content.split("\n");
            for (let i = 0; i < lines.length; i++) {
              const matches = lines[i].match(emojiRegex);
              if (matches) {
                for (const m of matches) {
                  emojiCount.set(m, (emojiCount.get(m) || 0) + 1);
                  results.push({ file: path.relative(dir, full), line: i + 1, emoji: m, text: lines[i].trim().substring(0, 80) });
                }
              }
            }
          } catch { /* skip unreadable */ }
        }
      }

      await scan(dir);
      if (results.length === 0) return ok(`No emojis found in ${dir}`);

      const sorted = [...emojiCount.entries()].sort((a, b) => b[1] - a[1]);
      const lines = [
        `**Emoji Scan** (${results.length} occurrences in ${new Set(results.map(r => r.file)).size} files)`, "",
        "| Emoji | Count | Codepoint |", "|---|---|---|",
        ...sorted.slice(0, 20).map(([e, c]) => `| ${e} | ${c} | U+${e.codePointAt(0)!.toString(16).toUpperCase()} |`),
        "", "**Locations:**",
        ...results.slice(0, 40).map(r => `  ${r.file}:${r.line} ${r.emoji} -- ${r.text}`),
      ];
      if (results.length > 40) lines.push(`  ... and ${results.length - 40} more`);
      return ok(lines.join("\n"));
    } catch (e: any) { return err(e.message); }
  }
);

// ============================================================================
// Tool 12: regex_test
// ============================================================================

// @ts-ignore: MCP SDK Zod type depth
server.tool(
  "regex_test",
  "Test a regex pattern against text. Shows all matches with groups and positions.",
  {
    pattern: z.string().describe("Regex pattern"),
    text: z.string().describe("Text to test against"),
    flags: z.string().default("g").describe("Regex flags (g, i, m, s, u)"),
  },
  async ({ pattern, text, flags }) => {
    try {
      const re = new RegExp(pattern, flags);
      const matches: { match: string; index: number; groups: string[] }[] = [];

      if (flags.includes("g")) {
        let m: RegExpExecArray | null;
        while ((m = re.exec(text)) !== null) {
          matches.push({ match: m[0], index: m.index, groups: m.slice(1) });
          if (m.index === re.lastIndex) re.lastIndex++;
        }
      } else {
        const m = re.exec(text);
        if (m) matches.push({ match: m[0], index: m.index, groups: m.slice(1) });
      }

      const lines = [`**Regex Test**`, `Pattern: \`/${pattern}/${flags}\``, ""];
      if (matches.length === 0) {
        lines.push("No matches.");
      } else {
        lines.push(`${matches.length} match(es):`, "");
        for (let i = 0; i < Math.min(matches.length, 50); i++) {
          const m = matches[i];
          lines.push(`  [${i}] "${m.match}" at index ${m.index}`);
          if (m.groups.length) lines.push(`       Groups: ${m.groups.map((g, j) => `$${j + 1}="${g}"`).join(", ")}`);
        }
        if (matches.length > 50) lines.push(`  ... and ${matches.length - 50} more`);
      }
      return ok(lines.join("\n"));
    } catch (e: any) { return err(`Invalid regex: ${e.message}`); }
  }
);

// ============================================================================
// Start Server
// ============================================================================

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch(console.error);
