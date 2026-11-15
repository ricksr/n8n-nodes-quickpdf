#!/usr/bin/env node
/**
 * Same path as workflows/demo-verification.json without n8n UI:
 * locked.pdf → POST /api/v1/pdf/unlock → %PDF header.
 *
 * Env: QPDF_API_KEY or QUICKPDF_API_KEY (Bearer qpdf_live_…)
 * Optional: QPDF_API_BASE (default https://api.quickpdftools.net)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repoRoot = path.resolve(root, "../..");

function findLockedPdf() {
  const candidates = [
    path.join(repoRoot, "tools/sites/developers/oss/fixtures/locked.pdf"),
    path.join(repoRoot, "tools/sites/test-fixtures/e2e/locked.pdf"),
    path.join(root, "fixtures/locked.pdf"),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

const apiKey = (process.env.QPDF_API_KEY || process.env.QUICKPDF_API_KEY || "").trim();
const apiBase = (process.env.QPDF_API_BASE || process.env.QUICKPDF_API_BASE || "https://api.quickpdftools.net")
  .trim()
  .replace(/\/$/, "");

if (!apiKey) {
  console.log("test-demo-e2e: SKIP (set QPDF_API_KEY or QUICKPDF_API_KEY to hit live API)");
  process.exit(0);
}

const lockedPath = findLockedPdf();
if (!lockedPath) {
  console.error("test-demo-e2e: locked.pdf fixture not found");
  process.exit(1);
}

const capsRes = await fetch(`${apiBase}/api/v1/capabilities`, {
  headers: { Authorization: `Bearer ${apiKey}` },
});
if (!capsRes.ok) {
  console.error("test-demo-e2e: capabilities failed", capsRes.status, await capsRes.text());
  process.exit(1);
}
console.log("test-demo-e2e: credential test OK (capabilities)");

const pdfBytes = fs.readFileSync(lockedPath);
const form = new FormData();
form.append(
  "file",
  new Blob([pdfBytes], { type: "application/pdf" }),
  "locked.pdf",
);
form.append("password", "secret123");

const unlockRes = await fetch(`${apiBase}/api/v1/pdf/unlock`, {
  method: "POST",
  headers: { Authorization: `Bearer ${apiKey}` },
  body: form,
});

if (!unlockRes.ok) {
  console.error("test-demo-e2e: unlock failed", unlockRes.status);
  const errText = await unlockRes.text();
  console.error(errText.slice(0, 500));
  process.exit(1);
}

const out = Buffer.from(await unlockRes.arrayBuffer());
if (!out.subarray(0, 5).equals(Buffer.from("%PDF-"))) {
  console.error("test-demo-e2e: response is not a PDF");
  process.exit(1);
}

console.log("test-demo-e2e: unlock OK", { bytesIn: pdfBytes.length, bytesOut: out.length, fixture: lockedPath });