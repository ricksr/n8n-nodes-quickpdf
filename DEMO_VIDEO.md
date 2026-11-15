# Demo video for n8n Creator Portal (manual review)

Record **2–3 minutes**, **English** audio (optional but helps), **1080p** screencast. Upload an **unlisted** YouTube or Loom link in the portal (or wherever the reviewer asked).

## Before you record

1. Install on your n8n instance: **Settings → Community nodes → Install** → `n8n-nodes-quickpdf` (latest on npm).
2. Create credential **Quick PDF Tools API**:
   - API Key: `qpdf_live_…` (blur in the video)
   - API Base URL: `https://api.quickpdftools.net`
   - Click **Test** — should succeed (capabilities check).
3. Import workflow from this repo: [`workflows/demo-verification.json`](./workflows/demo-verification.json)  
   Or download from GitHub: `https://github.com/ricksr/n8n-nodes-quickpdf/blob/main/workflows/demo-verification.json`
4. On the **Quick PDF Tools** node, attach the credential.

**Test run (off-camera):** Execute once. **Fetch test PDF** → **Quick PDF Tools** should go green; output item has binary `data` (unlocked PDF).

## Shot list (~2:30)

| # | Duration | On screen | Say (optional) |
|---|----------|-----------|----------------|
| 1 | 20s | [npm `n8n-nodes-quickpdf`](https://www.npmjs.com/package/n8n-nodes-quickpdf) — version, MIT, repo link | “This is the published community package.” |
| 2 | 25s | n8n **Community nodes** install of `n8n-nodes-quickpdf`, refresh node panel | “Installing from npm on n8n Cloud / self-hosted.” |
| 3 | 25s | Credentials → **Quick PDF Tools API** → fill fields → **Test** (blur API key while typing) | “Credential test hits the public capabilities endpoint.” |
| 4 | 15s | Open imported **Demo for Creator Portal** workflow — show 3 nodes | “Fixture PDF, then the community node.” |
| 5 | 40s | Open **Quick PDF Tools** — Resource **Document**, Operation **Unlock**, password `secret123` | “Unlock with a known password from the test file.” |
| 6 | 35s | **Execute workflow** → expand success → show **Binary** tab on output (`data`, ~size, `locked-unlocked.pdf` or similar) | “Unlocked PDF returned as binary for downstream OCR.” |

You do **not** need to demo Protect/Repair for the first review; Unlock on the public fixture is enough.

## What reviewers are checking

- Package installs from npm
- Credential test works
- Node uses **parameters only** (no env vars / local files in node code)
- Real API call succeeds and binary output is visible

## Privacy

- Blur or replace the API key in the recording; use a live key only in the credential test.
- Do not show unrelated workflows or customer data.

## Links to paste in the submission note

- npm: https://www.npmjs.com/package/n8n-nodes-quickpdf  
- GitHub: https://github.com/ricksr/n8n-nodes-quickpdf  
- Docs: https://quickpdftools.net/developers/n8n/  
- Test PDF: https://quickpdftools.net/developers/oss/fixtures/locked.pdf (password `secret123`)

## Optional polish

- Show **Protect** on the unlocked output in a second run (same recording) if you have time under 3 minutes.
- End on the [n8n hub page](https://quickpdftools.net/developers/n8n/).