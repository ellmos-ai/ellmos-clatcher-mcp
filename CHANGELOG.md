# Changelog

All notable changes to this project will be documented in this file.

## Unreleased

## [1.0.17] - 2026-09-14

### Repository Hygiene, CI Timeout Hardening & Multi-Host Protection (Pfad A) (2026-09-14)
- **CI Workflow Timeout- & Concurrency-Härtung (`.github/workflows/tests.yml`):** Configured strict `timeout-minutes: 15` on the multi-OS test matrix job (`ubuntu-latest`, `windows-latest`, `macos-latest` across Node.js 20, 22, 24) and removed duplicate `concurrency:` block definition. Hardened auxiliary workflows with timeout guardrails: `stale.yml` (`timeout-minutes: 10`), `welcome.yml` (`timeout-minutes: 5`), `auto-assign.yml` (`timeout-minutes: 5`), and `label-sync.yml` (`timeout-minutes: 5`).
- **.gitignore Multi-Host Cloud-Sync & Lock Defense:** Comprehensive hardening against OneDrive multi-host duplicate/conflict copies (`* (kopie)*`, `* (copy)*`, `* (Kopie)*`, `* (Copy)*`, `*conflicted copy*`, `*-ASUS-GEI.*`, `*-ASUS.*`, `*-WORKSTATION-LG.*`, `*-WORKSTATION.*`, `*-LAPTOP.*`, `*-LAPTOP-*`, `*-Mac Studio.*`), multi-agent lock files (`LOCK.permissions.json`, `uv.lock`), and coverage/cache artifacts (`.tox/`, `.turbo/`, `.nyc_output/`, `.hypothesis/`, `htmlcov/`).
- **Automated Hygiene & Contract Test Expansion (`test/repository-hygiene.test.ts` & `test/metadata.test.ts`):** Added automated contract tests for CI workflow timeout guardrails, expanded multi-host conflict and lock pattern protections in `.gitignore`, verified manifest version parity on 1.0.17, and updated test suite count baselines.
- **Documentation, Badges & Metadata Freshness:** Synchronized version `1.0.17` across `package.json`, `package-lock.json`, `server.json`, `glama.json`, and `src/index.ts`. Updated `SECURITY.md` and `llms.txt` freshness timestamps to `2026-09-14`, harmonized test badges and count descriptions in `README.md` and `README_de.md`.

### Bilingual Quick Navigation, 10 Runtime Invariants, License Audit & Metadata Parity (Pfad B) (2026-09-12)
- **Third-Party License Audit & Inventory (`THIRD_PARTY_LICENSES.md`):** Conducted comprehensive software license audit across all 7 runtime dependencies and 5 development dependencies. Validated 100% permissive licensing status (MIT, BSD-3-Clause, BSD-2-Clause, Apache-2.0) with zero GPL/AGPL copyleft dependencies and zero cloud network telemetry.
- **Local Marketing, Personas & Competitive Matrix (`MARKETING-LOG.txt`):** Structured 4 primary target audience personas (Autonomous AI Agents, Full-Stack Developers, DevOps & Release Engineers, Security & Compliance Officers), high-intent EN/DE keyword matrix, and 5-way comparative evaluation across 10 architectural dimensions vs built-in agent bash, ad-hoc jq/sed CLI scripts, heavy desktop apps, and online converters.
- **Bilingual 16-Point Quick Navigation Standard (`README.md` & `README_de.md`):** Upgraded quick navigation architecture to 16 reciprocal points, integrating dedicated sections for Target Personas (`#target-personas--discoverability` / `#zielgruppen--auffindbarkeit`), Comparative Matrix (`#comparative-matrix--alternatives` / `#vergleichsmatrix--alternativen`), and Third-Party Licenses (`#third-party-licenses--transparency` / `#drittanbieter-lizenzen--transparenz`).
- **Shields.io Badge Arsenal Expansion:** Added badges for audited third-party licenses, active marketing log, and freshness date (`2026-09-12`).
- **Automated Contract Suite Expansion (`test/metadata.test.ts`):** Added automated Vitest contract tests enforcing the presence of `THIRD_PARTY_LICENSES.md`, marketing log personas, 16-point navigation structure, and reciprocal anchor parity (161 tests passing).
- **Manifests & Context Synchronization:** Added `THIRD_PARTY_LICENSES.md` to `package.json` package files array; refreshed `llms.txt` and `SECURITY.md` timestamps to `2026-09-12`.

