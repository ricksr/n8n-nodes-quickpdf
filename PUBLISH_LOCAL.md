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

### If you get `E403` (2FA required)

Web `npm login` **does not** satisfy publish auth anymore. Use **one** of these:

**A — OTP at publish time** (account has 2FA app enabled):

```bash
npm publish --access public --otp=123456
```

Replace `123456` with the current code from your authenticator (npmjs.com → account should show 2FA enabled).

**B — Granular access token** (best for GitHub Actions too):

1. https://www.npmjs.com/ → **Access Tokens** → **Generate New Token** → **Granular Access Token**
2. Permissions: **Read and write** for packages (scope to `n8n-nodes-quickpdf` if offered, or all packages for first publish).
3. Copy the token once, then:

```bash
npm logout
npm config set //registry.npmjs.org/:_authToken='npm_PASTE_TOKEN_HERE'
npm publish --access public
```

4. For CI: same token → GitHub secret `NPM_TOKEN` on `ricksr/n8n-nodes-quickpdf`.
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