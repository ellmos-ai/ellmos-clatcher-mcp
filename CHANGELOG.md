# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Replace Spanish, Simplified Chinese, Japanese, and Russian i18n fallbacks with real Clatcher translations.
- Add direct i18n tests for supported language order, non-English fallback removal, and placeholder interpolation.
- Add local changelog and push protocol files for recurring MCP maintenance automation.

### Changed
- Update README and LLM index test count to 134 tests.

### Security
- Prevent `batch_rename` replacements from generating path targets outside the selected directory.
