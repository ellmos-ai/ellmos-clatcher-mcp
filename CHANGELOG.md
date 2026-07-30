# Changelog

All notable changes to this project will be documented in this file.

## [1.0.13] - 2026-07-30

### Added
- Add visual repository header banner (`assets/banner.png`) to `README.md` and `README_de.md`.

## [1.0.12] - 2026-07-29

### Added & Changed
- Add Glama.ai (`glama.json`) and Smithery.ai (`smithery.yaml`) badges and ecosystem discoverability links to `README.md` and `README_de.md`.
- Include `glama.json` in `package.json` `"files"` array to ensure manifest inclusion in npm releases.
- Extend `package.json` `"keywords"` with `glama`, `smithery`, and `smithery-ai` tags.
- Update `llms.txt` index timestamp to 2026-07-29.

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
