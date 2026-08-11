# Changelog

All notable changes to this project will be documented in this file.

## [1.0.15] - 2026-08-14

### Changed
- Add open-bricks umbrella and ellmos-ai ecosystem badges to `README.md` and `README_de.md`.
- Add interactive Mermaid system architecture & data flow diagrams to both English and German documentation, mapping AI agent tool invocation, parameter validation, dry-run safety guards, and atomic filesystem execution.
- Harmonize sibling MCP server tables across `README.md`, `README_de.md`, and `llms.txt` to include `ellmos-blender-use-mcp` (3 tools) and `open-compute-mcp` (10 tools), updating `FileCommander` tool count to 47.
- Refresh `llms.txt` Last-checked timestamp to `2026-08-14`.

## Unreleased

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
- Drop the Smithery.ai badge, the `smithery.yaml` deployment config, its
  `files` entry, its `llms.txt` link and the `smithery`/`smithery-ai` keywords.
  The advertised listing does not exist: `smithery.ai/server/@ellmos-ai/ellmos-clatcher-mcp`
  returns HTTP 404, so the badge pointed at a page that was never created.

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