### Repository Hygiene, CI Matrix Concurrency & Multi-Agent Lock Protection (Pfad A) (2026-09-10)
- **.gitignore Hardening:** Added ecosystem-standard ignore patterns for multi-host synchronization conflicts (`*-conflict-*`, `*.sync-conflict-*`, `*.sync-temp-*`), multi-agent lock management (`LOCK`, `LOCK.*`, `LOCK*.txt`, `*.lock` with explicit `!package-lock.json` unignore), test and coverage caches (`.pytest_cache/`, `.ruff_cache/`, `.coverage`, `coverage/`, `.vitest/`), packaging artifacts (`wheelhouse/`, `.wheel-smoke/`), and temporary editor files (`*.tmp`, `*.bak`, `*.swp`, `*~`).
- **CI Matrix Concurrency Guard:** Configured GitHub Actions workflow concurrency group (`${{ github.workflow }}-${{ github.ref }}`) with `cancel-in-progress: true` in `.github/workflows/tests.yml` across the multi-OS matrix (Ubuntu, Windows, macOS).
- **Automated Hygiene Contract Testsuite:** Expanded `test/repository-hygiene.test.ts` with 4 new contract tests validating sync-conflict exclusion, lockfile isolation with `package-lock.json` trackability preservation, cache directory ignoring, and workflow concurrency configuration.
- **Documentation & Metadata Parity:** Synchronized test count badges and descriptions to passed tests across `README.md`, `README_de.md`, and `llms.txt`; refreshed timestamps in `SECURITY.md` and `llms.txt` to `2026-09-10`.

### Discoverability, Visual Architecture & Governance Audit (Pfad B) (2026-09-09)
- **14-Point Quick Navigation Standard:** Standardized bilingual navigation tables (`README.md` and `README_de.md`) spanning 14 discrete structural sections (Highlights, Architecture, Sequence, 10 Invariants, Tools, Installation, Tests, Sibling Family, Ecosystem, Security, llms.txt, Changelog, Discoverability, Liability & License).
- **Core Governance & Runtime Invariants Matrix (10 Invariants):** Expanded the invariants specification across English and German READMEs with 2 additional operational guarantees: *Fail-Closed Argument Validation* (strict Zod schema bounds rejecting malformed inputs) and *Deterministic Error Bounds & Receipts* (invariant tool return contracts with diffs, stats, and audit receipts).
- **CI/CD Concurrency Hardening (`.github/workflows/tests.yml`):** Added a GitHub Actions `concurrency` group (`${{ github.workflow }}-${{ github.ref }}`) with `cancel-in-progress: true` to prevent resource contention and redundant queued CI runs on rapid commits.
- **Repository Hygiene & Multi-Host Protection (`.gitignore`):** Hardened `.gitignore` against multi-host cloud synchronization conflicts (`*.sync-conflict-*`, `*.conflict`, `*-CONFLIT-*`) and multi-agent lock artifacts (`LOCK.*`, `*.lock`, `LOCK*.txt`) while guaranteeing that `!package-lock.json` remains tracked.
- **Security Policy & Response SLA Update (`SECURITY.md`):** Refreshed policy timestamp to 2026-09-09, clarified dual SLAs (48-hour acknowledgment, 5-business-day triage), and integrated `security@open-bricks.org` across reporting channels.
- **Machine-Readable Manifest Refresh (`llms.txt`):** Updated freshness date to 2026-09-09 and synchronized Vitest test count.
- **Local Marketing & Governance Audit Log (`MARKETING-LOG.txt`):** Established repository-local marketing and architecture audit log adhering to GITHUBBOT multi-agent documentation conventions.
- **Automated Contract Suite Expansion (`test/metadata.test.ts`):** Added automated regression tests covering local marketing log presence, 10 runtime invariants, CI concurrency configuration, `.gitignore` conflict shielding, and 14-point navigation parity.

