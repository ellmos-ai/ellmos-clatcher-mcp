# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Add a `Clatcher tests` GitHub Actions workflow for Node.js 20, 22, and 24 with `npm ci`, TypeScript build, Vitest, and npm package dry-run.
- Replace Spanish, Simplified Chinese, Japanese, and Russian i18n fallbacks with real Clatcher translations.
- Add direct i18n tests for supported language order, non-English fallback removal, and placeholder interpolation.

### Changed
- Document the push-test workflow in both READMEs.
- Update README and LLM index test count to 134 tests.
- Update community workflows to `actions/stale@v10` and `actions/first-interaction@v3`.

### Security
- Prevent `batch_rename` replacements from generating path targets outside the selected directory.

### Removed
- Remove local maintenance protocol files from the public repository and ignore future protocol logs.
