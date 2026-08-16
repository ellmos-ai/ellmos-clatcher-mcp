<p align="center">
  <img src="assets/logo.jpg" alt="clatcher logo" width="400">
</p>

# ellmos-clatcher-mcp

**🇩🇪 [Deutsche Version](README_de.md)**

[![npm version](https://img.shields.io/npm/v/ellmos-clatcher-mcp.svg)](https://www.npmjs.com/package/ellmos-clatcher-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen.svg)](https://nodejs.org/)
[![Clatcher tests](https://github.com/ellmos-ai/ellmos-clatcher-mcp/actions/workflows/tests.yml/badge.svg)](https://github.com/ellmos-ai/ellmos-clatcher-mcp/actions/workflows/tests.yml)
[![Vitest](https://img.shields.io/badge/tests-143%20passed-brightgreen.svg)](vitest.config.ts)
[![MCP Registry Ready](https://img.shields.io/badge/MCP%20Registry-ready-blue)](server.json)
[![Glama](https://img.shields.io/badge/Glama.ai-registered-purple)](glama.json)
[![LLM-Ready](https://img.shields.io/badge/LLM--Ready-llms.txt-blue)](llms.txt)
[![Ecosystem](https://img.shields.io/badge/Ecosystem-ellmos--ai-orange.svg)](https://github.com/ellmos-ai)
[![Umbrella](https://img.shields.io/badge/Umbrella-open--bricks-blue.svg)](https://github.com/open-bricks)

**Claude Patcher** -- an MCP server that extends AI coding agents with utility tools they don't have natively. File repair, format conversion, duplicate detection, batch operations, and more.

Use Clatcher when your agent needs reliable local maintenance tools for text files, data files, and project folders: repair invalid JSON, normalize encodings, convert formats, compare folders, rename files safely, and verify checksums without leaving the MCP workflow.

> [!NOTE]
> **AI / LLM Integration Note:** All destructive operations (e.g. `batch_rename`, `cleanup_file`, `fix_json`, `fix_encoding`, `fix_umlauts`) default to **dry-run mode** (`dry_run: true`). Autonomous agents must explicitly specify `dry_run: false` to execute mutations on disk.

## System Architecture & Data Flow

```mermaid
graph TD
    Agent[AI Agent / Claude Code / Cursor / IDE] -->|MCP JSON-RPC Protocol over Stdio| Transport[MCP Stdio Transport Layer]
    Transport --> Server[Clatcher MCP Server Runtime]
    Server --> Dispatcher{Tool Dispatcher}

    Dispatcher -->|fix_json / cleanup_file| JsonEngine[JSON Linter & Auto-Fix Engine]
    Dispatcher -->|fix_encoding / fix_umlauts| EncodingEngine[Encoding Normalizer & Mojibake Resolver]
    Dispatcher -->|convert_format| FormatEngine[Format Converter: JSON/YAML/TOML/XML/CSV/INI]
    Dispatcher -->|detect_dupes / checksum| HashEngine[SHA-256 / Multi-Hash Content Engine]
    Dispatcher -->|folder_diff / batch_rename| FileOpsEngine[Folder Diff & Regex Batch Renamer]
    Dispatcher -->|archive / zip| ArchiveEngine[AdmZip Compression Handler]
    Dispatcher -->|scan_emoji / regex_test| RegexEngine[Emoji Scanner & Regex Debugger]

    JsonEngine --> DryRunGuard{Dry-Run Guard}
    EncodingEngine --> DryRunGuard
    FormatEngine --> DryRunGuard
    FileOpsEngine --> DryRunGuard
    ArchiveEngine --> DryRunGuard

    DryRunGuard -->|dry_run: true (default)| PreviewReport[Detailed Dry-Run Preview Diff & Status]
    DryRunGuard -->|dry_run: false (explicit)| DiskWrite[Safe Atomic Filesystem Write]
```

Part of the **ellmos MCP family**:

| Server | Focus | npm |
|---|---|---|
| [ellmos-filecommander-mcp](https://github.com/ellmos-ai/ellmos-filecommander-mcp) | Filesystem operations, process management, interactive sessions | [`ellmos-filecommander-mcp`](https://www.npmjs.com/package/ellmos-filecommander-mcp) |
| [ellmos-codecommander-mcp](https://github.com/ellmos-ai/ellmos-codecommander-mcp) | Code analysis, AST parsing, import management | [`ellmos-codecommander-mcp`](https://www.npmjs.com/package/ellmos-codecommander-mcp) |
| **[ellmos-clatcher-mcp](https://github.com/ellmos-ai/ellmos-clatcher-mcp)** | **Utility tools: repair, convert, detect, batch ops** | **[`ellmos-clatcher-mcp`](https://www.npmjs.com/package/ellmos-clatcher-mcp)** |
| [n8n-manager-mcp](https://github.com/ellmos-ai/n8n-manager-mcp) | n8n workflow management via AI assistants | [`n8n-manager-mcp`](https://www.npmjs.com/package/n8n-manager-mcp) |
| [ellmos-controlcenter-mcp](https://github.com/ellmos-ai/ellmos-controlcenter-mcp) | MCP stack discovery, profile management, control plane | [`ellmos-controlcenter-mcp`](https://www.npmjs.com/package/ellmos-controlcenter-mcp) |
| [ellmos-homebase-mcp](https://github.com/ellmos-ai/ellmos-homebase-mcp) | LLM memory, knowledge, state, routing, and orchestration | [`ellmos-homebase-mcp`](https://www.npmjs.com/package/ellmos-homebase-mcp) (alpha) |
| [ellmos-servercommander-mcp](https://github.com/ellmos-ai/ellmos-servercommander-mcp) | Server operations: deploy dry-runs, mail status, log analysis, health checks | [`ellmos-servercommander-mcp`](https://www.npmjs.com/package/ellmos-servercommander-mcp) (alpha) |
| [ellmos-blender-use-mcp](https://github.com/ellmos-ai/ellmos-blender-use-mcp) | Headless Blender asset QA and FBX reimport verification | [`ellmos-blender-use-mcp`](https://www.npmjs.com/package/ellmos-blender-use-mcp) (alpha) |
| [open-compute-mcp](https://github.com/ellmos-ai/open-compute-mcp) | Model-agnostic computer use: capture, safety-gated actions, Windows UIA | [`open-compute-mcp`](https://www.npmjs.com/package/open-compute-mcp) (alpha) |

Each server covers a different domain. Use one server, a focused pair, or the full family depending on your workflow.

## Discoverability

- **npm:** [`ellmos-clatcher-mcp`](https://www.npmjs.com/package/ellmos-clatcher-mcp)
- **GitHub:** [`ellmos-ai/ellmos-clatcher-mcp`](https://github.com/ellmos-ai/ellmos-clatcher-mcp)
- **MCP Registry metadata:** [`server.json`](server.json) declares the official `io.github.ellmos-ai/ellmos-clatcher-mcp` package identity.
- **Glama.ai Registry:** [`glama.json`](glama.json) manifest for Glama MCP ecosystem.
- **LLM index:** [`llms.txt`](llms.txt) summarizes the tool surface for agents and registry crawlers.

Primary search terms: `ellmos-clatcher-mcp`, `clatcher mcp`, `claude patcher`, `mcp json repair server`, `mcp encoding fix`, `model context protocol file repair`, `claude code utility tools`, `format conversion mcp tool`, `duplicate file detection mcp`, `batch rename mcp`, `checksum mcp`, `zip archive mcp`.

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

143 tests covering all 12 tools, i18n language packs, repository hygiene, and metadata consistency (vitest). The GitHub Actions workflow runs `npm ci`, TypeScript build, Vitest, and an npm package dry-run on Node.js 20, 22, and 24.

## Requirements

- Node.js >= 20

## License

[MIT](LICENSE)

---

## ellmos-ai Ecosystem

This MCP server is part of the **[ellmos-ai](https://github.com/ellmos-ai)** ecosystem — AI infrastructure, MCP servers, and intelligent tools.

### MCP Server Family

| Server | Tools | Focus | npm |
|--------|-------|-------|-----|
| [FileCommander](https://github.com/ellmos-ai/ellmos-filecommander-mcp) | 47 | Filesystem, process management, interactive sessions, cloud-lock-safe operations | [`ellmos-filecommander-mcp`](https://www.npmjs.com/package/ellmos-filecommander-mcp) |
| [CodeCommander](https://github.com/ellmos-ai/ellmos-codecommander-mcp) | 22 | Code analysis, JSON repair, imports, diffs, regex | [`ellmos-codecommander-mcp`](https://www.npmjs.com/package/ellmos-codecommander-mcp) |
| **[Clatcher](https://github.com/ellmos-ai/ellmos-clatcher-mcp)** | **12** | **File repair, format conversion, batch operations** | **[`ellmos-clatcher-mcp`](https://www.npmjs.com/package/ellmos-clatcher-mcp)** |
| [n8n Manager](https://github.com/ellmos-ai/n8n-manager-mcp) | 19 | n8n workflow management via AI assistants | [`n8n-manager-mcp`](https://www.npmjs.com/package/n8n-manager-mcp) |
| [ControlCenter](https://github.com/ellmos-ai/ellmos-controlcenter-mcp) | 20 | MCP stack discovery, profile management, control plane | [`ellmos-controlcenter-mcp`](https://www.npmjs.com/package/ellmos-controlcenter-mcp) |
| [Homebase](https://github.com/ellmos-ai/ellmos-homebase-mcp) | 45 | Local-first LLM memory, knowledge, state, routing, swarm orchestration | [`ellmos-homebase-mcp`](https://www.npmjs.com/package/ellmos-homebase-mcp) (alpha) |
| [ServerCommander](https://github.com/ellmos-ai/ellmos-servercommander-mcp) | 8 | Server operations: health checks, log analysis, deploy dry-runs, mail diagnostics | [`ellmos-servercommander-mcp`](https://www.npmjs.com/package/ellmos-servercommander-mcp) (alpha) |
| [Blender Use](https://github.com/ellmos-ai/ellmos-blender-use-mcp) | 3 | Headless Blender asset QA and FBX reimport verification | [`ellmos-blender-use-mcp`](https://www.npmjs.com/package/ellmos-blender-use-mcp) (alpha) |
| [Open Compute](https://github.com/ellmos-ai/open-compute-mcp) | 10 | Model-agnostic computer use: capture, safety-gated actions, Windows UIA | [`open-compute-mcp`](https://www.npmjs.com/package/open-compute-mcp) (alpha) |

### AI Infrastructure

| Project | Description |
|---------|-------------|
| [BACH](https://github.com/ellmos-ai/bach) | Local-first text-based OS for LLM agents — 113+ handlers, 550+ tools, SQLite memory |
| [open-compute](https://github.com/ellmos-ai/open-compute) | Model-agnostic computer-use core powering Open Compute MCP |
| [clutch](https://github.com/ellmos-ai/clutch) | Provider-neutral LLM orchestration with auto-routing and budget tracking |
| [rinnsal](https://github.com/ellmos-ai/rinnsal) | Lightweight agent memory, connectors, and automation infrastructure |
| [ellmos-stack](https://github.com/ellmos-ai/ellmos-stack) | Self-hosted AI research stack (Ollama + n8n + Rinnsal + KnowledgeDigest) |
| [MarbleRun](https://github.com/ellmos-ai/MarbleRun) | Autonomous agent chain framework for Claude Code |
| [gardener](https://github.com/ellmos-ai/gardener) | Minimalist database-driven LLM OS prototype (4 functions, 1 table) |
| [ellmos-tests](https://github.com/ellmos-ai/ellmos-tests) | Testing framework for LLM operating systems (7 dimensions) |

### Desktop Software & Sibling Ecosystem

Our partner organization **[open-bricks](https://github.com/open-bricks)** and sister suites bundle AI-native applications and developer tooling:

| Repository | Focus | Status |
|---|---|---|
| [file-bricks/ProFiler](https://github.com/file-bricks/ProFiler) | Multi-column PySide6 desktop file manager with smart workspaces | Active |
| [doc-bricks/DokuZen](https://github.com/doc-bricks/DokuZen) | Document conversion, batch OCR, metadata sanitization | Active |
| [dev-bricks/safe-start-for-codex](https://github.com/dev-bricks/safe-start-for-codex) | Secure workspace preflight and agent bootstrap gates | Active |
| [dev-bricks/automation-master](https://github.com/dev-bricks/automation-master) | Cross-agent automation orchestrator and policy enforcer | Active |
| [dev-bricks/DevCenter](https://github.com/dev-bricks/DevCenter) | Central development cockpit and service manager | Active |
| [dev-bricks/CodeBox](https://github.com/dev-bricks/CodeBox) | Sandboxed code execution and containerized worker environment | Active |

## Haftung / Liability

Dieses Projekt ist eine **unentgeltliche Open-Source-Schenkung** im Sinne der §§ 516 ff. BGB. Die Haftung des Urhebers ist gemäß **§ 521 BGB** auf **Vorsatz und grobe Fahrlässigkeit** beschränkt. Ergänzend gilt der Gewährleistungsausschluss der MIT-Lizenz.

Nutzung auf eigenes Risiko. Keine Wartungszusage, keine Verfügbarkeitsgarantie, keine Gewähr für Fehlerfreiheit oder Eignung für einen bestimmten Zweck.

This project is an unpaid open-source donation under German law. Liability is limited to intent and gross negligence (§ 521 German Civil Code). The MIT License warranty disclaimer applies.

Use at your own risk. No warranty, no maintenance guarantee, no availability guarantee, and no fitness-for-purpose assumed.
