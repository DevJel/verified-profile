# Read-only feature showcase

## Purpose

`demo/` is a public, static preview of the planned Verified Profile dashboard and authentication UI. It matches the existing light blue-and-white design without pretending to be an authenticated account.

| Screen             | Included                                                                    |
| ------------------ | --------------------------------------------------------------------------- |
| Overview           | Sample profile, project counts, project preview, and sign-in-method summary |
| My profile         | Disabled profile fields and private-by-default visibility explanation       |
| Projects           | Two explicitly fictional project cards; no import, editing, or analysis     |
| Credentials        | Honest empty state; no fake badge issuance or verification                  |
| Account & security | Disabled method-management, session, export, and deletion controls          |
| Sign-in preview    | Disabled Google, passkey, password, and email-code UI                       |

The sample email is **demo@verifiedprofile.com**, confirmed by the user. It is not verified and is never contacted. Password and one-time-code fields have no stored values. No provided sample secret is committed or accepted.

## What navigation means

Visitors can switch screens using local hash links and open/close mobile navigation. Those presentation-only actions do not authenticate, save, send, publish, connect, export, delete, or modify anything.

All non-navigation buttons and inputs are disabled. There are no form elements, network/auth handlers, cookies, browser storage, clipboard actions, service workers, or production endpoints. CSP blocks connections and form actions. Editing the DOM cannot turn this static build into a production backend.

## Responsive and accessible design

- Matches the existing system font, `#1557a0` accent, restrained borders, light surfaces, and supplied VP logo.
- Desktop workspace/sidebar, tablet stacking, and a collapsible mobile menu.
- Semantic headings/landmarks, a skip link, focus indicators, current-screen state, and focus movement on navigation.
- Supporting text at least 14px; standard body text 16px. Essential content is not removed on small screens.
- Reduced-motion support; status and restrictions are described with text rather than color alone.
- No guarantee of “every device.” Automated viewport/touch checks and actual inspected screenshots document the tested scope; real-device and broader browser testing remain acceptance work.

## Deployment boundary

The Pages build copies exactly the demo HTML, CSS, JS, and logo; a root redirect sends visitors to `/demo/`. The original landing prototype, backend source, environment files, documentation, tests, and databases are excluded.

See [GitHub Flow](GITHUB_FLOW.md) for Pages setup and release steps, [architecture](ARCHITECTURE.md) for the production boundary, and [authentication requirements](AUTHENTICATION.md) for real-account activation gates.

## Standards disclaimer

This is a UI showcase, not a verification service, a complete accessibility audit, or an ISO certification.
