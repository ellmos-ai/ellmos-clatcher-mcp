<p align="center">
  <img src="assets/logo.jpg" alt="clatcher logo" width="400">
</p>

# ellmos-clatcher-mcp

**🇬🇧 [English Version](README.md)**

**Claude Patcher** — ein MCP-Server, der KI-Coding-Agenten um nützliche Werkzeuge erweitert, die sie von Haus aus nicht mitbringen. Dateireparatur, Formatkonvertierung, Duplikaterkennung, Batch-Operationen und mehr.

Teil der **ellmos MCP-Familie**:

| Server | Fokus | npm |
|---|---|---|
| [ellmos-filecommander-mcp](https://github.com/ellmos-ai/ellmos-filecommander-mcp) | Dateisystem-Operationen, Prozessverwaltung, interaktive Sitzungen | `ellmos-filecommander-mcp` |
| [ellmos-codecommander-mcp](https://github.com/ellmos-ai/ellmos-codecommander-mcp) | Code-Analyse, AST-Parsing, Import-Verwaltung | `ellmos-codecommander-mcp` |
| **ellmos-clatcher-mcp** | **Hilfswerkzeuge: Reparatur, Konvertierung, Erkennung, Batch-Operationen** | `ellmos-clatcher-mcp` |

Jeder Server deckt einen anderen Bereich ab. Verwende einen, zwei oder alle drei — je nach Workflow.

## Werkzeuge

| Tool | Beschreibung |
|---|---|
| `fix_json` | Defektes JSON reparieren: Kommentare, abschließende Kommas, einfache Anführungszeichen, BOM/NUL entfernen |
| `fix_encoding` | Encoding-Probleme beheben: BOM-Entfernung, doppelt kodiertes UTF-8, cp1252-Artefakte |
| `fix_umlauts` | Kaputte deutsche Umlaute aus Doppel-Encoding reparieren (z. B. `Ã¤` → `ä`) |
| `convert_format` | Zwischen JSON, YAML, TOML, XML, CSV und INI konvertieren |
| `detect_dupes` | Doppelte Dateien anhand von Content-Hash (SHA256) finden, gruppiert nach identischem Inhalt |
| `folder_diff` | Zwei Verzeichnisse vergleichen oder einen Snapshot erstellen und beim nächsten Aufruf abgleichen |
| `batch_rename` | Dateien per Regex-Muster umbenennen, mit Vorschau im Dry-Run-Modus |
| `archive` | ZIP-Archive erstellen, entpacken oder auflisten |
| `checksum` | Datei-Hashes berechnen (SHA256, MD5, SHA1, SHA512) mit optionaler Verifikation |
| `cleanup_file` | BOM entfernen, Leerzeichen am Zeilenende bereinigen, Zeilenenden korrigieren, NUL-Bytes entfernen |
| `scan_emoji` | Emoji-Zeichen in Quellcode-Dateien finden |
| `regex_test` | Regex-Muster gegen Text testen, mit Anzeige aller Treffer und Gruppen |

Alle destruktiven Werkzeuge laufen standardmäßig im **Dry-Run-Modus** und erfordern explizit `dry_run: false`, um Änderungen zu schreiben.

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

### Aus dem Quellcode

```bash
git clone https://github.com/ellmos-ai/ellmos-clatcher-mcp.git
cd ellmos-clatcher-mcp
npm install
npm run build
node dist/index.js
```

## Tests

```bash
npm test
```

122 Tests für alle 12 Tools (vitest).

## Voraussetzungen

- Node.js >= 18

## Lizenz

[MIT](LICENSE)

---

## ellmos-ai Ecosystem

This MCP server is part of the **[ellmos-ai](https://github.com/ellmos-ai)** ecosystem — AI infrastructure, MCP servers, and intelligent tools.

### MCP Server Family

| Server | Tools | Focus | npm |
|--------|-------|-------|-----|
| [FileCommander](https://github.com/ellmos-ai/ellmos-filecommander-mcp) | 43 | Filesystem, process management, interactive sessions | `ellmos-filecommander-mcp` |
| [CodeCommander](https://github.com/ellmos-ai/ellmos-codecommander-mcp) | 17 | Code analysis, AST parsing, import management | `ellmos-codecommander-mcp` |
| **[Clatcher](https://github.com/ellmos-ai/ellmos-clatcher-mcp)** | **12** | **File repair, format conversion, batch operations** | `ellmos-clatcher-mcp` |
| [n8n Manager](https://github.com/ellmos-ai/n8n-manager-mcp) | 13 | n8n workflow management via AI assistants | `n8n-manager-mcp` |

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
