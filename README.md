<p align="center">
  <img src="logo.jpg" alt="clatcher logo" width="400">
</p>

# ellmos-clatcher-mcp

**Claude Patcher** -- an MCP server that extends AI coding agents with utility tools they don't have natively. File repair, format conversion, duplicate detection, batch operations, and more.

Part of the **ellmos MCP family**:

| Server | Focus | npm |
|---|---|---|
| [ellmos-filecommander-mcp](https://github.com/ellmos-ai/ellmos-filecommander-mcp) | Filesystem operations, process management, interactive sessions | `ellmos-filecommander-mcp` |
| [ellmos-codecommander-mcp](https://github.com/ellmos-ai/ellmos-codecommander-mcp) | Code analysis, AST parsing, import management | `ellmos-codecommander-mcp` |
| **ellmos-clatcher-mcp** | **Utility tools: repair, convert, detect, batch ops** | `ellmos-clatcher-mcp` |

Each server covers a different domain. Use one, two, or all three depending on your workflow.

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

122 tests covering all 12 tools (vitest).

## Requirements

- Node.js >= 18

## License

[MIT](LICENSE)
