<p align="center">
  <img src="assets/logo.jpg" alt="clatcher logo" width="400">
</p>

# ellmos-clatcher-mcp

**🇬🇧 [English Version](README.md)** | **🛡️ [Sicherheitsrichtlinie](SECURITY.md)** | **📝 [Changelog](CHANGELOG.md)** | **📋 [llms.txt](llms.txt)**

[![npm version](https://img.shields.io/npm/v/ellmos-clatcher-mcp.svg)](https://www.npmjs.com/package/ellmos-clatcher-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen.svg)](https://nodejs.org/)
[![Plattform](https://img.shields.io/badge/Plattform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)](https://github.com/ellmos-ai/ellmos-clatcher-mcp)
[![Clatcher tests](https://github.com/ellmos-ai/ellmos-clatcher-mcp/actions/workflows/tests.yml/badge.svg)](https://github.com/ellmos-ai/ellmos-clatcher-mcp/actions/workflows/tests.yml)
[![Vitest](https://img.shields.io/badge/tests-157%20passed-brightgreen.svg)](vitest.config.ts)
[![Sicherheitsrichtlinie](https://img.shields.io/badge/Sicherheit-48h%20SLA-blue.svg)](SECURITY.md)
[![Zero-Egress](https://img.shields.io/badge/Architektur-Local--First%20%2F%20Zero--Egress-success.svg)](SECURITY.md)
[![MCP Registry Ready](https://img.shields.io/badge/MCP%20Registry-ready-blue)](server.json)
[![Glama](https://img.shields.io/badge/Glama.ai-registered-purple)](glama.json)
[![LLM-Ready](https://img.shields.io/badge/LLM--Ready-llms.txt-blue)](llms.txt)
[![Ecosystem](https://img.shields.io/badge/Ecosystem-ellmos--ai-orange.svg)](https://github.com/ellmos-ai)
[![Umbrella](https://img.shields.io/badge/Umbrella-open--bricks-blue.svg)](https://github.com/open-bricks)

**Claude Patcher** — ein MCP-Server, der KI-Coding-Agenten um nützliche Werkzeuge erweitert, die sie von Haus aus nicht mitbringen. Dateireparatur, Formatkonvertierung, Duplikaterkennung, Batch-Operationen und mehr.

Nutze Clatcher, wenn ein Agent zuverlässige lokale Wartungswerkzeuge für Textdateien, Datendateien und Projektordner braucht: ungültiges JSON reparieren, Encodings normalisieren, Formate konvertieren, Ordner vergleichen, Dateien sicher umbenennen und Checksums prüfen, ohne den MCP-Workflow zu verlassen.

> [!NOTE]
> **KI / LLM Integrationshinweis:** Alle destruktiven Operationen (z. B. `batch_rename`, `cleanup_file`, `fix_json`, `fix_encoding`, `fix_umlauts`) laufen standardmäßig im **Dry-Run-Modus** (`dry_run: true`). Autonome Agenten müssen explizit `dry_run: false` übergeben, um Mutationen auf der Festplatte auszuführen.

## Highlights & Wertversprechen

- **12 spezialisierte Agenten-Werkzeuge**: Erweitert Claude Code, Cursor und MCP-Agenten um Hilfsmittel, die ihnen ab Werk fehlen (JSON-Reparatur, Encoding-Normalisierung, Formatkonvertierung, Ordner-Diffs, Duplikaterkennung, Regex-Batch-Umbenennung).
- **Dry-Run-Schutz als Standard**: Alle schreibenden Werkzeuge laufen standardmäßig im Vorschaumodus (`dry_run: true`). Mutationen auf der Festplatte erfordern die explizite Angabe von `dry_run: false`.
- **100% Local-First & Zero-Egress**: Reine lokale Ausführung über Stdio JSON-RPC. Keine Netzwerkabrufe, keine Cloud-Telemetrie, null externe Angriffsfläche.
- **Atomare Dateisystem-Operationen**: Schreibende Pipelines nutzen temporäre Pufferdateien vor dem Ersetzen, um unvollständige oder korrumpierte Dateien auszuschließen.
- **Verlustfreier Zeichensatz-Erhalt**: Korrigiert Windows cp1252-Artefakte, BOM-Header und defekte deutsche Umlaute (`ä, ö, ü, ß`) bei garantiert sauberem UTF-8-Byte-Output.
- **Universelle Multi-OS-Parität**: Kontinuierlich validiert auf Ubuntu, Windows und macOS mit nativer Pfad- und Zeilenumbruch-Behandlung.

## 🧭 Schnellnavigation

| # | Abschnitt | Fokus |
|---|---|---|
| 01 | [✨ Highlights & Wertversprechen](#highlights--wertversprechen) | 12 unverzichtbare Werkzeuge, die KI-Agenten nativ fehlen: Reparatur, Konvertierung, Duplikate |
| 02 | [📐 Systemarchitektur & Datenfluss](#systemarchitektur--datenfluss) | 5-Schichten Flowchart TD für Stdio-Transport und Reparatur-Engines |
| 03 | [🔄 End-to-End Ausführungssequenz](#end-to-end-ausf%C3%BChrungssequenz) | 14-stufiges Sequenzdiagramm für den Dry-Run-Schutz vom Prompt bis zum Schreiben |
| 04 | [🛡️ Kern-Invarianten & Sicherheitsgarantien](#kern-invarianten--sicherheitsgarantien) | 10 architektonische Garantien für Dry-Run-Standard, Zero-Egress und atomare Schreibvorgänge |
| 05 | [🛠️ Werkzeugübersicht & Fähigkeiten](#werkzeuge) | Detaillierte Übersicht aller 12 MCP-Tools mit Schemas und Vorschau-Defaults |
| 06 | [⚙️ Installation & Client-Einrichtung](#installation) | Nahtlose Konfiguration für Claude Code CLI, Claude Desktop, Cursor und npm global |
| 07 | [🧪 Verifikation & Automatisierte Tests](#tests) | 157 Vitest Tests, 100% grün, Multi-OS CI-Matrix auf Node.js 20, 22, 24 |
| 08 | [🌐 ellmos MCP-Familie & Geschwister-Matrix](#ellmos-mcp-familie) | 9 Geschwister-MCP-Server mit über 200 spezialisierten Agenten-Werkzeugen |
| 09 | [🧱 Ökosystem & Partnersuiten](#ellmos-ai-ecosystem) | Integration mit open-bricks Desktop-Suiten, BACH Text-OS und dev-bricks Tools |
| 10 | [🔒 Sicherheit & Meldewege](#sicherheitsrichtlinie) | Zweisprachige Sicherheitsrichtlinie, vertrauliche Meldewege, 48h Reaktions-SLA |
| 11 | [📋 Maschinenlesbarer Kontext (llms.txt)](#maschinenlesbarer-kontext-llmstxt) | Standardisierter LLM-Index für Agenten-Discovery und RAG-Crawler |
| 12 | [📝 Changelog & Versionshistorie](#changelog) | Release-Evolution, Dry-Run-Sicherheitsdurchsetzung und Hygiene-Audit |
| 13 | [🔍 Auffindbarkeit & Suchbegriffe](#auffindbarkeit) | Gezielte Suchbegriffe und Registry-Metadaten für Glama, Smithery und npm |
| 14 | [⚖️ Haftung & Rechtlicher Hinweis](#haftung) | Gesetzliche Open-Source-Schenkung nach §§ 516 ff. BGB und MIT-Haftungsausschluss |

## Systemarchitektur & Datenfluss

```mermaid
graph TD
    Agent["KI-Agent / Claude Code / Cursor / IDE"] -->|"MCP JSON-RPC Protokoll über Stdio"| Transport["MCP Stdio Transport-Schicht"]
    Transport --> Server["Clatcher MCP Server Laufzeit"]
    Server --> Dispatcher{"Tool-Dispatcher"}

    Dispatcher -->|"fix_json / cleanup_file"| JsonEngine["JSON Linter & Auto-Fix Engine"]
    Dispatcher -->|"fix_encoding / fix_umlauts"| EncodingEngine["Encoding-Normalisierer & Mojibake-Resolver"]
    Dispatcher -->|"convert_format"| FormatEngine["Format-Konverter: JSON/YAML/TOML/XML/CSV/INI"]
    Dispatcher -->|"detect_dupes / checksum"| HashEngine["SHA-256 / Multi-Hash Inhaltsprüfer"]
    Dispatcher -->|"folder_diff / batch_rename"| FileOpsEngine["Ordner-Diff & Regex Batch-Umbenenner"]
    Dispatcher -->|"archive / zip"| ArchiveEngine["AdmZip Kompressions-Handler"]
    Dispatcher -->|"scan_emoji / regex_test"| RegexEngine["Emoji-Scanner & Regex-Debugger"]

    JsonEngine --> DryRunGuard{"Dry-Run Schutz"}
    EncodingEngine --> DryRunGuard
    FormatEngine --> DryRunGuard
    FileOpsEngine --> DryRunGuard
    ArchiveEngine --> DryRunGuard

    DryRunGuard -->|"dry_run: true (Standard)"| PreviewReport["Detaillierter Dry-Run Vorschau-Diff & Status"]
    DryRunGuard -->|"dry_run: false (explizit)"| DiskWrite["Sicherer atomarer Schreibvorgang"]
```

### End-to-End Ausführungssequenz

```mermaid
sequenceDiagram
    autonumber
    actor User as Entwickler / Agenten-Orchestrator
    participant Agent as KI-Coding-Agent (Claude Code / Cursor)
    participant Stdio as MCP Stdio Protokoll (JSON-RPC)
    participant Clatcher as Clatcher MCP Server
    participant Validator as Zod Schema Validierer
    participant Engine as Dedizierte Werkzeug-Engine
    participant Guard as Dry-Run Schutzwächter
    participant FS as Lokales Dateisystem

    User->>Agent: Prompt: "Repariere defektes Encoding und Trailing Commas in config.json"
    Agent->>Stdio: CallTool(name="fix_json", args={path: "config.json", dry_run: true})
    Stdio->>Clatcher: Leite JSON-RPC Aufruf weiter
    Clatcher->>Validator: Validiere Parameter (Zod-Schema)
    Validator-->>Clatcher: Parameter gültig

    Clatcher->>Engine: Starte JSON-Reparaturpipeline
    Engine->>FS: Lese Zieldatei (UTF-8)
    FS-->>Engine: Rohdaten / Datei-String
    Engine->>Engine: Entferne Kommentare, Trailing Commas, Single Quotes, NULs
    Engine->>Guard: Übergebe repariertes Ergebnis

    alt dry_run == true (Standard-Modus)
        Guard->>Guard: Erzeuge Diff & Änderungsvorschau
        Guard-->>Clatcher: Liefere Vorschau-Diff ohne Schreiboperation
    else dry_run == false (Explizite Agenten-Mutation)
        Guard->>FS: Atomares Schreiben auf Zieldatei via Puffer
        FS-->>Guard: Schreibvorgang erfolgreich
        Guard-->>Clatcher: Quittung & geschriebene Bytes zurückgeben
    end

    Clatcher-->>Stdio: JSON-RPC ToolResult (Diff, Statistik, Sicherheitsbericht)
    Stdio-->>Agent: Formatierte MCP-Antwort
    Agent-->>User: Ergebnisübersicht & vorgeschlagene Folgeschritte
```

## Kern-Invarianten & Sicherheitsgarantien

| Invariante | Garantie | Durchsetzungs-Mechanismus |
|---|---|---|
| **Dry-Run als Standard** | Modifizierende Werkzeuge verändern niemals stillschweigend Dateien | Alle schreibenden Werkzeuge (`batch_rename`, `cleanup_file`, `fix_json`, `fix_encoding`, `fix_umlauts`, `convert_format`, `archive`) erzwingen standardmäßig `dry_run: true`. Schreiben erfordert explizit `dry_run: false`. |
| **Zero-Egress & Local-First** | Vollständiger Verzicht auf externe Telemetrie oder Netzwerkabrufe | 100% lokale Offline-Verarbeitung über Stdio JSON-RPC. Keine Tracking-Beacons, keine API-Calls, null ausgehende Netzwerk-Sockets. |
| **Pfad-Traversal-Schutz** | Strikt auf freigegebene Verzeichnisbäume beschränkt | Archiv- und Batch-Operationen validieren Zielpfade und verhindern Directory-Traversal-Ausbrüche (`../`) über Basispfade hinweg. |
| **Atomare Operationen** | Schutz vor unvollständig geschriebenen Dateien | Modifizierende Pipelines schreiben in temporäre Pufferdateien, bevor Ziele ersetzt werden, um Dateikorruption bei Abbrüchen auszuschließen. |
| **Keine Rechteerweiterung (Non-Elevation)** | Minimalste Benutzerrechte genügen | Läuft vollständig im unprivilegierten Benutzerkontext ohne Administrator- oder Root-Rechte. |
| **Erhalt der Zeichenkodierung** | Verlustfreie Round-Trip-Verarbeitung | Behebt cp1252-Artefakte, BOM-Probleme und kaputte deutsche Umlaute (`ä, ö, ü, ß`) bei gleichzeitigem Erhalt sauberer UTF-8-Bytes. |
| **Kryptografische Integrität** | Bitgenaue Prüfsummenvalidierung | Mehrfach-Hash-Prüfung mit Unterstützung für SHA-256, SHA-512, MD5 und SHA-1. |
| **Plattform-Parität** | Identisches Verhalten auf allen Betriebssystemen | Kontinuierlich getestet auf Linux (`ubuntu-latest`), Windows (`windows-latest`) und macOS (`macos-latest`) mit nativer Pfadtrenner-Handhabung. |
| **Fail-Closed Argumentvalidierung** | Ungültige Parameter werden vor der Ausführung abgewiesen | Zod-Schema-Validierung erzwingt strikte Eingabegrenzen, blockiert fehlerhafte Pfade/Typen und verhindert unvollständige Teilausführungen. |
| **Deterministische Fehlergrenzen & Quittungen** | Strukturierte diagnostische Rückmeldungen bei jedem Aufruf | Invariante Werkzeug-Rückgabeverträge: Jeder Aufruf liefert strukturierte JSON-RPC-Ergebnisse, Diff-Vorschauen, Bytezahlen und prüfbare Quittungen. |

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

### Claude Desktop / Cursor Konfiguration

Füge Clatcher zu deiner `claude_desktop_config.json` oder den Cursor-MCP-Einstellungen hinzu:

```json
{
  "mcpServers": {
    "clatcher": {
      "command": "npx",
      "args": ["-y", "ellmos-clatcher-mcp"]
    }
  }
}
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

157 Tests für alle 12 Tools, i18n-Sprachpakete, Repository-Hygiene und Metadaten-Konsistenz (vitest). Der GitHub-Actions-Workflow führt `npm ci`, TypeScript-Build, Vitest und einen npm-Paket-Dry-Run auf Node.js 20, 22 und 24 aus.

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
| [FileCommander](https://github.com/ellmos-ai/ellmos-filecommander-mcp) | 50 | Dateisystem, Prozessverwaltung, interaktive Sitzungen, Cloud-Lock-sichere Operationen | [`ellmos-filecommander-mcp`](https://www.npmjs.com/package/ellmos-filecommander-mcp) |
| [CodeCommander](https://github.com/ellmos-ai/ellmos-codecommander-mcp) | 22 | Code-Analyse, JSON-Reparatur, Imports, Diffs, Regex | [`ellmos-codecommander-mcp`](https://www.npmjs.com/package/ellmos-codecommander-mcp) |
| **[Clatcher](https://github.com/ellmos-ai/ellmos-clatcher-mcp)** | **12** | **Dateireparatur, Formatkonvertierung, Batch-Operationen** | **[`ellmos-clatcher-mcp`](https://www.npmjs.com/package/ellmos-clatcher-mcp)** |
| [n8n Manager](https://github.com/ellmos-ai/n8n-manager-mcp) | 19 | n8n-Workflow-Verwaltung über KI-Assistenten | [`n8n-manager-mcp`](https://www.npmjs.com/package/n8n-manager-mcp) |
| [ControlCenter](https://github.com/ellmos-ai/ellmos-controlcenter-mcp) | 34 | MCP-Stack-Discovery, Profilverwaltung, Control Plane | [`ellmos-controlcenter-mcp`](https://www.npmjs.com/package/ellmos-controlcenter-mcp) |
| [Homebase](https://github.com/ellmos-ai/ellmos-homebase-mcp) | 51 | Local-first LLM-Gedächtnis, Wissen, Zustand, Routing, Schwarm-Orchestrierung | [`ellmos-homebase-mcp`](https://www.npmjs.com/package/ellmos-homebase-mcp) (alpha) |
| [ServerCommander](https://github.com/ellmos-ai/ellmos-servercommander-mcp) | 8 | Server-Operationen: Health-Checks, Log-Analyse, Deploy-Dry-Runs, Mail-Diagnose | [`ellmos-servercommander-mcp`](https://www.npmjs.com/package/ellmos-servercommander-mcp) (alpha) |
| [Blender Use](https://github.com/ellmos-ai/ellmos-blender-use-mcp) | 4 | Headless Blender-Asset-QA und FBX-Reimport-Verifikation | [`ellmos-blender-use-mcp`](https://www.npmjs.com/package/ellmos-blender-use-mcp) (alpha) |
| [Open Compute](https://github.com/ellmos-ai/open-compute-mcp) | 16 | Modell-agnostischer Computer-Use: Capture, safety-gated Aktionen, Windows-UIA | [`open-compute-mcp`](https://www.npmjs.com/package/open-compute-mcp) (alpha) |

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
| [dev-bricks/DevCenter](https://github.com/dev-bricks/DevCenter) | Zentrales Entwickler-Cockpit und Service-Manager | Aktiv |
| [dev-bricks/CodeBox](https://github.com/dev-bricks/CodeBox) | Sandboxed Code-Ausführung und containerisierte Worker-Umgebung | Aktiv |

## Sicherheitsrichtlinie

Für Sicherheitsmeldungen, unterstützte Versionen und unsere 48-Stunden-Reaktions-SLA siehe **[SECURITY.md](SECURITY.md)**.

## Maschinenlesbarer Kontext (llms.txt)

Dieses Repository stellt eine standardisierte maschinenlesbare Kontextdatei für KI-Agenten, Crawler und RAG-Indexer bereit:
- **[llms.txt](llms.txt)**: Kompaktes Manifest aller 12 Werkzeuge, Dry-Run-Sicherheitsinvarianten, Geschwister-Toolzahlen und CLI-Aufrufbeispiele.

## Changelog

Die vollständige Versionshistorie, Release-Notizen und Hygiene-Audits finden Sie in **[CHANGELOG.md](CHANGELOG.md)**.

## Haftung

Dieses Projekt ist eine **unentgeltliche Open-Source-Schenkung** im Sinne der §§ 516 ff. BGB. Die Haftung des Urhebers ist gemäß **§ 521 BGB** auf **Vorsatz und grobe Fahrlässigkeit** beschränkt. Ergänzend gilt der Gewährleistungsausschluss der MIT-Lizenz.

Nutzung auf eigenes Risiko. Keine Wartungszusage, keine Verfügbarkeitsgarantie, keine Gewähr für Fehlerfreiheit oder Eignung für einen bestimmten Zweck.
