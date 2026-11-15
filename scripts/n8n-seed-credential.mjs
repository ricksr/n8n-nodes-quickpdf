#!/usr/bin/env node
/**
 * Seed Quick PDF Tools API credential into local Docker n8n + wire demo workflow.
 * Requires: QPDF_API_KEY or QUICKPDF_API_KEY, running n8n container.
 */
import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { encryptCredentialPayload } from "./n8n-encrypt.mjs";

const container = "n8n-nodes-quickpdf-n8n-1";
const apiKey = (process.env.QPDF_API_KEY || process.env.QUICKPDF_API_KEY || "").trim();

if (!apiKey) {
  console.error("n8n:seed — set QPDF_API_KEY (your qpdf_live_… key)");
  process.exit(1);
}

const ps = spawnSync("docker", ["ps", "-q", "-f", `name=${container}`], { encoding: "utf8" });
if (!ps.stdout?.trim()) {
  console.error("n8n:seed — start n8n first (docker compose up -d)");
  process.exit(1);
}

const cfgRaw = spawnSync("docker", ["exec", container, "cat", "/home/node/.n8n/config"], {
  encoding: "utf8",
});
const encryptionKey = JSON.parse(cfgRaw.stdout).encryptionKey;
if (!encryptionKey) {
  console.error("n8n:seed — missing encryptionKey in n8n config");
  process.exit(1);
}

const dbLocal = path.join(os.tmpdir(), `n8n-seed-${Date.now()}.sqlite`);
spawnSync("docker", ["cp", `${container}:/home/node/.n8n/database.sqlite`, dbLocal], { stdio: "inherit" });

const credId = crypto.randomUUID();
const credName = "Quick PDF Tools API";
const encrypted = encryptCredentialPayload(
  {
    apiKey,
    apiBase: process.env.QPDF_API_BASE || "https://api.quickpdftools.net",
  },
  encryptionKey,
);

const now = new Date().toISOString().replace("T", " ").replace("Z", "");
const sql = `
INSERT INTO credentials_entity (id, name, data, type, createdAt, updatedAt)
VALUES ('${credId}', '${credName}', '${encrypted}', 'quickPdfApi', '${now}', '${now}');
`;

const ins = spawnSync("sqlite3", [dbLocal, sql], { encoding: "utf8" });
if (ins.status !== 0) {
  console.error(ins.stderr);
  process.exit(1);
}

// Patch demo workflow nodes JSON to use new credential id
const wfRow = spawnSync(
  "sqlite3",
  [dbLocal, "SELECT id, nodes FROM workflow_entity WHERE name LIKE '%Demo for Creator Portal%' LIMIT 1;"],
  { encoding: "utf8" },
);
const line = wfRow.stdout.trim();
const tab = line.indexOf("|");
if (tab < 0) {
  console.error("n8n:seed — demo workflow not found; run npm run n8n:bootstrap first");
  process.exit(1);
}
const workflowId = line.slice(0, tab);
const nodes = JSON.parse(line.slice(tab + 1));
for (const node of nodes) {
  if (node.type === "n8n-nodes-quickpdf.quickPdf") {
    node.credentials = { quickPdfApi: { id: credId, name: credName } };
  }
}
const nodesJson = JSON.stringify(nodes).replace(/'/g, "''");
const upd = spawnSync("sqlite3", [dbLocal, `UPDATE workflow_entity SET nodes='${nodesJson}' WHERE id='${workflowId}';`], {
  encoding: "utf8",
});
if (upd.status !== 0) {
  console.error(upd.stderr);
  process.exit(1);
}

spawnSync("docker", ["cp", dbLocal, `${container}:/home/node/.n8n/database.sqlite`], { stdio: "inherit" });
fs.unlinkSync(dbLocal);

spawnSync("docker", ["restart", container], { stdio: "inherit" });
console.log("n8n:seed — credential created + workflow wired. Waiting for n8n…");
await new Promise((r) => setTimeout(r, 12000));

const exec = spawnSync("docker", ["exec", container, "n8n", "execute", "--id=" + workflowId], { encoding: "utf8" });
process.stdout.write(exec.stdout || "");
if (exec.stderr) process.stderr.write(exec.stderr);

if (/Execution was successful|finished successfully|status.*success/i.test(exec.stdout || "")) {
  console.log("\nn8n:seed — demo workflow executed successfully.");
  process.exit(0);
}
if (exec.status === 0 && !/Error executing workflow/i.test(exec.stderr || "")) {
  console.log("\nn8n:seed — execute finished (check output above).");
  process.exit(0);
}
console.error("\nn8n:seed — execute failed; open http://localhost:5678");
process.exit(exec.status ?? 1);