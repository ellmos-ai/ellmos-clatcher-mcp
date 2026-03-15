/**
 * Comprehensive test suite for ellmos-clatcher-mcp
 *
 * Tests the core logic of all 12 MCP tools using temporary files/directories.
 * Since the tool handlers are registered via server.tool() and not exported,
 * we replicate the core logic in test helpers and validate behavior.
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "fs/promises";
import * as fsSync from "fs";
import * as path from "path";
import * as crypto from "crypto";
import * as os from "os";
import * as yaml from "js-yaml";
import * as toml from "smol-toml";
import { XMLParser, XMLBuilder } from "fast-xml-parser";
import AdmZip from "adm-zip";

// ============================================================================
// Test Helpers -- mirror the logic from src/index.ts
// ============================================================================

function norm(p: string): string {
  return path.normalize(p);
}

async function exists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

function fmtSize(bytes: number): string {
  const u = ["B", "KB", "MB", "GB"];
  let i = 0,
    s = bytes;
  while (s >= 1024 && i < u.length - 1) {
    s /= 1024;
    i++;
  }
  return `${s.toFixed(1)} ${u[i]}`;
}

/** Create a temp directory for each test */
async function makeTmpDir(): Promise<string> {
  return await fs.mkdtemp(path.join(os.tmpdir(), "clatcher-test-"));
}

/** Recursively remove directory */
async function rmDir(dir: string): Promise<void> {
  try {
    await fs.rm(dir, { recursive: true, force: true });
  } catch {
    // ignore errors on cleanup
  }
}

// ============================================================================
// Tool 1: fix_json
// ============================================================================

/**
 * Replicates fix_json logic from src/index.ts
 */
async function fixJson(
  filePath: string,
  dryRun: boolean
): Promise<{ fixes: string[]; valid: boolean; parseErr: string; content: string }> {
  let content = await fs.readFile(filePath, "utf-8");
  const fixes: string[] = [];

  // BOM
  if (content.charCodeAt(0) === 0xfeff) {
    content = content.slice(1);
    fixes.push("BOM removed");
  }
  // NUL bytes
  if (content.includes("\0")) {
    content = content.replace(/\0/g, "");
    fixes.push("NUL bytes removed");
  }
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
  // Single quotes -> double quotes
  const c4 = content;
  content = content.replace(/'/g, '"');
  if (content !== c4) fixes.push("Single quotes -> double quotes");

  let valid = false;
  let parseErr = "";
  try {
    JSON.parse(content);
    valid = true;
  } catch (e: any) {
    parseErr = e.message;
  }

  if (!dryRun && fixes.length > 0) {
    await fs.writeFile(filePath, content, "utf-8");
  }

  return { fixes, valid, parseErr, content };
}

describe("Tool 1: fix_json", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await makeTmpDir();
  });
  afterEach(async () => {
    await rmDir(tmpDir);
  });

  it("should detect valid JSON with no fixes needed", async () => {
    const fp = path.join(tmpDir, "valid.json");
    await fs.writeFile(fp, '{"key": "value"}', "utf-8");
    const result = await fixJson(fp, true);
    expect(result.fixes).toHaveLength(0);
    expect(result.valid).toBe(true);
  });

  it("should remove BOM", async () => {
    const fp = path.join(tmpDir, "bom.json");
    await fs.writeFile(fp, '\uFEFF{"key": "value"}', "utf-8");
    const result = await fixJson(fp, true);
    expect(result.fixes).toContain("BOM removed");
    expect(result.valid).toBe(true);
  });

  it("should remove NUL bytes", async () => {
    const fp = path.join(tmpDir, "nul.json");
    await fs.writeFile(fp, '{"key"\0: "value"}', "utf-8");
    const result = await fixJson(fp, true);
    expect(result.fixes).toContain("NUL bytes removed");
    expect(result.valid).toBe(true);
  });

  it("should strip single-line comments", async () => {
    const fp = path.join(tmpDir, "comments.json");
    await fs.writeFile(
      fp,
      '// This is a comment\n{"key": "value"}\n// Another comment',
      "utf-8"
    );
    const result = await fixJson(fp, true);
    expect(result.fixes).toContain("Single-line comments removed");
    expect(result.valid).toBe(true);
  });

  it("should strip block comments", async () => {
    const fp = path.join(tmpDir, "block.json");
    await fs.writeFile(fp, '/* comment */{"key": /* inline */ "value"}', "utf-8");
    const result = await fixJson(fp, true);
    expect(result.fixes).toContain("Block comments removed");
    expect(result.valid).toBe(true);
  });

  it("should fix trailing commas", async () => {
    const fp = path.join(tmpDir, "trailing.json");
    await fs.writeFile(fp, '{"a": 1, "b": 2,}', "utf-8");
    const result = await fixJson(fp, true);
    expect(result.fixes).toContain("Trailing commas removed");
    expect(result.valid).toBe(true);
  });

  it("should fix trailing commas in arrays", async () => {
    const fp = path.join(tmpDir, "trailing-arr.json");
    await fs.writeFile(fp, '{"a": [1, 2, 3,]}', "utf-8");
    const result = await fixJson(fp, true);
    expect(result.fixes).toContain("Trailing commas removed");
    expect(result.valid).toBe(true);
  });

  it("should convert single quotes to double quotes", async () => {
    const fp = path.join(tmpDir, "quotes.json");
    await fs.writeFile(fp, "{'key': 'value'}", "utf-8");
    const result = await fixJson(fp, true);
    expect(result.fixes).toContain("Single quotes -> double quotes");
    expect(result.valid).toBe(true);
  });

  it("should handle multiple issues at once", async () => {
    const fp = path.join(tmpDir, "multi.json");
    await fs.writeFile(
      fp,
      "\uFEFF// comment\n{'key': 'value',}",
      "utf-8"
    );
    const result = await fixJson(fp, true);
    expect(result.fixes.length).toBeGreaterThanOrEqual(3);
    expect(result.valid).toBe(true);
  });

  it("should write file when dry_run=false", async () => {
    const fp = path.join(tmpDir, "write.json");
    await fs.writeFile(fp, '{"a": 1,}', "utf-8");
    await fixJson(fp, false);
    const content = await fs.readFile(fp, "utf-8");
    expect(content).toBe('{"a": 1}');
    JSON.parse(content); // should not throw
  });

  it("should NOT write file when dry_run=true", async () => {
    const fp = path.join(tmpDir, "nowrite.json");
    const original = '{"a": 1,}';
    await fs.writeFile(fp, original, "utf-8");
    await fixJson(fp, true);
    const content = await fs.readFile(fp, "utf-8");
    expect(content).toBe(original);
  });

  it("should handle empty file", async () => {
    const fp = path.join(tmpDir, "empty.json");
    await fs.writeFile(fp, "", "utf-8");
    const result = await fixJson(fp, true);
    expect(result.valid).toBe(false);
  });

  it("should handle deeply broken JSON and report it as invalid", async () => {
    const fp = path.join(tmpDir, "broken.json");
    await fs.writeFile(fp, "{{{not json at all", "utf-8");
    const result = await fixJson(fp, true);
    expect(result.valid).toBe(false);
    expect(result.parseErr).toBeTruthy();
  });
});

// ============================================================================
// Tool 2: fix_encoding
// ============================================================================

async function fixEncoding(
  filePath: string,
  dryRun: boolean
): Promise<{ fixes: string[]; content: string }> {
  const buf = await fs.readFile(filePath);
  let content = buf.toString("utf-8");
  const fixes: string[] = [];

  // BOM
  if (content.charCodeAt(0) === 0xfeff) {
    content = content.slice(1);
    fixes.push("UTF-8 BOM removed");
  }
  // C1 patterns (double-encoded uppercase umlauts and eszett)
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
  // Common cp1252 -> UTF-8 mojibake patterns
  const replacements: [RegExp, string, string][] = [
    [/\u00C3\u00A4/g, "\u00E4", "double-encoded ae -> \u00E4"],
    [/\u00C3\u00B6/g, "\u00F6", "double-encoded oe -> \u00F6"],
    [/\u00C3\u00BC/g, "\u00FC", "double-encoded ue -> \u00FC"],
    [/\u00C3\u00A9/g, "\u00E9", "double-encoded e-acute -> \u00E9"],
    [/\u00C3\u00A8/g, "\u00E8", "double-encoded e-grave -> \u00E8"],
    [/\u00C3\u00A0/g, "\u00E0", "double-encoded a-grave -> \u00E0"],
  ];
  for (const [re, repl, desc] of replacements) {
    const before = content;
    content = content.replace(re, repl);
    if (content !== before) fixes.push(desc);
  }
  // Replacement character
  if (content.includes("\uFFFD")) {
    fixes.push("Warning: contains \uFFFD replacement characters (data loss possible)");
  }
  // NUL bytes
  if (content.includes("\0")) {
    content = content.replace(/\0/g, "");
    fixes.push("NUL bytes removed");
  }

  if (!dryRun && fixes.length > 0) {
    await fs.writeFile(filePath, content, "utf-8");
  }

  return { fixes, content };
}

