# One-time local npm publish (your choice)

Use this to get `n8n-nodes-quickpdf` on npm **today**. For **verified** badge in n8n Creator Portal, re-publish later from GitHub Actions with provenance (see NPM_PUBLISH_SETUP.md).

## Commands (copy-paste)

```bash
cd integrations/n8n-nodes-quickpdf

npm login
# Browser or username/password + OTP

npm run build && npm run validate

npm publish --access public
```

Confirm:

```bash
npm view n8n-nodes-quickpdf version
open https://www.npmjs.com/package/n8n-nodes-quickpdf
```

## Install in n8n Cloud

**Settings → Community nodes → Install** → type:

```text
n8n-nodes-quickpdf
```

Import workflow (after site deploy): `unlock-before-ocr-quickpdf-node.json`

## After local publish (verification track)

1. Configure GitHub Actions auth (NPM_PUBLISH_SETUP.md).
2. Bump to `0.1.1` in `package.json`, commit, tag `0.1.1`, push tag → CI publish with `--provenance`.
3. Submit at https://creators.n8n.io/nodes (CREATOR_PORTAL.md).
4. Record demo video (unlock `locked.pdf` / `secret123`).

## Optional scan before Creator Portal

```bash
npx @n8n/scan-community-package n8n-nodes-quickpdf
```