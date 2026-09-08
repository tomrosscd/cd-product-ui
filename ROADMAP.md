# Roadmap

## Approved delivery order (9 September 2026, re-prioritised by the user — supersedes Codex's original ordering below)

The user reviewed Codex's negotiated 30-item pass structure and found the priority and grouping had drifted from what the finance/capacity screenshots actually need. This replacement list is the authoritative one; Codex's original six-pass ordering further down this section is kept only as historical record of what it superseded.

### First: improve everyday controls (Pass 2 — done except item 1's optional ActionMenu polish)

| #   | Component or improvement              | Scope                                                                                                                                                                                                                                                                                                                                                                          |
| --- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Branded Select and menu improvements  | Consistent open panels, selected indicators, groups, disabled items, scrolling, keyboard navigation and light/dark styling. Preserve existing consumer behaviour. **Largely done in Pass 1** (`StyledSelect`). **Still open:** `ActionMenu` was not touched in Pass 2 — no long-list scrolling review has been done on it. Low priority; pick up if a real long menu shows up. |
| 2   | Calendar and date-range picker        | Convert-styled calendar, clear range highlighting, month/year navigation, typed entry, disabled dates, clear/apply actions and mobile layout. **Done in Pass 1** (`Calendar`/`DatePicker`/`MonthPicker`).                                                                                                                                                                      |
| 3   | Chips                                 | **Done in Pass 2** (`Chip`/`ChipGroup`). Selectable filter chips, removable selections and chip groups. Non-interactive status badges (`Badge`) kept separate.                                                                                                                                                                                                                 |
| 4   | Searchable combobox and multi-select  | **Done in Pass 2** (`Combobox`). Local or remote (`onSearchChange`) options, loading/error states, an `avatar` slot per option. No-results state is a plain message, not a fake disabled option.                                                                                                                                                                               |
| 5   | Segmented controls / toggle groups    | **Done in Pass 2** (`SegmentedControl`/`SegmentedMultiControl`, on the new `@radix-ui/react-toggle-group` dependency).                                                                                                                                                                                                                                                         |
| 6   | Filter toolbar                        | **Done in Pass 2** (`FilterToolbar` pattern, composing Chip/Combobox/SegmentedControl/StyledSelect as the application chooses).                                                                                                                                                                                                                                                |
| 7   | Currency, percentage and hours inputs | **Done in Pass 2** (`CurrencyInput`/`PercentageInput`/`HoursInput`). Financial calculations stay in the application.                                                                                                                                                                                                                                                           |
| 8   | Period navigation                     | **Done in Pass 2** (`PeriodNavigator`). Does not calculate period boundaries itself.                                                                                                                                                                                                                                                                                           |

### Next: make tables and editing useful for real work (Pass 3)

| #   | Component or improvement                     | Scope                                                                                                                                                         |
| --- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 9   | Standalone Pagination                        | **Done in Pass 1.** Reusable page controls, page size, totals; reused within `DataTable` via `pagination="full"`.                                             |
| 10  | DataTable expansion                          | Row selection, bulk actions, column filters, sticky headers, sorting controls and server-driven pagination. Add virtualisation when dataset size warrants it. |
| 11  | Column configuration and saved-view controls | Show/hide, reorder and pin columns; choose named views. The application owns saving preferences.                                                              |
| 12  | Grouped rows and summary footers             | Group by team, lead or project, expand/collapse groups and display supplied totals/subtotals.                                                                 |
| 13  | General dialog and details drawer            | Inspect or edit records without leaving the table. Include dirty, saving, saved and failed states.                                                            |
| 14  | Editable cells and quick-entry rows          | Explicit save/cancel, validation, keyboard movement and pending/error feedback. Do this before any spreadsheet-style bulk editing.                            |
| 15  | File upload and attachments                  | Invoice/receipt uploads, file lists, progress, retry, removal and validation states.                                                                          |
| 16  | Wizard / stepper                             | Multi-step creation and import flows, including mapping, review and completion.                                                                               |

### Then: finance and capacity visualisation (Pass 4)