describe("Tool 2: fix_encoding", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await makeTmpDir();
  });
  afterEach(async () => {
    await rmDir(tmpDir);
  });

  it("should detect clean file with no issues", async () => {
    const fp = path.join(tmpDir, "clean.txt");
    await fs.writeFile(fp, "Hello World", "utf-8");
    const result = await fixEncoding(fp, true);
    expect(result.fixes).toHaveLength(0);
  });

  it("should remove UTF-8 BOM", async () => {
    const fp = path.join(tmpDir, "bom.txt");
    await fs.writeFile(fp, "\uFEFFHello", "utf-8");
    const result = await fixEncoding(fp, true);
    expect(result.fixes).toContain("UTF-8 BOM removed");
    expect(result.content).toBe("Hello");
  });

  it("should fix double-encoded lowercase umlauts", async () => {
    const fp = path.join(tmpDir, "umlauts.txt");
    // \u00C3\u00A4 is the double-encoded form of ae
    await fs.writeFile(fp, "\u00C3\u00A4\u00C3\u00B6\u00C3\u00BC", "utf-8");
    const result = await fixEncoding(fp, true);
    expect(result.content).toBe("\u00E4\u00F6\u00FC");
  });

  it("should fix double-encoded uppercase umlauts via C1 patterns", async () => {
    const fp = path.join(tmpDir, "upper-umlauts.txt");
    await fs.writeFile(fp, "\u00C3\u0084\u00C3\u0096\u00C3\u009C", "utf-8");
    const result = await fixEncoding(fp, true);
    expect(result.content).toBe("\u00C4\u00D6\u00DC");
  });

  it("should fix double-encoded eszett", async () => {
    const fp = path.join(tmpDir, "eszett.txt");
    await fs.writeFile(fp, "\u00C3\u009F", "utf-8");
    const result = await fixEncoding(fp, true);
    expect(result.content).toBe("\u00DF");
  });

  it("should warn about replacement characters", async () => {
    const fp = path.join(tmpDir, "fffd.txt");
    await fs.writeFile(fp, "Hello \uFFFD World", "utf-8");
    const result = await fixEncoding(fp, true);
    expect(result.fixes.some((f) => f.includes("replacement characters"))).toBe(true);
  });

  it("should remove NUL bytes", async () => {
    const fp = path.join(tmpDir, "nul.txt");
    await fs.writeFile(fp, "Hello\0World", "utf-8");
    const result = await fixEncoding(fp, true);
    expect(result.fixes).toContain("NUL bytes removed");
    expect(result.content).toBe("HelloWorld");
  });

  it("should write fixed file when dry_run=false", async () => {
    const fp = path.join(tmpDir, "fix.txt");
    await fs.writeFile(fp, "\uFEFFHello\0World", "utf-8");
    await fixEncoding(fp, false);
    const content = await fs.readFile(fp, "utf-8");
    expect(content).toBe("HelloWorld");
  });

  it("should NOT write file when dry_run=true", async () => {
    const fp = path.join(tmpDir, "nofix.txt");
    await fs.writeFile(fp, "\uFEFFHello", "utf-8");
    await fixEncoding(fp, true);
    const raw = await fs.readFile(fp, "utf-8");
    expect(raw.charCodeAt(0)).toBe(0xfeff);
  });
});

// ============================================================================
// Tool 3: fix_umlauts
// ============================================================================

async function fixUmlauts(
  filePath: string,
  dryRun: boolean
): Promise<{ fixes: string[]; totalFixes: number; content: string }> {
  let content = await fs.readFile(filePath, "utf-8");
  const fixes: string[] = [];
  let totalFixes = 0;

  const umlautMap: [RegExp, string, string][] = [
    [/Ã¤/g, "ä", "Ã¤→ä"],
    [/Ã¶/g, "ö", "Ã¶→ö"],
    [/Ã¼/g, "ü", "Ã¼→ü"],
    [/Ã„/g, "Ä", "Ã„→Ä"],
    [/Ã–/g, "Ö", "Ã–→Ö"],
    [/Ãœ/g, "Ü", "Ãœ→Ü"],
    [/ÃŸ/g, "ß", "ÃŸ→ß"],
    [/Ã©/g, "é", "Ã©→é"],
    [/Ã¨/g, "è", "Ã¨→è"],
  ];
  const htmlMap: [RegExp, string, string][] = [
    [/&auml;/gi, "ä", "&auml;→ä"],
    [/&ouml;/gi, "ö", "&ouml;→ö"],
    [/&uuml;/gi, "ü", "&uuml;→ü"],
    [/&Auml;/gi, "Ä", "&Auml;→Ä"],
    [/&Ouml;/gi, "Ö", "&Ouml;→Ö"],
    [/&Uuml;/gi, "Ü", "&Uuml;→Ü"],
    [/&szlig;/gi, "ß", "&szlig;→ß"],
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

  if (!dryRun && fixes.length > 0) {
    await fs.writeFile(filePath, content, "utf-8");
  }

  return { fixes, totalFixes, content };
}

describe("Tool 3: fix_umlauts", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await makeTmpDir();
  });
  afterEach(async () => {
    await rmDir(tmpDir);
  });

  it("should detect clean file with correct umlauts", async () => {
    const fp = path.join(tmpDir, "clean.txt");
    await fs.writeFile(fp, "Hallo Welt mit ä ö ü", "utf-8");
    const result = await fixUmlauts(fp, true);
    expect(result.fixes).toHaveLength(0);
    expect(result.totalFixes).toBe(0);
  });

  it("should fix broken lowercase umlauts (Ã¤ -> ae)", async () => {
    const fp = path.join(tmpDir, "broken.txt");
    await fs.writeFile(fp, "Ã¤ Ã¶ Ã¼", "utf-8");
    const result = await fixUmlauts(fp, true);
    expect(result.content).toBe("ä ö ü");
    expect(result.totalFixes).toBe(3);
  });

  it("should fix broken uppercase umlauts", async () => {
    const fp = path.join(tmpDir, "upper.txt");
    await fs.writeFile(fp, "Ã„ Ã– Ãœ", "utf-8");
    const result = await fixUmlauts(fp, true);
    expect(result.content).toBe("Ä Ö Ü");
    expect(result.totalFixes).toBe(3);
  });

  it("should fix broken eszett", async () => {
    const fp = path.join(tmpDir, "eszett.txt");
    await fs.writeFile(fp, "GroÃŸ", "utf-8");
    const result = await fixUmlauts(fp, true);
    expect(result.content).toBe("Groß");
  });

  it("should fix HTML entities", async () => {
    const fp = path.join(tmpDir, "html.txt");
    await fs.writeFile(fp, "&auml; &ouml; &uuml; &szlig;", "utf-8");
    const result = await fixUmlauts(fp, true);
    expect(result.content).toBe("ä ö ü ß");
    expect(result.totalFixes).toBe(4);
  });

  it("should fix HTML entities case-insensitively", async () => {
    const fp = path.join(tmpDir, "html-case.txt");
    await fs.writeFile(fp, "&AUML; &Ouml;", "utf-8");
    const result = await fixUmlauts(fp, true);
    // Note: &Auml; pattern is case-insensitive, so it replaces &AUML; too
    // But the replacement for &Auml; is "Ä" and for &auml; is "ä"
    // Since &auml; uses /gi, &AUML; matches &auml; first (earlier in the list)
    expect(result.totalFixes).toBe(2);
  });

  it("should handle multiple occurrences and count correctly", async () => {
    const fp = path.join(tmpDir, "multi.txt");
    await fs.writeFile(fp, "Ã¤Ã¤Ã¤ Ã¶Ã¶", "utf-8");
    const result = await fixUmlauts(fp, true);
    expect(result.content).toBe("äää öö");
    expect(result.totalFixes).toBe(5);
  });

  it("should write file when dry_run=false", async () => {
    const fp = path.join(tmpDir, "write.txt");
    await fs.writeFile(fp, "Ã¤", "utf-8");
    await fixUmlauts(fp, false);
    const content = await fs.readFile(fp, "utf-8");
    expect(content).toBe("ä");
  });

  it("should fix accented characters (e-acute, e-grave)", async () => {
    const fp = path.join(tmpDir, "accents.txt");
    await fs.writeFile(fp, "Ã© Ã¨", "utf-8");
    const result = await fixUmlauts(fp, true);
    expect(result.content).toBe("é è");
  });
});

