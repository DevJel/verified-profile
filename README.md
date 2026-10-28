# Verified Profile

A clean, responsive, blue-and-white profile concept. **This is an interactive prototype, not a live identity or credential-verification service.**

## Website

The site uses readable `index.html`, `styles.css`, and `app.js` files, an optimized supplied logo, and a vendored QR library. No installation, build, CDN, or backend is required to host it. Open the page locally or serve this directory with `python3 -m http.server 8080`.

Edit the page structure in `index.html`, the design in `styles.css`, and interactions in `app.js`. The logo is an SVG container preserving the supplied WebP image. Third-party copyright notices remain intact.

## Publish with GitHub Pages

**Repository created and site uploaded. GitHub Pages is not enabled yet.**

1. Open [Settings → Pages](https://github.com/DevJel/verified-profile/settings/pages).
2. Under **Build and deployment**, select **Deploy from a branch**.
3. Choose **main** and **/ (root)**, then save.
4. Wait for GitHub's deployment to complete and use the website URL shown there.

No custom domain is configured. `.nojekyll` is included.

## Features

- Responsive desktop/mobile layout, mobile navigation, and keyboard-accessible tabs.
- Native profile and privacy dialogs, Escape/focus return, and reduced-motion support.
- Local-only profile previews with validated name/handle inputs and safe text rendering.
- Real QR codes containing clearly labeled demo text — not verification links.
- Clipboard feedback, including a fallback when copying is blocked.
- No analytics, remote fonts, cookies, browser storage, or form submissions.

## Test

Node.js 18+ is needed for testing only.

```sh
npm ci
npx playwright install chromium
npm test
```

With an existing Chromium installation:

```sh
CHROMIUM_PATH=/path/to/chromium npm test
```

Tests cover 320, 390, 768, 900, and 1440px widths; menus, tabs, dialogs, keyboard behavior, validation, safe HTML-like input rendering, mocked clipboard success/denial, reduced motion, resource loading, and absence of external network requests or browser storage. They produce fresh PNG screenshots and JSON results under `docs/evidence/`.

Committed evidence images are SVG containers holding lossless WebP screenshots. Viewport or dialog-region crops from actual browser PNGs keep the files within the connector's size limit; no UI elements were redrawn. `docs/evidence/screenshots.json` records the source hashes, crop bounds, dimensions, and lossless image hashes. Running the tests creates fresh full PNG screenshots locally.

## Scope and privacy

Form values live only in the current page's memory. Reloading resets them. QR text includes the chosen handle; do not enter sensitive information. Clipboard tests mock the API, so actual clipboard permissions depend on browser and hosting context. Hosting providers may keep request logs.

Not implemented: accounts, persistent profiles, handle reservation, identity checks, credential issuance, registry verification, GitHub connection, AI analysis, or a backend. Branding rights and domain ownership were not independently verified.

See [third-party notices](THIRD_PARTY_NOTICES.md), [implementation record](docs/changes/2026-10-29-github-repository.md), and [test results](docs/evidence/test-results.json). Checks and source headers follow applicable ISO MCP project guidance; **no independent ISO audit or certification is claimed**.
