# Changelog

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