| #   | Component or improvement               | Scope                                                                                                                                         |
| --- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 17  | Capacity indicator                     | Booked versus available hours, remaining capacity and visible overload above 100%. Ordinary progress bars stay completion indicators.         |
| 18  | Status indicators and reusable legends | Labelled risk states and project-phase legends, including unknown states. Review semantic colours in both themes; never rely on colour alone. |
| 19  | Budget-versus-actual chart patterns    | Targets, variance, negative values, currency formatting and actual/forecast distinctions, with accessible data alternatives.                  |
| 20  | Gantt project timeline                 | Projects/tasks against dates, phases, milestones, grouped rows, today marker and week/month scales. Start with viewing and inspection.        |
| 21  | Resource scheduling timeline           | People/teams against time, allocation blocks, availability and conflicts. Share timeline foundations with Gantt where practical.              |
| 22  | Capacity heatmap                       | Person/team × week grid with exact hours or percentages, explicit missing data and accessible alternatives.                                   |
| 23  | Timeline editing                       | Move and resize allocations, with keyboard alternatives and save/cancel feedback. Decide dependency editing separately.                       |
| 24  | Roadmap drag-and-drop                  | Add pointer dragging while retaining the existing accessible stage selector.                                                                  |

### Additional gaps visible in the screenshots (Pass 5)

| #   | Component or improvement                  | Scope                                                                                                                                                               |
| --- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 25  | Nested and collapsible sidebar navigation | Expandable Projects groups, child destinations, collapsed desktop mode and clear active states.                                                                     |
| 26  | Reusable page header                      | Title, supporting context, primary actions and responsive toolbar placement. Keep the library's UI typography rather than adopting the screenshots' serif headings. |
| 27  | Notification centre                       | Bell, unread count and notification list. Existing toasts cover temporary feedback, not a persistent inbox.                                                         |
| 28  | Command palette                           | Keyboard search across application destinations and actions.                                                                                                        |
| 29  | Import/sync status pattern                | Last updated, running, partial success, failed records and retry. Compose existing feedback components; integration logic stays outside the library.                |
| 30  | Print styling                             | Readable tables and reports, repeated headers where supported, sensible page breaks and hidden navigation/controls.                                                 |

### Engineering work to ship alongside the relevant feature work, not batched at the end

| Priority                        | Work                                                                                                                                                                              | Status                                                                                                                          |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Before changing shared controls | Real-browser Button and mobile-sidebar interaction tests; verify ref handling and focus return before replacing remaining raw sidebar buttons.                                    | Still open — see section 5 below.                                                                                               |
| Alongside accessibility review  | Reduce unnecessary live-region announcements; fix duplicate table announcements and roadmap heading levels; document or support the current breadcrumb's supplied link.           | **Done** (this session, 9 September 2026) — see section 4 below.                                                                |
| Early resilience improvement    | Add an `ErrorBoundary` with a useful fallback and application-owned recovery action.                                                                                              | **Done.**                                                                                                                       |
| Alongside component changes     | Reuse `Skeleton` within `Card`; consolidate field-description/error logic for `RadioGroup`; strengthen chart data types.                                                          | Skeleton/RadioGroup done in 0.4.0. Chart data types still open.                                                                 |
| Dedicated compatibility review  | Review loading/pending/state conventions, empty-state handling, shared option types and Badge/Alert tone vocabulary. Preserve existing APIs through aliases or migration support. | Still open — do this as its own review, not folded into a feature pass.                                                         |
| Locale support                  | Make internal copy overridable and provide deliberate number, currency and date formatting options. Australian English remains the default.                                       | Still open — see section 3 (this is the same i18n decision, not new scope).                                                     |
| Tooling                         | Meaningful CI coverage thresholds, type-aware linting, Storybook linting and lint/type coverage for consumer examples.                                                            | Coverage thresholds and examples lint/type-check **done**. Type-aware linting and Storybook linting still open — see section 5. |
| Later compatibility coverage    | RTL layouts and stories; revisit visual regression testing as contribution volume grows.                                                                                          | Still deferred — see section 5.                                                                                                 |

