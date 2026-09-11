import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function isIgnored(relativePath: string): boolean {
  try {
    execFileSync("git", ["check-ignore", "--quiet", "--", relativePath], {
      cwd: repoRoot,
      stdio: "ignore",
    });
    return true;
  } catch (error: any) {
    if (error.status === 1) return false;
    throw error;
  }
}

describe("repository hygiene", () => {
  it("ignores local credential and recovery-code files", () => {
    const ignoredPaths = [
      ".env",
      ".env.local",
      ".npmrc",
      "secrets.json",
      "credentials.json",
      "token.json",
      "tokens.json",
      "id_ed25519",
      "id_rsa",
      "private.pem",
      "client.key",
      "npm_recovery_codes.txt",
    ];

    for (const candidate of ignoredPaths) {
      expect(isIgnored(candidate), `${candidate} should be ignored`).toBe(true);
    }
  });

  it("keeps public examples and package metadata trackable", () => {
    const trackablePaths = [".env.example", ".env.sample", "package-lock.json", "server.json"];

    for (const candidate of trackablePaths) {
      expect(isIgnored(candidate), `${candidate} should stay trackable`).toBe(false);
    }
  });

  it("ignores local maintenance protocol logs", () => {
    const ignoredPaths = ["push-protocoll.txt", "changelog-protocoll.txt", "release-protocol.txt"];

    for (const candidate of ignoredPaths) {
      expect(isIgnored(candidate), `${candidate} should be ignored`).toBe(true);
    }
  });

  it("ignores multi-host synchronization conflict files", () => {
    const conflictPaths = [
      "file-conflict-20260910-120000.txt",
      "test.sync-conflict-20260910.md",
      "data.sync-temp-001",
    ];

    for (const candidate of conflictPaths) {
      expect(isIgnored(candidate), `${candidate} should be ignored`).toBe(true);
    }
  });

  it("ignores multi-agent locks and temporary editor files", () => {
    const ignoredPaths = [
      "LOCK",
      "LOCK.txt",
      "LOCK.user.txt",
      "LOCK.until.txt",
      "process.lock",
      "file.tmp",
      "file.bak",
      "file.swp",
      "file~",
    ];

    for (const candidate of ignoredPaths) {
      expect(isIgnored(candidate), `${candidate} should be ignored`).toBe(true);
    }
  });

  it("ignores test, coverage, and packaging caches", () => {
    const cachePaths = [
      ".pytest_cache/v/cache",
      ".ruff_cache/content",
      ".coverage",
      "coverage/lcov.info",
      ".vitest/results",
      "wheelhouse/pkg.whl",
      ".wheel-smoke/env",
    ];

    for (const candidate of cachePaths) {
      expect(isIgnored(candidate), `${candidate} should be ignored`).toBe(true);
    }
  });

  it("validates CI workflow concurrency and cancel-in-progress configuration", () => {
    const ciPath = path.join(repoRoot, ".github", "workflows", "tests.yml");
    expect(existsSync(ciPath)).toBe(true);
    const ciContent = readFileSync(ciPath, "utf8");
    expect(ciContent).toContain("concurrency:");
    expect(ciContent).toContain("cancel-in-progress: true");
  });
});