### Discoverability, Showcase Design & Parity Audit (Pfad B) (2026-09-07)
- **Bilingual Documentation Overhaul (`README.md` & `README_de.md`):** Synchronized comprehensive Quick Navigation (`🧭 Quick Navigation` / `🧭 Schnellnavigation`) with direct anchor jumps, dual interactive Mermaid diagrams (`graph TD` for component data flow and `sequenceDiagram` for end-to-end agent tool lifecycle), structured Core Invariants & Safety Guarantees matrix, client configuration walkthroughs for Claude Desktop and Cursor, and upgraded Shields.io badges (Node.js >=20, Vitest 148 passed tests, Multi-OS platform matrix, 100% Local-First / Zero-Egress, 48h Security SLA).
- **Core Invariants & Safety Guarantees:** Documented runtime invariants for default dry-run protection, local-first zero-egress operation, atomic staging, path traversal guards, non-elevation user-mode, lossless character encoding preservation, and multi-hash cryptographic integrity.
- **Client Configuration Guides:** Added concrete setup snippets for Claude Code CLI, Claude Desktop (`claude_desktop_config.json`), and Cursor / MCP-compatible agents.
- **Sibling Ecosystem Matrix:** Harmonized cross-linking matrix across `README.md`, `README_de.md`, and `llms.txt`, covering 9 sibling MCP servers in `ellmos-ai` and partner suites in `open-bricks`, `file-bricks`, `dev-bricks`, and `doc-bricks`.
- **Security Policy & LLM Context Refresh:** Verified bilingual `SECURITY.md` (Local-First, Zero-Egress, 48h SLA, Supported Versions 1.0.x) and updated `llms.txt` with refreshed `Last-checked: 2026-09-07` timestamp and 148 verified tests.
- **Automated Metadata & Contract Testsuite (`test/metadata.test.ts`):** Added new contract test assertions verifying quick navigation anchors, dual Mermaid diagrams, core invariant matrix, client configuration sections, and test count parity (suite expanded to 148 passed tests).
- **Mermaid Diagram Syntax Quoting:** Quoted all edge and node labels containing parentheses or special characters in `README.md` and `README_de.md` to eliminate GitHub Mermaid parse errors (`got 'PS'`), and integrated automated Mermaid syntax validation into the contract testsuite.

### Security (2026-08-28)
- Enforce the documented `dry_run: true` default for `convert_format` and the mutating `archive` actions. ZIP extraction now also defaults to `overwrite: false` and requires both mutations and overwrites to be requested explicitly.

### Release state (verified 2026-09-04)
- The three release surfaces disagree and have done so for a while. npm `latest` is **1.0.14**
  (published 2026-07-31); the newest git tag and the newest GitHub release are both **v1.0.10**
  (2026-07-23); `package.json`, `server.json`, `glama.json` and `src/index.ts` all declare
  **1.0.16**. Versions 1.0.11 through 1.0.16 have no tag, and 1.0.15/1.0.16 were never published.
- This matters for the safety promise: the npm artifact predates the 2026-08-28 dry-run fix above,
  so in the currently installable package `convert_format` writes its target file and
  `archive`/`extract` overwrites existing files without an explicit opt-in — while the README
  shipped alongside it states that all destructive tools default to dry-run. Publishing a release
  is what closes this gap; nothing in the repository can.
- `server.json` advertises npm package version `1.0.16` to the MCP registry. That version does not
  exist on npm.

### Documentation & hygiene (2026-09-04)
- Recount every sibling MCP tool number against the sibling repositories themselves. Five of nine
  were stale: FileCommander 47 → **50**, ControlCenter 20 → **34**, Homebase 45 → **51**,
  Blender Use 3 → **4**, Open Compute 10 → **16**. CodeCommander (22), n8n Manager (19),
  ServerCommander (8) and Clatcher (12) were already correct.
- Rewrite the sibling-count test so it derives the expectation from one table instead of pinning
  table rows as string literals. The previous version asserted FileCommander at 47 as the
  *expected* value, so the suite defended a number the sibling had long outgrown and would have
  turned red on the correction.
- Stop advertising `dev-bricks/automation-master` in the ecosystem tables: the repository is
  private, so the link was a 404 for every reader. The test now forbids linking it.
- Correct the Vitest badge in both READMEs: it said 145 while the prose in the same files, in
  `llms.txt` and the actual suite said 146. With the new private-link test the suite is now at
  **147**, and badge, prose and `llms.txt` all state that number. The test checks badge and prose
  together so the two cannot drift apart again.
- Add `.gitattributes` with `* text=auto eol=lf`. All 35 tracked text files were checked out CRLF
  with no EOL attribute, which produces phantom diffs on Windows clones.
- Remove the internal pipeline path `.SOFTWARE/_LANG/LANGUAGE_CODES.md` from the header comment of
  `src/i18n/types.ts`; it is unresolvable for readers and exposes internal directory structure.

## [1.0.16] - 2026-08-22

