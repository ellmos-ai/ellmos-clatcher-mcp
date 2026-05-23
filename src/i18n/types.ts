/**
 * i18n Type Definitions for Clatcher MCP Server
 * Reference: .SOFTWARE/_LANG/LANGUAGE_CODES.md
 */

export interface Translations {
  common: {
    fileNotFound: (path: string) => string;
    error: (msg: string) => string;
    success: (msg: string) => string;
    serverStarted: string;
  };

  fix_json: {
    description: string;
    repaired: (path: string) => string;
    alreadyValid: (path: string) => string;
  };

  fix_encoding: {
    description: string;
    fixed: (path: string, from: string, to: string) => string;
  };

  fix_umlauts: {
    description: string;
    fixed: (path: string, count: number) => string;
    noIssues: (path: string) => string;
  };

  convert_format: {
    description: string;
    converted: (from: string, to: string) => string;
  };

  detect_dupes: {
    description: string;
    found: (count: number) => string;
    noDupes: string;
  };

  folder_diff: {
    description: string;
    header: (dir1: string, dir2: string) => string;
  };

  batch_rename: {
    description: string;
    renamed: (count: number) => string;
    noMatches: string;
  };

  archive: {
    description: string;
    created: (path: string, count: number) => string;
    extracted: (path: string) => string;
  };

  checksum: {
    description: string;
    result: (algo: string, hash: string) => string;
  };

  cleanup_file: {
    description: string;
    cleaned: (path: string) => string;
  };

  scan_emoji: {
    description: string;
    found: (count: number) => string;
    noEmoji: string;
  };

  regex_test: {
    description: string;
    matches: (count: number) => string;
    noMatch: string;
  };
}
