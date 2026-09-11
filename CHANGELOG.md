# Changelog

## 0.10.0 · 11 September 2026

Shared table and form improvements, adoption audit fixes and aligned pagination controls. The library remains independent of application services and business rules.

### Added

- `Stepper`, `NotificationCentre`, `Drawer`, `ColumnConfigPanel` and `InlineEdit` from the post-0.9.0 work.
- Recursive sidebar sections, `SidebarItem.badge`, Button variants and control sizes.
- `DataTable.tableState` and `onTableStateChange` for sorting, filtering, pagination, visibility, order, pinning, selection and expansion.
- Server pagination with explicit `rowCount`, optional bulk actions and host-supplied grouped rows and totals.
- `FileUpload` for file selection and transfer status; `Wizard` for controlled form steps.
- `FilterToolbar.actions` for actions separate from filtering controls.

### Fixed

- Pagination uses an inline page-size label and matching compact controls. Narrow containers place navigation on its own row.
- Styled select options use one rounded focus ring without viewport clipping, retain a forced-colour outline and align checkmarks to the trailing edge.
- Inline editing retains the draft after rejection, clears pending state and restores trigger focus. Duplicate saves and cancellation during submission are blocked.
- Column configuration reflects saved views and host-controlled selection. Reorder buttons meet the 24px target minimum.
- Formatted inputs parse locale separators and digits. Invalid text stays visible and does not emit a replacement value.
- Combobox loading/error results cannot be selected. Required values participate in validation; disabled values are excluded from submission.
- Date panels fit the available popover height. Sticky table offsets use rendered column widths.
- Triggerless drawers restore focus. Notification items expose unread text to assistive technology.
- Adoption examples use the release archive and type-check against its declarations. Demonstration content is synthetic.

### Behaviour and release review

- Post-0.9.0 token work changes focus width from 2px to 1px and adds control-size tokens. Review focus visibility and density.
- Column configuration is controlled. Update `visibleKeys` in `onChange`; hidden columns remain available in definition order.
- Numeric inputs reject malformed grouping, arbitrary text, currency symbols and exponent notation. Use the selected locale's decimal notation.
- Release jobs run the full checks on the tag commit, verify metadata, publish a SHA256 checksum and refuse existing releases.
- Registry hosting is retired. Local registry source and drift checks remain available.

See [migration notes](docs/release-0.10.md). Applications upgrade deliberately; this release does not change installed consumers.

## 0.9.0 · 9 September 2026

Tables that carry real data, and the navigation and status fixes the first external consumer found while adopting 0.8.0. Everything is additive; two existing default appearances change, both called out below. See [docs/release-0.9.md](docs/release-0.9.md).

- Add `meta: { sticky: true }` to pin a leading `DataTable` column while the table scrolls horizontally, so a row's identifier stays readable. Pair it with `tableLayout="scroll"` and a declared `size`; the offset of a second pinned column is computed from the widths before it.
- `DataTable` renders a `tfoot` when a column definition declares a `footer`, using TanStack's own field rather than a second API. Tables that declare none are unchanged.

- `DataTable` now applies a column definition's `size` to the rendered column. Declaring any size switches the table to fixed layout, so declared widths decide the columns; a table filling its container distributes the surplus proportionally, which makes the sizes ratios rather than absolute pixels. Tables that declare no size are unaffected.
- Add per-column presentation through a column definition's `meta`: `numeric` aligns the column to the end and switches on tabular figures so digits line up down the column, and `align` sets `start`, `center` or `end`. Typed through TanStack's `ColumnMeta` augmentation. Formatting the value, including currency, hours, negatives and what missing looks like, stays with the application.
- **Fix:** a `negative` `Badge` used `--cui-surface-page` as its background, within 1.00:1 of the page behind it, so it read as bare text beside the tinted positive and warning badges. Adds `--cui-surface-negative`, measured at 1.20:1 against the page, between warning's 1.17 and positive's 1.37, with 5.16:1 for the text on it.

