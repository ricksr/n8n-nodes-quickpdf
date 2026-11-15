# Local testing (same path as the Creator Portal demo)

Three layers — fastest first:

## 1. API smoke test (no n8n)

Mirrors **Fetch test PDF → Unlock** using the CC0 fixture and live API:

```bash
cd integrations/n8n-nodes-quickpdf
npm run build
export QPDF_API_KEY='qpdf_live_…'   # or QUICKPDF_API_KEY
npm run test:e2e
```

Expect: `credential test OK` + `unlock OK` with byte counts. Without a key, `test:e2e` skips (exit 0).

## 2. n8n in Docker (full UI — record your portal video here)

```bash
npm run n8n:local
```

Open http://localhost:5678, import `workflows/demo-verification.json`, add **Quick PDF Tools API** credential, execute.

The package is mounted via `N8N_CUSTOM_EXTENSIONS` (no community install step needed for dev).

Stop: `docker compose -f docker-compose.n8n.yml down`

## 3. npm test in CI / monorepo

From repo root:

```bash
cd tools/sites && npm run test:release
```

Includes `n8n-community-node.test.mjs` (build, validate, demo workflow shape, optional e2e).

## Portal video

Use layer **2** and follow [DEMO_VIDEO.md](./DEMO_VIDEO.md). Hosted copy of the workflow:

https://quickpdftools.net/developers/oss/workflows/demo-verification.json