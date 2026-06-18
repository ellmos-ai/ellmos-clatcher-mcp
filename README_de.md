<p align="center">
  <img src="assets/logo.jpg" alt="clatcher logo" width="400">
</p>

# ellmos-clatcher-mcp

**🇬🇧 [English Version](README.md)**

[![npm version](https://img.shields.io/npm/v/ellmos-clatcher-mcp.svg)](https://www.npmjs.com/package/ellmos-clatcher-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org/)
[![Clatcher tests](https://github.com/ellmos-ai/ellmos-clatcher-mcp/actions/workflows/tests.yml/badge.svg)](https://github.com/ellmos-ai/ellmos-clatcher-mcp/actions/workflows/tests.yml)
[![MCP Registry Ready](https://img.shields.io/badge/MCP%20Registry-ready-blue)](server.json)

**Claude Patcher** — ein MCP-Server, der KI-Coding-Agenten um nützliche Werkzeuge erweitert, die sie von Haus aus nicht mitbringen. Dateireparatur, Formatkonvertierung, Duplikaterkennung, Batch-Operationen und mehr.

Nutze Clatcher, wenn ein Agent zuverlässige lokale Wartungswerkzeuge für Textdateien, Datendateien und Projektordner braucht: ungültiges JSON reparieren, Encodings normalisieren, Formate konvertieren, Ordner vergleichen, Dateien sicher umbenennen und Checksums prüfen, ohne den MCP-Workflow zu verlassen.

Teil der **ellmos MCP-Familie**:

| Server | Fokus | npm |
|---|---|---|
| [ellmos-filecommander-mcp](https://github.com/ellmos-ai/ellmos-filecommander-mcp) | Dateisystem-Operationen, Prozessverwaltung, interaktive Sitzungen | [`ellmos-filecommander-mcp`](https://www.npmjs.com/package/ellmos-filecommander-mcp) |
| [ellmos-codecommander-mcp](https://github.com/ellmos-ai/ellmos-codecommander-mcp) | Code-Analyse, AST-Parsing, Import-Verwaltung | [`ellmos-codecommander-mcp`](https://www.npmjs.com/package/ellmos-codecommander-mcp) |
| **[ellmos-clatcher-mcp](https://github.com/ellmos-ai/ellmos-clatcher-mcp)** | **Hilfswerkzeuge: Reparatur, Konvertierung, Erkennung, Batch-Operationen** | **[`ellmos-clatcher-mcp`](https://www.npmjs.com/package/ellmos-clatcher-mcp)** |
| [n8n-manager-mcp](https://github.com/ellmos-ai/n8n-manager-mcp) | n8n-Workflow-Verwaltung über KI-Assistenten | [`n8n-manager-mcp`](https://www.npmjs.com/package/n8n-manager-mcp) |
| [ellmos-controlcenter-mcp](https://github.com/ellmos-ai/ellmos-controlcenter-mcp) | MCP-Stack-Discovery, Profilverwaltung, Control Plane | [`ellmos-controlcenter-mcp`](https://www.npmjs.com/package/ellmos-controlcenter-mcp) |
| [ellmos-homebase-mcp](https://github.com/ellmos-ai/ellmos-homebase-mcp) | LLM-Memory, Wissen, Zustandsverwaltung, Routing und Orchestrierung | [`ellmos-homebase-mcp`](https://www.npmjs.com/package/ellmos-homebase-mcp) (alpha) |
| [ellmos-servercommander-mcp](https://github.com/ellmos-ai/ellmos-servercommander-mcp) | Server-Operationen: Deploy-Dry-Runs, Mail-Status, Log-Analyse, Health-Checks | [`ellmos-servercommander-mcp`](https://www.npmjs.com/package/ellmos-servercommander-mcp) (alpha) |

Jeder Server deckt einen anderen Bereich ab. Verwende einen Server, ein fokussiertes Paar oder die ganze Familie — je nach Workflow.

## Auffindbarkeit

- **npm:** [`ellmos-clatcher-mcp`](https://www.npmjs.com/package/ellmos-clatcher-mcp)
- **GitHub:** [`ellmos-ai/ellmos-clatcher-mcp`](https://github.com/ellmos-ai/ellmos-clatcher-mcp)
- **MCP-Registry-Metadaten:** [`server.json`](server.json) deklariert die offizielle Paketidentität `io.github.ellmos-ai/ellmos-clatcher-mcp`.
- **LLM-Index:** [`llms.txt`](llms.txt) fasst die Tool-Oberfläche für Agenten und Registry-Crawler zusammen.

Primäre Suchbegriffe: `ellmos-clatcher-mcp`, `clatcher mcp`, `claude patcher`, `mcp json repair server`, `mcp encoding fix`, `model context protocol file repair`, `claude code utility tools`, `format conversion mcp tool`, `duplicate file detection mcp`, `batch rename mcp`, `checksum mcp`, `zip archive mcp`.

## Werkzeuge

| Tool | Beschreibung |
|---|---|
| `fix_json` | Defektes JSON reparieren: Kommentare, abschließende Kommas, einfache Anführungszeichen, BOM/NUL entfernen |
| `fix_encoding` | Encoding-Probleme beheben: BOM-Entfernung, doppelt kodiertes UTF-8, cp1252-Artefakte |
| `fix_umlauts` | Kaputte deutsche Umlaute aus Doppel-Encoding reparieren (z. B. `\u00C3\u00A4` → `ä`) |
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

136 Tests für alle 12 Tools, i18n-Sprachpakete und Repository-Hygiene (vitest). Der GitHub-Actions-Workflow führt `npm ci`, TypeScript-Build, Vitest und einen npm-Paket-Dry-Run auf Node.js 20, 22 und 24 aus.

## Voraussetzungen

- Node.js >= 18

## Lizenz

[MIT](LICENSE)

---

## ellmos-ai-Ökosystem

Dieser MCP-Server ist Teil des **[ellmos-ai](https://github.com/ellmos-ai)**-Ökosystems: KI-Infrastruktur, MCP-Server und intelligente Werkzeuge.

### MCP-Server-Familie

| Server | Tools | Fokus | npm |
|--------|-------|-------|-----|
| [FileCommander](https://github.com/ellmos-ai/ellmos-filecommander-mcp) | 44 | Dateisystem, Prozessverwaltung, interaktive Sitzungen | [`ellmos-filecommander-mcp`](https://www.npmjs.com/package/ellmos-filecommander-mcp) |
| [CodeCommander](https://github.com/ellmos-ai/ellmos-codecommander-mcp) | 17 | Code-Analyse, AST-Parsing, Import-Verwaltung | [`ellmos-codecommander-mcp`](https://www.npmjs.com/package/ellmos-codecommander-mcp) |
| **[Clatcher](https://github.com/ellmos-ai/ellmos-clatcher-mcp)** | **12** | **Dateireparatur, Formatkonvertierung, Batch-Operationen** | **[`ellmos-clatcher-mcp`](https://www.npmjs.com/package/ellmos-clatcher-mcp)** |
| [n8n Manager](https://github.com/ellmos-ai/n8n-manager-mcp) | 18 | n8n-Workflow-Verwaltung über KI-Assistenten | [`n8n-manager-mcp`](https://www.npmjs.com/package/n8n-manager-mcp) |
| [ControlCenter](https://github.com/ellmos-ai/ellmos-controlcenter-mcp) | 10 | MCP-Stack-Discovery, Profilverwaltung, Control Plane | [`ellmos-controlcenter-mcp`](https://www.npmjs.com/package/ellmos-controlcenter-mcp) |
| [Homebase](https://github.com/ellmos-ai/ellmos-homebase-mcp) | 44 | LLM-Memory, Wissen, Zustandsverwaltung, Routing und Orchestrierung | [`ellmos-homebase-mcp`](https://www.npmjs.com/package/ellmos-homebase-mcp) (alpha) |
| [ServerCommander](https://github.com/ellmos-ai/ellmos-servercommander-mcp) | 8 | Server-Operationen: Deploy-Dry-Runs, Mail, Log-Analyse, Health-Checks | [`ellmos-servercommander-mcp`](https://www.npmjs.com/package/ellmos-servercommander-mcp) (alpha) |

### KI-Infrastruktur

| Projekt | Beschreibung |
|---------|-------------|
| [BACH](https://github.com/ellmos-ai/bach) | Textbasiertes Betriebssystem für LLMs: Handler, Tools und Skills |
| [clutch](https://github.com/ellmos-ai/clutch) | Provider-neutrale LLM-Orchestrierung mit Auto-Routing und Budget-Tracking |
| [rinnsal](https://github.com/ellmos-ai/rinnsal) | Leichte Agent-Memory-, Connector- und Automatisierungsinfrastruktur |
| [ellmos-stack](https://github.com/ellmos-ai/ellmos-stack) | Self-hosted AI Research Stack |
| [MarbleRun](https://github.com/ellmos-ai/MarbleRun) | Autonomes Agent-Chain-Framework für Claude Code |
| [gardener](https://github.com/ellmos-ai/gardener) | Minimalistischer datenbankgetriebener LLM-OS-Prototyp |
| [ellmos-tests](https://github.com/ellmos-ai/ellmos-tests) | Testframework für LLM-Betriebssysteme |

### Desktop-Software

Unsere Partnerorganisation **[open-bricks](https://github.com/open-bricks)** bündelt KI-native Desktop-Anwendungen: eine moderne Open-Source-Softwaresuite für Datei-, Dokumenten- und Entwicklerwerkzeuge.

---

## Haftung

Dieses Projekt ist eine **unentgeltliche Open-Source-Schenkung** im Sinne der §§ 516 ff. BGB. Die Haftung des Urhebers ist gemäß **§ 521 BGB** auf **Vorsatz und grobe Fahrlässigkeit** beschränkt. Ergänzend gilt der Gewährleistungsausschluss der MIT-Lizenz.

Nutzung auf eigenes Risiko. Keine Wartungszusage, keine Verfügbarkeitsgarantie, keine Gewähr für Fehlerfreiheit oder Eignung für einen bestimmten Zweck.
