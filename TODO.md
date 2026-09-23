# TASKPLAN-Aufgabenregister

Stand: 2026-09-20  |  Rolle: TASKWRITER  |  Projekt: `ellmos-clatcher-mcp`

Dieses Register hält den aktuellen Review-Readback fest. Die vollständigen
Aufgabenbeschreibungen, Quellen, DoD, Blocker und Zuständigkeiten liegen
kanonisch in TASKPLAN; die folgenden IDs sind dafür maßgeblich.

## Projektfunktion

Lokaler, dry-run-orientierter TypeScript-MCP-Server mit 12 Werkzeugen,
lokaler Verarbeitung und einer dokumentierten Null-Egress-Ausrichtung.

## Review-Readback

- Controls und Projektdateien wurden gelesen: `README.md`, `README_de.md`,
  `SECURITY.md`, `CHANGELOG.md`, `package.json`, CI-Workflow,
  `server.json`, `glama.json`, `smithery.yaml`, Quellen und Tests.
- Vor diesem Lauf existierte kein kanonisches `TODO.md`, `ROADMAP.md` oder
  vergleichbares Aufgabenregister; deshalb wird dieses Register neu angelegt.
- `npm test`: 4 Testdateien, 163 Tests bestanden.
- `npx tsc --noEmit`: erfolgreich.
- `npm pack --dry-run`: erfolgreich; `ellmos-clatcher-mcp@1.0.17`, 47 Dateien,
  einschließlich `smithery.yaml`.
- `npm audit --omit=dev --json`: 6 Produktionsbefunde, davon 4 `high` und 2
  `moderate`; betroffen sind direkte und transitive Abhängigkeiten.
- Git-Arbeitsbaum sauber; lokaler `HEAD` `882ec2d7` liegt einen Commit vor
  `origin/main`, während Remote, Tag und npm weiterhin `1.0.17` auf
  `315e2f1` ausweisen. Der `Unreleased`-Abschnitt ist leer.
- Es wurden keine Aufgaben ausgeführt, keine Abhängigkeiten geändert, kein
  Audit-Fix, kein Push, kein Tag und kein Release vorgenommen.

## Offene TASKPLAN-Aufgaben

| ID | Aufgabe | Priorität | Aufwand | Scope | Quelle |
| --- | --- | --- | --- | --- | --- |
| `CLATCHER-SECURITY-001` (TASKPLAN #2195) | Produktionsabhängigkeiten gegen den aktuellen npm-Audit-Befund härten | hoch | large | local | `npm audit --omit=dev --json`, `package.json`, `package-lock.json` |
| `CLATCHER-RELEASE-002` (TASKPLAN #2196) | Post-1.0.17-Hygiene-Commit mit Unreleased- und Remote-Status abgleichen | mittel | special | local | Git-Status/-Historie/-Tags, `CHANGELOG.md` |
| `CLATCHER-SMITHERY-003` (TASKPLAN #2197) | Smithery-Konfiguration und Paketbeigabe bewusst entscheiden | mittel | special | local | `CHANGELOG.md`, `smithery.yaml`, `package.json` |

Die vollständige Definition of Done, die Ist-/Soll-Abgrenzung, Blocker,
Prioritätsbegründung und Nichtziele stehen in den jeweiligen TASKPLAN-
Aufgaben. Neue Aufgaben dürfen nicht an diesem Register vorbei in einem
zweiten lokalen Aufgabenspeicher angelegt werden.

## Abschluss dieses TASKWRITER-Schritts

Die drei Befunde wurden formalisiert und über die TASKPLAN-API mit Projekt,
Root, Aufwand, Scope und Quellen registriert. Dieser Schritt hat ausschließlich
erkannt, beschrieben und synchronisiert; die Bearbeitung erfolgt erst in einem
späteren TASKSOLVER-Schritt.
