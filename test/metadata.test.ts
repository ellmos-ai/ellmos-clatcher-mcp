import { readFileSync } from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readRepoFile(relativePath: string): string {
  return readFileSync(path.join(repoRoot, relativePath), "utf8");
}

describe("metadata consistency", () => {
  it("keeps CodeCommander family references on the current 22-tool surface", () => {
    const expectations = [
      {
        file: "README.md",
        expected:
          "| [CodeCommander](https://github.com/ellmos-ai/ellmos-codecommander-mcp) | 22 | Code analysis, JSON repair, imports, diffs, regex |",
        stale:
          "| [CodeCommander](https://github.com/ellmos-ai/ellmos-codecommander-mcp) | 21 |",
      },
      {
        file: "README_de.md",
        expected:
          "| [CodeCommander](https://github.com/ellmos-ai/ellmos-codecommander-mcp) | 22 | Code-Analyse, JSON-Reparatur, Imports, Diffs, Regex |",
        stale:
          "| [CodeCommander](https://github.com/ellmos-ai/ellmos-codecommander-mcp) | 21 |",
      },
      {
        file: "llms.txt",
        expected:
          "[ellmos-codecommander-mcp](https://github.com/ellmos-ai/ellmos-codecommander-mcp): Code analysis, AST parsing, import management (22 tools)",
        stale:
          "[ellmos-codecommander-mcp](https://github.com/ellmos-ai/ellmos-codecommander-mcp): Code analysis, AST parsing, import management (21 tools)",
      },
    ];

    for (const { file, expected, stale } of expectations) {
      const contents = readRepoFile(file);
      expect(contents, `${file} should list CodeCommander with 22 tools`).toContain(expected);
      expect(contents, `${file} should not list a stale CodeCommander tool count`).not.toContain(stale);
    }
  });
});
