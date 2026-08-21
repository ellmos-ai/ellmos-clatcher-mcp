# Security Policy

## Execution Safety and Local-First Guarantees

`ellmos-clatcher-mcp` is designed as a local-first utility MCP server for text and data file operations with built-in dry-run safety and non-destructive defaults.

## Risk Assessment & Safety Architecture

### Destructive / Modifying Tools (Dry-Run Protected)
All modifying tools enforce a strict **dry-run default** (`dry_run: true`). Mutating operations on the filesystem require an explicit `dry_run: false` parameter from the caller.

| Tool | Risk Level | Default Mode | Description |
|------|------------|--------------|-------------|
| `batch_rename` | Medium | `dry_run: true` | Renames files according to regex patterns |
| `cleanup_file` | Medium | `dry_run: true` | Strips BOM, trailing whitespace, fixes line endings |
| `fix_json` | Medium | `dry_run: true` | Repairs broken JSON structure, comments, trailing commas |
| `fix_encoding` | Medium | `dry_run: true` | Resolves encoding artifacts and double-encoded UTF-8 |
| `fix_umlauts` | Medium | `dry_run: true` | Restores corrupted German umlaut character sequences |
| `convert_format` | Medium | `dry_run: true` | Converts data structures between JSON, YAML, TOML, XML, CSV, INI |
| `archive` | Medium | Safe Extraction | Creates, extracts, or lists ZIP archives |

### Read-Only / Diagnostic Tools (Zero Risk)
| Tool | Risk Level | Description |
|------|------------|-------------|
| `detect_dupes` | Low (Read-Only) | Computes SHA-256 hashes to group identical files |
| `folder_diff` | Low (Read-Only) | Compares directory contents or evaluates snapshot deltas |
| `checksum` | Low (Read-Only) | Calculates cryptographic hashes (SHA-256, MD5, SHA-1, SHA-512) |
| `scan_emoji` | Low (Read-Only) | Detects emoji occurrences and Unicode positions |
| `regex_test` | Low (Read-Only) | Evaluates regular expressions against sample text |

## Recommendations

1. **Always inspect preview outputs first**: When calling modifying tools, review the detailed diff and status reported by the default `dry_run: true` before executing with `dry_run: false`.
2. **Local stdio transport only**: This server is designed for local development and coding agent interaction via stdio; do not expose the stdio stream over untrusted networks.
3. **Keep client approvals enabled**: Maintain confirmation prompts in your MCP client (e.g. Claude Desktop / Claude Code) for write operations.

## Supported Versions

| Version | Supported | Notes |
|---|---|---|
| `1.0.x` | :white_check_mark: | Current active release branch |
| `< 1.0.0` | :x: | Legacy pre-release versions |

## Reporting a Vulnerability

If you discover a security vulnerability or unexpected behavioral bypass in `ellmos-clatcher-mcp`, please open a private security advisory via GitHub Security Advisories or contact the maintainers.
