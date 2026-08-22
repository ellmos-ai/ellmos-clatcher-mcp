# Security Policy / Sicherheitsrichtlinie

[English](#english) | [Deutsch](#deutsch)

---

<a name="english"></a>
## English: Security Policy

### Important Security Notice

**This MCP server runs locally with the permissions of the invoking operating system user.**

`ellmos-clatcher-mcp` is designed as a local-first utility MCP server for text and data file operations, format conversions, encoding repairs, and archive management with built-in dry-run safety and non-destructive defaults. It adheres strictly to **Local-First** and **Zero-Egress** principles: no telemetry, no cloud transmission of user data, and strictly unprivileged standard user-mode execution.

### Tool Risk Classification & Execution Safety

#### Destructive / Modifying Tools (Dry-Run Protected)
All modifying tools enforce a strict **dry-run default** (`dry_run: true`). Mutating operations on the filesystem require an explicit `dry_run: false` parameter from the caller.

| Tool | Risk Level | Default Mode | Description & Mitigation |
|------|------------|--------------|--------------------------|
| `batch_rename` | **Medium** | `dry_run: true` | Renames files according to regex patterns with preview diff. |
| `cleanup_file` | **Medium** | `dry_run: true` | Strips BOM, trailing whitespace, fixes line endings. |
| `fix_json` | **Medium** | `dry_run: true` | Repairs broken JSON structure, comments, trailing commas. |
| `fix_encoding` | **Medium** | `dry_run: true` | Resolves encoding artifacts and double-encoded UTF-8. |
| `fix_umlauts` | **Medium** | `dry_run: true` | Restores corrupted German umlaut character sequences. |
| `convert_format` | **Medium** | `dry_run: true` | Converts data structures between JSON, YAML, TOML, XML, CSV, INI. |
| `archive` | **Medium** | Safe Extraction | Creates, extracts, or lists ZIP archives with path bounds. |

#### Read-Only / Diagnostic Tools (Zero Risk)
| Tool | Risk Level | Description |
|------|------------|-------------|
| `detect_dupes` | **Low (Read-Only)** | Computes SHA-256 hashes to group identical files. |
| `folder_diff` | **Low (Read-Only)** | Compares directory contents or evaluates snapshot deltas. |
| `checksum` | **Low (Read-Only)** | Calculates cryptographic hashes (SHA-256, MD5, SHA-1, SHA-512). |
| `scan_emoji` | **Low (Read-Only)** | Detects emoji occurrences and Unicode positions. |
| `regex_test` | **Low (Read-Only)** | Evaluates regular expressions against sample text. |

### Core Safety Mechanisms

1. **Dry-Run by Default**: All modifying operations default to preview mode (`dry_run: true`) to give AI agents and developers full visibility before applying changes to disk.
2. **Zero-Egress Guarantee**: Operates 100% offline. Never sends files, tokens, prompts, or hashes to any remote or external server.
3. **Transport Isolation**: Operates exclusively over standard input/output (`stdio`). Does not open network ports or listen on sockets.
4. **Non-Elevation**: Designed to execute purely within standard user permissions without requiring administrative or root elevation.
5. **Path Traversal Protection**: Archive and batch operations validate destination boundaries to prevent directory traversal attacks.

### Reporting Vulnerabilities

If you discover a security vulnerability or unexpected behavioral bypass in `ellmos-clatcher-mcp`, please report it responsibly:
- **Email**: [security@ellmos.ai](mailto:security@ellmos.ai) or [support@lukasgeiger.com](mailto:support@lukasgeiger.com) / [lukas@open-bricks.org](mailto:lukas@open-bricks.org)
- **GitHub**: [GitHub Security Advisories](https://github.com/ellmos-ai/ellmos-clatcher-mcp/security/advisories)

We aim to acknowledge and address security inquiries within 24 hours.

### Supported Versions

| Version | Supported | Notes |
|---------|-----------|-------|
| 1.0.x   | :white_check_mark: Yes | Current active release branch |
| < 1.0.0 | :x: No | Legacy pre-release versions |

---

<a name="deutsch"></a>
## Deutsch: Sicherheitsrichtlinie

### Wichtiger Sicherheitshinweis

**Dieser MCP-Server arbeitet lokal mit den Berechtigungen des ausführenden Betriebssystem-Benutzers.**

`ellmos-clatcher-mcp` ist ein lokaler MCP-Hilfswerkzeug-Server für Text- und Datendatei-Operationen, Formatkonvertierungen, Kodierungsreparaturen und Archivverwaltung mit standardmäßigem Dry-Run-Schutz. Das Design folgt strikten **Local-First-** und **Zero-Egress-**Prinzipien: keine Telemetrie, keine Datenübertragung an externe Server und reiner Betrieb im unprivilegierten Standard-Benutzerkontext.

### Risikoklassifizierung der Werkzeuge & Ausführungssicherheit

#### Verändernde / Schreibende Werkzeuge (Dry-Run geschützt)
Alle modifizierenden Werkzeuge erzwingen standardmäßig einen **Dry-Run-Modus** (`dry_run: true`). Schreibende Operationen auf dem Dateisystem erfordern die explizite Übergabe von `dry_run: false`.

| Werkzeug | Risikostufe | Standardmodus | Beschreibung & Schutzmaßnahmen |
|----------|-------------|---------------|--------------------------------|
| `batch_rename` | **Mittel** | `dry_run: true` | Benennt Dateien anhand von Regex-Mustern um (inkl. Vorschau-Diff). |
| `cleanup_file` | **Mittel** | `dry_run: true` | Entfernt BOM, abschließende Leerzeichen und korrigiert Zeilenumbrüche. |
| `fix_json` | **Mittel** | `dry_run: true` | Repariert fehlerhafte JSON-Strukturen, Kommentare und Trailing Commas. |
| `fix_encoding` | **Mittel** | `dry_run: true` | Behebt Kodierungsartefakte und doppelt kodiertes UTF-8. |
| `fix_umlauts` | **Mittel** | `dry_run: true` | Stellt beschädigte deutsche Umlaute (Mojibake) wieder her. |
| `convert_format` | **Mittel** | `dry_run: true` | Konvertiert Datenformate zwischen JSON, YAML, TOML, XML, CSV, INI. |
| `archive` | **Mittel** | Sichere Extraktion | Erstellt, entpackt oder listet ZIP-Archive mit Pfadgrenzen. |

#### Lesende / Diagnostische Werkzeuge (Kein Risiko)
| Werkzeug | Risikostufe | Beschreibung |
|----------|-------------|--------------|
| `detect_dupes` | **Niedrig (Nur-Lese)** | Berechnet SHA-256 Prüfsummen zur Gruppierung identischer Dateien. |
| `folder_diff` | **Niedrig (Nur-Lese)** | Vergleicht Verzeichnisinhalte oder Snapshot-Deltas. |
| `checksum` | **Niedrig (Nur-Lese)** | Berechnet kryptografische Hashes (SHA-256, MD5, SHA-1, SHA-512). |
| `scan_emoji` | **Niedrig (Nur-Lese)** | Erkennt Emoji-Zeichen und deren Unicode-Positionen. |
| `regex_test` | **Niedrig (Nur-Lese)** | Prüft reguläre Ausdrücke gegen Beispieltexte. |

### Zentrale Schutzfunktionen

1. **Dry-Run als Standard**: Alle schreibenden Operationen laufen standardmäßig im Vorschaumodus (`dry_run: true`), um KI-Agenten und Entwicklern volle Transparenz vor Disk-Mutationen zu garantieren.
2. **Zero-Egress-Garantie**: Vollständiger 100% Offline-Betrieb. Keine Übertragung von Dateien, Tokens, Prompts oder Hashes an externe Server.
3. **Transport-Isolation**: Ausschließliche Kommunikation über Standard-Ein-/Ausgabe (`stdio`). Keine offenen Netzwerk-Ports oder Web-Sockets.
4. **Keine Rechteerweiterung (Non-Elevation)**: Reiner Betrieb im Standard-Benutzerkontext ohne Administrator- oder Root-Rechte.
5. **Pfad-Traversal-Schutz**: Archiv- und Batch-Operationen validieren Zielpfade gegen Directory Traversal.

### Schwachstellen melden

Sollten Sie eine Sicherheitslücke oder unerwartetes Verhalten in `ellmos-clatcher-mcp` feststellen, melden Sie diese bitte verantwortungsvoll an:
- **E-Mail**: [security@ellmos.ai](mailto:security@ellmos.ai) oder [support@lukasgeiger.com](mailto:support@lukasgeiger.com) / [lukas@open-bricks.org](mailto:lukas@open-bricks.org)
- **GitHub**: [GitHub Security Advisories](https://github.com/ellmos-ai/ellmos-clatcher-mcp/security/advisories)

### Unterstützte Versionen

| Version | Unterstützt |
|---------|-------------|
| 1.0.x   | :white_check_mark: Ja |
| < 1.0.0 | :x: Nein (Bitte aktualisieren) |
