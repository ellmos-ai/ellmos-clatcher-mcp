# Contributing to ellmos-clatcher-mcp / Mitwirken an ellmos-clatcher-mcp

[English](#english) | [Deutsch](#deutsch)

---

<a id="english"></a>
## English

Thank you for your interest in contributing to **ellmos-clatcher-mcp** (`ellmos-ai/ellmos-clatcher-mcp`), the local-first Model Context Protocol (MCP) utility toolkit extending AI coding agents with reliable file repair, encoding normalization, format conversion, duplicate detection, batch operations, and archive handling.

### 1. Architectural Principles & 10 Governance Invariants

All contributions must strictly uphold our core architectural invariants:

1. **Default Dry-Run Guard (`INV-DRYRUN-01`)**: All mutating tools (`batch_rename`, `cleanup_file`, `fix_json`, `fix_encoding`, `fix_umlauts`, `convert_format`, `archive`) default unconditionally to preview mode (`dry_run: true`). Modifying disk operations require explicit `dry_run: false`.
2. **100% Local-First & Zero-Egress (`INV-LOCAL-02`)**: Operates exclusively over standard input/output (`stdio`) JSON-RPC transport. No network ports, no external sockets, zero telemetry, and zero cloud data transmission.
3. **Path Traversal Guard (`INV-TRAVERSAL-03`)**: All filesystem operations validate destination paths against parent directory traversal attempts (`..` escaping sandbox roots).
4. **Atomic File Operations (`INV-ATOMIC-04`)**: Modifying pipelines stage changes in isolated temporary buffers before atomic file replacement, preventing truncated or corrupted outputs on interruption.
5. **Non-Elevation User-Mode (`INV-UNPRIV-05`)**: Pure `RunAsInvoker` standard user mode execution. The server and its scripts require zero administrative elevation, zero root/sudo privileges, and zero background system services.
6. **Lossless Encoding Preservation (`INV-ENCODING-06`)**: Reversible UTF-8 normalization eliminates Windows cp1252 artifacts, BOM headers, and German umlaut Mojibake (`ä, ö, ü, ß`) while guaranteeing pristine UTF-8 bytes.
7. **Cryptographic Multi-Hash Integrity (`INV-CRYPTO-07`)**: Native collision-resistant digest calculation (SHA-256, MD5, SHA-1, SHA-512) for file verification and snapshot diffing.
8. **Universal Multi-OS Parity (`INV-PLATFORM-08`)**: Universal parity across Linux, Windows, and macOS with native line endings and path handling.
9. **Fail-Closed Argument Validation (`INV-VALIDATION-09`)**: All tool calls are validated against strict Zod runtime schemas before execution. Missing or malformed parameters fail closed immediately.
10. **Binding 30d Remediation SLA (`INV-SLA-10`)**: Structured status receipts with diff previews, binding 48-hour response confirmation, 5 business days triage assessment, and 30 calendar days remediation SLA.

### 2. Plan D Local Development Workflow

In accordance with our repository architecture (Plan D), the canonical local git repository serves as the authoritative **Source of Truth** (`C:\_Local_DEV\repos\ellmos-clatcher-mcp`). Development, testing, and commits must take place exclusively in the local clone.

```bash
# Clone the canonical repository
git clone https://github.com/ellmos-ai/ellmos-clatcher-mcp.git
cd ellmos-clatcher-mcp

# Install dependencies
npm install

# Build TypeScript sources
npm run build

# Run automated vitest test suite
npm test
```

### 3. Version Freeze Discipline (`T-20260920-167562623`)

`ellmos-clatcher-mcp` operates under strict version-freeze discipline. Version `1.0.17` in `package.json`, `package-lock.json`, `server.json`, `glama.json`, and documentation badges must not be incremented without explicit release authorization. All technical hygiene, documentation updates, and workflow additions are documented under `## [Unreleased]` in `CHANGELOG.md`.

### 4. Quality Gates

Before submitting a pull request, verify that all quality gates pass:
1. `npm run build`: Zero TypeScript compilation errors.
2. `npm test`: 100% green test execution across all unit, integration, and metadata contract suites.
3. `git diff --check`: Zero whitespace anomalies.
4. `git diff -G"version"`: Zero unauthorized version modifications.

### 5. Statutory Notice (§ 521 BGB) & Liability Disclaimer

This software is provided free of charge as open-source software under the MIT License. In accordance with statutory German law (§ 521 BGB - Gefälligkeitsrecht), liability for defects in quality and title is strictly limited to intentional misconduct (*Vorsatz*) and gross negligence (*grobe Fahrlässigkeit*).

### 6. Security Contact & Vulnerability Reporting

Please report security issues privately:
- Maintainer & Security Team: [security@ellmos.ai](mailto:security@ellmos.ai), [security@open-bricks.org](mailto:security@open-bricks.org), [support@lukasgeiger.com](mailto:support@lukasgeiger.com), [lukas@open-bricks.org](mailto:lukas@open-bricks.org)
- Adhere to the 48h Security Response SLA (`INV-SLA-10`) as detailed in [SECURITY.md](SECURITY.md).

---

<a id="deutsch"></a>
## Deutsch

Vielen Dank für dein Interesse an einer Mitwirkung bei **ellmos-clatcher-mcp** (`ellmos-ai/ellmos-clatcher-mcp`), dem lokalen Model Context Protocol (MCP) Hilfswerkzeug-Toolkit, das KI-Coding-Agenten um zuverlässige Dateireparatur, Zeichensatz-Normalisierung, Formatkonvertierung, Duplikaterkennung, Batch-Operationen und Archivverwaltung erweitert.

### 1. Architektur-Prinzipien & 10 Governance-Invarianten

Alle Beiträge müssen unsere verbindlichen Kern-Invarianten strikt einhalten:

1. **Dry-Run-Schutz als Standard (`INV-DRYRUN-01`)**: Alle schreibenden Werkzeuge (`batch_rename`, `cleanup_file`, `fix_json`, `fix_encoding`, `fix_umlauts`, `convert_format`, `archive`) laufen standardmäßig ausnahmslos im Vorschaumodus (`dry_run: true`). Schreibende Dateisystemoperationen erfordern die explizite Angabe von `dry_run: false`.
2. **100% Local-First & Zero-Egress (`INV-LOCAL-02`)**: Arbeitet ausschließlich über Standard-Input/Output (`stdio`) JSON-RPC. Keine offenen Netzwerk-Ports, keine externen Sockets, null Telemetrie und null Cloud-Datenübertragung.
3. **Pfad-Traversal-Schutz (`INV-TRAVERSAL-03`)**: Alle Dateisystem-Operationen validieren Zielpfade gegen Directory-Traversal-Ausbrüche (`..`-Sequenzen aus Wurzelpfaden).
4. **Atomare Dateisystem-Operationen (`INV-ATOMIC-04`)**: Schreibende Pipelines puffern Änderungen in isolierten temporären Dateien vor dem atomaren Ersetzen, um unvollständige oder beschädigte Ausgaben bei Unterbrechungen auszuschließen.
5. **Rechtefreier Benutzermodus (`INV-UNPRIV-05`)**: Reine `RunAsInvoker`-Ausführung im unprivilegierten Standardbenutzer-Modus. Der Server und seine Skripte erfordern keinerlei administrative Rechte, kein root/sudo und keine Hintergrunddienste.
6. **Verlustfreier Zeichensatz-Erhalt (`INV-ENCODING-06`)**: Reversible UTF-8-Normalisierung eliminiert Windows cp1252-Artefakte, BOM-Header und Mojibake deutscher Umlaute (`ä, ö, ü, ß`) bei garantiert byte-exakter UTF-8-Integrität.
7. **Kryptografische Multi-Hash-Integrität (`INV-CRYPTO-07`)**: Native kollisionsresistente Prüfsummenberechnung (SHA-256, MD5, SHA-1, SHA-512) für Dateiverifikation und Snapshot-Vergleiche.
8. **Universelle Plattform-Parität (`INV-PLATFORM-08`)**: Vollständige Plattformparität über Linux, Windows und macOS mit nativer Zeilenumbruch- und Pfadbehandlung.
9. **Fail-Closed Argumentvalidierung (`INV-VALIDATION-09`)**: Alle Werkzeugaufrufe werden vor der Ausführung gegen strikte Zod-Laufzeitschemata geprüft. Ungültige Argumente schlagen sofort fehlgeschlossen fehl.
10. **Verbindliche 30-Tage Behebungszusage (`INV-SLA-10`)**: Strukturierte Quittungen mit Diff-Vorschau, verbindliche 48-Stunden-Erstantwort, 5-Werktage-Triage und 30-Kalendertage-Behebungszusage für Sicherheitsmeldungen.

### 2. Plan D Lokaler Entwicklungsworkflow

Gemäß unserer Architektur (Plan D) bildet das lokale Git-Repository die alleinige maßgebliche **Source of Truth** (`C:\_Local_DEV\repos\ellmos-clatcher-mcp`). Entwicklung, Tests und Commits finden ausschließlich im kanonischen lokalen Klon statt.

```bash
# Kanonischen Klon verwenden
git clone https://github.com/ellmos-ai/ellmos-clatcher-mcp.git
cd ellmos-clatcher-mcp

# Abhängigkeiten installieren
npm install

# TypeScript kompilieren
npm run build

# Vitest-Testsuite ausführen
npm test
```

### 3. Version-Freeze-Disziplin (`T-20260920-167562623`)

`ellmos-clatcher-mcp` unterliegt einer strikten Version-Freeze-Disziplin. Version `1.0.17` in `package.json`, `package-lock.json`, `server.json`, `glama.json` und Dokumentations-Badges darf ohne gesonderte Freigabe nicht erhöht werden. Alle technischen Wartungen, Dokumentationsanpassungen und Workflows werden unter `## [Unreleased]` in `CHANGELOG.md` erfasst.

### 4. Qualitätstore

Vor jedem Pull Request müssen alle Qualitätstore erfolgreich durchlaufen werden:
1. `npm run build`: Null TypeScript-Kompilierungsfehler.
2. `npm test`: 100% grüne Ausführung über alle Unit-, Integrations- und Vertragstests.
3. `git diff --check`: Keine Whitespace-Fehler.
4. `git diff -G"version"`: Keine unbefugten Versionsänderungen.

### 5. Gesetzlicher Hinweis (§ 521 BGB) & Haftungsausschluss

Diese Software wird unentgeltlich als Open-Source-Software unter der MIT-Lizenz bereitgestellt. Gemäß § 521 BGB (Gefälligkeitsrecht) ist die Haftung für Sach- und Rechtsmängel auf Vorsatz und grobe Fahrlässigkeit beschränkt.

### 6. Sicherheitskontakt & Meldung von Schwachstellen

Sicherheitsrelevante Hinweise bitte vertraulich einreichen an:
- Maintainer & Sicherheitsteam: [security@ellmos.ai](mailto:security@ellmos.ai), [security@open-bricks.org](mailto:security@open-bricks.org), [support@lukasgeiger.com](mailto:support@lukasgeiger.com), [lukas@open-bricks.org](mailto:lukas@open-bricks.org)
- Einhaltung der verbindlichen 48h-Reaktions-SLA (`INV-SLA-10`) gemäß [SECURITY.md](SECURITY.md).
