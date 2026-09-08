# Changelog

## 0.5.0 candidate

- Add branded StyledSelect, Calendar, DatePicker (single and combined range with presets) and MonthPicker. Keep native Select and DateRange unchanged.
- Add responsive standalone Pagination, opt-in full DataTable pagination, and opt-in readable horizontally scrolling table layouts. Dashboard demonstrates adoption.
- Add calendar keyboard, invalid-range, cancellation, selection and pagination stories. API snapshots capture additive exports and props.
- Existing component defaults and v0.4.0 naming remain unchanged.
- Fix: the `--cui-focus-offset` token was 4px, giving every focusable element (buttons, links, checkboxes, tabs, StyledSelect/DatePicker triggers, SearchSelect's disclosure) a visibly detached "floating" focus ring — Input and native Select had already been special-cased flush against their border, but the token itself was never corrected. Set to 0px and removed the now-redundant per-component overrides.
- Fix: StyledSelect and DatePicker's trigger chevron sat too far in from the right edge, because their trigger reused native Select's asymmetric padding (a gutter meant for a browser-drawn arrow). Gave it symmetric padding for its own flex-laid-out icon.
- Docs: split the "Pass 1 controls" scratch story file into a proper per-component section each (Pagination, Styled select, Calendar, Date picker, Month picker), and moved the existing native DateRange's stories next to the new Date picker instead of an unrelated grab-bag file, so the two aren't mistaken for each other.
- Fix: `Table`'s scroll region announced its caption twice (once via a duplicated `aria-label`, once via the native `<caption>`) — now uses `aria-labelledby` pointing at the caption, with "scrollable table" conveyed separately via `aria-describedby`.
- Fix: `Breadcrumbs` silently discarded `href` on the current-page item; if one is supplied it's now rendered as a link with `aria-current="page"` instead of being dropped. Unchanged when no `href` is supplied.
- `EmptyState` gains an opt-in `live` prop (default `false`) instead of always being a live region — `DataTable` sets it only for its dynamic "no matching results while searching" case, not its initial "no rows yet" state. `RoadmapBoard`'s empty columns are unaffected.

## 0.4.0 · 8 September 2026

**Breaking.** See [docs/release-0.4.md](docs/release-0.4.md) for the full migration guide.

- Renamed `title` to `heading` on Alert, EmptyState, Disclosure, ConfirmationDialog, DataChart, RoadmapBoard and SignInForm, matching Card's existing `heading` for the same concept. SignInForm's `pending` renamed to `loading`, matching the Button it already forwards that value to.
- Added `pnpm api:check`/`pnpm api:update` (Microsoft API Extractor) and `etc/*.api.md`, enforced in CI. Every future change to the public API surface now shows up as an explicit diff instead of relying on manual review.
- Internal only, no usage changes: `SelectOption`/`RadioOption`/`SearchSelectOption` consolidated into one exported `ChoiceOption`; `Button` now forwards its ref (fixes `Button` refs silently doing nothing, and lets the sidebar's mobile-drawer controls use `Button` instead of hand-rolled markup); `Card`'s loading state now reuses `Skeleton`; `RadioGroup` and `Field` share one `aria-describedby` helper; `RoadmapCard`'s heading level corrected from `h3` to `h4`.
- Deliberately not changed, and why: `Table.caption`, and the `label` prop on Tabs/Progress/AllocationBar/ChartContainer/Breadcrumbs, describe genuinely different roles than "block heading" and were left alone rather than forced into false consistency. `RoadmapItem.title`/`ToastMessage.title` are data-record fields, not component props, and are unaffected. The `state` unions on DataTable/DataChart/RoadmapBoard were not given a matching `'empty'` value — each already renders its own empty message from within `'ready'` by inspecting its data/items array.

## 0.3.1 · 8 September 2026

Patch release from a full codebase audit. No public API changes.

- Fix: `docs/using-the-library.mdx` no longer hardcodes a version number that goes stale every release.
- Fix: `check-package.mjs`/`check-next.mjs` used a macOS-only hardcoded temp path; now cross-platform.
- Fix: `TextLink` and the sidebar's nav links now block `javascript:`/`vbscript:`/`data:` URI schemes in an application-supplied `href`.
- Fix: `RadioGroup`'s fieldset had `aria-invalid` with no supporting ARIA role; added `role="radiogroup"`.
- Fix: `check-package.mjs`/`check-next.mjs`'s temp-consumer installs failed under `CI=true` (pnpm implicitly treats plain `pnpm install` as `--frozen-lockfile` in CI) — caught by the new CI workflow the first time it actually ran on GitHub Actions, since no local run had `CI` set.
- Internal: charts, RoadmapBoard and Breadcrumbs now use `Button`/`TextLink` internally instead of hand-rolled markup that duplicated their styling without their behaviour.
- Docs: merged the duplicate `component-catalogue.md`/`.mdx` into one source; added a README version-history table.
- Tooling: added CI (`.github/workflows/ci.yml`), Dependabot, `eslint-plugin-jsx-a11y` (fixed the 4 violations it found on introduction), and `pnpm test:coverage`.
- Process: added a backward-compatibility policy (`docs/release-process.md`) and [CONSUMERS.md](CONSUMERS.md) to track who has installed this package, so future breaking changes can be coordinated instead of discovered. See [ROADMAP.md](ROADMAP.md) for what's deliberately deferred, including a breaking naming-consistency pass.

## 0.3.0 · 8 September 2026

- Add scoped light and dark themes from the same token source, a Storybook theme toolbar and theme-aware portals. Light remains the default.
- Add official logo/mark/straight components and 80 original SVG, PNG and JPG downloads with a searchable Storybook catalogue. Replace the sidebar wordmark text with official artwork.
- Add ActionMenu, Tooltip, ToastRegion, Breadcrumbs, SearchSelect and DateRange with controlled application-owned data.
- Add theme contrast tests and interactive stories, and update installation, AI and validation guidance.
- Preserve existing component APIs, optional chart imports and licensed-font exclusion. No Brand Hub application or authentication is included.

Review fixes: Input and Select in dark mode use a neutral white border/focus colour instead of the accent green; their focus outline sits flush against the border instead of floating with a gap. Alert dropped its accent-coloured left border for a plain border matching the rest of the system. The brand asset Downloads catalogue is now organised into Icon/Logo/Straight/Profile icons tabs with one swatch per colour, instead of a flat 80-item grid.

## 0.2.0 · 8 September 2026

- Forms: Input, PasswordInput, Textarea, Field, Checkbox, RadioGroup and Switch.
- Badge, TextLink, Tabs, Disclosure, ConfirmationDialog, Alert, EmptyState, Spinner and Skeleton.
- KeyValueList, Avatar, ResourceList and ActivityList.
- Metric/MetricCard, Progress/AllocationBar, Table and sortable, searchable, paginated DataTable.
- Optional Recharts v3 charts entry: line, area, bar, stacked bar, donut and sparkline, plus composable chart container, tooltip and legend.
- Seven chart tokens, using existing Convert colours. Charts include summaries, keyboard tooltips and expandable exact values.
- Controlled roadmap board/cards, sign-in presentation and summary/details/progress/action card compositions.
- Dashboard rebuilt with exported metrics, tables, progress and charts. Neutral roadmap and sign-in examples.
- Expanded interaction and accessibility checks, core/chart package consumers and a Next.js build fixture.

Migration: existing 0.1.0 component imports remain valid. Chart users install the optional Recharts/react-is peers and import from `@convert/product-ui/charts`. Prefixes and the approved palette remain unchanged. Authentication and persistence remain application responsibilities.

## 0.1.0 · 7 September 2026

Initial versioned library delivery.

- 85 generated tokens covering surfaces, colour, typography, spacing, borders, radii, elevation, focus, motion, sizing, breakpoints and layers.
- React Card, native Select and responsive DashboardSidebar; supporting Button, Icon, ConvertMark and DashboardShell.
- Storybook token reference, wiki-style guidance, component states and interactive neutral dashboard.
- Universal compiled CSS and token exports; React 19.2 component support.
- Accessibility, interaction, token contrast, type, lint and package-consumption checks.
- Installation, pinned updates and rollback guidance for consuming applications.
- GitHub contribution guide, bug and feature forms, and pull request template.
- Release process, AI guidance and Impeccable review rules.

Migration: first release. Plain HTML and other frameworks receive tokens/styles; React-managed interactions require React. Licensed fonts are excluded from Git and the package.
