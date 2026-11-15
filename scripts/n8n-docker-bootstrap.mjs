#!/usr/bin/env node
/**
 * Import demo workflow into local Docker n8n and optionally run API e2e.
 * Usage: QPDF_API_KEY=… npm run n8n:bootstrap
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const composeFile = path.join(root, "docker-compose.n8n.yml");
const container = "n8n-nodes-quickpdf-n8n-1";

function docker(...args) {
  return spawnSync("docker", args, { encoding: "utf8" });
}

const ps = docker("ps", "-q", "-f", `name=${container}`);
if (!ps.stdout?.trim()) {
  console.error("n8n:bootstrap — start Docker first: npm run n8n:local (detached: docker compose up -d)");
  process.exit(1);
}

const wf = JSON.parse(fs.readFileSync(path.join(root, "workflows/demo-verification.json"), "utf8"));
const importPayload = [wf];
const importPath = path.join(root, ".tmp-demo-import.json");
fs.writeFileSync(importPath, JSON.stringify(importPayload));

const cp = docker("cp", importPath, `${container}:/tmp/demo-import.json`);
if (cp.status !== 0) {
  console.error(cp.stderr);
  process.exit(1);
}

docker(
  "exec",
  "-u",
  "node",
  container,
  "sh",
  "-c",
  "mkdir -p /home/node/.n8n/nodes && cd /home/node/.n8n/nodes && npm install /custom/n8n-nodes-quickpdf --ignore-scripts --omit=dev",
);

const imp = docker("exec", container, "n8n", "import:workflow", "--input=/tmp/demo-import.json");
process.stdout.write(imp.stdout || "");
process.stderr.write(imp.stderr || "");
if (imp.status !== 0) process.exit(imp.status ?? 1);

fs.unlinkSync(importPath);

console.log("\nn8n:bootstrap — workflow imported. Open http://localhost:5678/workflows");
console.log("  1. Open «Quick PDF Tools — Demo for Creator Portal»");
console.log("  2. Credentials → Quick PDF Tools API → Test → attach on Quick PDF node");
console.log("  3. Test workflow\n");

if (process.env.QPDF_API_KEY || process.env.QUICKPDF_API_KEY) {
  const seed = spawnSync("node", ["scripts/n8n-seed-credential.mjs"], { cwd: root, stdio: "inherit", env: process.env });
  if (seed.status !== 0) process.exit(seed.status ?? 1);
} else {
  console.log("n8n:bootstrap — set QPDF_API_KEY then re-run to seed credential + execute workflow.");
}