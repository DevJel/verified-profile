# Reader documentation and live screenshot guide

## Record

- Local date: 29 October 2026, Asia/Kuala_Lumpur; live captures dated 28 October UTC.
- Scope: documentation and evidence only, requested for the repository's `main` branch.
- Initial baseline inspected: merged dashboard revision `e5bad1d60a65f9b327eac2f3d2afad09c8e6d629`. Reconciled the subsequent Cloudflare packaging merge `a05e84c3c229a53603af9b18cab03b276d820ac9` before publication.
- Live source: https://verified-profile-demo.black-tooth-5474.workers.dev/demo/.
- Deployment mode checked: public read-only showcase; authentication false, persistence false.

## Reader problem

The previous README was primarily a short implementation summary and still said no live deployment was claimed. It did not provide a complete non-technical guide, live images of every tab, or a single documentation map.

## Changes

- Reorganized the README around purpose, actual status, navigation, six tabs, current/planned features, privacy, project structure, and contributor links.
- Added root `manual.md` with a complete plain-language screen tour, explanations of fields and controls, mobile/keyboard use, privacy, troubleshooting, glossary, and separate-prototype boundaries.
- Added Mermaid illustrations for the product concept, navigation, future account path, credential/account distinction, documentation map, and normal GitHub review flow.
- Added a documentation index and impact-oriented change history.
- Captured every live tab on desktop/mobile plus the expanded mobile menu; kept all 13 original screenshots complete through lossless consecutive image parts where necessary.
- Recorded source URLs, times, viewports, dimensions, exact image-part bounds, and hashes. Reassembly reproduced all original pixels.
- Updated the authentication/release guides only to clarify that the Cloudflare showcase is deployed while real accounts remain unimplemented.
- Preserved the original technical guides, earlier prototype, notices, and historical evidence.

## Validation scope

Documentation links, same-page anchors, screenshot coverage, encoded image integrity, Mermaid syntax/rendering, and visual presentation were checked for this update. The new live captures were opened individually for review. Detailed machine-readable results are in `docs/screenshots/documentation-checks.json`.

This change does not modify application source, workflows, dependencies, backend behavior, or Cloudflare configuration. It does not claim a new application regression run: previous application checks are quoted with their original scope. Cloudflare packaging was observed merged in PR #2 during this update; the project structure and links were reconciled with that actual main-branch state.

## Risks and boundaries

- Screenshot evidence can become stale when the live service changes; recapture affected screens with documentation edits.
- SVG image parts use embedded lossless WebP pixels. Documentation rendering must be checked on GitHub, not assumed from file creation alone.
- Real Google/passkey/password/email-code authentication, persistence, verification, and credential issuance remain unavailable.
- No sample password, reusable code, real secret, or private account record is included.

## Rollback

Revert the documentation change to restore the previous text and remove this screenshot set. No account data, database, application deployment, or migration needs rollback.

## Guidance

Applicable ISO MCP documentation and repository-change guidance was reviewed. Alignment is self-declared; no independent ISO certification, full security audit, or restricted standard text is claimed.
