# Beacon Business

Offline business management by Beacon of the Eagle LLC, with a blue interface and 100 educational business tips. **English is the first-launch language**; Spanish and Italian remain selectable. Existing saved language preferences are preserved.

## Features

- Monthly cash KPIs: income received, expenses paid, net cash result and cash margin.
- Six-month trend with a table of the underlying amounts.
- Manual transactions with monthly filtering, search, editing and deletion with Undo.
- Client contacts, status and estimated lead opportunities.
- Projects with client assignment, planned budgets, deadlines and linked task progress.
- Tasks with priorities, status, deadlines and completion.
- 100 complete tips in each language, with search, categories, favorites, notes and practical actions.
- JSON export and validated restoration with a preview and Undo.
- Monthly income targets, expense budgets and CSV reports.
- A branded Beacon welcome page with the eagle and lighthouse emblem.
- An Introduction / How it works guide explaining manual entry, monthly cash KPIs, client/project/task workflows, USD amounts, reports, backups and restoration.

Amounts use USD and are stored as integer cents. Monthly result is income received minus expenses paid; margin is result divided by income times 100. With no income, margin displays a dash. Opportunities and project budgets are planning values and are not counted as collected income or paid expenses.

## Web app

Serve `dist/` through a static HTTP server. No dependency installation or compilation is required. Browser records are stored in localStorage. The hosted app has owner-private access through ChatGPT. No bank connection or account synchronization is included. Validated JSON backup restoration and monthly CSV reports are included. Export before clearing browser data.

## Android app

Open `android/` in Android Studio. The app bundles the web assets and runs offline without ChatGPT sign-in. Package: `com.beaconoftheeagle.businessmanager`; version 1.0.1; minimum API 26; target API 36. See `android/README.md` for build and signing instructions. Private signing material is deliberately excluded from this repository.

## Google Play preparation

The requested country list is **United States, Spain and Canada only**. This list must be applied in Play Console; it is not enforced by the AAB. See `play-store/` for English listing text, release settings, assets and publication steps. Preparing or compiling an app does not publish it or grant legal/export authorization.

Android privacy policy: [PRIVACY.md](PRIVACY.md). Intellectual-property and country requirements: [release review](play-store/DISTRIBUTION-AND-IP-REVIEW.md). Third-party notices: [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Validation

Web JavaScript syntax and complete translations were checked. Browser checks covered cash calculations (1,000 income and 250 expense produce 750 net and 75% margin), language switching, persistence, linked clients/projects/tasks, completion and Undo. Test records were removed. Android build and signature validation are recorded with the release outputs; on-device testing and Play review remain separate steps.

## Update 1.0.1 (version code 2)

- Monthly priorities calculated from the local ledger and goals, plus overdue tasks and active projects, in English, Spanish and Italian.
- Failed transaction, task, deletion and goal writes preserve the current in-memory records; forms remain available to retry.
- Backup validation accepts a UTF-8 BOM and rejects invalid amount types and malformed goals.
- Larger touch targets, wrapping for large amounts and reduced-motion support.

Run `node --test tests/release-core.test.cjs` and `node tests/release-browser.cjs` (Playwright and Chromium required; optionally set CHROMIUM_BIN). Native Android runtime and document pickers still require device testing.

The prepared 1.0.1 AAB reuses the signed 1.0.0 release's compiled native DEX/resources, updates web assets and manifest through official bundletool, and is signed with the same private upload key. The native Java code is unchanged. The Gradle source configuration also specifies version 1.0.1 / code 2 for future full builds. No Google Play submission was performed for this update.
