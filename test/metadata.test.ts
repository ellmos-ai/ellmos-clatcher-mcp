import { readFileSync, existsSync } from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readRepoFile(relativePath: string): string {
  return readFileSync(path.join(repoRoot, relativePath), "utf8");
}

describe("metadata consistency", () => {
  it("maintains version parity across manifests and source files", () => {
    const pkg = JSON.parse(readRepoFile("package.json"));
    const serverJson = JSON.parse(readRepoFile("server.json"));
    const glamaJson = JSON.parse(readRepoFile("glama.json"));
    const srcIndex = readRepoFile("src/index.ts");
    const changelog = readRepoFile("CHANGELOG.md");

    const expectedVersion = "1.0.16";
    expect(pkg.version).toBe(expectedVersion);
    expect(serverJson.version).toBe(expectedVersion);
    expect(serverJson.packages[0].version).toBe(expectedVersion);
    expect(glamaJson.version).toBe(expectedVersion);
    expect(srcIndex).toContain(`version: "${expectedVersion}"`);
    expect(changelog).toContain(`## [${expectedVersion}]`);
  });

  it("keeps sibling tool counts synchronized across documentation files", () => {
    const expectations = [
      {
        file: "README.md",
        expected: [
          "| [CodeCommander](https://github.com/ellmos-ai/ellmos-codecommander-mcp) | 22 | Code analysis, JSON repair, imports, diffs, regex |",
          "| [FileCommander](https://github.com/ellmos-ai/ellmos-filecommander-mcp) | 47 |",
          "| [n8n Manager](https://github.com/ellmos-ai/n8n-manager-mcp) | 19 |",
        ],
        stale: [
          "| [CodeCommander](https://github.com/ellmos-ai/ellmos-codecommander-mcp) | 21 |",
          "| [n8n Manager](https://github.com/ellmos-ai/n8n-manager-mcp) | 18 |",
        ],
      },
      {
        file: "README_de.md",
        expected: [
          "| [CodeCommander](https://github.com/ellmos-ai/ellmos-codecommander-mcp) | 22 | Code-Analyse, JSON-Reparatur, Imports, Diffs, Regex |",
          "| [FileCommander](https://github.com/ellmos-ai/ellmos-filecommander-mcp) | 47 |",
          "| [n8n Manager](https://github.com/ellmos-ai/n8n-manager-mcp) | 19 |",
        ],
        stale: [
          "| [CodeCommander](https://github.com/ellmos-ai/ellmos-codecommander-mcp) | 21 |",
          "| [n8n Manager](https://github.com/ellmos-ai/n8n-manager-mcp) | 18 |",
        ],
      },
      {
        file: "llms.txt",
        expected: [
          "[ellmos-codecommander-mcp](https://github.com/ellmos-ai/ellmos-codecommander-mcp): Code analysis, AST parsing, import management (22 tools)",
          "[ellmos-filecommander-mcp](https://github.com/ellmos-ai/ellmos-filecommander-mcp): Filesystem, process management, interactive sessions (47 tools)",
          "[n8n-manager-mcp](https://github.com/ellmos-ai/n8n-manager-mcp): n8n workflow management via MCP (19 tools)",
        ],
        stale: [
          "[ellmos-codecommander-mcp](https://github.com/ellmos-ai/ellmos-codecommander-mcp): Code analysis, AST parsing, import management (21 tools)",
          "[n8n-manager-mcp](https://github.com/ellmos-ai/n8n-manager-mcp): n8n workflow management via MCP (18 tools)",
        ],
      },
    ];

    for (const { file, expected, stale } of expectations) {
      const contents = readRepoFile(file);
      for (const exp of expected) {
        expect(contents, `${file} should contain: ${exp}`).toContain(exp);
      }
      for (const st of stale) {
        expect(contents, `${file} should not contain stale snippet: ${st}`).not.toContain(st);
      }
    }
  });

  it("verifies ecosystem discoverability manifests and badges", () => {
    expect(existsSync(path.join(repoRoot, "server.json"))).toBe(true);
    expect(existsSync(path.join(repoRoot, "glama.json"))).toBe(true);
    expect(existsSync(path.join(repoRoot, "smithery.yaml"))).toBe(true);
    expect(existsSync(path.join(repoRoot, "llms.txt"))).toBe(true);
    expect(existsSync(path.join(repoRoot, "SECURITY.md"))).toBe(true);

    const pkg = JSON.parse(readRepoFile("package.json"));
    expect(pkg.files).toContain("SECURITY.md");
    expect(pkg.files).toContain("smithery.yaml");
    expect(pkg.files).toContain("llms.txt");

    const readme = readRepoFile("README.md");
    const readmeDe = readRepoFile("README_de.md");

    expect(readme).toContain("open-bricks");
    expect(readme).toContain("ellmos-ai");
    expect(readme).toContain("146 tests");
    expect(readmeDe).toContain("open-bricks");
    expect(readmeDe).toContain("ellmos-ai");
    expect(readmeDe).toContain("146 Tests");
    expect(readRepoFile("llms.txt")).toContain("146 tests");
  });

  it("validates GitHub Actions CI workflow configuration", () => {
    expect(existsSync(path.join(repoRoot, ".github", "workflows", "tests.yml"))).toBe(true);
    const ciYaml = readRepoFile(".github/workflows/tests.yml");

    expect(ciYaml).toContain("uses: actions/checkout@v4");
    expect(ciYaml).toContain("uses: actions/setup-node@v4");
    expect(ciYaml).toContain("os: [ubuntu-latest, windows-latest, macos-latest]");
    expect(ciYaml).toContain("node-version: [20, 22, 24]");
    expect(ciYaml).toContain("npm test");
    expect(ciYaml).toContain("npm pack --dry-run");
  });

  it("validates bilingual security policy contents and contact channels", () => {
    expect(existsSync(path.join(repoRoot, "SECURITY.md"))).toBe(true);
    const secDoc = readRepoFile("SECURITY.md");

    expect(secDoc).toContain("# Security Policy / Sicherheitsrichtlinie");
    expect(secDoc).toContain("English: Security Policy");
    expect(secDoc).toContain("Deutsch: Sicherheitsrichtlinie");
    expect(secDoc).toContain("Zero-Egress");
    expect(secDoc).toContain("Local-First");
    expect(secDoc).toContain("Non-Elevation");
    expect(secDoc).toContain("dry_run: true");
    expect(secDoc).toContain("security@ellmos.ai");
    expect(secDoc).toContain("support@lukasgeiger.com");
    expect(secDoc).toContain("lukas@open-bricks.org");
    expect(secDoc).toContain("GitHub Security Advisories");
  });

  it("keeps every mutating tool behind a default dry-run guard", () => {
    const srcIndex = readRepoFile("src/index.ts");
    const convertBlock = srcIndex.slice(
      srcIndex.indexOf('// Tool 4: convert_format'),
      srcIndex.indexOf('// Tool 5: detect_dupes'),
    );
    const archiveBlock = srcIndex.slice(
      srcIndex.indexOf('// Tool 8: archive'),
      srcIndex.indexOf('// Tool 9: checksum'),
    );

    expect(convertBlock).toContain('dry_run: z.boolean().default(true)');
    expect(convertBlock).toContain('if (dry_run)');
    expect(convertBlock.indexOf('if (dry_run)')).toBeLessThan(convertBlock.indexOf('await fs.writeFile(outPath'));

    expect(archiveBlock).toContain('dry_run: z.boolean().default(true)');
    expect(archiveBlock).toContain('overwrite: z.boolean().default(false)');
    expect(archiveBlock).toContain('if (dry_run)');
    expect(archiveBlock.indexOf('if (dry_run)')).toBeLessThan(archiveBlock.indexOf('zip.writeZip(archPath)'));
    expect(archiveBlock.lastIndexOf('if (dry_run)')).toBeLessThan(archiveBlock.indexOf('zip.extractAllTo(target, overwrite)'));
  });
});
