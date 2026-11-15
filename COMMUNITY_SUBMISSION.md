# n8n community nodes — submission checklist

Follow [n8n community nodes](https://docs.n8n.io/integrations/community-nodes/installation/) after the package is on npm.

## Before publish

1. `npm run build` — `dist/` contains compiled `.js` + `quickpdf.svg`.
2. Bump version in `package.json` (semver).
3. `npm publish --access public` (first time: `npm login`).
4. Confirm package on https://www.npmjs.com/package/n8n-nodes-quickpdf

## n8n listing form

- **Package name:** `n8n-nodes-quickpdf`
- **Node names:** Quick PDF Tools (`quickPdf`)
- **Credentials:** Quick PDF Tools API
- **Docs URL:** https://quickpdftools.net/developers/n8n/
- **OpenAPI:** https://quickpdftools.net/developers/openapi.yaml
- **Support:** https://quickpdftools.net/contact.html
- **Category:** Productivity / Document

## User install (Cloud or self-hosted)

**Settings → Community nodes → Install** → enter `n8n-nodes-quickpdf`

Or in a custom image / user folder:

```bash
npm install n8n-nodes-quickpdf
```

## Local dev (before npm)

```bash
cd integrations/n8n-nodes-quickpdf
npm install --ignore-scripts
npm run build
npm link
# In ~/.n8n/custom or project custom folder:
npm link n8n-nodes-quickpdf
```

Restart n8n → search **Quick PDF** in the node panel.

## Smoke test

1. Create **Quick PDF Tools API** credential with `qpdf_live_…` key.
2. **Read/Write Files from Disk** or **HTTP Request** → load `locked.pdf` from CC0 fixtures.
3. **Quick PDF Tools** → operation **Unlock**, password `secret123`.
4. Confirm output binary opens in a PDF viewer.