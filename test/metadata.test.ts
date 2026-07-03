import { readFileSync } from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readRepoFile(relativePath: string): string {
  return readFileSync(path.join(repoRoot, relativePath), "utf8");
}

describe("metadata consistency", () => {
  it("keeps CodeCommander family references on the current 21-tool surface", () => {
    const expectations = [
      {
        file: "README.md",
        expected:
          "| [CodeCommander](https://github.com/ellmos-ai/ellmos-codecommander-mcp) | 21 | Code analysis, AST parsing, import management |",
        stale:
          "| [CodeCommander](https://github.com/ellmos-ai/ellmos-codecommander-mcp) | 17 | Code analysis, AST parsing, import management |",
      },
      {
        file: "README_de.md",
        expected:
          "| [CodeCommander](https://github.com/ellmos-ai/ellmos-codecommander-mcp) | 21 | Code-Analyse, AST-Parsing, Import-Verwaltung |",
        stale:
          "| [CodeCommander](https://github.com/ellmos-ai/ellmos-codecommander-mcp) | 17 | Code-Analyse, AST-Parsing, Import-Verwaltung |",
      },
      {
        file: "llms.txt",
        expected:
          "[ellmos-codecommander-mcp](https://github.com/ellmos-ai/ellmos-codecommander-mcp): Code analysis, AST parsing, import management (21 tools)",
        stale:
          "[ellmos-codecommander-mcp](https://github.com/ellmos-ai/ellmos-codecommander-mcp): Code analysis, AST parsing, import management (17 tools)",
      },
    ];

    for (const { file, expected, stale } of expectations) {
      const contents = readRepoFile(file);
      expect(contents, `${file} should list CodeCommander with 21 tools`).toContain(expected);
      expect(contents, `${file} should not list the stale CodeCommander 17-tool count`).not.toContain(stale);
    }
  });
});