- **Fix:** a closed `DashboardSidebar` section still rendered its children and kept them in the tab sequence while reporting `aria-expanded="false"`. The list carried the `hidden` attribute, but `.cui-nav-section-list`'s class-based `display: flex` outranks the user agent's `[hidden] { display: none }`, so the attribute had no effect. Reported by the first consumer to adopt 0.8.0.
- Redesign the sidebar collapse control. Expanded, a quiet panel-collapse button sits on the trailing edge of the branding row, replacing the separate hamburger and "Collapse" row beneath the logo. Collapsed, a panel-expand button sits centred beneath the mark, in the space the workspace block occupies when expanded, so the first destination holds the same vertical position in both states. Branding is never a toggle: clicking the logo does not collapse navigation.
- Add `sidebar-collapse` and `sidebar-expand` icons.
- Add `brand` and `brandMark` to `DashboardSidebar` and `DashboardShell`, so a product can show its own wordmark inside the Convert system. `brand` replaces the logo in the expanded sidebar; `brandMark` replaces the mark in the collapsed rail and the mobile bar, where a wordmark does not fit. Both fall back to Convert's own.
- Add `pnpm registry:check` and `pnpm registry:sync`, guarding the shadcn registry's copy of the token source, generator and responsive template against the canonical files. Wired into CI. The copy had already fallen six tokens behind (`colour.warning`, `text.warning`, `surface.warning`, `dropdown.hover`, `dropdown.selected`, `size.rail`) with a stale `surface.selected` description; it is now synced and its CSS regenerated.
- Add `.github/workflows/registry.yml`, publishing the registry to GitHub Pages on a version tag at an immutable `/r/v<version>/` path plus a `/r/latest/` alias, after verifying the tag matches `package.json` and that the token copy has not drifted. Requires GitHub Pages to be enabled on the repository, which the workflow deliberately does not do for you.

## 0.8.0 · 9 September 2026

Composition and navigation: the pieces needed to build a real dashboard out of the library rather than around it. Everything is additive except one `Progress` behaviour change, called out below. See [docs/release-0.8.md](docs/release-0.8.md).

0.7.0 was prepared but never tagged, so its changes ship here too. Its changelog section and [release notes](docs/release-0.7.md) are kept below as the record of what it covered.

- Add `Stack`, `Grid`, `SplitLayout` and `PageHeader` layout primitives. `Grid` takes `columns` (1 to 4) and `minItemWidth`; `SplitLayout` takes `ratio` (`primary`, `balanced`, `secondary`), with `primary` reproducing the original two-to-one split.
- Add `ContentList` and `ContentListItem`: a row composing a leading indicator, title, supporting content, trailing metadata and actions. The row is deliberately not a click target, so links and actions stay separate.
- Add `readOnly` to `RoadmapBoard` and `RoadmapCard`, hiding the stage and priority controls. Defaults to `false`, so existing consumers keep today's editing controls.
- Add collapsible sections to `DashboardSidebar`. `items` now accepts `SidebarEntry`, a union of the existing `SidebarItem` and a new `SidebarSection` holding child destinations. A flat `SidebarItem[]` is still valid and renders exactly as before. Sections are disclosures with `aria-expanded`, never links.
- Add `collapsible`, `collapsed`, `defaultCollapsed` and `onCollapsedChange` to `DashboardSidebar` and `DashboardShell`, giving an icon-only rail at the new `--cui-size-rail` width. Off by default. Structure follows Material Design 3's collapsed and expanded navigation rail; the appearance stays on Convert's tokens.
- Add a neutral dashboard composition example, an adoption guide and responsive layout regression checks.
- **Behaviour change:** `Progress` no longer clamps a value to `max`. A value above the maximum previously reported the same width and percentage as the maximum itself, so 142 of 100 and 100 of 100 were indistinguishable. The track now rescales, a marker shows where the maximum sits, and the percentage reads above 100. Values at or below the maximum are unchanged, including their ARIA values. Only inputs that previously produced a false reading behave differently.

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
