# Cloudflare showcase deployment

## Current release

**Live read-only showcase:** https://verified-profile-demo.black-tooth-5474.workers.dev/demo/

- Account selected through the user's newly authorized connection: **Verified Profile Platform**.
- Worker: `verified-profile-demo`.
- Published on 2026-10-28 UTC; deployment ID `21c45a0cc03343238cb789d3998ea049`.
- UI source: feature revision `ab5790baa63f2aee82c5791725de9fc1fbd6be5e`; Cloudflare packaging and this record are added in the subsequent feature commit.
- This is a **Cloudflare Workers deployment**, not Cloudflare Pages or GitHub Pages. The dashboard feature was merged in PR #1. GitHub Pages is a separate configured workflow; its publication status was not verified as part of this Cloudflare deployment.
- No custom domain, plan upgrade, database, authentication provider, email service, or secret binding was created. Cloudflare platform limits and normal hosting usage policies still apply.

The account connection does not complete the production application. Google, passkeys, passwords, email codes, owner-scoped persistence, and credential issuance are **not implemented or activated** in this release.

## Isolation and behavior

The generated Worker contains an explicit allowlist of four static files from `demo/`. It performs no outbound requests and has no database, storage, or service bindings.

| Request                                                               | Behavior                                                          |
| --------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `GET /` or `GET /demo`                                                | Redirect to `/demo/`                                              |
| `GET /demo/`                                                          | Six-screen read-only dashboard showcase                           |
| `GET /demo/index.html`, `styles.css`, `demo.js`, `assets/vp-logo.svg` | Exact reviewed assets                                             |
| `GET /healthz`                                                        | Reports `read-only-demo`, authentication false, persistence false |
| `GET /robots.txt`                                                     | Requests no crawling                                              |
| Unknown path, including `/login`, `/api/profile`, `/.env`             | 404, no source or private configuration disclosure                |
| Methods other than GET and HEAD                                       | 405; no mutations                                                 |

Responses use no-store caching, no cookies, nosniff, no-referrer, anti-framing, HSTS, noindex, and a restrictive CSP including `connect-src 'none'` and `form-action 'none'`. Worker observability is disabled; that is not a promise that Cloudflare maintains no platform/security logs. robots and noindex are not access controls: the showcase is intentionally public.

## Build and verify

```sh
npm ci
npx playwright install chromium
npm test
npm run build:cloudflare
```

`build:cloudflare` first builds the same `.site/` demo allowlist used for GitHub Pages, then creates `.cloudflare/worker.mjs`. Generated build output is ignored by Git. The original interactive landing-page prototype and repository documentation are not included.

## Redeploy with a reviewed CLI

Use an installed, organization-approved Wrangler version and authenticate privately to the **Verified Profile Platform** account. Confirm the selected account with `wrangler whoami` before making changes. When multiple accounts are present, explicitly set `CLOUDFLARE_ACCOUNT_ID` to the intended account in the local environment; do not rely on a default.

```sh
npm test
npm run build:cloudflare
wrangler deploy --config wrangler.demo.jsonc
```

No production credentials belong in the demo or repository. API-token deployments should use a narrowly scoped Workers token supplied through the deployment environment, never committed. Do not add an automatic GitHub-to-Cloudflare production release until its protected environment, approvals, credentials, and checks are configured.

The first deployment used the user's authorized Cloudflare MCP API: multipart upload of `worker.mjs` with `main_module`, compatibility date, empty bindings, and disabled observability; then enabled only the Worker’s workers.dev route. No persistent deploy credential was exported to the computer or GitHub.

## Verification evidence

- Existing landing/dashboard regression suites: 129 local checks passed before release.
- Cloudflare handler suite: 54 checks passed for exact assets, headers, HEAD behavior, redirects, unknown routes, and write denial.
- Live HTTP checks: 21 passed, including exact SHA-256 asset matches, no Set-Cookie, correct health status, and write refusal.
- Live shared-browser checks: 49 passed across all six routes at 390px and 1440px, with no editable fields, forms, horizontal overflow, or JavaScript page errors.
- Actual deployed desktop overview, mobile overview, and mobile sign-in screenshots were visually inspected. Other responsive and interaction states are covered by the prior demo evidence.
- See [live evidence](cloudflare-evidence.json). Heuristic ISO MCP checks on the new build/test source reported zero findings; these are not an independent audit or security certification.

## Rollback and withdrawal

Record the deployed version and reviewed source revision before updating. To roll back this initial code-only service, rebuild a previously approved source revision and deploy it to the same Worker, then rerun health, exact-asset, browser, and write-denial checks. Alternatively use Cloudflare's recorded Worker version/deployment controls after confirming the intended account.

For immediate withdrawal, disable the `verified-profile-demo` workers.dev route in the selected account. Do not delete unrelated services or change the account-wide subdomain. There is no application database or account state to migrate or restore in this showcase.

## Production is separate

Complete [authentication activation gates](AUTHENTICATION.md) before launching real accounts. Use a stable approved HTTPS app domain, vetted auth integration, private owner-scoped storage, verified sender, real-device passkey tests, negative authorization tests, and a separate security-reviewed release. Never convert the fixed sample email/password/code into a production bypass.
