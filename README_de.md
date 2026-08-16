<p align="center">
  <img src="assets/logo.jpg" alt="clatcher logo" width="400">
</p>

# ellmos-clatcher-mcp

**🇬🇧 [English Version](README.md)**

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

**Claude Patcher** — ein MCP-Server, der KI-Coding-Agenten um nützliche Werkzeuge erweitert, die sie von Haus aus nicht mitbringen. Dateireparatur, Formatkonvertierung, Duplikaterkennung, Batch-Operationen und mehr.

Nutze Clatcher, wenn ein Agent zuverlässige lokale Wartungswerkzeuge für Textdateien, Datendateien und Projektordner braucht: ungültiges JSON reparieren, Encodings normalisieren, Formate konvertieren, Ordner vergleichen, Dateien sicher umbenennen und Checksums prüfen, ohne den MCP-Workflow zu verlassen.

> [!NOTE]
> **KI / LLM Integrationshinweis:** Alle destruktiven Operationen (z. B. `batch_rename`, `cleanup_file`, `fix_json`, `fix_encoding`, `fix_umlauts`) laufen standardmäßig im **Dry-Run-Modus** (`dry_run: true`). Autonome Agenten müssen explizit `dry_run: false` übergeben, um Mutationen auf der Festplatte auszuführen.

## Systemarchitektur & Datenfluss