### Security & Hygiene
- Upgraded GitHub Actions CI workflow (`.github/workflows/tests.yml`) to official `actions/checkout@v4` and `actions/setup-node@v4` with a full Multi-OS matrix (`ubuntu-latest`, `windows-latest`, `macos-latest`) across Node.js versions `[20, 22, 24]`.
- Implemented comprehensive bilingual `SECURITY.md` (English & German) with Local-First and Zero-Egress guarantees, unprivileged user-mode execution (Non-Elevation), strict default dry-run mode (`dry_run: true`) for mutating tools, stdio transport isolation, path traversal guards, and direct maintainer security channels.
- Extended automated metadata parity test suite in `test/metadata.test.ts` to include CI matrix workflow integrity, bilingual security policy validation, and package file verification (145/145 tests passed).
- Synchronized documentation badges, quick navigation bar, and `llms.txt` ecosystem index.

## [1.0.15] - 2026-08-16

### Changed
- Add open-bricks umbrella and ellmos-ai ecosystem badges to `README.md` and `README_de.md`.
- Add interactive Mermaid system architecture & data flow diagrams to both English and German documentation, mapping AI agent tool invocation, parameter validation, dry-run safety guards, and atomic filesystem execution.
- Harmonize sibling MCP server tables across `README.md`, `README_de.md`, and `llms.txt` to include `n8n-manager-mcp` (19 tools), `ellmos-blender-use-mcp` (3 tools), and `open-compute-mcp` (10 tools), updating `FileCommander` tool count to 47.
- Add Desktop Software & Sibling Ecosystem cross-linking matrix (`ProFiler`, `DokuZen`, `safe-start-for-codex`, `automation-master`, `DevCenter`, `CodeBox`).
- Expand metadata consistency test suite with version parity, sibling tool counts, and discoverability manifest validations.
- Refresh `llms.txt` Last-checked timestamp to `2026-08-16`.

## Unreleased (carried over from the 1.0.11-1.0.14 branch reconciliation)

### Security (2026-08-11)
- Close all open Dependabot advisories in lockfile (`express-rate-limit` ^8.6.2, `nanoid` ^3.3.17, `fast-uri` ^3.1.5, `hono` ^4.13.0). `npm audit` reports 0 vulnerabilities.

### Changed
- Reconcile the diverged `main` and `master` branches (open since 1.0.11) back
  into a single line of development. Both branches had independently used the
  version numbers 1.0.12 and 1.0.13 for different content; the entries below
  now describe what npm actually shipped, and the discoverability work that
  only ever existed on `master` is listed here as unreleased.
- Add the Glama.ai badge and registry link to `README.md`, `README_de.md` and
  `llms.txt`, ship `glama.json` in the `package.json` `files` array, and add the
  `glama` keyword. Listing verified live (`glama.ai/mcp/servers/ellmos-clatcher-mcp`,
  HTTP 200).
- Refresh the dependency `overrides` (`hono`, `@hono/node-server`, `fast-uri`,
  `postcss`, `vite`, `adm-zip`) and align `vitest` at `^3.2.7` in both
  `devDependencies` and `overrides`.
- Raise the declared Node.js floor from 18 to 20 in `package.json` (`engines`),
  both READMEs and `llms.txt`. The `@hono/node-server` 2.x override requires
  Node 20 and the CI matrix has only ever tested 20/22/24, so the advertised
  `>=18` was wrong.

### Fixed
- Make the package installable again. `master` declared an override
  `vite@^6.4.3` against a direct devDependency `vite@^6.2.0`; npm rejects that
  combination with `EOVERRIDE`, so `npm install`/`npm ci` failed outright on
  that branch. The direct dependency now matches the override at `^6.4.3`.

### Security
- Close all five open advisories that the stale override pins had left open:
  `hono` (ReDoS in the CORS middleware, `<4.12.34`), `fast-uri` (host confusion
  via backslash authority introducer, `<=3.1.4`), `ip-address` (3× SSRF /
  trust-boundary bypass, `<=10.3.0`, also reaching `express-rate-limit`) and
  `js-yaml` (quadratic CPU consumption in `!!omap`, `<=4.3.0`). All fixes stay
  within the current major version. `npm audit` now reports 0 vulnerabilities;
  build and 141/141 Vitest tests stay green.

### Removed
- Drop the Smithery.ai badge, its `llms.txt` link and the `smithery`/`smithery-ai`
  keywords. The advertised listing does not exist: the server page under
  `smithery.ai` renders without any server data, so the badge pointed at a page
  that was never populated.
- *Correction (2026-09-04):* this entry originally also claimed that
  `smithery.yaml` and its `package.json` `files` entry had been removed. Both are
  still present and `test/metadata.test.ts` requires them, so the deployment
  config was kept while only the outward-facing badge and keywords went. Whether
  to keep an unpublished deployment config is still open.