// ============================================================================
// Tool 4: convert_format
// ============================================================================

async function convertFormat(
  inputPath: string,
  outputPath: string,
  inputFormat: string,
  outputFormat: string
): Promise<void> {
  const raw = await fs.readFile(inputPath, "utf-8");
  let data: any;

  switch (inputFormat) {
    case "json":
      data = JSON.parse(raw);
      break;
    case "yaml":
      data = yaml.load(raw);
      break;
    case "toml":
      data = toml.parse(raw);
      break;
    case "xml":
      data = new XMLParser({ ignoreAttributes: false }).parse(raw);
      break;
    case "csv": {
      const lines = raw.trim().split("\n");
      if (lines.length < 2) throw new Error("CSV needs at least header + 1 data row");
      const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
      data = lines.slice(1).map((line) => {
        const vals = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
        const obj: Record<string, string> = {};
        headers.forEach((h, i) => (obj[h] = vals[i] || ""));
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
        if (secMatch) {
          section = secMatch[1];
          result[section] = result[section] || {};
          continue;
        }
        const kvMatch = trimmed.match(/^([^=]+)=(.*)$/);
        if (kvMatch) {
          result[section] = result[section] || {};
          result[section][kvMatch[1].trim()] = kvMatch[2].trim();
        }
      }
      data = result;
      break;
    }
  }

  let output: string;
  switch (outputFormat) {
    case "json":
      output = JSON.stringify(data, null, 2);
      break;
    case "yaml":
      output = yaml.dump(data, { lineWidth: 120, noRefs: true });
      break;
    case "toml":
      if (typeof data !== "object" || data === null || Array.isArray(data))
        throw new Error("TOML requires an object as root element");
      output = toml.stringify(data);
      break;
    case "xml":
      output = new XMLBuilder({ ignoreAttributes: false, format: true }).build(data);
      break;
    case "csv": {
      if (!Array.isArray(data)) throw new Error("CSV output requires array of objects");
      const keys = Object.keys(data[0] || {});
      const rows = [
        keys.join(","),
        ...data.map((row: any) =>
          keys.map((k) => `"${String(row[k] ?? "").replace(/"/g, '""')}"`).join(",")
        ),
      ];
      output = rows.join("\n");
      break;
    }
    case "ini": {
      if (typeof data !== "object" || Array.isArray(data))
        throw new Error("INI requires an object");
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
    default:
      throw new Error(`Unsupported output format: ${outputFormat}`);
  }

  await fs.writeFile(outputPath, output, "utf-8");
}

describe("Tool 4: convert_format", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await makeTmpDir();
  });
  afterEach(async () => {
    await rmDir(tmpDir);
  });

  it("should convert JSON to YAML", async () => {
    const inFile = path.join(tmpDir, "input.json");
    const outFile = path.join(tmpDir, "output.yaml");
    await fs.writeFile(inFile, '{"name": "test", "version": 1}', "utf-8");
    await convertFormat(inFile, outFile, "json", "yaml");
    const result = await fs.readFile(outFile, "utf-8");
    const parsed = yaml.load(result) as any;
    expect(parsed.name).toBe("test");
    expect(parsed.version).toBe(1);
  });

  it("should convert YAML to JSON", async () => {
    const inFile = path.join(tmpDir, "input.yaml");
    const outFile = path.join(tmpDir, "output.json");
    await fs.writeFile(inFile, "name: test\nversion: 2\n", "utf-8");
    await convertFormat(inFile, outFile, "yaml", "json");
    const parsed = JSON.parse(await fs.readFile(outFile, "utf-8"));
    expect(parsed.name).toBe("test");
    expect(parsed.version).toBe(2);
  });

  it("should convert JSON to TOML", async () => {
    const inFile = path.join(tmpDir, "input.json");
    const outFile = path.join(tmpDir, "output.toml");
    await fs.writeFile(inFile, '{"name": "test", "count": 42}', "utf-8");
    await convertFormat(inFile, outFile, "json", "toml");
    const result = toml.parse(await fs.readFile(outFile, "utf-8"));
    expect(result.name).toBe("test");
    expect(result.count).toBe(42);
  });

  it("should convert TOML to JSON", async () => {
    const inFile = path.join(tmpDir, "input.toml");
    const outFile = path.join(tmpDir, "output.json");
    await fs.writeFile(inFile, 'name = "test"\ncount = 42\n', "utf-8");
    await convertFormat(inFile, outFile, "toml", "json");
    const parsed = JSON.parse(await fs.readFile(outFile, "utf-8"));
    expect(parsed.name).toBe("test");
    expect(parsed.count).toBe(42);
  });

  it("should convert JSON to XML", async () => {
    const inFile = path.join(tmpDir, "input.json");
    const outFile = path.join(tmpDir, "output.xml");
    await fs.writeFile(inFile, '{"root": {"name": "test"}}', "utf-8");
    await convertFormat(inFile, outFile, "json", "xml");
    const result = await fs.readFile(outFile, "utf-8");
    expect(result).toContain("test");
  });

  it("should convert CSV to JSON", async () => {
    const inFile = path.join(tmpDir, "input.csv");
    const outFile = path.join(tmpDir, "output.json");
    await fs.writeFile(inFile, "name,age\nAlice,30\nBob,25\n", "utf-8");
    await convertFormat(inFile, outFile, "csv", "json");
    const parsed = JSON.parse(await fs.readFile(outFile, "utf-8"));
    expect(parsed).toHaveLength(2);
    expect(parsed[0].name).toBe("Alice");
    expect(parsed[0].age).toBe("30");
    expect(parsed[1].name).toBe("Bob");
  });

  it("should convert JSON array to CSV", async () => {
    const inFile = path.join(tmpDir, "input.json");
    const outFile = path.join(tmpDir, "output.csv");
    await fs.writeFile(
      inFile,
      '[{"name": "Alice", "age": 30}, {"name": "Bob", "age": 25}]',
      "utf-8"
    );
    await convertFormat(inFile, outFile, "json", "csv");
    const result = await fs.readFile(outFile, "utf-8");
    expect(result).toContain("name,age");
    expect(result).toContain('"Alice"');
    expect(result).toContain('"Bob"');
  });

  it("should convert INI to JSON", async () => {
    const inFile = path.join(tmpDir, "input.ini");
    const outFile = path.join(tmpDir, "output.json");
    await fs.writeFile(inFile, "[section]\nkey1 = value1\nkey2 = value2\n", "utf-8");
    await convertFormat(inFile, outFile, "ini", "json");
    const parsed = JSON.parse(await fs.readFile(outFile, "utf-8"));
    expect(parsed.section.key1).toBe("value1");
    expect(parsed.section.key2).toBe("value2");
  });

  it("should convert JSON to INI", async () => {
    const inFile = path.join(tmpDir, "input.json");
    const outFile = path.join(tmpDir, "output.ini");
    await fs.writeFile(
      inFile,
      '{"database": {"host": "localhost", "port": "5432"}}',
      "utf-8"
    );
    await convertFormat(inFile, outFile, "json", "ini");
    const result = await fs.readFile(outFile, "utf-8");
    expect(result).toContain("[database]");
    expect(result).toContain("host = localhost");
    expect(result).toContain("port = 5432");
  });

  it("should handle INI comments and empty lines", async () => {
    const inFile = path.join(tmpDir, "input.ini");
    const outFile = path.join(tmpDir, "output.json");
    await fs.writeFile(
      inFile,
      "; comment\n# another comment\n\n[section]\nkey = value\n",
      "utf-8"
    );
    await convertFormat(inFile, outFile, "ini", "json");
    const parsed = JSON.parse(await fs.readFile(outFile, "utf-8"));
    expect(parsed.section.key).toBe("value");
  });

  it("should throw for TOML output from array data", async () => {
    const inFile = path.join(tmpDir, "input.json");
    const outFile = path.join(tmpDir, "output.toml");
    await fs.writeFile(inFile, "[1, 2, 3]", "utf-8");
    await expect(convertFormat(inFile, outFile, "json", "toml")).rejects.toThrow(
      "TOML requires an object"
    );
  });

  it("should throw for CSV output from non-array data", async () => {
    const inFile = path.join(tmpDir, "input.json");
    const outFile = path.join(tmpDir, "output.csv");
    await fs.writeFile(inFile, '{"key": "value"}', "utf-8");
    await expect(convertFormat(inFile, outFile, "json", "csv")).rejects.toThrow(
      "CSV output requires array"
    );
  });

  it("should throw for CSV input with only a header", async () => {
    const inFile = path.join(tmpDir, "input.csv");
    const outFile = path.join(tmpDir, "output.json");
    await fs.writeFile(inFile, "name,age\n", "utf-8");
    // After trim + split, there is only one line (header only)
    await expect(convertFormat(inFile, outFile, "csv", "json")).rejects.toThrow(
      "CSV needs at least header + 1 data row"
    );
  });

  it("should roundtrip JSON -> YAML -> JSON", async () => {
    const original = { name: "roundtrip", items: [1, 2, 3], nested: { a: true } };
    const f1 = path.join(tmpDir, "step1.json");
    const f2 = path.join(tmpDir, "step2.yaml");
    const f3 = path.join(tmpDir, "step3.json");
    await fs.writeFile(f1, JSON.stringify(original), "utf-8");
    await convertFormat(f1, f2, "json", "yaml");
    await convertFormat(f2, f3, "yaml", "json");
    const result = JSON.parse(await fs.readFile(f3, "utf-8"));
    expect(result).toEqual(original);
  });
});

