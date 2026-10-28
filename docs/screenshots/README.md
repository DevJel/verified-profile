# Live screenshot record

**[User manual](../../manual.md) · [Project README](../../README.md)**

## What these images show

All 13 source captures were taken from the actual public Cloudflare showcase, not a local mockup or a future real-account app. The live service reports `read-only-demo`, authentication false, and persistence false. All names and project records shown are illustrative.

- Source: https://verified-profile-demo.black-tooth-5474.workers.dev/demo/
- Capture date: 28 October 2026 UTC / 29 October 2026 Malaysia time.
- Browser viewport widths: 1440px desktop and 390px mobile.
- Each capture includes the complete page. Full-page image dimensions can differ from the browser viewport because browser scrollbars and page height affect the captured content area.
- Six tabs were captured at both widths; the expanded mobile menu was also captured.
- No page errors or horizontal page overflow were observed during capture.
- Every original screenshot was opened individually for visual review.

## Image list

| Tab or state         | Desktop image parts, in reading order                                               | Mobile image parts, in reading order                                            |
| -------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| Overview             | [Part 1](overview-1440.svg) · [Part 2](overview-1440-continued.svg)                 | [Part 1](overview-390.svg) · [Part 2](overview-390-continued.svg)               |
| My profile           | [Part 1](profile-1440.svg) · [Part 2](profile-1440-continued.svg)                   | [Full capture](profile-390.svg)                                                 |
| Projects             | [Part 1](projects-1440.svg) · [Part 2](projects-1440-continued.svg)                 | [Full capture](projects-390.svg)                                                |
| Credentials          | [Full capture](credentials-1440.svg)                                                | [Full capture](credentials-390.svg)                                             |
| Account & security   | [Part 1](account-security-1440.svg) · [Part 2](account-security-1440-continued.svg) | [Full capture](account-security-390.svg)                                        |
| Sign-in preview      | [Part 1](sign-in-preview-1440.svg) · [Part 2](sign-in-preview-1440-continued.svg)   | [Part 1](sign-in-preview-390.svg) · [Part 2](sign-in-preview-390-continued.svg) |
| Expanded mobile menu | Not applicable                                                                      | [Part 1](mobile-menu-390.svg) · [Part 2](mobile-menu-390-continued.svg)         |

## Format and authenticity

The GitHub connection accepts text assets and limits individual upload size. The committed images are SVG containers carrying **lossless WebP pixels from the actual browser PNGs**. Larger captures are divided into consecutive image parts; all rows are retained in their original order. No UI was redrawn, no element was moved, and no image was rescaled. Breaks were selected in blank horizontal regions where possible.

Each capture was reassembled from its encoded parts and compared pixel-for-pixel with the source PNG: all 13 round trips passed. The [manifest](manifest.json) records the exact source URL, capture time, viewport, original PNG hash, full image dimensions, each part’s bounds, and encoded-file hashes.

The README gallery shows previews where necessary; the manual displays complete consecutive parts. Earlier screenshots in `docs/evidence/` and `docs/demo-evidence/` remain historical evidence and are not relabeled as this live capture set.

## Updating screenshots

1. Open the actual release and confirm its mode and labels.
2. Capture the affected tab at the documented desktop/mobile widths, without entering secrets or personal information.
3. Record the URL, time, viewport, dimensions, and source hash.
4. Preserve the real screenshot pixels. If splitting is required, retain every row and record exact bounds.
5. Open each original image individually, inspect the relevant features, and confirm encoded parts reproduce the source.
6. Update the README/manual descriptions, links, manifest, and change record together.

## Review limitations

Screenshots document the captured release and browser widths, not every device, a full accessibility audit, or a certification of account security. ISO-related alignment is self-declared; no restricted standards text is reproduced.
