import type { Translations } from './types.js';

export const zh: Translations = {
  common: {
    fileNotFound: (path) => `未找到文件: ${path}`,
    error: (msg) => `错误: ${msg}`,
    success: (msg) => `成功: ${msg}`,
    serverStarted: 'Clatcher MCP 服务器已启动',
  },

  fix_json: {
    description: '修复损坏的 JSON',
    repaired: (path) => `JSON 已修复: ${path}`,
    alreadyValid: (path) => `JSON 已经有效: ${path}`,
  },

  fix_encoding: {
    description: '修复编码问题',
    fixed: (path, from, to) => `编码已修复: ${path} (${from} → ${to})`,
  },

  fix_umlauts: {
    description: '修复损坏的德语变音字符',
    fixed: (path, count) => `已在 ${path} 中修复 ${count} 个变音字符`,
    noIssues: (path) => `${path} 中没有损坏的变音字符`,
  },

  convert_format: {
    description: '在文件格式之间转换',
    converted: (from, to) => `已转换: ${from} → ${to}`,
  },

  detect_dupes: {
    description: '通过哈希查找重复文件',
    found: (count) => `找到 ${count} 组重复文件`,
    noDupes: '未找到重复文件',
  },

  folder_diff: {
    description: '比较两个目录',
    header: (dir1, dir2) => `比较: ${dir1} ↔ ${dir2}`,
  },

  batch_rename: {
    description: '按模式重命名文件',
    renamed: (count) => `已重命名 ${count} 个文件`,
    noMatches: '未找到匹配的文件',
  },

  archive: {
    description: '创建或解压 ZIP 归档',
    created: (path, count) => `已创建归档: ${path} (${count} 个文件)`,
    extracted: (path) => `已解压到: ${path}`,
  },

  checksum: {
    description: '计算文件校验和',
    result: (algo, hash) => `${algo}: ${hash}`,
  },

  cleanup_file: {
    description: '清理文件（BOM、空白、换行符）',
    cleaned: (path) => `已清理: ${path}`,
  },

  scan_emoji: {
    description: '在代码文件中查找表情符号',
    found: (count) => `找到 ${count} 个表情符号`,
    noEmoji: '未找到表情符号',
  },

  regex_test: {
    description: '测试正则表达式模式',
    matches: (count) => `${count} 个匹配项`,
    noMatch: '没有匹配项',
  },
};
