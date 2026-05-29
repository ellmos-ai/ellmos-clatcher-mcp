import { readFile } from "fs/promises";
import { afterEach, describe, expect, it } from "vitest";
import { getLanguage, getSupportedLanguages, setLanguage, t, type Lang } from "../src/i18n/index.js";

type NonFallbackLang = Exclude<Lang, "de" | "en">;

interface LocalizedExpectation {
  serverStarted: string;
  jsonRepaired: string;
  noDupes: string;
}

const localizedExpectations: Record<NonFallbackLang, LocalizedExpectation> = {
  es: {
    serverStarted: "Servidor MCP Clatcher iniciado",
    jsonRepaired: "JSON reparado: demo.json",
    noDupes: "No se encontraron duplicados",
  },
  zh: {
    serverStarted: "Clatcher MCP 服务器已启动",
    jsonRepaired: "JSON 已修复: demo.json",
    noDupes: "未找到重复文件",
  },
  ja: {
    serverStarted: "Clatcher MCPサーバーを起動しました",
    jsonRepaired: "JSONを修復しました: demo.json",
    noDupes: "重複は見つかりませんでした",
  },
  ru: {
    serverStarted: "Сервер Clatcher MCP запущен",
    jsonRepaired: "JSON восстановлен: demo.json",
    noDupes: "Дубликаты не найдены",
  },
};

describe("i18n language packs", () => {
  afterEach(() => {
    setLanguage("de");
  });

  it("exposes all supported language codes in stable order", () => {
    expect(getSupportedLanguages()).toEqual(["de", "en", "es", "zh", "ja", "ru"]);
  });

  it("defaults back to German after tests reset the language", () => {
    expect(getLanguage()).toBe("de");
    expect(t().common.serverStarted).toBe("Clatcher MCP Server gestartet");
  });

  for (const [lang, expected] of Object.entries(localizedExpectations) as Array<[NonFallbackLang, LocalizedExpectation]>) {
    it(`uses real ${lang} translations instead of English fallback`, () => {
      setLanguage(lang);

      expect(t().common.serverStarted).toBe(expected.serverStarted);
      expect(t().fix_json.repaired("demo.json")).toBe(expected.jsonRepaired);
      expect(t().detect_dupes.noDupes).toBe(expected.noDupes);
      expect(t().common.serverStarted).not.toBe("Clatcher MCP Server started");
      expect(t().detect_dupes.noDupes).not.toBe("No duplicates found");
    });
  }

  it("keeps placeholder interpolation intact across non-English languages", () => {
    setLanguage("zh");
    expect(t().archive.created("backup.zip", 3)).toContain("3");
    expect(t().archive.created("backup.zip", 3)).toContain("backup.zip");

    setLanguage("ja");
    expect(t().folder_diff.header("left", "right")).toContain("left");
    expect(t().folder_diff.header("left", "right")).toContain("right");

    setLanguage("ru");
    expect(t().fix_encoding.fixed("data.txt", "cp1252", "utf-8")).toContain("cp1252");

    setLanguage("es");
    expect(t().regex_test.matches(7)).toContain("7");
  });

  for (const lang of ["es", "zh", "ja", "ru"] as const) {
    it(`does not keep the old ${lang} English-fallback stub`, async () => {
      const source = await readFile(new URL(`../src/i18n/${lang}.ts`, import.meta.url), "utf-8");

      expect(source).not.toContain("falls back to English");
      expect(source).not.toContain("...en");
      expect(source).not.toContain("from './en.js'");
    });
  }
});
