# Implement the adoption audit

The audit's library fixes and agreed table/form improvements are implemented on `feature/adoption-quality`. The package is `0.10.0-rc.1`, an unreleased candidate.

The user confirmed that larger roadmap features remain deferred. The implementation uses generic record, inventory, registration and attachment examples. No consumer-specific service or business rule was added.

## Review the changes

- Read [candidate migration notes](../release-0.10.md) for changed behaviour.
- Use [the table guide](../data-table.md) for controlled state, server pagination, selection and grouped rows.
- Use [the form guide](../form-workflows.md) for editing, attachments and validated steps.
- Review the generated API/CSS changes before release.

## Remaining ownership and deferrals

F02 remains consumer-owned: `cd_capacity` needs its package manager and lockfile reconciled. No files, dependencies, scripts, workflows or settings were changed there. No messages were sent.

Scheduling, Gantt, timeline editing, roadmap dragging, full i18n, RTL, Chromatic and motion-library work remain deferred. No raster assets or retained compatibility exports were removed.

Application upgrades, manual screen-reader sessions, Safari/Firefox, real touch-device testing and platform immutability settings remain unverified. Repository review and remote CI are required before release.

Nothing was committed, pushed, merged, tagged, published or deployed. The released 0.9.0 archive remains unchanged.

## Detail

### Finding reconciliation

| Finding | Implementation                                                       | Verification                                                                                 |
| ------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| F01     | Distinct candidate version, changelog and migration notes            | Metadata check passes; tag check rejects the unreleased entry.                               |
| F02     | Generic frozen-install guidance and corrected consumer record        | Consumer remains read-only; owner action remains open.                                       |
| F03     | Recoverable save lifecycle, retained draft and duplicate-save guard  | Reject, retry, unchanged value, cancellation and unmount tests.                              |
| F04     | Column selection derives from controlled props                       | Saved view, unknown key and host rejection tests.                                            |
| F05     | Locale-aware decimal parser and invalid draft feedback               | Locale digits, grouping, negatives, zero, precision and invalid text tests.                  |
| F06     | Selection and active descendant require available results            | Loading/error keyboard tests.                                                                |
| F07     | Selected-value validation and disabled hidden fields                 | Native validity and FormData tests.                                                          |
| F08     | Date panel height follows available popover space                    | Pointer Apply passes at 1280×700, 320×700 and 1280×400, including dark mode.                 |
| F09     | Sticky offsets use observed rendered widths                          | Ratio-sized pinned columns remain separate while scrolling.                                  |
| F10     | Editor and triggerless drawer focus return                           | Browser focus assertions.                                                                    |
| F11     | Reorder targets measure at least 24×24px                             | Browser geometry and accessibility checks.                                                   |
| F12     | Unread text sits outside the decorative hidden dot                   | Accessible-name assertion.                                                                   |
| F13     | Updated guidance, typed archive examples and export checklist        | Types, packed examples and catalogue checks.                                                 |
| F14     | Retired publishing workflow and archived pilot guidance              | Workflow has no deployment job or publishing permissions.                                    |
| F15     | Exact-tag CI, release metadata guard, checksum and overwrite refusal | Local metadata checks and archive hash verification; remote release execution not performed. |

### General-purpose additions

`DataTable` supports controlled sorting, filtering, pagination, column visibility, order, pinning, selection and expansion. Server pagination requires an explicit total. Selection across server pages requires stable IDs.

`FileUpload` provides native file selection and controlled transfer status. `Wizard` provides controlled form steps and focus movement. `FilterToolbar.actions` separates primary actions from filters.

Uploads, validation, request cancellation, saved views, totals, authorisation and persistence remain application-owned. Quick-entry forms use native controls and explicit save/cancel actions. Spreadsheet navigation remains deferred.

### Verification record

All local implementation checks pass. Component checks: 59 unit tests, 230 light stories and 230 dark stories. Coverage: 93.11% statements, 87.78% branches, 92.71% functions and 94.15% lines.

Types, lint, formatting, token drift, API contracts, CSS contracts, registry drift, catalogue coverage and static Storybook checks pass. API snapshots retain the generator's existing CRLF format.

| Fixture                                            | Result                                                                     |
| -------------------------------------------------- | -------------------------------------------------------------------------- |
| React 19.2.8, Vite 8.2.2, pnpm                     | Packed core and optional charts build; strict TypeScript passes.           |
| Next.js 16.3.4, React 19.2.8, pnpm                 | App Router production build and TypeScript pass.                           |
| Next.js 15.5.25, React 19.2.8, npm, Tailwind 4.3.3 | Frozen install, production build and browser assertions pass.              |
| Tailwind 3.4.19 CSS processing                     | Packed stylesheet parses without host Tailwind directives.                 |
| 320px production viewport                          | Layout settles without page overflow; host control retains its 7px border. |

The review archive contains 321 files. Its SHA256 is `355ab2e8f8e1ccd04507e6cfbbdc62e450bdd2b7422e224331896dbc5d3a3c0c`. Find the local copy in `artifacts/review-2026-09-10/`.

The Vite chart example reports a large-chunk warning. It includes optional Recharts; core consumers do not import it. No warning threshold was suppressed.

The [evidence folder](2026-09-10-implementation-evidence/) retains compact outputs and the package manifest. The [original audit](2026-09-10-adoption-audit.md) remains a dated evidence record.

### Technical references

- [TanStack pagination](https://tanstack.com/table/v8/docs/guide/pagination)
- [Radix Dialog](https://www.radix-ui.com/primitives/docs/components/dialog)
- [WAI combobox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/combobox/)
- [Intl formatting parts](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/formatToParts)
- [GitHub reusable workflows](https://docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows)
- [Release action inputs](https://github.com/softprops/action-gh-release/blob/v2/action.yml)