## [1.0.14] - 2026-07-30

### Changed
- Settle the README header on the project's own Clatcher wappen after the
  banner experiments in 1.0.12/1.0.13 — the generic emblem is gone for good.

## [1.0.13] - 2026-07-30

### Changed
- Revert 1.0.12: restore the project's own Clatcher wappen/logo header.

## [1.0.12] - 2026-07-29

### Changed
- Replace the custom README banner with the shared ellmos emblem (reverted
  again in 1.0.13).

## [1.0.11] - 2026-07-25

### Security & Maintenance
- Remediate `postcss <=8.5.17` high-severity vulnerability (`GHSA-r28c-9q8g-f849`), `fast-uri`, `body-parser`, `js-yaml`, and `hono` security findings via dependency updates.
- Synchronize version string 1.0.11 across `package.json`, `package-lock.json`, `server.json`, `glama.json`, and `src/index.ts`.
- Verify full test suite (141 tests passing).

## [1.0.10] - 2026-07-24

### Changed
- Update `llms.txt` index timestamp to 2026-07-25.
- Add Shields.io Vitest (141 passed) and LLM-Ready badges to `README.md` and `README_de.md`.
- Include AI/LLM integration callouts (`> [!NOTE]`) in both READMEs explaining default dry-run semantics for autonomous agents.

### Fixed
- Correct FileCommander (46) and CodeCommander (22) tool counts in the ecosystem family table; counts now verified against the live MCP `tools/list` surface.
- Align the McpServer runtime version in `src/index.ts` with package.json (was stuck at 1.0.8).

## [1.0.9] - 2026-07-24

### Changed
- Unified the ellmos-ai ecosystem section in README.md and README_de.md: full 9-server MCP family table with refreshed tool counts, AI infrastructure, and desktop software links.
- Refreshed `glama.json` for the Glama MCP directory listing.
- Synced `server.json` version metadata.

## [1.0.7] - 2026-06-17

### Changed
- Add a TTY-guarded `update-notifier` check for interactive CLI starts while keeping MCP stdio output unchanged.
- Include `CHANGELOG.md` in the npm package file list.
- Normalize `package.json` repository metadata to npm's `git+https` form.

### Fixed
- Align `package.json`, lockfile, MCP runtime version, and `server.json` metadata after the update-notifier release.
- Refresh npm dependency locks so production audit findings for `hono` and `js-yaml` are resolved.

## [1.0.8] - 2026-07-03

### Added
- Add a `Clatcher tests` GitHub Actions workflow for Node.js 20, 22, and 24 with `npm ci`, TypeScript build, Vitest, and npm package dry-run.
- Replace Spanish, Simplified Chinese, Japanese, and Russian i18n fallbacks with real Clatcher translations.
- Add direct i18n tests for supported language order, non-English fallback removal, and placeholder interpolation.
- Add a metadata regression test for the CodeCommander tool count in README, README_de, and llms.txt.

### Changed
- Refresh discovery metadata for Clatcher-specific search phrases, npm keywords, Glama keywords, and MCP Registry description.
- Synchronize ellmos MCP family references with FileCommander's current 44-tool surface and current BACH scale.
- Document the push-test workflow in both READMEs.
- Lock `@emnapi/core` and `@emnapi/runtime` as explicit dev dependencies so Linux `npm ci` resolves Vitest/Rolldown optional peers deterministically.
- Update README and LLM index test count to 141 tests.
- Update community workflows to `actions/stale@v10` and `actions/first-interaction@v3`.
- Only start the stdio server when `dist/index.js` is run directly (CLI entry), not when its pure helpers are imported, e.g. by tests.

### Fixed
- `fix_json`: stop the single-quote-to-double-quote repair step from corrupting already-valid JSON. The previous regex paired up any two apostrophes in the file as if they delimited a single-quoted string, so a double-quoted value like `"it's fine"` followed later by another apostrophe (e.g. `"another's value"`) had everything between the two apostrophes mangled into invalid JSON -- even in non-dry-run mode, where the corrupted content was written to disk. The conversion is now context-aware and only rewrites real single-quote string delimiters outside of double-quoted strings.

### Security
- Ignore local credential, token, private-key, and recovery-code files while keeping public env examples trackable.
- Cover local maintenance protocol-log ignore rules in repository hygiene tests.
- Prevent `batch_rename` replacements from generating path targets outside the selected directory.

### Removed
- Remove local maintenance protocol files from the public repository and ignore future protocol logs.
