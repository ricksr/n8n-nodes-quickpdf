# npm publish — one-time setup (required)

GitHub Actions run **publish** failed with `ENEEDAUTH` because npm is not wired yet.

Repo: https://github.com/ricksr/n8n-nodes-quickpdf  
Workflow: `.github/workflows/publish.yml` (file name = **`publish.yml`**)

## Option A — Trusted Publisher (recommended, no token in GitHub)

1. Log in at https://www.npmjs.com/
2. Confirm your npm username (top right → account).
3. **First-time package:** you may need **one** publish claim — either:
   - **Granular token** (Option B) for `0.1.0`, then switch to trusted publisher, **or**
   - npm → Access Tokens is not needed if your account supports **trusted publishing for new packages** under your scope.
4. Open https://www.npmjs.com/package/n8n-nodes-quickpdf (404 until first publish is OK).
5. After first publish, or via npm user settings → **Trusted publishers** (GitHub Actions):
   - **Repository owner:** `ricksr`
   - **Repository name:** `n8n-nodes-quickpdf`
   - **Workflow filename:** `publish.yml`
   - **Environment:** (empty)

6. Re-run publish:
   ```bash
   cd integrations/n8n-nodes-quickpdf
   git tag -d 0.1.0 2>/dev/null; git push origin :refs/tags/0.1.0 2>/dev/null
   git tag 0.1.0 && git push origin 0.1.0
   ```
   Or: GitHub → Actions → **publish** → Re-run workflow / workflow_dispatch.

## Option B — `NPM_TOKEN` in GitHub (fastest first publish)

1. npm → Access Tokens → **Generate new token** → **Granular access token**
   - Packages: **Read and write** for `n8n-nodes-quickpdf` (or all packages on your account for first publish).
2. GitHub → https://github.com/ricksr/n8n-nodes-quickpdf/settings/secrets/actions
   - New secret: **`NPM_TOKEN`** = paste token
3. Re-run workflow (push tag `0.1.0` again or workflow_dispatch).

## Verify

```bash
npm view n8n-nodes-quickpdf version
```

Should print `0.1.0`.

## Then — Creator Portal

See [CREATOR_PORTAL.md](./CREATOR_PORTAL.md) → https://creators.n8n.io/nodes