<p align="center">
  <img src="assets/logo.jpg" alt="clatcher logo" width="400">
</p>

# ellmos-clatcher-mcp

**🇩🇪 [Deutsche Version](README_de.md)**

[![npm version](https://img.shields.io/npm/v/ellmos-clatcher-mcp.svg)](https://www.npmjs.com/package/ellmos-clatcher-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org/)
[![MCP Registry Ready](https://img.shields.io/badge/MCP%20Registry-ready-blue)](server.json)

**Claude Patcher** -- an MCP server that extends AI coding agents with utility tools they don't have natively. File repair, format conversion, duplicate detection, batch operations, and more.

Use Clatcher when your agent needs reliable local maintenance tools for text files, data files, and project folders: repair invalid JSON, normalize encodings, convert formats, compare folders, rename files safely, and verify checksums without leaving the MCP workflow.

Part of the **ellmos MCP family**:

| Server | Focus | npm |
|---|---|---|
| [ellmos-filecommander-mcp](https://github.com/ellmos-ai/ellmos-filecommander-mcp) | Filesystem operations, process management, interactive sessions | [`ellmos-filecommander-mcp`](https://www.npmjs.com/package/ellmos-filecommander-mcp) |
| [ellmos-codecommander-mcp](https://github.com/ellmos-ai/ellmos-codecommander-mcp) | Code analysis, AST parsing, import management | [`ellmos-codecommander-mcp`](https://www.npmjs.com/package/ellmos-codecommander-mcp) |
| **[ellmos-clatcher-mcp](https://github.com/ellmos-ai/ellmos-clatcher-mcp)** | **Utility tools: repair, convert, detect, batch ops** | **[`ellmos-clatcher-mcp`](https://www.npmjs.com/package/ellmos-clatcher-mcp)** |
| [n8n-manager-mcp](https://github.com/ellmos-ai/n8n-manager-mcp) | n8n workflow management via AI assistants | [`n8n-manager-mcp`](https://www.npmjs.com/package/n8n-manager-mcp) |
| [ellmos-controlcenter-mcp](https://github.com/ellmos-ai/ellmos-controlcenter-mcp) | MCP stack discovery, profile management, control plane | [`ellmos-controlcenter-mcp`](https://www.npmjs.com/package/ellmos-controlcenter-mcp) |

Each server covers a different domain. Use one server, a focused pair, or the full family depending on your workflow.

## Discoverability

- **npm:** [`ellmos-clatcher-mcp`](https://www.npmjs.com/package/ellmos-clatcher-mcp)
- **GitHub:** [`ellmos-ai/ellmos-clatcher-mcp`](https://github.com/ellmos-ai/ellmos-clatcher-mcp)
- **MCP Registry metadata:** [`server.json`](server.json) declares the official `io.github.ellmos-ai/ellmos-clatcher-mcp` package identity.
- **LLM index:** [`llms.txt`](llms.txt) summarizes the tool surface for agents and registry crawlers.

Primary search terms: `mcp server`, `model context protocol`, `claude code tools`, `json repair`, `encoding fix`, `format conversion`, `duplicate file detection`, `batch rename`, `checksum`, `zip archive`.

## Tools

| Tool | Description |
|---|---|
| `fix_json` | Repair broken JSON: strip comments, trailing commas, single quotes, BOM/NUL |
| `fix_encoding` | Fix encoding issues: BOM removal, double-encoded UTF-8, cp1252 artifacts |
| `fix_umlauts` | Fix broken German umlauts from double-encoding (e.g. `Ã¤` -> `ä`) |
| `convert_format` | Convert between JSON, YAML, TOML, XML, CSV, and INI |
| `detect_dupes` | Find duplicate files by content hash (SHA256), grouped by identical content |
| `folder_diff` | Compare two directories, or take a snapshot and diff on next call |
| `batch_rename` | Rename files using regex patterns, with dry-run preview |
| `archive` | Create, extract, or list ZIP archives |
| `checksum` | Calculate file hashes (SHA256, MD5, SHA1, SHA512) with optional verification |
| `cleanup_file` | Remove BOM, trailing whitespace, fix line endings, strip NUL bytes |
| `scan_emoji` | Find emoji characters in code files |
| `regex_test` | Test regex patterns against text, showing all matches with groups |

All destructive tools default to **dry-run mode** and require explicit `dry_run: false` to write changes.

## Installation

### Claude Code CLI

```bash
claude mcp add ellmos-clatcher-mcp -- npx ellmos-clatcher-mcp
```

### npm (global)

```bash
npm install -g ellmos-clatcher-mcp
claude mcp add ellmos-clatcher-mcp -- ellmos-clatcher
```

### From source

```bash
git clone https://github.com/ellmos-ai/ellmos-clatcher-mcp.git
cd ellmos-clatcher-mcp
npm install
npm run build
node dist/index.js
```

## Testing

```bash
npm test
```

133 tests covering all 12 tools and i18n language packs (vitest).

## Requirements

- Node.js >= 18

## License

[MIT](LICENSE)

---

## ellmos-ai Ecosystem

This MCP server is part of the **[ellmos-ai](https://github.com/ellmos-ai)** ecosystem — AI infrastructure, MCP servers, and intelligent tools.

### MCP Server Family

| Server | Tools | Focus | npm |
|--------|-------|-------|-----|
| [FileCommander](https://github.com/ellmos-ai/ellmos-filecommander-mcp) | 43 | Filesystem, process management, interactive sessions | [`ellmos-filecommander-mcp`](https://www.npmjs.com/package/ellmos-filecommander-mcp) |
| [CodeCommander](https://github.com/ellmos-ai/ellmos-codecommander-mcp) | 17 | Code analysis, AST parsing, import management | [`ellmos-codecommander-mcp`](https://www.npmjs.com/package/ellmos-codecommander-mcp) |
| **[Clatcher](https://github.com/ellmos-ai/ellmos-clatcher-mcp)** | **12** | **File repair, format conversion, batch operations** | **[`ellmos-clatcher-mcp`](https://www.npmjs.com/package/ellmos-clatcher-mcp)** |
| [n8n Manager](https://github.com/ellmos-ai/n8n-manager-mcp) | 18 | n8n workflow management via AI assistants | [`n8n-manager-mcp`](https://www.npmjs.com/package/n8n-manager-mcp) |
| [ControlCenter](https://github.com/ellmos-ai/ellmos-controlcenter-mcp) | 10 | MCP stack discovery, profile management, control plane | [`ellmos-controlcenter-mcp`](https://www.npmjs.com/package/ellmos-controlcenter-mcp) |

### AI Infrastructure

| Project | Description |
|---------|-------------|
| [BACH](https://github.com/ellmos-ai/bach) | Text-based OS for LLMs — 109+ handlers, 373+ tools, 932+ skills |
| [clutch](https://github.com/ellmos-ai/clutch) | Provider-neutral LLM orchestration with auto-routing and budget tracking |
| [rinnsal](https://github.com/ellmos-ai/rinnsal) | Lightweight agent memory, connectors, and automation infrastructure |
| [ellmos-stack](https://github.com/ellmos-ai/ellmos-stack) | Self-hosted AI research stack (Ollama + n8n + Rinnsal + KnowledgeDigest) |
| [MarbleRun](https://github.com/ellmos-ai/MarbleRun) | Autonomous agent chain framework for Claude Code |
| [gardener](https://github.com/ellmos-ai/gardener) | Minimalist database-driven LLM OS prototype (4 functions, 1 table) |
| [ellmos-tests](https://github.com/ellmos-ai/ellmos-tests) | Testing framework for LLM operating systems (7 dimensions) |

### Desktop Software

Our partner organization **[open-bricks](https://github.com/open-bricks)** bundles AI-native desktop applications — a modern, open-source software suite built for the age of AI. Categories include file management, document tools, developer utilities, and more.

---

## Haftung / Liability

Dieses Projekt ist eine **unentgeltliche Open-Source-Schenkung** im Sinne der §§ 516 ff. BGB. Die Haftung des Urhebers ist gemäß **§ 521 BGB** auf **Vorsatz und grobe Fahrlässigkeit** beschränkt. Ergänzend gilt der Gewährleistungsausschluss der MIT-Lizenz.

Nutzung auf eigenes Risiko. Keine Wartungszusage, keine Verfügbarkeitsgarantie, keine Gewähr für Fehlerfreiheit oder Eignung für einen bestimmten Zweck.

This project is an unpaid open-source donation under German law. Liability is limited to intent and gross negligence (§ 521 German Civil Code). The MIT License warranty disclaimer applies.

Use at your own risk. No warranty, no maintenance guarantee, no availability guarantee, and no fitness-for-purpose assumed.