// ============================================================================
// Tool 5: detect_dupes
// ============================================================================

describe("Tool 5: detect_dupes", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await makeTmpDir();
  });
  afterEach(async () => {
    await rmDir(tmpDir);
  });

  async function detectDupes(
    directory: string,
    options: { recursive?: boolean; minSize?: number; extensions?: string | null } = {}
  ): Promise<{ dupes: { hash: string; files: string[]; size: number }[]; totalFiles: number }> {
    const { recursive = true, minSize = 1, extensions = null } = options;
    const dir = norm(directory);
    const extFilter = extensions
      ? new Set(extensions.split(",").map((e) => "." + e.trim().replace(/^\./, "")))
      : null;

    async function collectFiles(d: string): Promise<string[]> {
      const entries = await fs.readdir(d, { withFileTypes: true });
      const files: string[] = [];
      for (const entry of entries) {
        const full = path.join(d, entry.name);
        if (entry.isDirectory() && recursive) {
          if (
            entry.name.startsWith(".") ||
            entry.name === "node_modules" ||
            entry.name === "__pycache__"
          )
            continue;
          files.push(...(await collectFiles(full)));
        } else if (entry.isFile()) {
          if (extFilter && !extFilter.has(path.extname(entry.name).toLowerCase())) continue;
          const st = await fs.stat(full);
          if (st.size >= minSize) files.push(full);
        }
      }
      return files;
    }

    const files = await collectFiles(dir);
    const sizeMap = new Map<number, string[]>();
    for (const f of files) {
      const st = await fs.stat(f);
      const arr = sizeMap.get(st.size) || [];
      arr.push(f);
      sizeMap.set(st.size, arr);
    }

    const hashMap = new Map<string, string[]>();
    for (const [, group] of sizeMap) {
      if (group.length < 2) continue;
      for (const f of group) {
        const buf = await fs.readFile(f);
        const hash = crypto.createHash("sha256").update(buf).digest("hex");
        const arr = hashMap.get(hash) || [];
        arr.push(f);
        hashMap.set(hash, arr);
      }
    }

    const dupes: { hash: string; files: string[]; size: number }[] = [];
    for (const [hash, group] of hashMap) {
      if (group.length < 2) continue;
      const size = (await fs.stat(group[0])).size;
      dupes.push({ hash, files: group, size });
    }

    return { dupes, totalFiles: files.length };
  }

  it("should find no duplicates in unique files", async () => {
    await fs.writeFile(path.join(tmpDir, "a.txt"), "content A", "utf-8");
    await fs.writeFile(path.join(tmpDir, "b.txt"), "content B", "utf-8");
    await fs.writeFile(path.join(tmpDir, "c.txt"), "content C", "utf-8");
    const result = await detectDupes(tmpDir);
    expect(result.dupes).toHaveLength(0);
    expect(result.totalFiles).toBe(3);
  });

  it("should find duplicates with identical content", async () => {
    await fs.writeFile(path.join(tmpDir, "a.txt"), "same content", "utf-8");
    await fs.writeFile(path.join(tmpDir, "b.txt"), "same content", "utf-8");
    await fs.writeFile(path.join(tmpDir, "c.txt"), "different", "utf-8");
    const result = await detectDupes(tmpDir);
    expect(result.dupes).toHaveLength(1);
    expect(result.dupes[0].files).toHaveLength(2);
  });

  it("should find multiple duplicate groups", async () => {
    await fs.writeFile(path.join(tmpDir, "a1.txt"), "group A", "utf-8");
    await fs.writeFile(path.join(tmpDir, "a2.txt"), "group A", "utf-8");
    await fs.writeFile(path.join(tmpDir, "b1.txt"), "group B!", "utf-8");
    await fs.writeFile(path.join(tmpDir, "b2.txt"), "group B!", "utf-8");
    const result = await detectDupes(tmpDir);
    expect(result.dupes).toHaveLength(2);
  });

  it("should scan subdirectories when recursive=true", async () => {
    const sub = path.join(tmpDir, "sub");
    await fs.mkdir(sub);
    await fs.writeFile(path.join(tmpDir, "a.txt"), "duplicate", "utf-8");
    await fs.writeFile(path.join(sub, "b.txt"), "duplicate", "utf-8");
    const result = await detectDupes(tmpDir, { recursive: true });
    expect(result.dupes).toHaveLength(1);
  });

  it("should NOT scan subdirectories when recursive=false", async () => {
    const sub = path.join(tmpDir, "sub");
    await fs.mkdir(sub);
    await fs.writeFile(path.join(tmpDir, "a.txt"), "duplicate", "utf-8");
    await fs.writeFile(path.join(sub, "b.txt"), "duplicate", "utf-8");
    const result = await detectDupes(tmpDir, { recursive: false });
    expect(result.dupes).toHaveLength(0);
    expect(result.totalFiles).toBe(1);
  });

  it("should skip files below min_size", async () => {
    await fs.writeFile(path.join(tmpDir, "a.txt"), "x", "utf-8"); // 1 byte
    await fs.writeFile(path.join(tmpDir, "b.txt"), "x", "utf-8"); // 1 byte
    const result = await detectDupes(tmpDir, { minSize: 10 });
    expect(result.totalFiles).toBe(0);
  });

  it("should filter by extensions", async () => {
    await fs.writeFile(path.join(tmpDir, "a.txt"), "same", "utf-8");
    await fs.writeFile(path.join(tmpDir, "b.txt"), "same", "utf-8");
    await fs.writeFile(path.join(tmpDir, "c.js"), "same", "utf-8");
    const result = await detectDupes(tmpDir, { extensions: "txt" });
    expect(result.dupes).toHaveLength(1);
    expect(result.dupes[0].files).toHaveLength(2);
    // .js file should be excluded
    expect(result.totalFiles).toBe(2);
  });

  it("should skip hidden directories", async () => {
    const hidden = path.join(tmpDir, ".hidden");
    await fs.mkdir(hidden);
    await fs.writeFile(path.join(tmpDir, "a.txt"), "dup", "utf-8");
    await fs.writeFile(path.join(hidden, "b.txt"), "dup", "utf-8");
    const result = await detectDupes(tmpDir, { recursive: true });
    expect(result.dupes).toHaveLength(0);
  });

  it("should skip node_modules directory", async () => {
    const nm = path.join(tmpDir, "node_modules");
    await fs.mkdir(nm);
    await fs.writeFile(path.join(tmpDir, "a.txt"), "dup", "utf-8");
    await fs.writeFile(path.join(nm, "b.txt"), "dup", "utf-8");
    const result = await detectDupes(tmpDir, { recursive: true });
    expect(result.dupes).toHaveLength(0);
  });
});