```mermaid
graph TD
    Agent[KI-Agent / Claude Code / Cursor / IDE] -->|MCP JSON-RPC Protokoll über Stdio| Transport[MCP Stdio Transport-Schicht]
    Transport --> Server[Clatcher MCP Server Laufzeit]
    Server --> Dispatcher{Tool-Dispatcher}

    Dispatcher -->|fix_json / cleanup_file| JsonEngine[JSON Linter & Auto-Fix Engine]
    Dispatcher -->|fix_encoding / fix_umlauts| EncodingEngine[Encoding-Normalisierer & Mojibake-Resolver]
    Dispatcher -->|convert_format| FormatEngine[Format-Konverter: JSON/YAML/TOML/XML/CSV/INI]
    Dispatcher -->|detect_dupes / checksum| HashEngine[SHA-256 / Multi-Hash Inhaltsprüfer]
    Dispatcher -->|folder_diff / batch_rename| FileOpsEngine[Ordner-Diff & Regex Batch-Umbenenner]
    Dispatcher -->|archive / zip| ArchiveEngine[AdmZip Kompressions-Handler]
    Dispatcher -->|scan_emoji / regex_test| RegexEngine[Emoji-Scanner & Regex-Debugger]

    JsonEngine --> DryRunGuard{Dry-Run Schutz}
    EncodingEngine --> DryRunGuard
    FormatEngine --> DryRunGuard
    FileOpsEngine --> DryRunGuard
    ArchiveEngine --> DryRunGuard

    DryRunGuard -->|dry_run: true (Standard)| PreviewReport[Detaillierter Dry-Run Vorschau-Diff & Status]
    DryRunGuard -->|dry_run: false (explizit)| DiskWrite[Sicherer atomarer Schreibvorgang]
```

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
| [ellmos-blender-use-mcp](https://github.com/ellmos-ai/ellmos-blender-use-mcp) | Headless Blender Asset QA und FBX-Reimport-Verifikation | [`ellmos-blender-use-mcp`](https://www.npmjs.com/package/ellmos-blender-use-mcp) (alpha) |
| [open-compute-mcp](https://github.com/ellmos-ai/open-compute-mcp) | Modell-agnostischer Computer-Use: Capture, safety-gated Aktionen, Windows UIA | [`open-compute-mcp`](https://www.npmjs.com/package/open-compute-mcp) (alpha) |

Jeder Server deckt einen anderen Bereich ab. Verwende einen Server, ein fokussiertes Paar oder die ganze Familie — je nach Workflow.

## Auffindbarkeit

- **npm:** [`ellmos-clatcher-mcp`](https://www.npmjs.com/package/ellmos-clatcher-mcp)
- **GitHub:** [`ellmos-ai/ellmos-clatcher-mcp`](https://github.com/ellmos-ai/ellmos-clatcher-mcp)
- **MCP-Registry-Metadaten:** [`server.json`](server.json) deklariert die offizielle Paketidentität `io.github.ellmos-ai/ellmos-clatcher-mcp`.
- **Glama.ai-Registry:** [`glama.json`](glama.json) Manifest für das Glama-MCP-Ökosystem.
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

143 Tests für alle 12 Tools, i18n-Sprachpakete, Repository-Hygiene und Metadaten-Konsistenz (vitest). Der GitHub-Actions-Workflow führt `npm ci`, TypeScript-Build, Vitest und einen npm-Paket-Dry-Run auf Node.js 20, 22 und 24 aus.

## Voraussetzungen

- Node.js >= 20

## Lizenz

[MIT](LICENSE)

---

## ellmos-ai-Ökosystem

Dieser MCP-Server ist Teil des **[ellmos-ai](https://github.com/ellmos-ai)**-Ökosystems — KI-Infrastruktur, MCP-Server und intelligente Werkzeuge.

### MCP-Server-Familie

| Server | Tools | Fokus | npm |
|--------|-------|-------|-----|
| [FileCommander](https://github.com/ellmos-ai/ellmos-filecommander-mcp) | 47 | Dateisystem, Prozessverwaltung, interaktive Sitzungen, Cloud-Lock-sichere Operationen | [`ellmos-filecommander-mcp`](https://www.npmjs.com/package/ellmos-filecommander-mcp) |
| [CodeCommander](https://github.com/ellmos-ai/ellmos-codecommander-mcp) | 22 | Code-Analyse, JSON-Reparatur, Imports, Diffs, Regex | [`ellmos-codecommander-mcp`](https://www.npmjs.com/package/ellmos-codecommander-mcp) |
| **[Clatcher](https://github.com/ellmos-ai/ellmos-clatcher-mcp)** | **12** | **Dateireparatur, Formatkonvertierung, Batch-Operationen** | **[`ellmos-clatcher-mcp`](https://www.npmjs.com/package/ellmos-clatcher-mcp)** |
| [n8n Manager](https://github.com/ellmos-ai/n8n-manager-mcp) | 19 | n8n-Workflow-Verwaltung über KI-Assistenten | [`n8n-manager-mcp`](https://www.npmjs.com/package/n8n-manager-mcp) |
| [ControlCenter](https://github.com/ellmos-ai/ellmos-controlcenter-mcp) | 20 | MCP-Stack-Discovery, Profilverwaltung, Control Plane | [`ellmos-controlcenter-mcp`](https://www.npmjs.com/package/ellmos-controlcenter-mcp) |
| [Homebase](https://github.com/ellmos-ai/ellmos-homebase-mcp) | 45 | Local-first LLM-Gedächtnis, Wissen, Zustand, Routing, Schwarm-Orchestrierung | [`ellmos-homebase-mcp`](https://www.npmjs.com/package/ellmos-homebase-mcp) (alpha) |
| [ServerCommander](https://github.com/ellmos-ai/ellmos-servercommander-mcp) | 8 | Server-Operationen: Health-Checks, Log-Analyse, Deploy-Dry-Runs, Mail-Diagnose | [`ellmos-servercommander-mcp`](https://www.npmjs.com/package/ellmos-servercommander-mcp) (alpha) |
| [Blender Use](https://github.com/ellmos-ai/ellmos-blender-use-mcp) | 3 | Headless Blender-Asset-QA und FBX-Reimport-Verifikation | [`ellmos-blender-use-mcp`](https://www.npmjs.com/package/ellmos-blender-use-mcp) (alpha) |
| [Open Compute](https://github.com/ellmos-ai/open-compute-mcp) | 10 | Modell-agnostischer Computer-Use: Capture, safety-gated Aktionen, Windows-UIA | [`open-compute-mcp`](https://www.npmjs.com/package/open-compute-mcp) (alpha) |

### KI-Infrastruktur

| Projekt | Beschreibung |
|---------|-------------|
| [BACH](https://github.com/ellmos-ai/bach) | Local-first textbasiertes OS für LLM-Agenten — 113+ Handler, 550+ Tools, SQLite-Memory |
| [open-compute](https://github.com/ellmos-ai/open-compute) | Modell-agnostischer Computer-Use-Kern hinter Open Compute MCP |
| [clutch](https://github.com/ellmos-ai/clutch) | Provider-neutrale LLM-Orchestrierung mit Auto-Routing und Budget-Tracking |
| [rinnsal](https://github.com/ellmos-ai/rinnsal) | Leichte Agent-Memory-, Connector- und Automatisierungsinfrastruktur |
| [ellmos-stack](https://github.com/ellmos-ai/ellmos-stack) | Self-hosted AI Research Stack (Ollama + n8n + Rinnsal + KnowledgeDigest) |
| [MarbleRun](https://github.com/ellmos-ai/MarbleRun) | Autonomes Agent-Chain-Framework für Claude Code |
| [gardener](https://github.com/ellmos-ai/gardener) | Minimalistischer datenbankgetriebener LLM-OS-Prototyp (4 Funktionen, 1 Tabelle) |
| [ellmos-tests](https://github.com/ellmos-ai/ellmos-tests) | Testframework für LLM-Betriebssysteme (7 Dimensionen) |

### Desktop-Software & Geschwister-Ökosystem

Unsere Partnerorganisation **[open-bricks](https://github.com/open-bricks)** und Schwester-Suiten bündeln KI-native Desktop-Anwendungen und Entwickler-Tools:

| Repository | Fokus | Status |
|---|---|---|
| [file-bricks/ProFiler](https://github.com/file-bricks/ProFiler) | Mehrspaltiger PySide6 Desktop-Dateimanager mit Smart Workspaces | Aktiv |
| [doc-bricks/DokuZen](https://github.com/doc-bricks/DokuZen) | Dokumentenkonvertierung, Batch-OCR, Metadaten-Bereinigung | Aktiv |
| [dev-bricks/safe-start-for-codex](https://github.com/dev-bricks/safe-start-for-codex) | Sichere Workspace-Preflight- und Agent-Bootstrap-Gates | Aktiv |
| [dev-bricks/automation-master](https://github.com/dev-bricks/automation-master) | Cross-Agent-Automations-Orchestrator und Policy-Enforcer | Aktiv |
| [dev-bricks/DevCenter](https://github.com/dev-bricks/DevCenter) | Zentrales Entwickler-Cockpit und Service-Manager | Aktiv |
| [dev-bricks/CodeBox](https://github.com/dev-bricks/CodeBox) | Sandboxed Code-Ausführung und containerisierte Worker-Umgebung | Aktiv |

## Haftung

Dieses Projekt ist eine **unentgeltliche Open-Source-Schenkung** im Sinne der §§ 516 ff. BGB. Die Haftung des Urhebers ist gemäß **§ 521 BGB** auf **Vorsatz und grobe Fahrlässigkeit** beschränkt. Ergänzend gilt der Gewährleistungsausschluss der MIT-Lizenz.

Nutzung auf eigenes Risiko. Keine Wartungszusage, keine Verfügbarkeitsgarantie, keine Gewähr für Fehlerfreiheit oder Eignung für einen bestimmten Zweck.
