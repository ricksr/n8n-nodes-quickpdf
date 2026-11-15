# n8n-nodes-quickpdf

Community package for [Quick PDF Tools API v1](https://quickpdftools.net/developers/) — **Unlock**, **Protect**, and **Repair** on n8n Cloud (no `qpdf` on the host).

| Operation | API route |
|-----------|-----------|
| Unlock | `POST /api/v1/pdf/unlock` |
| Protect | `POST /api/v1/pdf/protect` |
| Repair | `POST /api/v1/pdf/repair` |

Guide: https://quickpdftools.net/developers/n8n/

## Build

```bash
npm install --ignore-scripts
npm run build
npm run validate
```

## Install in n8n

**Cloud:** Settings → Community nodes → Install → `n8n-nodes-quickpdf` (after `npm publish`).

**Self-hosted / dev:**

```bash
npm link
# In n8n user folder or custom directory:
npm link n8n-nodes-quickpdf
```

Restart n8n, then add **Quick PDF Tools** from the node panel.

## Credential

| Field | Value |
|-------|--------|
| API Key | `qpdf_live_…` from [developers portal](https://quickpdftools.net/developers/#keys) |
| API Base URL | Default `https://api.quickpdftools.net` |

## Node parameters

- **Operation** — unlock / protect / repair
- **Binary Property** — input PDF (default `data`)
- **Password** — required for unlock & protect
- **Output Binary Property** — decrypted PDF (default `data`)

## Test

**Automated (same as demo workflow):**

```bash
export QPDF_API_KEY='qpdf_live_…'
npm run test:e2e
```

**n8n UI:** `npm run n8n:local` → import `workflows/demo-verification.json`. Full guide: [LOCAL_TESTING.md](./LOCAL_TESTING.md).

**Manual:** CC0 [`locked.pdf`](https://quickpdftools.net/developers/oss/fixtures/locked.pdf), Unlock, password `secret123`.

## Publish

See [COMMUNITY_SUBMISSION.md](./COMMUNITY_SUBMISSION.md).

```bash
npm publish --access public
```

## License

MIT — see [LICENSE](./LICENSE).