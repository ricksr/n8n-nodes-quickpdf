#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const n8n = pkg.n8n;

for (const rel of [...(n8n.nodes || []), ...(n8n.credentials || [])]) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) {
    console.error("missing:", rel);
    process.exit(1);
  }
}

const icon = path.join(root, "dist/nodes/QuickPdf/quickpdf.svg");
if (!fs.existsSync(icon)) {
  console.error("missing icon", icon);
  process.exit(1);
}

console.log("n8n-nodes-quickpdf: build OK", pkg.version);