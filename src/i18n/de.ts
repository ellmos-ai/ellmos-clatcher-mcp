import type { Translations } from './types.js';

export const de: Translations = {
  common: {
    fileNotFound: (path) => `Datei nicht gefunden: ${path}`,
    error: (msg) => `Fehler: ${msg}`,
    success: (msg) => `Erfolgreich: ${msg}`,
    serverStarted: 'Clatcher MCP Server gestartet',
  },

  fix_json: {
    description: 'Repariert fehlerhaftes JSON',
    repaired: (path) => `JSON repariert: ${path}`,
    alreadyValid: (path) => `JSON bereits valide: ${path}`,
  },

  fix_encoding: {
    description: 'Behebt Encoding-Probleme',
    fixed: (path, from, to) => `Encoding korrigiert: ${path} (${from} → ${to})`,
  },

  fix_umlauts: {
    description: 'Repariert defekte deutsche Umlaute',
    fixed: (path, count) => `${count} Umlaute repariert in: ${path}`,
    noIssues: (path) => `Keine defekten Umlaute in: ${path}`,
  },

  convert_format: {
    description: 'Konvertiert zwischen Dateiformaten',
    converted: (from, to) => `Konvertiert: ${from} → ${to}`,
  },

  detect_dupes: {
    description: 'Findet Datei-Duplikate per Hash',
    found: (count) => `${count} Duplikat-Gruppe(n) gefunden`,
    noDupes: 'Keine Duplikate gefunden',
  },

  folder_diff: {
    description: 'Vergleicht zwei Verzeichnisse',
    header: (dir1, dir2) => `Vergleich: ${dir1} ↔ ${dir2}`,
  },

  batch_rename: {
    description: 'Benennt Dateien nach Muster um',
    renamed: (count) => `${count} Datei(en) umbenannt`,
    noMatches: 'Keine passenden Dateien gefunden',
  },

  archive: {
    description: 'Erstellt/entpackt ZIP-Archive',
    created: (path, count) => `Archiv erstellt: ${path} (${count} Dateien)`,
    extracted: (path) => `Entpackt nach: ${path}`,
  },

  checksum: {
    description: 'Berechnet Datei-Prüfsummen',
    result: (algo, hash) => `${algo}: ${hash}`,
  },

  cleanup_file: {
    description: 'Bereinigt Datei (BOM, Whitespace, Zeilenenden)',
    cleaned: (path) => `Bereinigt: ${path}`,
  },

  scan_emoji: {
    description: 'Findet Emojis in Code-Dateien',
    found: (count) => `${count} Emoji(s) gefunden`,
    noEmoji: 'Keine Emojis gefunden',
  },

  regex_test: {
    description: 'Testet Regex-Muster',
    matches: (count) => `${count} Treffer`,
    noMatch: 'Kein Treffer',
  },
};
