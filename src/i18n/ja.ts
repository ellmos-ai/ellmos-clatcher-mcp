import type { Translations } from './types.js';

export const ja: Translations = {
  common: {
    fileNotFound: (path) => `ファイルが見つかりません: ${path}`,
    error: (msg) => `エラー: ${msg}`,
    success: (msg) => `成功: ${msg}`,
    serverStarted: 'Clatcher MCPサーバーを起動しました',
  },

  fix_json: {
    description: '壊れたJSONを修復します',
    repaired: (path) => `JSONを修復しました: ${path}`,
    alreadyValid: (path) => `JSONはすでに有効です: ${path}`,
  },

  fix_encoding: {
    description: 'エンコーディングの問題を修正します',
    fixed: (path, from, to) => `エンコーディングを修正しました: ${path} (${from} → ${to})`,
  },

  fix_umlauts: {
    description: '壊れたドイツ語ウムラウトを修復します',
    fixed: (path, count) => `${path} で ${count} 件のウムラウトを修復しました`,
    noIssues: (path) => `${path} に壊れたウムラウトはありません`,
  },

  convert_format: {
    description: 'ファイル形式を変換します',
    converted: (from, to) => `変換しました: ${from} → ${to}`,
  },

  detect_dupes: {
    description: 'ハッシュで重複ファイルを見つけます',
    found: (count) => `${count} 件の重複グループが見つかりました`,
    noDupes: '重複は見つかりませんでした',
  },

  folder_diff: {
    description: '2つのディレクトリを比較します',
    header: (dir1, dir2) => `比較: ${dir1} ↔ ${dir2}`,
  },

  batch_rename: {
    description: 'パターンでファイル名を変更します',
    renamed: (count) => `${count} 件のファイル名を変更しました`,
    noMatches: '一致するファイルは見つかりませんでした',
  },

  archive: {
    description: 'ZIPアーカイブを作成または展開します',
    created: (path, count) => `アーカイブを作成しました: ${path} (${count} ファイル)`,
    extracted: (path) => `展開先: ${path}`,
  },

  checksum: {
    description: 'ファイルのチェックサムを計算します',
    result: (algo, hash) => `${algo}: ${hash}`,
  },

  cleanup_file: {
    description: 'ファイルを整えます（BOM、空白、改行）',
    cleaned: (path) => `整えました: ${path}`,
  },

  scan_emoji: {
    description: 'コードファイル内の絵文字を見つけます',
    found: (count) => `${count} 件の絵文字が見つかりました`,
    noEmoji: '絵文字は見つかりませんでした',
  },

  regex_test: {
    description: '正規表現パターンをテストします',
    matches: (count) => `${count} 件一致しました`,
    noMatch: '一致なし',
  },
};
