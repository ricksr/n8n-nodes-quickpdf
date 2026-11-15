#!/usr/bin/env node
/** Structural checks for workflows/demo-verification.json (Creator Portal + local n8n). */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workflowPath = path.join(root, "workflows", "demo-verification.json");
const wf = JSON.parse(fs.readFileSync(workflowPath, "utf8"));

const types = wf.nodes.map((n) => n.type);
if (!types.includes("n8n-nodes-quickpdf.quickPdf")) {
  console.error("demo workflow: missing Quick PDF Tools node");
  process.exit(1);
}
const qp = wf.nodes.find((n) => n.type === "n8n-nodes-quickpdf.quickPdf");
const params = qp?.parameters ?? {};
if (params.operation !== "unlock" || params.password !== "secret123") {
  console.error("demo workflow: expected unlock + secret123");
  process.exit(1);
}
if (!wf.connections || Object.keys(wf.connections).length < 2) {
  console.error("demo workflow: expected chained connections");
  process.exit(1);
}

console.log("validate-demo-workflow: OK", wf.name);