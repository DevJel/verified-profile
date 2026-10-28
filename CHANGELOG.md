# Change history

This history describes user-visible changes and their status. Dates use Malaysia local time unless another timezone is stated. A deployed showcase is not the same as a released real-account service.

## 2026-10-29 — Documentation and live-screen guide

### Added

- A detailed, plain-language root `manual.md` explaining every dashboard tab and displayed feature.
- A reorganized README with product purpose, available/planned features, navigation, Mermaid illustrations, project structure, and documentation links.
- A documentation index separating visitor guidance, engineering requirements, release information, and evidence.
- Actual live screenshots of all six desktop and mobile tabs, plus the expanded mobile menu, with capture and integrity records.
- Explanations of inactive controls, privacy boundaries, keyboard/mobile navigation, and troubleshooting.

### Unchanged

- The running application, public showcase behavior, and disabled account controls.
- Real accounts, saved data, identity checks, and credential issuance remain unimplemented.

## 2026-10-29 — Cloudflare read-only showcase

### Available

- Public read-only dashboard hosted in the authorized **Verified Profile Platform** Cloudflare account.
- Overview, My profile, Projects, Credentials, Account & security, and Sign-in preview.
- Responsive navigation, including the mobile menu and direct links to individual screens.
- Explicit sample-data, no-issued-credentials, and no-active-session messages.

### Release scope

The live service is a static Cloudflare Worker. Its deployment packaging and runbook were merged in [PR #2](https://github.com/DevJel/verified-profile/pull/2). See the [Cloudflare runbook](docs/CLOUDFLARE.md) for the deployment record and operating instructions. GitHub Pages is a separate workflow; this history does not claim its publication was verified.

## 2026-10-29 — Dashboard feature merged

- [PR #1](https://github.com/DevJel/verified-profile/pull/1) merged the separate `demo/` dashboard and engineering documentation.
- Added a demo-only GitHub Pages build and verification workflow.
- Recorded responsive, navigation, disabled-control, and screenshot checks.
- Documented future requirements for real accounts rather than presenting the sign-in preview as working authentication.

## Earlier prototype

The repository retains the original landing-page prototype with a local-only profile preview, demo-text QR code, privacy dialog, and presentation tabs. It is separate from the currently deployed dashboard. See [its implementation record](docs/changes/2026-10-29-github-repository.md) and [original evidence](docs/evidence/).

## Notices

This is a project change record, not a certification statement. Applicable standards alignment is self-declared; no restricted ISO/IEC standard text is reproduced.
