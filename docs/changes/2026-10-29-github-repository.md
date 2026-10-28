# GitHub repository setup

Date: 2026-10-29, Asia/Kuala_Lumpur. Repository: https://github.com/DevJel/verified-profile

The user approved creation of the previously proposed public `verified-profile` repository. A new public repository was created in the authenticated DevJel account; its default branch is main. No existing project was overwritten.

## Site and scope

The previously cleaned, tested page is published in this repository as readable HTML, CSS, and JavaScript with a local QR library and a small SVG container preserving the original supplied WebP logo. The site needs no build step for Pages. The multi-file development package delivered in the chat remains unchanged.

There is no backend, account creation, persistent data, handle reservation, live credential verification, GitHub analysis, or AI service. The site remains explicitly a demo. The site uses a restrictive self-only script/style content policy.

## Validation and evidence

The repository version passed all 31 smoke checks with Chromium. Exact execution time, version, and results are recorded in ../evidence/test-results.json. Coverage includes five viewport widths, menus, tab navigation, dialogs, validation, safe text rendering, mocked clipboard outcomes, reduced motion, resource loading, and absence of external network requests/storage. Data-URI images are local embedded resources, not external requests.

Actual screenshots are committed as viewport or dialog-region crops encoded losslessly as WebP in SVG wrappers, due to the text-only connector and its 64KB request limit. Source PNG hashes, crop bounds, dimensions, and lossless WebP hashes are in ../evidence/screenshots.json. Converted pixels were verified identical to the PNG crop. These are authentic browser captures, not illustrations or vector recreations. Before/after and relevant state screenshots were visually inspected during the cleanup; the standalone page renders the same interface.

The cleanup also included a real QR decode, primary contrast calculations, a locked npm dependency audit, and ISO MCP heuristic review of authored source components. The SVG namespace's required HTTP-spelled identifier was a documented non-network false positive. No independent ISO certification, comprehensive security audit, or full accessibility/cross-browser audit is claimed.

## Guidance and publication status

Reviewed the applicable ISO MCP deployment checklist, including ARC-009, SDLC-005, REPO-001, REPO-022, REPO-025, REPO-026, and REPO-029. Public ownership is the user's authenticated personal account. No credentials or secrets are included. No DNS or custom domain settings were changed.

**Repository source is ready for review. GitHub Pages is not enabled and no live deployment is claimed.** The connected tools expose repository content operations but no Pages-setting operation. The README provides the remaining Settings → Pages step: deploy main from the root.

To roll back the source, revert the setup commits. To withdraw the future website, disable Pages. No database or persistent user data needs restoration.