Keep i18n, RTL, Chromatic and animation-library decisions deferred (including the CSS-only loading screen below — the user confirmed 9 September 2026 it's "way later", not part of any near-term pass). Product UI private employee font setup uses company-restricted storage, excluded from Git and public packages; document local/deployed use once a storage link is provided.

<details>
<summary>Superseded: Codex's original six-pass ordering (9 September 2026, kept for history only)</summary>

1. **Pass 1, target 0.5.0:** opt-in readable/scrollable tables; branded Select/menu patterns; single-date, combined-range, reporting-preset, month/year and inline calendars; standalone responsive Pagination and DataTable integration.
2. **Pass 2:** collapsible sidebar/navigation rail and mobile drawer, chips, async single/multiple combobox, segmented controls, responsive filter toolbar.
3. **Pass 3:** currency/percentage/hours inputs, period navigation, general dialogs/details drawers, editable cells and quick-entry rows.
4. **Pass 4:** bulk selection/actions, server-driven tables, column configuration and saved-view controls, grouped rows/totals, upload/attachments and wizard/stepper.
5. **Pass 5:** capacity/overload indicators, labelled status/phase legends, budget-versus-actual chart patterns, Gantt, resource timelines and capacity heatmaps. Evaluate scheduling separately from Recharts.
6. **Pass 6:** timeline move/resize, roadmap dragging with keyboard alternatives, page header, notification centre, command palette, import/sync patterns and print styles.

</details>

Each pass can have multiple focused PRs. Keep existing APIs and default behaviour intact where practical through opt-in variants. Every release requires light/dark keyboard/mobile review, API snapshots, full checks, package and Next.js validation, and green CI. Do not merge or tag without user approval.

Everything here came out of a full codebase review (8 September 2026) and was deliberately deferred rather than fixed immediately — either because it's a breaking change that needs coordinating with [CONSUMERS.md](CONSUMERS.md) first, or because it's a real feature that deserves its own stories, tests and docs rather than being rushed into a "quick fix" batch. Nothing on this list is urgent; work through it whenever there's appetite. See [docs/release-process.md](docs/release-process.md#backward-compatibility) for how to ship the breaking items safely.

When you pick something up, move it from here into a normal feature branch and PR — don't edit components directly against this list. Delete an item once it ships, and note it in CHANGELOG.md as usual.

## 1. Naming and consistency refactor — done in 0.4.0, one item left

Most of this shipped in 0.4.0 (see [docs/release-0.4.md](docs/release-0.4.md)): the `title`→`heading` rename across seven components, `SignInForm.pending`→`loading`, the `ChoiceOption` consolidation, `Button`'s `forwardRef` fix and the sidebar swap, `Card`/`Skeleton` reuse, and `RadioGroup`/`Field`'s shared `describedByIds` helper. Two things from the original review were considered and deliberately left alone — see CHANGELOG.md's 0.4.0 entry for why (`BadgeTone`/Alert tone vocabularies, and the `state` unions not getting a matching `'empty'` value). Don't re-propose either without new information.

One item remains, lower priority since it's an internal typing concern rather than a public API inconsistency:

- Consider tightening `ChartConfig`/`ChartDatum` (currently loose index signatures in `src/charts/index.tsx` that force `!` non-null assertions and `unknown` casts elsewhere in the same file).

## 2. New components

Each of these is a real feature — stories, interaction tests, and a docs/component-catalogue.md entry, not just a source file.

- **Standalone Pagination.** Currently only exists baked into `DataTable` via TanStack's pagination row model. Extract a reusable `Pagination` component (page/pageSize/total, prev/next, page-size selector, optional page-number jumps) that `DataTable` can then use internally too.
- **Async/remote Combobox.** `SearchSelect` is deliberately local-array-only (its own docstring says so). A real async combobox needs `loadOptions`, debounced input, a loading state, and should probably be a genuine ARIA combobox (`SearchSelect` explicitly isn't one, by design, for the local-choice case).
- **Command palette (cmd-k).** Nothing like this exists yet. Worth building on top of the same Radix primitives already in use (`@radix-ui/react-dialog` is already a dependency).
- **Wizard / multi-step stepper.** No component or pattern for this today.
- **File upload / dropzone.** No component for this today — zero references to `type="file"` or drag-drop file handling anywhere in `src/`.
- **Real drag-and-drop for RoadmapBoard.** Today "moving" a card is a `<Select>` dropdown (`onStageChange`), which is genuinely good for keyboard/touch accessibility and should stay as an option — but a mouse-drag interaction (e.g. via `dnd-kit`, which has good accessibility primitives of its own) is worth adding as a progressive enhancement alongside it, not a replacement.
- **Error boundary component.** Components accept `state='error'` props for their own internal error states, but nothing in the library catches a render-time throw from a consumer's own code. A simple `ErrorBoundary` wrapper would round this out.

## 3. Internationalization and locale

Roughly 60 hardcoded English strings live inside components today (several are accessible names, not just visible copy) — see e.g. `card.tsx`, `select.tsx`, `data-table.tsx`, `charts/index.tsx`, `roadmap-board.tsx`, `fields.tsx`, `workspace-controls.tsx`, `sign-in-form.tsx`, `dashboard-sidebar.tsx`. Some are already overridable via props (Card's `message`, Spinner/Skeleton's `label`), most aren't. `charts/index.tsx` also hardcodes `Intl.NumberFormat('en-AU', ...)`.

This is a bigger architectural decision than the others on this list (a full i18n library integration vs. just making every string an overridable prop with an English default) and shouldn't be started casually — pick an approach deliberately before touching components.

## 4. Accessibility follow-ups (beyond what was already fixed)

Fixed alongside the 0.5.0 pass 1 table/select/date-picker work (9 September 2026): `EmptyState`'s `role="status"` is now an opt-in `live` prop instead of automatic (`DataTable`'s dynamic "no matching results" case opts in, its initial "no rows yet" and `RoadmapBoard`'s static empty columns don't); `Table`'s scroll region uses `aria-labelledby` pointing at the caption instead of duplicating its text; `Breadcrumbs` now honours `href` on the current-page item (renders a link with `aria-current="page"`) instead of silently discarding it, unchanged when no `href` is supplied.

## 5. Testing and tooling, further out

Done (9 September 2026): a real coverage threshold (`vitest.config.ts`, statements 90/branches 80/functions 85/lines 90 — a few points below the actual baseline, so it catches a genuine regression without blocking normal work); lint coverage for `examples/**` (a dedicated `*.jsx` block for `examples/next`'s fixture, and `examples/react/**/*.tsx` now type-checked against current source via a `paths` alias, which caught a real implicit-any).

Still open:

- **Interaction test coverage for `Button` and `DashboardSidebar`'s mobile drawer.** Both are genuinely interactive and currently have zero Storybook play-function coverage (they're covered only by the jsdom unit tests in `tests/components.test.tsx`, which don't exercise real browser focus/keyboard behaviour the way the Storybook/Playwright project does for other components).
- **`typescript-eslint` `recommendedTypeChecked`** instead of the current plain `recommended`, for stricter type-aware linting. Deliberately not attempted yet — expect it to surface a real batch of new violations across the codebase, so budget dedicated time rather than folding it into an unrelated pass.
- **`eslint-plugin-storybook`.**
- **`examples/next`'s `*.jsx` fixture is still outside `tsc`.** Bringing it in needs `allowJs`/`checkJs` at the root project level, a bigger, separate decision than the `examples/react` fix above.
- **Print stylesheet** (`@media print`) — currently doesn't exist anywhere in `src/styles/`.
- **RTL language support.** A handful of logical CSS properties exist already, but there's no `[dir="rtl"]` handling or story — directionality has been unconsidered rather than actively supported.
- **Visual regression testing (Chromatic or similar).** Deliberately deferred by decision on 8 September 2026 — not worth the external-account overhead at the current team/contributor size. Revisit if the component count or number of people submitting UI PRs grows meaningfully.

## 6. Loading animation / a branded loading screen

Requested 8 September 2026: something more polished than the current plain `Spinner` for a full-page or full-screen loading moment, without turning this into an animation-heavy system. Three real options, roughly in the order I'd reach for them:

1. **A branded, CSS-only loading screen using the existing `ConvertLogo` mark geometry.** Animate the "C" mark's stroke drawing on with a `stroke-dasharray`/`stroke-dashoffset` keyframe, or a slow pulse/scale on the existing SVG path — no new dependency, works identically in every framework this library already supports (tokens + CSS, not React-only), and automatically respects the reduced-motion handling already built into `src/styles/components.css`. This is the one I'd build first: it's genuinely on-brand rather than a generic spinner, costs nothing in bundle size, and fits the project's existing "framework-neutral core" architecture instead of cutting against it. Ship it as a `BrandedLoader`/`LoadingScreen` component alongside the existing `Spinner`/`Skeleton`, not a replacement for either — `Spinner` and `Skeleton` are for inline/in-context loading, this would be specifically for a full-screen "the app is starting" moment.
2. **`@formkit/auto-animate`** (npm, ~2KB, MIT) if there's appetite for small automatic transitions elsewhere — e.g. items animating in/out of the RoadmapBoard columns, or a toast sliding in — without hand-writing keyframes per case. It's a single hook (`useAutoAnimate()`) applied to a container, framework-light, and low-risk to try since it degrades gracefully (an unanimated DOM change) if something doesn't suit it.
3. **`motion`** (npm, the renamed/rebuilt Framer Motion, `import { motion } from 'motion/react'`) only if there's a real need for richer orchestration later — staggered list reveals, shared-element/layout transitions, gesture-driven interactions. This is the heaviest option (a real dependency, React-specific, ~30KB gzipped) and would need to be gated the same way Recharts already is: an optional peer dependency behind its own entry point, not bundled into the core. I would not reach for this just for a loading screen — it's overkill for that specific ask, and it's the one place on this list where "don't go over the top" cuts hardest.

Recommendation: build option 1 now if/when this gets picked up, and treat 2 and 3 as separate, later decisions with their own justification — don't pull in an animation library "while we're at it" for a loading screen that doesn't need one.
