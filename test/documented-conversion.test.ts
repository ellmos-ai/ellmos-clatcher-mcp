import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

// Capture the real registrations and handlers, rather than duplicating tool logic.
const registrations = vi.hoisted(() => new Map<string, { schema: any; handler: any }>());
vi.mock("@modelcontextprotocol/sdk/server/mcp.js", () => ({
  McpServer: class {
    tool(name: string, _description: string, schema: any, handler: any) {
      registrations.set(name, { schema, handler });
    }
  },
}));

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
let temporaryDirectory: string | undefined;
beforeAll(async () => { await import("../src/index.js"); });
afterEach(async () => {
  if (temporaryDirectory) await rm(temporaryDirectory, { recursive: true });
  temporaryDirectory = undefined;
});

describe("documented convert_format calls", () => {
  for (const document of ["README.md", "README_de.md", "README_es.md"]) {
    it(`${document} validates and executes its YAML-to-JSON example`, async () => {
      const markdown = await readFile(path.join(root, document), "utf8");
      const blocks = [...markdown.matchAll(/```json\s*\r?\n([\s\S]*?)```/g)];
      const examples = blocks.filter((block) => /"name"\s*:\s*"convert_format"/.test(block[1]));
      expect(examples).toHaveLength(1);
      const request = JSON.parse(examples[0][1]);
      const tool = registrations.get(request.name)!;
      expect(tool).toBeDefined();
      const argumentsFromDocumentation = z.object(tool.schema).strict().parse(request.arguments);
      temporaryDirectory = await mkdtemp(path.join(tmpdir(), "clatcher-doc-conversion-"));
      const input = path.join(temporaryDirectory, path.basename(argumentsFromDocumentation.input_path));
      const output = path.join(temporaryDirectory, path.basename(argumentsFromDocumentation.output_path));
      expect(input).not.toBe(output);
      const source = "name: fixture\nvalue: 7\n";
      await writeFile(input, source, "utf8");
      const result = await tool.handler({ ...argumentsFromDocumentation, input_path: input, output_path: output });
      expect(result.isError).not.toBe(true);
      expect(JSON.parse(await readFile(output, "utf8"))).toEqual({ name: "fixture", value: 7 });
      expect(await readFile(input, "utf8")).toBe(source);
    });
  }
});
