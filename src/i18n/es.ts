import type { Translations } from './types.js';

export const es: Translations = {
  common: {
    fileNotFound: (path) => `Archivo no encontrado: ${path}`,
    error: (msg) => `Error: ${msg}`,
    success: (msg) => `Correcto: ${msg}`,
    serverStarted: 'Servidor MCP Clatcher iniciado',
  },

  fix_json: {
    description: 'Repara JSON dañado',
    repaired: (path) => `JSON reparado: ${path}`,
    alreadyValid: (path) => `JSON ya válido: ${path}`,
  },

  fix_encoding: {
    description: 'Corrige problemas de codificación',
    fixed: (path, from, to) => `Codificación corregida: ${path} (${from} → ${to})`,
  },

  fix_umlauts: {
    description: 'Repara diéresis alemanas dañadas',
    fixed: (path, count) => `${count} diéresis reparada(s) en: ${path}`,
    noIssues: (path) => `No hay diéresis dañadas en: ${path}`,
  },

  convert_format: {
    description: 'Convierte entre formatos de archivo',
    converted: (from, to) => `Convertido: ${from} → ${to}`,
  },

  detect_dupes: {
    description: 'Encuentra archivos duplicados por hash',
    found: (count) => `${count} grupo(s) de duplicados encontrado(s)`,
    noDupes: 'No se encontraron duplicados',
  },

  folder_diff: {
    description: 'Compara dos directorios',
    header: (dir1, dir2) => `Comparación: ${dir1} ↔ ${dir2}`,
  },

  batch_rename: {
    description: 'Renombra archivos mediante patrones',
    renamed: (count) => `${count} archivo(s) renombrado(s)`,
    noMatches: 'No se encontraron archivos coincidentes',
  },

  archive: {
    description: 'Crea o extrae archivos ZIP',
    created: (path, count) => `Archivo ZIP creado: ${path} (${count} archivos)`,
    extracted: (path) => `Extraído en: ${path}`,
  },

  checksum: {
    description: 'Calcula sumas de verificación de archivos',
    result: (algo, hash) => `${algo}: ${hash}`,
  },

  cleanup_file: {
    description: 'Limpia archivos (BOM, espacios, finales de línea)',
    cleaned: (path) => `Limpio: ${path}`,
  },

  scan_emoji: {
    description: 'Encuentra emojis en archivos de código',
    found: (count) => `${count} emoji(s) encontrado(s)`,
    noEmoji: 'No se encontraron emojis',
  },

  regex_test: {
    description: 'Prueba patrones regex',
    matches: (count) => `${count} coincidencia(s)`,
    noMatch: 'Sin coincidencias',
  },
};
