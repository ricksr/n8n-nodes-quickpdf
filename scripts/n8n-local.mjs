#!/usr/bin/env node
/**
 * Start n8n locally with this package loaded via N8N_CUSTOM_EXTENSIONS.
 * Requires Docker (compose v2). Open http://localhost:5678
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const composeFile = path.join(root, "docker-compose.n8n.yml");

if (!fs.existsSync(composeFile)) {
  console.error("missing", composeFile);
  process.exit(1);
}

const build = spawnSync("npm", ["run", "build"], { cwd: root, stdio: "inherit", shell: true });
if (build.status !== 0) process.exit(build.status ?? 1);

console.log("\nn8n-local: starting Docker (package mounted as custom extension)…");
console.log("  URL: http://localhost:5678");
console.log("  Import: workflows/demo-verification.json");
console.log("  Create credential Quick PDF Tools API + run Test workflow\n");

const up = spawnSync("docker", ["compose", "-f", composeFile, "up"], {
  cwd: root,
  stdio: "inherit",
  shell: false,
  env: { ...process.env, N8N_NODES_QUICKPDF_ROOT: root },
});

process.exit(up.status ?? 1);