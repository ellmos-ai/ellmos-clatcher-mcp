# Changelog

All notable changes to this project will be documented in this file.

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
