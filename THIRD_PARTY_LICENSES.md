# Third-Party Licenses & Software Inventory

- **Repository:** `ellmos-ai/ellmos-clatcher-mcp`
- **Version:** `1.0.17`
- **Audit Date:** `2026-09-30`
- **License Status:** `100% Permissive Open Source (0 AGPL, 0 Copyleft, 0 Cloud Telemetry)`
- **Attribution:** Formal copyright notice and attribution defined in [`NOTICE`](NOTICE)
- **Umbrella Organization:** [`open-bricks`](https://github.com/open-bricks) | **Parent Organization:** [`ellmos-ai`](https://github.com/ellmos-ai)
- **Security Contact:** `security@ellmos.ai`, `security@open-bricks.org`, `support@lukasgeiger.com`, `lukas@open-bricks.org`

---

## 1. Overview & Compliance Summary

`ellmos-clatcher-mcp` provides a local-first Model Context Protocol (MCP) utility toolkit for AI coding agents, specializing in file repair, encoding normalization, format conversion, duplicate detection, batch operations, and archive handling. In adherence to open-bricks and ellmos-ai software governance standards, all direct runtime, transitive, and development dependencies undergo continuous automated licensing and security audits.

- **Copyleft / Reciprocal License Risk:** 0.0% (Zero GPL, LGPL, AGPL, SSPL, or proprietary components).
- **Network Egress / Telemetry Risk:** 0.0% (100% Local-First execution over stdio JSON-RPC; zero phone-home calls, zero cloud telemetry).
- **Permissive Distribution:** All components are distributed under standard MIT, BSD-3-Clause, BSD-2-Clause, and Apache-2.0 licenses.
- **Node.js Runtime Scope:** Compatible with modern Node.js runtimes (`>=20.0.0`) on Ubuntu, Windows, and macOS.

---

## 2. Direct Runtime Dependencies

| Package | Version Range | License | SPDX Identifier | Purpose in Project | Upstream Repository |
|---|---|---|---|---|---|
| [`@modelcontextprotocol/sdk`](https://github.com/modelcontextprotocol/typescript-sdk) | `^1.0.0` | MIT License | `MIT` | Official MCP TypeScript SDK for stdio server transport and JSON-RPC tool dispatching | `https://github.com/modelcontextprotocol/typescript-sdk` |
| [`adm-zip`](https://github.com/cthackers/adm-zip) | `^0.6.1` | MIT License | `MIT` | In-memory ZIP archive creation, extraction, directory inspection, and buffer handling | `https://github.com/cthackers/adm-zip` |
| [`fast-xml-parser`](https://github.com/NaturalIntelligence/fast-xml-parser) | `^5.8.0` | MIT License | `MIT` | High-performance XML parser and builder for cross-format conversion (`convert_format`) | `https://github.com/NaturalIntelligence/fast-xml-parser` |
| [`js-yaml`](https://github.com/nodeca/js-yaml) | `^4.3.2` | MIT License | `MIT` | Spec-compliant YAML 1.2 parsing and serializing for structured configuration conversion | `https://github.com/nodeca/js-yaml` |
| [`smol-toml`](https://github.com/squirrelchat/smol-toml) | `^1.9.0` | BSD 3-Clause License | `BSD-3-Clause` | Compact, fast, and spec-compliant TOML parser and serializer | `https://github.com/squirrelchat/smol-toml` |
| [`update-notifier`](https://github.com/yeoman/update-notifier) | `^7.3.1` | BSD 2-Clause License | `BSD-2-Clause` | Non-blocking CLI update notification mechanism for global and local npm installations | `https://github.com/yeoman/update-notifier` |
| [`zod`](https://github.com/colinhacks/zod) | `^3.23.8` | MIT License | `MIT` | Strict runtime schema declaration, input type validation, and fail-closed argument defense | `https://github.com/colinhacks/zod` |
| Node.js Standard Library | `>=20.0.0` | Node.js License (MIT-equivalent) | `MIT` | Core execution, file I/O, child processes, hashing, path normalization (`fs`, `path`, `crypto`, `os`, `child_process`, `util`) | `https://github.com/nodejs/node` |

---

## 3. Transitive Runtime Dependencies

All transitive runtime dependencies are resolved and pinned via `package-lock.json` and comply strictly with permissive licensing guidelines:

| Package | License | SPDX Identifier | Role / Functional Domain |
|---|---|---|---|
| `content-type` | MIT License | `MIT` | HTTP / MIME header content type parser |
| `raw-body` | MIT License | `MIT` | Stream byte buffer length and size validation |
| `bytes` | MIT License | `MIT` | Byte string parsing and formatting |
| `iconv-lite` | MIT License | `MIT` | Character encoding conversion primitives |
| `safer-buffer` | MIT License | `MIT` | Safe polyfill for legacy Buffer constructors |
| `strnum` | MIT License | `MIT` | Fast numerical string parsing utility for XML parser |
| `argparse` | Python-2.0 / MIT | `MIT` | CLI argument parser for js-yaml utilities |
| `punycode` | MIT License | `MIT` | Robust Punycode converter complying with RFC 3492 |

---

## 4. Development & Build-Time Dependencies

Development and build tools are utilized solely for compiling TypeScript, executing the automated Vitest test suite, and validating packaging artifacts. They are never bundled into distributed runtime artifacts or npm packages:

| Tool | Version Range | License | SPDX Identifier | Role in Development Workflow | Upstream Repository |
|---|---|---|---|---|---|
| [`typescript`](https://github.com/microsoft/TypeScript) | `^5.3.3` | Apache License 2.0 | `Apache-2.0` | TypeScript compiler (`tsc`) and type definitions | `https://github.com/microsoft/TypeScript` |
| [`vitest`](https://github.com/vitest-dev/vitest) | `^4.1.11` | MIT License | `MIT` | Unit, integration, and metadata regression test runner | `https://github.com/vitest-dev/vitest` |
| [`vite`](https://github.com/vitejs/vite) | `^6.4.3` | MIT License | `MIT` | Next-generation frontend and test runtime bundling engine | `https://github.com/vitejs/vite` |
| [`@types/node`](https://github.com/DefinitelyTyped/DefinitelyTyped) | `^20.11.0` | MIT License | `MIT` | Type definitions for Node.js runtime and standard modules | `https://github.com/DefinitelyTyped/DefinitelyTyped` |
| [`@types/adm-zip`](https://github.com/DefinitelyTyped/DefinitelyTyped) | `^0.5.7` | MIT License | `MIT` | Type definitions for adm-zip library | `https://github.com/DefinitelyTyped/DefinitelyTyped` |
| [`@types/js-yaml`](https://github.com/DefinitelyTyped/DefinitelyTyped) | `^4.0.9` | MIT License | `MIT` | Type definitions for js-yaml parser | `https://github.com/DefinitelyTyped/DefinitelyTyped` |
| [`@emnapi/core`](https://github.com/toyobayashi/emnapi) | `^1.10.0` | MIT License | `MIT` | Native Node-API WebAssembly bindings layer | `https://github.com/toyobayashi/emnapi` |
| [`@emnapi/runtime`](https://github.com/toyobayashi/emnapi) | `^1.10.0` | MIT License | `MIT` | Emscripten Node-API runtime implementation | `https://github.com/toyobayashi/emnapi` |

---

## 5. Governance & Runtime Invariant Compliance (Level 1 SBOM)

The dependency stack and implementation architecture adhere strictly to the 10 Governance and Runtime Invariants of `ellmos-clatcher-mcp`, certified for unprivileged execution (`RunAsInvoker`) and zero cloud telemetry:

| Invariant Code | Invariant Name | Architectural Commitment | Verification & Audit Mechanism |
|:---|:---|:---|:---|
| `INV-DRYRUN-01` | Default Dry-Run Guard | Mutating tools (`batch_rename`, `cleanup_file`, `fix_json`, `fix_encoding`, `fix_umlauts`, `convert_format`, `archive`) default to `dry_run: true`. | Verified by unit & contract tests; writes require explicit `dry_run: false`. |
| `INV-LOCAL-02` | 100% Local-First & Zero-Egress | Stdio JSON-RPC transport guarantees complete air-gapped isolation; zero phone-home sockets. | Zero network dependencies, pure local execution audited in test suite. |
| `INV-TRAVERSAL-03` | Path Traversal Guard | Filesystem operations validate target path boundaries against directory traversal. | Normalized path checks via `path.normalize` and root boundary validation. |
| `INV-ATOMIC-04` | Atomic File Operations | Modifying pipelines write to isolated temporary buffers before replacement. | Staged disk writes prevent truncated or corrupted outputs on interrupt. |
| `INV-UNPRIV-05` | Non-Elevation User-Mode (`RunAsInvoker`) | Server operates purely within standard unprivileged operating system user scope. | Non-elevated execution tests; zero admin/sudo elevation requirements. |
| `INV-ENCODING-06` | Lossless Encoding Preservation | Reversible UTF-8 normalization eliminates cp1252 artifacts and German umlaut Mojibake. | Byte-exact UTF-8 conversion suites covering `ä, ö, ü, ß` and BOM stripping. |
| `INV-CRYPTO-07` | Cryptographic Multi-Hash Integrity | Native collision-resistant digest calculation (SHA-256, MD5, SHA-1, SHA-512). | Native Node.js `crypto` primitives audited in test suite. |
| `INV-PLATFORM-08` | Universal Multi-OS Parity | Bit-level identical behavior across Linux, Windows, and macOS environments. | Multi-OS CI matrix across Ubuntu, Windows, and macOS on Node.js 20, 22, 24. |
| `INV-VALIDATION-09` | Fail-Closed Argument Validation | All tool calls are validated against strict Zod runtime schemas before execution. | Malformed or type-divergent arguments fail closed prior to tool dispatch. |
| `INV-SLA-10` | Binding 30d Remediation SLA | Structured status receipts with diff previews, binding 48-hour response, 5 business days triage, and 30 calendar days remediation SLA. | Enforced in `SECURITY.md`, `README.md`, and monitored disclosure channels. |

### Level 1 SBOM & Unprivileged Execution Certification
- **Attribution & Provenance:** Full copyright attribution and ecosystem affiliations are cataloged in [`NOTICE`](NOTICE).
- **Security Context:** Certified for standard unprivileged desktop and CI runner environments (`RunAsInvoker`).
- **No External Sockets:** Zero outbound HTTP/TCP sockets instantiated by runtime packages.

---

## 6. Authoritative License Texts

### The MIT License
```text
MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### The 3-Clause BSD License
```text
Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice,
   this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.
3. Neither the name of the copyright holder nor the names of its contributors
   may be used to endorse or promote products derived from this software without
   specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
```

### The 2-Clause BSD License
```text
Redistribution and use in source and binary forms, with or without modification,
are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice,
   this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
```

### Apache License, Version 2.0
```text
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
