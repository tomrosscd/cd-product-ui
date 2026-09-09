# Changelog

## Unreleased

- Add Stack, Grid, SplitLayout and PageHeader for token-spaced, container-responsive dashboard composition.
- Add ContentList and ContentListItem with flexible metadata and separate actions.
- Add explicit readOnly mode to RoadmapBoard and RoadmapCard, preserving existing defaults.
- Add a neutral dashboard example, adoption guidance and responsive layout regression checks.

## 0.7.0 · 9 September 2026

Interaction quality: focus, dropdown states and iconography made consistent across the library. No new components, and nothing removed or renamed — upgrading from 0.6.0 needs no code changes. See [docs/release-0.7.md](docs/release-0.7.md) for the full contracts and the list of visible changes to review first.

- Fix: the primary button's focus ring was effectively invisible, measuring 1.00:1 against a card in light and 1.04:1 against the page in dark, where WCAG 2.2 SC 1.4.11 asks 3:1. The ring is drawn outside the border box, so it has to contrast with the surface behind it, not with the button. It now keeps `--cui-focus-colour` and offsets by its own width: 11.79:1 and 12.40:1 in light, 12.01:1 and 9.34:1 in dark.
- Fix: formatted inputs (`CurrencyInput`/`PercentageInput`/`HoursInput`) drew two nested focus outlines. The wrapper's perimeter, which covers the prefix and suffix, is now the only one.
- Fix: `Combobox`'s popup was unsized and inherited page list indentation, so its panel did not align with its own trigger. Selection-column alignment and disabled-option behaviour fixed with it.
- Add `--cui-dropdown-hover` and `--cui-dropdown-selected`: dropdown and menu options no longer borrow `--cui-surface-selected`, the brand green that navigation uses for the current page. `--cui-surface-selected` keeps its value and every existing use; only its description narrowed.
- `Icon` moves onto a curated Lucide set, preserving all ten existing names and adding 23 more (`search`, `filter`, `sort`, `plus`, `calendar`, `edit`, `delete`, `settings`, `visibility`, `loading` among them). Adds `lucide-react` as a runtime dependency, imported by explicit name so bundlers tree-shake it.
- Replace the remaining literal Unicode symbols: `StyledSelect` scroll arrows, `Metric` trend arrows, `DataTable` sort indicators, `TextLink`'s external-link marker, and `PasswordInput`'s "Show"/"Hide" text.
- Add an accessible clear button to `DataTable`'s search: resets pagination to page 0 and returns focus to the input.
- Add Storybook references: `Foundations/Component states` (rest, focus, selected, error, loading, read-only and disabled across fifteen component families), `Foundations/Dropdown states` and `Foundations/Icons`.
- Also on `main` since 0.6.0, not shipped in the package: an experimental shadcn registry pilot (`registry/`) and its audit. Not part of the installable library and not yet ready for adoption — see HANDOFF.md.

## 0.6.0 · 9 September 2026

Pass 2 of the user's re-prioritised roadmap: "everyday controls". See [docs/release-0.6.md](docs/release-0.6.md) for full contracts.

- Add `Chip`/`ChipGroup`: selectable and/or removable interactive tags, distinct from the non-interactive `Badge`.
- Add `SegmentedControl`/`SegmentedMultiControl` on the new `@radix-ui/react-toggle-group` dependency.
- Add `Combobox`: searchable single or multi-select, local or remote (`onSearchChange`) filtering, loading/error states, avatar slot per option.
- Add `CurrencyInput`/`PercentageInput`/`HoursInput`: formatted numeric inputs; the application keeps calculations and rounding.
- Add `PeriodNavigator`: previous/next chrome for an application-defined period, with an optional Today shortcut and reporting presets.
- Add `FilterToolbar` pattern: composes search, application-supplied filters, a result count and removable active-filter chips into a responsive bar.
- Fix: `Icon` silently dropped its own base class when a caller passed `className`, since it spread props after a hardcoded `className` instead of merging them — invisible until a real consumer (`PeriodNavigator`'s flipped arrow) needed it.
- Fix: a Radix Popover race in `Combobox` where the click that opened it also immediately closed it (`onInteractOutside`), and a follow-on bug where confirming a single selection's refocus reopened the panel and blanked the display value.
- Existing component defaults and all prior exports remain unchanged.

## 0.5.0 · 9 September 2026

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
- Add `ErrorBoundary`: catches rendering errors in its subtree and shows a fallback (default or custom) instead of a blank page, with a reset action and an `onError` hook.
- Tooling: a real coverage threshold in `vitest.config.ts`; `examples/**` is now covered by ESLint, and `examples/react`'s `*.tsx` fixture is now type-checked against current source (caught a genuine implicit-any in the process). `examples/next`'s `*.jsx` fixture remains outside `tsc` — see ROADMAP.md.

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
