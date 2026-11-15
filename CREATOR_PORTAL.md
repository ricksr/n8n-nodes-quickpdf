# n8n Creator Portal — verification submission

Use after **npm publish** from GitHub Actions (provenance required since May 2026).

## “Error getting author email from npm”

`package.json` must include **`author.email`** and it must match your **npm maintainer email** (Creator Portal login). For this package: `sutirtharej@gmail.com` (same as `npm view n8n-nodes-quickpdf maintainers`). Fixed in **≥ 0.1.2** — republish, approve staged release if needed, resubmit.

## If validation shows “Operation is required”

The portal expects the standard **Resource + Operation** pattern (and `required: true` on Operation). Fix in **≥ 0.1.1** — re-submit the npm package URL after publishing.

## “Your package appears to have external dependencies”

Verified nodes must have **no `dependencies`** on npm (only `peerDependencies`: `n8n-workflow`). **0.1.3 and older** incorrectly listed `@n8n/scan-community-package` — that triggers this error.

1. Confirm clean latest: `npm view n8n-nodes-quickpdf dependencies` → should be `undefined` or empty (use **≥ 0.1.4**).
2. Pre-check: `npx @n8n/scan-community-package@beta n8n-nodes-quickpdf@0.1.5` (or current `latest`).
3. In Creator Portal, resubmit the npm URL and ensure the review picks **latest** after staged publish approval.

Unverified install via Settings → Community nodes still works without verification.

## If validation shows “Package does not support this n8n version”

Ensure `package.json` includes `"n8n": { "n8nNodesApiVersion": 1, "strict": true }` and installable on **n8n ≥ 1.0.0** (your Cloud instance must be recent, e.g. **≥ 1.94** for community nodes UI). If your instance is older, upgrade n8n before installing.

## 1. Publish pipeline

1. **npm trusted publisher** (no token): https://www.npmjs.com/package/n8n-nodes-quickpdf/settings  
   - Trusted Publishers → GitHub Actions  
   - Owner: `ricksr`  
   - Repository: `n8n-nodes-quickpdf`  
   - Workflow: `publish.yml`

   **Or** add `NPM_TOKEN` (granular publish token) to https://github.com/ricksr/n8n-nodes-quickpdf/settings/secrets/actions

2. Push tag to trigger publish:

   ```bash
   git tag 0.1.0
   git push origin 0.1.0
   ```

   Or: GitHub → Actions → **publish** → **Run workflow**.

3. Confirm: https://www.npmjs.com/package/n8n-nodes-quickpdf

## 2. Pre-submit scan

```bash
npx @n8n/scan-community-package n8n-nodes-quickpdf
```

## 3. Creator Portal

- Portal: https://creators.n8n.io/nodes  
- Alternate form (docs): https://internal.users.n8n.cloud/form/f0ff9304-f34a-420e-99da-6103a2f8ac5b

### Copy-paste fields

| Field | Value |
|--------|--------|
| npm package | `n8n-nodes-quickpdf` |
| npm URL | https://www.npmjs.com/package/n8n-nodes-quickpdf |
| GitHub | https://github.com/ricksr/n8n-nodes-quickpdf |
| Short description | Unlock, protect, and repair PDFs on n8n Cloud via Quick PDF Tools API (no qpdf on host). |
| Long description | Built for password-protected bank/statements → OCR pipelines. Operations: unlock (known password), protect, repair. 15 MiB max; files deleted after processing. Docs: https://quickpdftools.net/developers/n8n/ |
| License | MIT |
| Category | Productivity / Documents |

## 4. Demo video (required for verification)

**Full script + import workflow:** [DEMO_VIDEO.md](./DEMO_VIDEO.md) and [`workflows/demo-verification.json`](./workflows/demo-verification.json).

Short version: unlisted **2–3 min** screencast showing npm package → community install → credential **Test** → run demo workflow → green execution + binary `data` on output. Upload link in the portal when asked for manual review.

## 5. Unverified install (works before verification)

n8n Cloud → Settings → Community nodes → Install → `n8n-nodes-quickpdf`