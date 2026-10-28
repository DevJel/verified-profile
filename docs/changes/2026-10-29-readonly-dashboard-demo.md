# Read-only dashboard showcase and authentication documentation

**Date:** 2026-10-29, Asia/Kuala_Lumpur. **Branch:** `feat/readonly-demo-docs`.

## Request and scope

Extend the existing design with documentation, login/dashboard options, responsive layouts, Mermaid illustrations, and GitHub Flow. The user chose real production accounts with Google, passkeys, email/password, and email codes, plus an entirely separate read-only Pages showcase. The user confirmed `demo@verifiedprofile.com` as the fictional display email.

This change implements **only the independent read-only showcase, documentation, test coverage, and a demo-only Pages workflow**. Production authentication, persistence, provider/email configuration, and Cloudflare deployment remain unimplemented and gated on the new account and service setup. No supplied password or fixed code is stored or accepted.

## Inspect → plan → implement → validate → review

- Inspected the existing source and preserved its original landing page, blue/white visual identity, supplied logo, typography, and spacing conventions.
- Built six static demo views: overview, profile, projects, credentials, account/security, and sign-in preview.
- Allowed presentation-only hash navigation and mobile menu controls. All account/write controls and fields are disabled; there are no forms, API calls, cookies, browser storage, or production bindings.
- Added an explicit Pages artifact allowlist and project-path-safe `/demo/` redirect. No production/root prototype files enter that artifact.
- Added architecture, ownership, auth requirements, activation gates, deployment/rollback instructions, and five Mermaid diagrams.
- Introduced GitHub Flow through a feature branch, pull request, verification jobs, and a main-only deployment gate. Pages must first be enabled with GitHub Actions as its source.

## Impact and files

- **UI:** six responsive screens under `demo/`, with clear sample/read-only status and disabled Google/passkey/password/code previews.
- **Backend/API/database:** none. Real accounts and saved data are not claimed as complete.
- **Privacy/security:** public sample data only. The displayed email is not verified or contacted. Password/code fields have no value. Demo CSP blocks connections and form submissions. Disabled UI is not treated as production authorization.
- **Dependencies:** no new production or locked npm dependencies. Official GitHub actions are pinned to exact upstream commit SHAs. Prettier 3.6.2 and Mermaid 11.12.0/JSDOM 26.1.0 were temporary validation tools outside the repository, not shipped runtime dependencies.
- **Changed files:** `demo/`, `scripts/build-demo.cjs`, `tests/demo.cjs`, package scripts, `.gitignore`, Pages workflow, README, documentation, and authentic validation evidence.

## Observed validation

- `CHROMIUM_PATH=/usr/local/bin/chromium npm test`: **31 existing checks + 98 demo checks passed**. Exact timestamps/browser versions are in `docs/demo-evidence/landing-results.json` and `results.json`.
- All six screens checked for horizontal overflow and clipped leaf text at 320, 390, 768, 1024, 1440, and 1920px. Landscape and simulated touch navigation were exercised.
- Verified disabled fields/actions; no forms; blank password/code values; correct fictional email; static GET-only traffic; no session/storage; safe unknown hash fallback; direct links; focus handling; no-JavaScript safety; and nested-path artifact behavior.
- Inspected all six desktop/mobile screens and the expanded mobile menu individually. Fixed one truncated mobile headline with a wrapping, disabled textarea.
- All five Mermaid blocks parsed with Mermaid 11.12.0. Fixed a sequence-label semicolon found during validation.
- Workflow structure/permissions checked; six final authored source snapshots returned zero heuristic errors/warnings from ISO MCP. This does not prove full compliance or security.
- The Pages artifact was verified to contain exactly the root redirect, `.nojekyll`, demo HTML/CSS/JS, and supplied logo.

## Status and limitations

The feature is prepared for pull-request review. **No merge, live Pages publication, Cloudflare resource creation, real account creation, or authentication activation is claimed.** GitHub CI results are separate from local results and must be reviewed before merging.

Device support is documented by tested viewports and simulated touch—not a claim that all real devices or browsers were tested. Real authentication, server authorization, session controls, email delivery, passkeys on user devices, recovery, backups, observability, and production security review remain required acceptance gates.

## Rollback

Revert the feature commits and redeploy the previous Pages artifact, or disable Pages. There are no database migrations, sessions, emails, or persistent user records to restore. The original landing-page prototype is unchanged.

## Standards disclaimer

Applied applicable ISO MCP change/evidence/security guidance including REPO-009, REPO-016, REPO-017, REPO-023, REPO-025, REPO-026, and IAM-006/IAM-007 requirements for the future real service. No ISO certification, full accessibility audit, or completed production authentication is claimed.
