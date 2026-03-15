# ellmos-clatcher-mcp

**Claude Patcher** -- a "best-of" MCP server that extends Claude Code with tools it does *not* have natively. No redundant file I/O, no grep clones. Only capabilities that fill real gaps.

Replaces **bach-codecommander-mcp** and **bach-filecommander-mcp** with a single, lean server.

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

All destructive tools (`fix_json`, `fix_encoding`, `fix_umlauts`, `batch_rename`, `cleanup_file`) default to **dry-run mode** and require explicit `dry_run: false` to write changes.

## Installation

### npm (global)

```bash
npm install -g ellmos-clatcher-mcp
```

### Claude Code CLI

```bash
claude mcp add ellmos-clatcher -- npx ellmos-clatcher-mcp
```

Or with an explicit global install:

```bash
npm install -g ellmos-clatcher-mcp
claude mcp add ellmos-clatcher -- ellmos-clatcher
```

### Manual (from source)

```bash
git clone https://github.com/ellmos-ai/ellmos-clatcher-mcp.git
cd ellmos-clatcher-mcp
npm install
npm run build
claude mcp add ellmos-clatcher -- node /path/to/ellmos-clatcher-mcp/dist/index.js
```

## Requirements

- Node.js >= 18

## License

[MIT](LICENSE)