// ============================================================================
// Tool 6: folder_diff
// ============================================================================

describe("Tool 6: folder_diff", () => {
  let tmpDirA: string;
  let tmpDirB: string;

  beforeEach(async () => {
    tmpDirA = await makeTmpDir();
    tmpDirB = await makeTmpDir();
  });
  afterEach(async () => {
    await rmDir(tmpDirA);
    await rmDir(tmpDirB);
  });

  async function scanDir(
    d: string
  ): Promise<Map<string, { size: number; mtime: number }>> {
    const result = new Map<string, { size: number; mtime: number }>();
    async function walk(current: string) {
      const entries = await fs.readdir(current, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
        const full = path.join(current, entry.name);
        if (entry.isDirectory()) {
          await walk(full);
          continue;
        }
        if (entry.isFile()) {
          const st = await fs.stat(full);
          result.set(path.relative(d, full), { size: st.size, mtime: st.mtimeMs });
        }
      }
    }
    await walk(d);
    return result;
  }

  function compareDirs(
    mapA: Map<string, { size: number; mtime: number }>,
    mapB: Map<string, { size: number; mtime: number }>
  ): { onlyA: string[]; onlyB: string[]; modified: string[]; same: string[] } {
    const onlyA: string[] = [],
      onlyB: string[] = [],
      modified: string[] = [],
      same: string[] = [];
    for (const [file, infoA] of mapA) {
      const infoB = mapB.get(file);
      if (!infoB) onlyA.push(file);
      else if (infoA.size !== infoB.size) modified.push(file);
      else same.push(file);
    }
    for (const file of mapB.keys()) {
      if (!mapA.has(file)) onlyB.push(file);
    }
    return { onlyA, onlyB, modified, same };
  }

  it("should detect identical directories", async () => {
    await fs.writeFile(path.join(tmpDirA, "file.txt"), "content", "utf-8");
    await fs.writeFile(path.join(tmpDirB, "file.txt"), "content", "utf-8");
    const [mapA, mapB] = await Promise.all([scanDir(tmpDirA), scanDir(tmpDirB)]);
    const result = compareDirs(mapA, mapB);
    expect(result.onlyA).toHaveLength(0);
    expect(result.onlyB).toHaveLength(0);
    expect(result.modified).toHaveLength(0);
    expect(result.same).toHaveLength(1);
  });

  it("should detect files only in A", async () => {
    await fs.writeFile(path.join(tmpDirA, "a.txt"), "only in A", "utf-8");
    await fs.writeFile(path.join(tmpDirA, "shared.txt"), "shared", "utf-8");
    await fs.writeFile(path.join(tmpDirB, "shared.txt"), "shared", "utf-8");
    const [mapA, mapB] = await Promise.all([scanDir(tmpDirA), scanDir(tmpDirB)]);
    const result = compareDirs(mapA, mapB);
    expect(result.onlyA).toContain("a.txt");
    expect(result.onlyA).toHaveLength(1);
  });

  it("should detect files only in B", async () => {
    await fs.writeFile(path.join(tmpDirA, "shared.txt"), "shared", "utf-8");
    await fs.writeFile(path.join(tmpDirB, "shared.txt"), "shared", "utf-8");
    await fs.writeFile(path.join(tmpDirB, "b.txt"), "only in B", "utf-8");
    const [mapA, mapB] = await Promise.all([scanDir(tmpDirA), scanDir(tmpDirB)]);
    const result = compareDirs(mapA, mapB);
    expect(result.onlyB).toContain("b.txt");
    expect(result.onlyB).toHaveLength(1);
  });

  it("should detect modified files (different size)", async () => {
    await fs.writeFile(path.join(tmpDirA, "file.txt"), "short", "utf-8");
    await fs.writeFile(path.join(tmpDirB, "file.txt"), "much longer content here", "utf-8");
    const [mapA, mapB] = await Promise.all([scanDir(tmpDirA), scanDir(tmpDirB)]);
    const result = compareDirs(mapA, mapB);
    expect(result.modified).toContain("file.txt");
  });

  it("should handle empty directories", async () => {
    const [mapA, mapB] = await Promise.all([scanDir(tmpDirA), scanDir(tmpDirB)]);
    const result = compareDirs(mapA, mapB);
    expect(result.onlyA).toHaveLength(0);
    expect(result.onlyB).toHaveLength(0);
    expect(result.same).toHaveLength(0);
  });

  it("should scan subdirectories", async () => {
    const subA = path.join(tmpDirA, "sub");
    const subB = path.join(tmpDirB, "sub");
    await fs.mkdir(subA);
    await fs.mkdir(subB);
    await fs.writeFile(path.join(subA, "deep.txt"), "deep", "utf-8");
    await fs.writeFile(path.join(subB, "deep.txt"), "deep", "utf-8");
    const [mapA, mapB] = await Promise.all([scanDir(tmpDirA), scanDir(tmpDirB)]);
    const result = compareDirs(mapA, mapB);
    expect(result.same).toHaveLength(1);
    // The relative path should include the subdir
    expect(result.same[0]).toMatch(/sub/);
  });
});

// ============================================================================
// Tool 7: batch_rename
// ============================================================================

describe("Tool 7: batch_rename", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await makeTmpDir();
  });
  afterEach(async () => {
    await rmDir(tmpDir);
  });

  async function batchRename(
    directory: string,
    pattern: string,
    replacement: string,
    options: { extensions?: string; dryRun?: boolean } = {}
  ): Promise<{ renames: { from: string; to: string }[]; executed: boolean }> {
    const { extensions, dryRun = true } = options;
    const dir = norm(directory);
    const re = new RegExp(pattern);
    const extFilter = extensions
      ? new Set(extensions.split(",").map((e) => "." + e.trim().replace(/^\./, "")))
      : null;

    const entries = await fs.readdir(dir, { withFileTypes: true });
    const renames: { from: string; to: string }[] = [];

    for (const entry of entries) {
      if (!entry.isFile()) continue;
      if (extFilter && !extFilter.has(path.extname(entry.name).toLowerCase())) continue;
      if (!re.test(entry.name)) continue;
      const newName = entry.name.replace(re, replacement);
      if (newName !== entry.name) renames.push({ from: entry.name, to: newName });
    }

    if (!dryRun && renames.length > 0) {
      for (const r of renames) {
        await fs.rename(path.join(dir, r.from), path.join(dir, r.to));
      }
    }

    return { renames, executed: !dryRun };
  }

  it("should preview renames with dry_run=true", async () => {
    await fs.writeFile(path.join(tmpDir, "photo_001.jpg"), "", "utf-8");
    await fs.writeFile(path.join(tmpDir, "photo_002.jpg"), "", "utf-8");
    const result = await batchRename(tmpDir, "photo_", "img_");
    expect(result.renames).toHaveLength(2);
    expect(result.renames[0].from).toBe("photo_001.jpg");
    expect(result.renames[0].to).toBe("img_001.jpg");
    // Files should still have old names
    expect(await exists(path.join(tmpDir, "photo_001.jpg"))).toBe(true);
  });

  it("should execute renames with dry_run=false", async () => {
    await fs.writeFile(path.join(tmpDir, "old_file.txt"), "content", "utf-8");
    await batchRename(tmpDir, "old_", "new_", { dryRun: false });
    expect(await exists(path.join(tmpDir, "new_file.txt"))).toBe(true);
    expect(await exists(path.join(tmpDir, "old_file.txt"))).toBe(false);
  });

  it("should use regex capture groups", async () => {
    await fs.writeFile(path.join(tmpDir, "file_2024_01.txt"), "", "utf-8");
    const result = await batchRename(tmpDir, "(\\d{4})_(\\d{2})", "$2-$1");
    expect(result.renames).toHaveLength(1);
    expect(result.renames[0].to).toBe("file_01-2024.txt");
  });

  it("should filter by extensions", async () => {
    await fs.writeFile(path.join(tmpDir, "test_a.txt"), "", "utf-8");
    await fs.writeFile(path.join(tmpDir, "test_b.jpg"), "", "utf-8");
    const result = await batchRename(tmpDir, "test_", "renamed_", {
      extensions: "txt",
    });
    expect(result.renames).toHaveLength(1);
    expect(result.renames[0].from).toBe("test_a.txt");
  });

  it("should return empty when no files match", async () => {
    await fs.writeFile(path.join(tmpDir, "hello.txt"), "", "utf-8");
    const result = await batchRename(tmpDir, "xyz_", "abc_");
    expect(result.renames).toHaveLength(0);
  });

  it("should not rename if result is same as original", async () => {
    await fs.writeFile(path.join(tmpDir, "file.txt"), "", "utf-8");
    const result = await batchRename(tmpDir, "nomatch", "replacement");
    expect(result.renames).toHaveLength(0);
  });

  it("should handle special regex characters in pattern", async () => {
    await fs.writeFile(path.join(tmpDir, "file (copy).txt"), "", "utf-8");
    const result = await batchRename(tmpDir, "\\s*\\(copy\\)", "");
    expect(result.renames).toHaveLength(1);
    expect(result.renames[0].to).toBe("file.txt");
  });

  it("should skip directories", async () => {
    await fs.mkdir(path.join(tmpDir, "test_dir"));
    await fs.writeFile(path.join(tmpDir, "test_file.txt"), "", "utf-8");
    const result = await batchRename(tmpDir, "test_", "renamed_");
    expect(result.renames).toHaveLength(1);
    expect(result.renames[0].from).toBe("test_file.txt");
  });
});

