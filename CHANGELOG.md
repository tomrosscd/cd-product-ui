# Changelog

## 0.2.0 · Unreleased candidate

- Forms: Input, PasswordInput, Textarea, Field, Checkbox, RadioGroup and Switch.
- Badge, TextLink, Tabs, Disclosure, ConfirmationDialog, Alert, EmptyState, Spinner and Skeleton.
- KeyValueList, Avatar, ResourceList and ActivityList.
- Metric/MetricCard, Progress/AllocationBar, Table and sortable, searchable, paginated DataTable.
- Optional Recharts v3 charts entry: line, area, bar, stacked bar, donut and sparkline, plus composable chart container, tooltip and legend.
- Seven chart tokens, using existing Convert colours. Charts include summaries, keyboard tooltips and expandable exact values.
- Controlled roadmap board/cards, sign-in presentation and summary/details/progress/action card compositions.
- Dashboard rebuilt with exported metrics, tables, progress and charts. Neutral roadmap and sign-in examples.
- Expanded interaction and accessibility checks, core/chart package consumers and a Next.js build fixture.

Migration: existing 0.1.0 component imports remain valid. Chart users install the optional Recharts/react-is peers and import from `@convert/product-ui/charts`. Prefixes and the approved palette remain unchanged. This candidate is not yet tagged or merged into main. Authentication and persistence remain application responsibilities.

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
