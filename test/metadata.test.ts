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

  // Single source of truth for the sibling tool counts advertised by this repo.
  //
  // These numbers are NOT invented here -- each one is the count the sibling repository
  // states about itself (its own README badge / llms.txt headline / tool table).
  // Verified on 2026-09-04. When a sibling ships new tools, update this map only;
  // the test then enforces that all three documentation surfaces follow.
  //
  // Deliberately no hard-coded "expected" table rows: the previous version of this test
  // pinned FileCommander at 47 while the sibling had long since shipped 50, so the suite
  // actively defended a wrong number and would have gone red on the correction.
  const SIBLING_TOOL_COUNTS: Record<string, number> = {
    "ellmos-filecommander-mcp": 50,
    "ellmos-codecommander-mcp": 22,
    "ellmos-clatcher-mcp": 12,
    "n8n-manager-mcp": 19,
    "ellmos-controlcenter-mcp": 34,
    "ellmos-homebase-mcp": 51,
    "ellmos-servercommander-mcp": 8,
    "ellmos-blender-use-mcp": 4,
    "open-compute-mcp": 16,
  };

  it("keeps sibling tool counts synchronized across documentation files", () => {
    // README tables: | [Name](https://github.com/<org>/<repo>) | <count> | ...
    const readmeRow = (contents: string, repo: string): number | null => {
      const pattern = new RegExp(
        `\\|\\s*\\*{0,2}\\[[^\\]]+\\]\\(https://github\\.com/[^/]+/${repo}\\)\\*{0,2}\\s*\\|\\s*\\*{0,2}(\\d+)\\*{0,2}\\s*\\|`,
      );
      const match = contents.match(pattern);
      return match ? Number(match[1]) : null;
    };

    // llms.txt lines: - [<repo>](...): <description> (<count> tools[, alpha])
    const llmsEntry = (contents: string, repo: string): number | null => {
      const pattern = new RegExp(
        `\\[${repo}\\]\\(https://github\\.com/[^)]+\\):[^\\n]*?\\((\\d+) tools`,
      );
      const match = contents.match(pattern);
      return match ? Number(match[1]) : null;
    };

    const readme = readRepoFile("README.md");
    const readmeDe = readRepoFile("README_de.md");
    const llms = readRepoFile("llms.txt");

    for (const [repo, expectedCount] of Object.entries(SIBLING_TOOL_COUNTS)) {
      expect(readmeRow(readme, repo), `README.md must list ${repo} with a tool count`).toBe(
        expectedCount,
      );
      expect(readmeRow(readmeDe, repo), `README_de.md must list ${repo} with a tool count`).toBe(
        expectedCount,
      );
      // llms.txt lists the *siblings*; this server itself is described in the headline
      // paragraph instead of the sibling list, so it has no entry there.
      if (repo !== "ellmos-clatcher-mcp") {
        expect(llmsEntry(llms, repo), `llms.txt must list ${repo} with a tool count`).toBe(
          expectedCount,
        );
      }
    }
  });

  it("does not advertise repositories that are not publicly reachable", () => {
    // A link to a private repository is a 404 for every reader of this README.
    // `dev-bricks/automation-master` sat in the ecosystem table while being private.
    const privateRepos = ["dev-bricks/automation-master"];

    for (const file of ["README.md", "README_de.md", "llms.txt"]) {
      const contents = readRepoFile(file);
      for (const repo of privateRepos) {
        expect(contents, `${file} must not link the private repository ${repo}`).not.toContain(
          `github.com/${repo}`,
        );
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
    // The badge and the prose both state a test count -- keep them in step.
    expect(readme).toContain("157 tests");
    expect(readme).toContain("badge/tests-157%20passed");
    expect(readmeDe).toContain("open-bricks");
    expect(readmeDe).toContain("ellmos-ai");
    expect(readmeDe).toContain("157 Tests");
    expect(readmeDe).toContain("badge/tests-157%20passed");
    expect(readRepoFile("llms.txt")).toContain("157 tests");
  });

  it("validates GitHub Actions CI workflow configuration", () => {
    expect(existsSync(path.join(repoRoot, ".github", "workflows", "tests.yml"))).toBe(true);
    const ciYaml = readRepoFile(".github/workflows/tests.yml");

    // Accept either a floating major tag or a 40-character commit SHA pin.
    // Pinning the literal `@v4` here would have made the suite go red on exactly the
    // SHA pinning that a supply-chain hardening pass is supposed to introduce.
    expect(ciYaml).toMatch(/uses: actions\/checkout@(v\d+|[0-9a-f]{40})/);
    expect(ciYaml).toMatch(/uses: actions\/setup-node@(v\d+|[0-9a-f]{40})/);
    expect(ciYaml).toContain("os: [ubuntu-latest, windows-latest, macos-latest]");
    expect(ciYaml).toContain("node-version: [20, 22, 24]");
    expect(ciYaml).toContain("concurrency:");
    expect(ciYaml).toContain("cancel-in-progress: true");
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

  it("validates Pfad B showcase design, sequence diagrams, and safety matrix", () => {
    const readme = readRepoFile("README.md");
    const readmeDe = readRepoFile("README_de.md");
    const changelog = readRepoFile("CHANGELOG.md");
    const llmsDoc = readRepoFile("llms.txt");
    const secDoc = readRepoFile("SECURITY.md");

    // Quick navigation anchors
    expect(readme).toContain("## 🧭 Quick Navigation");
    expect(readmeDe).toContain("## 🧭 Schnellnavigation");

    // Dual Mermaid diagrams & syntax validation
    expect(readme).toContain("graph TD");
    expect(readme).toContain("sequenceDiagram");
    expect(readmeDe).toContain("graph TD");
    expect(readmeDe).toContain("sequenceDiagram");

    const validateMermaidBlocks = (content: string, filename: string) => {
      const regex = /```mermaid\s*\n([\s\S]*?)\n```/g;
      let m: RegExpExecArray | null;
      while ((m = regex.exec(content)) !== null) {
        const diagram = m[1];
        const lines = diagram.split("\n");
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          const edgeLabels = [
            ...line.matchAll(/-+>\|([^|]+)\|/g),
            ...line.matchAll(/<-+>\|([^|]+)\|/g),
          ];
          for (const edgeMatch of edgeLabels) {
            const label = edgeMatch[1];
            const isQuoted = label.startsWith('"') && label.endsWith('"');
            if (!isQuoted) {
              const hasUnquotedSpecial = /[()[\]{}<>]/.test(label);
              expect(
                hasUnquotedSpecial,
                `${filename}:${i + 1} Mermaid edge label has unquoted special chars: ${edgeMatch[0]}`,
              ).toBe(false);
            }
          }
          const nodeMatches = line.matchAll(/\w+\s*\[([^"\n]+)\]/g);
          for (const nodeMatch of nodeMatches) {
            const inner = nodeMatch[1];
            if (!inner.startsWith('"') || !inner.endsWith('"')) {
              if (!inner.startsWith("(") || !inner.endsWith(")")) {
                const hasParens = /[()]/.test(inner);
                expect(
                  hasParens,
                  `${filename}:${i + 1} Mermaid node has unquoted parentheses: ${nodeMatch[0]}`,
                ).toBe(false);
              }
            }
          }
        }
      }
    };

    validateMermaidBlocks(readme, "README.md");
    validateMermaidBlocks(readmeDe, "README_de.md");

    // Core Invariants & Safety Guarantees matrix
    expect(readme).toContain("## Core Invariants & Safety Guarantees");
    expect(readmeDe).toContain("## Kern-Invarianten & Sicherheitsgarantien");
    expect(readme).toContain("Default Dry-Run Guard");
    expect(readmeDe).toContain("Dry-Run als Standard");

    // Client setup
    expect(readme).toContain("Claude Desktop / Cursor Configuration");
    expect(readmeDe).toContain("Claude Desktop / Cursor Konfiguration");

    // Badges & metadata
    expect(readme).toContain("tests-157%20passed-brightgreen.svg");
    expect(readmeDe).toContain("tests-157%20passed-brightgreen.svg");
    expect(readme).toContain("security-48h%20SLA-blue.svg");
    expect(readmeDe).toContain("Sicherheit-48h%20SLA-blue.svg");

    // Freshness
    expect(llmsDoc).toContain("Last-checked: 2026-09-10");
    expect(secDoc).toContain("Zuletzt aktualisiert:** 2026-09-10");
    expect(changelog).toContain("Discoverability, Showcase Design & Parity Audit (Pfad B) (2026-09-07)");
    expect(changelog).toContain("Discoverability, Visual Architecture & Governance Audit (Pfad B) (2026-09-09)");
    expect(changelog).toContain("Repository Hygiene, CI Matrix Concurrency & Multi-Agent Lock Protection (Pfad A) (2026-09-10)");
  });

  it("validates local MARKETING-LOG.txt existence and Pfad B deliverables", () => {
    expect(existsSync(path.join(repoRoot, "MARKETING-LOG.txt"))).toBe(true);
    const mktLog = readRepoFile("MARKETING-LOG.txt");
    expect(mktLog).toContain("# MARKETING-LOG: ellmos-clatcher-mcp (Pfad B)");
    expect(mktLog).toContain("Stand: 2026-09-09");
    expect(mktLog).toContain("Zweisprachige Landingpages (README.md & README_de.md)");
    expect(mktLog).toContain("10 Governance- & Laufzeitinvarianten");
  });

  it("validates 10 Core Governance & Runtime Invariants across documentation", () => {
    const readme = readRepoFile("README.md");
    const readmeDe = readRepoFile("README_de.md");

    const englishInvariants = [
      "Default Dry-Run Guard",
      "Zero-Egress & Local-First",
      "Path Traversal Guard",
      "Atomic Operations",
      "Non-Elevation User-Mode",
      "Encoding Preservation",
      "Multi-Hash Integrity",
      "Multi-OS Parity",
      "Fail-Closed Argument Validation",
      "Deterministic Error Bounds & Receipts",
    ];

    const germanInvariants = [
      "Dry-Run als Standard",
      "Zero-Egress & Local-First",
      "Pfad-Traversal-Schutz",
      "Atomare Operationen",
      "Keine Rechteerweiterung (Non-Elevation)",
      "Erhalt der Zeichenkodierung",
      "Kryptografische Integrität",
      "Plattform-Parität",
      "Fail-Closed Argumentvalidierung",
      "Deterministische Fehlergrenzen & Quittungen",
    ];

    for (const inv of englishInvariants) {
      expect(readme).toContain(inv);
    }
    for (const inv of germanInvariants) {
      expect(readmeDe).toContain(inv);
    }
  });

  it("validates 14-point quick navigation structure across bilingual READMEs", () => {
    const readme = readRepoFile("README.md");
    const readmeDe = readRepoFile("README_de.md");

    for (let i = 1; i <= 14; i++) {
      const numStr = i < 10 ? `0${i}` : `${i}`;
      expect(readme).toMatch(new RegExp(`\\|\\s*${numStr}\\s*\\|`));
      expect(readmeDe).toMatch(new RegExp(`\\|\\s*${numStr}\\s*\\|`));
    }
  });

  it("validates CI workflow concurrency group and fail-safe configuration", () => {
    const ciYaml = readRepoFile(".github/workflows/tests.yml");
    expect(ciYaml).toContain("concurrency:");
    expect(ciYaml).toContain("cancel-in-progress: true");
  });

  it("validates .gitignore protection against multi-host sync conflicts and locks", () => {
    const gitignore = readRepoFile(".gitignore");
    expect(gitignore).toContain("*.sync-conflict-*");
    expect(gitignore).toContain("LOCK.*");
    expect(gitignore).toContain("!package-lock.json");
  });
});