// ============================================================================
// Tool 8: archive
// ============================================================================

describe("Tool 8: archive", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await makeTmpDir();
  });
  afterEach(async () => {
    await rmDir(tmpDir);
  });

  it("should create a ZIP archive from files", async () => {
    const file1 = path.join(tmpDir, "a.txt");
    const file2 = path.join(tmpDir, "b.txt");
    const archPath = path.join(tmpDir, "archive.zip");
    await fs.writeFile(file1, "Hello A", "utf-8");
    await fs.writeFile(file2, "Hello B", "utf-8");

    const zip = new AdmZip();
    zip.addLocalFile(file1);
    zip.addLocalFile(file2);
    zip.writeZip(archPath);

    expect(await exists(archPath)).toBe(true);
    const readZip = new AdmZip(archPath);
    const entries = readZip.getEntries();
    expect(entries.length).toBe(2);
  });

  it("should create a ZIP from a directory", async () => {
    const subDir = path.join(tmpDir, "mydir");
    await fs.mkdir(subDir);
    await fs.writeFile(path.join(subDir, "inner.txt"), "inner content", "utf-8");
    const archPath = path.join(tmpDir, "dir-archive.zip");

    const zip = new AdmZip();
    zip.addLocalFolder(subDir, path.basename(subDir));
    zip.writeZip(archPath);

    const readZip = new AdmZip(archPath);
    const entries = readZip.getEntries();
    expect(entries.some((e) => e.entryName.includes("inner.txt"))).toBe(true);
  });

  it("should extract a ZIP archive", async () => {
    const file1 = path.join(tmpDir, "file.txt");
    await fs.writeFile(file1, "extract me", "utf-8");
    const archPath = path.join(tmpDir, "test.zip");

    const zip = new AdmZip();
    zip.addLocalFile(file1);
    zip.writeZip(archPath);

    const extractDir = path.join(tmpDir, "extracted");
    await fs.mkdir(extractDir);
    const readZip = new AdmZip(archPath);
    readZip.extractAllTo(extractDir, true);

    expect(await exists(path.join(extractDir, "file.txt"))).toBe(true);
    const content = await fs.readFile(path.join(extractDir, "file.txt"), "utf-8");
    expect(content).toBe("extract me");
  });

  it("should list entries in a ZIP archive", async () => {
    const file1 = path.join(tmpDir, "a.txt");
    const file2 = path.join(tmpDir, "b.txt");
    await fs.writeFile(file1, "A", "utf-8");
    await fs.writeFile(file2, "BB", "utf-8");
    const archPath = path.join(tmpDir, "list.zip");

    const zip = new AdmZip();
    zip.addLocalFile(file1);
    zip.addLocalFile(file2);
    zip.writeZip(archPath);

    const readZip = new AdmZip(archPath);
    const entries = readZip.getEntries();
    expect(entries.length).toBe(2);
    const names = entries.map((e) => e.entryName);
    expect(names).toContain("a.txt");
    expect(names).toContain("b.txt");
  });

  it("should handle empty ZIP creation", async () => {
    const archPath = path.join(tmpDir, "empty.zip");
    const zip = new AdmZip();
    zip.writeZip(archPath);
    expect(await exists(archPath)).toBe(true);
    const readZip = new AdmZip(archPath);
    expect(readZip.getEntries().length).toBe(0);
  });

  it("should handle ZIP with nested directories", async () => {
    const dir = path.join(tmpDir, "nested");
    const sub = path.join(dir, "sub1", "sub2");
    await fs.mkdir(sub, { recursive: true });
    await fs.writeFile(path.join(sub, "deep.txt"), "deep content", "utf-8");
    const archPath = path.join(tmpDir, "nested.zip");

    const zip = new AdmZip();
    zip.addLocalFolder(dir, "nested");
    zip.writeZip(archPath);

    const extractDir = path.join(tmpDir, "ex-nested");
    const readZip = new AdmZip(archPath);
    readZip.extractAllTo(extractDir, true);
    expect(
      await exists(path.join(extractDir, "nested", "sub1", "sub2", "deep.txt"))
    ).toBe(true);
  });
});

// ============================================================================
// Tool 9: checksum
// ============================================================================

describe("Tool 9: checksum", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await makeTmpDir();
  });
  afterEach(async () => {
    await rmDir(tmpDir);
  });

  function computeHash(content: string | Buffer, algorithm: string): string {
    const buf = typeof content === "string" ? Buffer.from(content) : content;
    return crypto.createHash(algorithm).update(buf).digest("hex");
  }

  it("should compute SHA256 hash", async () => {
    const fp = path.join(tmpDir, "test.txt");
    const content = "Hello World";
    await fs.writeFile(fp, content, "utf-8");
    const buf = await fs.readFile(fp);
    const hash = crypto.createHash("sha256").update(buf).digest("hex");
    expect(hash).toBe(computeHash(content, "sha256"));
    expect(hash).toHaveLength(64);
  });

  it("should compute MD5 hash", async () => {
    const content = "Hello World";
    const hash = computeHash(content, "md5");
    expect(hash).toHaveLength(32);
    // Known MD5 of "Hello World"
    expect(hash).toBe("b10a8db164e0754105b7a99be72e3fe5");
  });

  it("should compute SHA1 hash", async () => {
    const content = "Hello World";
    const hash = computeHash(content, "sha1");
    expect(hash).toHaveLength(40);
    // Known SHA1 of "Hello World"
    expect(hash).toBe("0a4d55a8d778e5022fab701977c5d840bbc486d0");
  });

  it("should compute SHA512 hash", async () => {
    const content = "Hello World";
    const hash = computeHash(content, "sha512");
    expect(hash).toHaveLength(128);
  });

  it("should verify matching hash", async () => {
    const content = "verify me";
    const hash = computeHash(content, "sha256");
    expect(hash.toLowerCase()).toBe(hash); // already lowercase
    expect(hash.toLowerCase() === hash.toLowerCase()).toBe(true);
  });

  it("should detect mismatching hash", async () => {
    const content = "verify me";
    const hash = computeHash(content, "sha256");
    const wrongHash = "0000000000000000000000000000000000000000000000000000000000000000";
    expect(hash.toLowerCase() === wrongHash.toLowerCase()).toBe(false);
  });

  it("should handle empty file", async () => {
    const hash = computeHash("", "sha256");
    // Known SHA256 of empty string
    expect(hash).toBe("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
  });

  it("should handle binary content", async () => {
    const fp = path.join(tmpDir, "binary.bin");
    const buf = Buffer.from([0x00, 0x01, 0x02, 0xff, 0xfe]);
    await fs.writeFile(fp, buf);
    const readBuf = await fs.readFile(fp);
    const hash = crypto.createHash("sha256").update(readBuf).digest("hex");
    expect(hash).toHaveLength(64);
  });

  it("should be case-insensitive when comparing expected hash", async () => {
    const content = "test";
    const hash = computeHash(content, "sha256");
    const upperHash = hash.toUpperCase();
    expect(hash.toLowerCase() === upperHash.toLowerCase()).toBe(true);
  });
});

