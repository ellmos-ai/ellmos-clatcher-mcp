import type { Translations } from './types.js';

export const ru: Translations = {
  common: {
    fileNotFound: (path) => `Файл не найден: ${path}`,
    error: (msg) => `Ошибка: ${msg}`,
    success: (msg) => `Успешно: ${msg}`,
    serverStarted: 'Сервер Clatcher MCP запущен',
  },

  fix_json: {
    description: 'Восстанавливает поврежденный JSON',
    repaired: (path) => `JSON восстановлен: ${path}`,
    alreadyValid: (path) => `JSON уже корректен: ${path}`,
  },

  fix_encoding: {
    description: 'Исправляет проблемы с кодировкой',
    fixed: (path, from, to) => `Кодировка исправлена: ${path} (${from} → ${to})`,
  },

  fix_umlauts: {
    description: 'Исправляет поврежденные немецкие умлауты',
    fixed: (path, count) => `${count} умлаут(ов) исправлено в: ${path}`,
    noIssues: (path) => `Поврежденные умлауты не найдены в: ${path}`,
  },

  convert_format: {
    description: 'Конвертирует между файловыми форматами',
    converted: (from, to) => `Конвертировано: ${from} → ${to}`,
  },

  detect_dupes: {
    description: 'Находит дубликаты файлов по хэшу',
    found: (count) => `Найдено групп дубликатов: ${count}`,
    noDupes: 'Дубликаты не найдены',
  },

  folder_diff: {
    description: 'Сравнивает два каталога',
    header: (dir1, dir2) => `Сравнение: ${dir1} ↔ ${dir2}`,
  },

  batch_rename: {
    description: 'Переименовывает файлы по шаблону',
    renamed: (count) => `Переименовано файлов: ${count}`,
    noMatches: 'Подходящие файлы не найдены',
  },

  archive: {
    description: 'Создает или распаковывает ZIP-архивы',
    created: (path, count) => `Архив создан: ${path} (${count} файлов)`,
    extracted: (path) => `Распаковано в: ${path}`,
  },

  checksum: {
    description: 'Вычисляет контрольные суммы файлов',
    result: (algo, hash) => `${algo}: ${hash}`,
  },

  cleanup_file: {
    description: 'Очищает файл (BOM, пробелы, переводы строк)',
    cleaned: (path) => `Очищено: ${path}`,
  },

  scan_emoji: {
    description: 'Находит эмодзи в файлах кода',
    found: (count) => `Найдено эмодзи: ${count}`,
    noEmoji: 'Эмодзи не найдены',
  },

  regex_test: {
    description: 'Проверяет regex-шаблоны',
    matches: (count) => `Совпадений: ${count}`,
    noMatch: 'Совпадений нет',
  },
};
