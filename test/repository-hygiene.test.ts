import { execFileSync } from "node:child_process";
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
});