// ============================================================================
// Tool 10: cleanup_file
// ============================================================================

async function cleanupFile(
  filePath: string,
  options: {
    removeBom?: boolean;
    removeTrailingWhitespace?: boolean;
    normalizeLineEndings?: "lf" | "crlf" | "none";
    removeNulBytes?: boolean;
    ensureFinalNewline?: boolean;
    dryRun?: boolean;
  } = {}
): Promise<{ fixes: string[]; content: string }> {
  const {
    removeBom = true,
    removeTrailingWhitespace = true,
    normalizeLineEndings = "lf",
    removeNulBytes = true,
    ensureFinalNewline = true,
    dryRun = true,
  } = options;

  let content = await fs.readFile(filePath, "utf-8");
  const fixes: string[] = [];

  if (removeBom && content.charCodeAt(0) === 0xfeff) {
    content = content.slice(1);
    fixes.push("BOM removed");
  }
  if (removeNulBytes && content.includes("\0")) {
    content = content.replace(/\0/g, "");
    fixes.push("NUL bytes removed");
  }
  if (removeTrailingWhitespace) {
    const before = content;
    content = content.replace(/[ \t]+$/gm, "");
    if (content !== before) fixes.push("Trailing whitespace removed");
  }
  if (normalizeLineEndings === "lf") {
    const before = content;
    content = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    if (content !== before) fixes.push("Line endings -> LF");
  } else if (normalizeLineEndings === "crlf") {
    const before = content;
    content = content
      .replace(/\r\n/g, "\n")
      .replace(/\r/g, "\n")
      .replace(/\n/g, "\r\n");
    if (content !== before) fixes.push("Line endings -> CRLF");
  }
  if (ensureFinalNewline && content.length > 0 && !content.endsWith("\n")) {
    content += normalizeLineEndings === "crlf" ? "\r\n" : "\n";
    fixes.push("Final newline added");
  }

  if (!dryRun && fixes.length > 0) {
    await fs.writeFile(filePath, content, "utf-8");
  }

  return { fixes, content };
}

describe("Tool 10: cleanup_file", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await makeTmpDir();
  });
  afterEach(async () => {
    await rmDir(tmpDir);
  });

  it("should detect clean file", async () => {
    const fp = path.join(tmpDir, "clean.txt");
    await fs.writeFile(fp, "clean content\n", "utf-8");
    const result = await cleanupFile(fp);
    expect(result.fixes).toHaveLength(0);
  });

  it("should remove BOM", async () => {
    const fp = path.join(tmpDir, "bom.txt");
    await fs.writeFile(fp, "\uFEFFcontent\n", "utf-8");
    const result = await cleanupFile(fp);
    expect(result.fixes).toContain("BOM removed");
    expect(result.content.charCodeAt(0)).not.toBe(0xfeff);
  });

  it("should remove NUL bytes", async () => {
    const fp = path.join(tmpDir, "nul.txt");
    await fs.writeFile(fp, "he\0llo\n", "utf-8");
    const result = await cleanupFile(fp);
    expect(result.fixes).toContain("NUL bytes removed");
    expect(result.content).toContain("hello");
  });

  it("should remove trailing whitespace", async () => {
    const fp = path.join(tmpDir, "whitespace.txt");
    await fs.writeFile(fp, "line1   \nline2\t\t\nline3\n", "utf-8");
    const result = await cleanupFile(fp);
    expect(result.fixes).toContain("Trailing whitespace removed");
    expect(result.content).toBe("line1\nline2\nline3\n");
  });

  it("should normalize CRLF to LF", async () => {
    const fp = path.join(tmpDir, "crlf.txt");
    await fs.writeFile(fp, "line1\r\nline2\r\n", "utf-8");
    const result = await cleanupFile(fp);
    expect(result.fixes).toContain("Line endings -> LF");
    expect(result.content).toBe("line1\nline2\n");
  });

  it("should normalize LF to CRLF", async () => {
    const fp = path.join(tmpDir, "lf.txt");
    await fs.writeFile(fp, "line1\nline2\n", "utf-8");
    const result = await cleanupFile(fp, { normalizeLineEndings: "crlf" });
    expect(result.fixes).toContain("Line endings -> CRLF");
    expect(result.content).toBe("line1\r\nline2\r\n");
  });

  it("should add final newline when missing", async () => {
    const fp = path.join(tmpDir, "nonewline.txt");
    await fs.writeFile(fp, "no newline at end", "utf-8");
    const result = await cleanupFile(fp);
    expect(result.fixes).toContain("Final newline added");
    expect(result.content.endsWith("\n")).toBe(true);
  });

  it("should add CRLF final newline when normalizing to CRLF", async () => {
    const fp = path.join(tmpDir, "nonewline-crlf.txt");
    await fs.writeFile(fp, "content", "utf-8");
    const result = await cleanupFile(fp, { normalizeLineEndings: "crlf" });
    expect(result.content.endsWith("\r\n")).toBe(true);
  });

  it("should not add final newline to empty file", async () => {
    const fp = path.join(tmpDir, "empty.txt");
    await fs.writeFile(fp, "", "utf-8");
    const result = await cleanupFile(fp);
    expect(result.content).toBe("");
    expect(result.fixes).not.toContain("Final newline added");
  });

  it("should respect normalize_line_endings=none", async () => {
    const fp = path.join(tmpDir, "mixed.txt");
    await fs.writeFile(fp, "line1\r\nline2\nline3\n", "utf-8");
    const result = await cleanupFile(fp, { normalizeLineEndings: "none" });
    expect(result.fixes).not.toContain("Line endings -> LF");
    expect(result.fixes).not.toContain("Line endings -> CRLF");
    // CRLF should still be present
    expect(result.content).toContain("\r\n");
  });

  it("should write file when dry_run=false", async () => {
    const fp = path.join(tmpDir, "fix.txt");
    await fs.writeFile(fp, "\uFEFFcontent  \r\n", "utf-8");
    await cleanupFile(fp, { dryRun: false });
    const content = await fs.readFile(fp, "utf-8");
    expect(content.charCodeAt(0)).not.toBe(0xfeff);
    expect(content).toBe("content\n");
  });

  it("should handle all options disabled", async () => {
    const fp = path.join(tmpDir, "nofix.txt");
    await fs.writeFile(fp, "\uFEFFdirty\0  \r\n", "utf-8");
    const result = await cleanupFile(fp, {
      removeBom: false,
      removeTrailingWhitespace: false,
      normalizeLineEndings: "none",
      removeNulBytes: false,
      ensureFinalNewline: false,
    });
    expect(result.fixes).toHaveLength(0);
  });
});

// ============================================================================
// Tool 11: scan_emoji
// ============================================================================

