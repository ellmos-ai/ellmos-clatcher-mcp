import type { Translations } from './types.js';

export const en: Translations = {
  common: {
    fileNotFound: (path) => `File not found: ${path}`,
    error: (msg) => `Error: ${msg}`,
    success: (msg) => `Success: ${msg}`,
    serverStarted: 'Clatcher MCP Server started',
  },

  fix_json: {
    description: 'Repairs broken JSON',
    repaired: (path) => `JSON repaired: ${path}`,
    alreadyValid: (path) => `JSON already valid: ${path}`,
  },

  fix_encoding: {
    description: 'Fixes encoding issues',
    fixed: (path, from, to) => `Encoding fixed: ${path} (${from} → ${to})`,
  },

  fix_umlauts: {
    description: 'Repairs broken German umlauts',
    fixed: (path, count) => `${count} umlaut(s) repaired in: ${path}`,
    noIssues: (path) => `No broken umlauts in: ${path}`,
  },

  convert_format: {
    description: 'Converts between file formats',
    converted: (from, to) => `Converted: ${from} → ${to}`,
  },

  detect_dupes: {
    description: 'Finds duplicate files by hash',
    found: (count) => `${count} duplicate group(s) found`,
    noDupes: 'No duplicates found',
  },

  folder_diff: {
    description: 'Compares two directories',
    header: (dir1, dir2) => `Comparison: ${dir1} ↔ ${dir2}`,
  },

  batch_rename: {
    description: 'Renames files by pattern',
    renamed: (count) => `${count} file(s) renamed`,
    noMatches: 'No matching files found',
  },

  archive: {
    description: 'Creates/extracts ZIP archives',
    created: (path, count) => `Archive created: ${path} (${count} files)`,
    extracted: (path) => `Extracted to: ${path}`,
  },

  checksum: {
    description: 'Calculates file checksums',
    result: (algo, hash) => `${algo}: ${hash}`,
  },

  cleanup_file: {
    description: 'Cleans up file (BOM, whitespace, line endings)',
    cleaned: (path) => `Cleaned: ${path}`,
  },

  scan_emoji: {
    description: 'Finds emojis in code files',
    found: (count) => `${count} emoji(s) found`,
    noEmoji: 'No emojis found',
  },

  regex_test: {
    description: 'Tests regex patterns',
    matches: (count) => `${count} match(es)`,
    noMatch: 'No match',
  },
};