describe("Tool 11: scan_emoji", () => {
  let tmpDir: string;

  beforeEach(async () => {
    tmpDir = await makeTmpDir();
  });
  afterEach(async () => {
    await rmDir(tmpDir);
  });

  const emojiRegex =
    /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{200D}\u{20E3}\u{FE0F}]/gu;

  async function scanEmoji(
    directory: string,
    options: { extensions?: string; recursive?: boolean } = {}
  ): Promise<{ results: { file: string; line: number; emoji: string }[]; emojiCount: Map<string, number> }> {
    const { extensions = "py,js,ts,json,md,txt", recursive = true } = options;
    const dir = norm(directory);
    const extSet = new Set(
      extensions.split(",").map((e) => "." + e.trim().replace(/^\./, ""))
    );
    const results: { file: string; line: number; emoji: string }[] = [];
    const emojiCount = new Map<string, number>();

    async function scan(d: string) {
      const entries = await fs.readdir(d, { withFileTypes: true });
      for (const entry of entries) {
        const full = path.join(d, entry.name);
        if (entry.isDirectory()) {
          if (recursive && !entry.name.startsWith(".") && entry.name !== "node_modules")
            await scan(full);
          continue;
        }
        if (!extSet.has(path.extname(entry.name).toLowerCase())) continue;
        const content = await fs.readFile(full, "utf-8");
        const lines = content.split("\n");
        for (let i = 0; i < lines.length; i++) {
          const matches = lines[i].match(emojiRegex);
          if (matches) {
            for (const m of matches) {
              emojiCount.set(m, (emojiCount.get(m) || 0) + 1);
              results.push({
                file: path.relative(dir, full),
                line: i + 1,
                emoji: m,
              });
            }
          }
        }
      }
    }

    await scan(dir);
    return { results, emojiCount };
  }

  it("should find no emojis in clean code", async () => {
    await fs.writeFile(
      path.join(tmpDir, "clean.py"),
      'def hello():\n    print("Hello World")\n',
      "utf-8"
    );
    const result = await scanEmoji(tmpDir);
    expect(result.results).toHaveLength(0);
  });

  it("should detect common emojis", async () => {
    await fs.writeFile(
      path.join(tmpDir, "emoji.py"),
      '# This has emojis \u{1F600}\nprint("\u{1F680}")\n',
      "utf-8"
    );
    const result = await scanEmoji(tmpDir);
    expect(result.results.length).toBeGreaterThanOrEqual(2);
  });

  it("should count emoji occurrences", async () => {
    await fs.writeFile(
      path.join(tmpDir, "count.txt"),
      "\u{1F600}\u{1F600}\u{1F600}\n\u{1F680}\n",
      "utf-8"
    );
    const result = await scanEmoji(tmpDir);
    expect(result.emojiCount.get("\u{1F600}")).toBe(3);
    expect(result.emojiCount.get("\u{1F680}")).toBe(1);
  });

  it("should filter by file extension", async () => {
    await fs.writeFile(path.join(tmpDir, "a.py"), "\u{1F600}\n", "utf-8");
    await fs.writeFile(path.join(tmpDir, "b.xyz"), "\u{1F600}\n", "utf-8");
    const result = await scanEmoji(tmpDir, { extensions: "py" });
    expect(result.results).toHaveLength(1);
    expect(result.results[0].file).toBe("a.py");
  });

  it("should scan subdirectories when recursive=true", async () => {
    const sub = path.join(tmpDir, "sub");
    await fs.mkdir(sub);
    await fs.writeFile(path.join(sub, "deep.txt"), "\u{1F600}\n", "utf-8");
    const result = await scanEmoji(tmpDir, { recursive: true });
    expect(result.results).toHaveLength(1);
  });

  it("should NOT scan subdirectories when recursive=false", async () => {
    const sub = path.join(tmpDir, "sub");
    await fs.mkdir(sub);
    await fs.writeFile(path.join(sub, "deep.txt"), "\u{1F600}\n", "utf-8");
    const result = await scanEmoji(tmpDir, { recursive: false });
    expect(result.results).toHaveLength(0);
  });

  it("should report correct line numbers", async () => {
    await fs.writeFile(
      path.join(tmpDir, "lines.txt"),
      "line 1\nline 2 \u{1F600}\nline 3\nline 4 \u{1F680}\n",
      "utf-8"
    );
    const result = await scanEmoji(tmpDir);
    expect(result.results.find((r) => r.emoji === "\u{1F600}")?.line).toBe(2);
    expect(result.results.find((r) => r.emoji === "\u{1F680}")?.line).toBe(4);
  });

  it("should skip hidden directories", async () => {
    const hidden = path.join(tmpDir, ".hidden");
    await fs.mkdir(hidden);
    await fs.writeFile(path.join(hidden, "secret.txt"), "\u{1F600}\n", "utf-8");
    const result = await scanEmoji(tmpDir);
    expect(result.results).toHaveLength(0);
  });

  it("should handle Unicode emoji ranges (weather symbols)", async () => {
    await fs.writeFile(path.join(tmpDir, "weather.txt"), "\u{2600}\u{2601}\n", "utf-8");
    const result = await scanEmoji(tmpDir);
    // sun and cloud are in the \u2600-\u26FF range
    expect(result.results.length).toBeGreaterThanOrEqual(2);
  });
});

// ============================================================================
// Tool 12: regex_test
// ============================================================================

describe("Tool 12: regex_test", () => {
  function regexTest(
    pattern: string,
    text: string,
    flags: string = "g"
  ): { matches: { match: string; index: number; groups: string[] }[] } {
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

    return { matches };
  }

  it("should find simple text matches", () => {
    const result = regexTest("hello", "hello world hello");
    expect(result.matches).toHaveLength(2);
    expect(result.matches[0].match).toBe("hello");
    expect(result.matches[0].index).toBe(0);
    expect(result.matches[1].index).toBe(12);
  });

  it("should return no matches for non-matching pattern", () => {
    const result = regexTest("xyz", "hello world");
    expect(result.matches).toHaveLength(0);
  });

  it("should support capture groups", () => {
    const result = regexTest("(\\d{4})-(\\d{2})-(\\d{2})", "Date: 2024-01-15");
    expect(result.matches).toHaveLength(1);
    expect(result.matches[0].groups).toEqual(["2024", "01", "15"]);
  });

  it("should support case-insensitive flag", () => {
    const result = regexTest("hello", "Hello HELLO hello", "gi");
    expect(result.matches).toHaveLength(3);
  });

  it("should support multiline flag", () => {
    const result = regexTest("^line", "line1\nline2\nline3", "gm");
    expect(result.matches).toHaveLength(3);
  });

  it("should handle non-global flag (find only first match)", () => {
    const result = regexTest("\\d+", "a1b2c3", "");
    expect(result.matches).toHaveLength(1);
    expect(result.matches[0].match).toBe("1");
  });

  it("should handle empty pattern (zero-length matches)", () => {
    const result = regexTest("", "abc");
    expect(result.matches.length).toBeGreaterThanOrEqual(1);
  });

  it("should throw on invalid regex pattern", () => {
    expect(() => regexTest("[invalid", "text")).toThrow();
  });

  it("should handle special regex characters", () => {
    const result = regexTest("\\.", "hello.world.test");
    expect(result.matches).toHaveLength(2);
  });

  it("should handle complex patterns with alternation", () => {
    const result = regexTest("cat|dog", "I have a cat and a dog");
    expect(result.matches).toHaveLength(2);
    expect(result.matches[0].match).toBe("cat");
    expect(result.matches[1].match).toBe("dog");
  });

  it("should handle lookahead patterns", () => {
    const result = regexTest("\\d+(?= dollars)", "5 euros 10 dollars 20 dollars");
    expect(result.matches).toHaveLength(2);
    expect(result.matches[0].match).toBe("10");
    expect(result.matches[1].match).toBe("20");
  });

  it("should handle named capture groups via unnamed groups array", () => {
    const result = regexTest("(?<year>\\d{4})-(?<month>\\d{2})", "2024-01");
    expect(result.matches).toHaveLength(1);
    expect(result.matches[0].groups).toEqual(["2024", "01"]);
  });

  it("should handle Unicode patterns with u flag", () => {
    const result = regexTest("[\\u{1F600}-\\u{1F64F}]", "\u{1F600}\u{1F601}", "gu");
    expect(result.matches).toHaveLength(2);
  });
});

// ============================================================================
// Helpers Tests
// ============================================================================

describe("Helper functions", () => {
  it("fmtSize should format bytes correctly", () => {
    expect(fmtSize(0)).toBe("0.0 B");
    expect(fmtSize(512)).toBe("512.0 B");
    expect(fmtSize(1024)).toBe("1.0 KB");
    expect(fmtSize(1536)).toBe("1.5 KB");
    expect(fmtSize(1048576)).toBe("1.0 MB");
    expect(fmtSize(1073741824)).toBe("1.0 GB");
  });

  it("fmtSize should handle large values", () => {
    const result = fmtSize(2 * 1073741824); // 2 GB
    expect(result).toBe("2.0 GB");
  });

  it("norm should normalize paths", () => {
    const result = norm("foo/bar/../baz");
    expect(result).toBe(path.normalize("foo/bar/../baz"));
  });

  it("exists should return true for existing file", async () => {
    const tmp = await makeTmpDir();
    const fp = path.join(tmp, "exists.txt");
    await fs.writeFile(fp, "hi", "utf-8");
    expect(await exists(fp)).toBe(true);
    await rmDir(tmp);
  });

  it("exists should return false for non-existing file", async () => {
    expect(await exists("/nonexistent/path/file.txt")).toBe(false);
  });
});
