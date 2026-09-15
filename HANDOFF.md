# FormSection and Grid equal-height work (15 September 2026, in progress)

The user reviewed cd_capacity screenshots beyond the list pages covered by 0.11.1: the New Project wizard, Settings, Change Requests, Capacity Forecasting, the Allocation pool toolbar and the dashboard KPI row. Authorised building the library-side fixes now, on branch `feat/form-section-grid-align`, and folding them into a release later rather than immediately — do not tag or publish until asked.

**Shipped on the branch, locally verified:**
- New `FormSection` component (`src/components/primitives/form-section.tsx`) — an eyebrow heading with a rule beneath it, for grouping fields or read-only values in a longer form or record-review layout. Deliberately does not lay out its children; consumers compose `Grid`/`Stack` inside. Addresses the New Project wizard's "IDENTITY"/"TEAM"/"SKILLS NEEDED" sections and Change Requests' review-field groups, both of which cd_capacity currently hand-rolls with bespoke CSS.
- `Grid`'s new `align` prop (`'start'` default, `'stretch'` opt-in) — `.cui-layout-grid` previously hardcoded `align-items: start`, so a row of otherwise-equal cards (the dashboard's Active projects / Launching / Avg utilisation / Open risks row) visibly mismatched height whenever one card's text wrapped an extra line. `align="stretch"` fixes it without changing the default for unrelated-card grids.
- `pnpm type-check`, `pnpm lint`, `pnpm format:check`, `pnpm test` (310/310), `pnpm build`, `pnpm css:check` (updated, additive-only: 3 new classes) and `pnpm api:check` (updated, additive-only: new `FormSection` export, new optional `Grid.align` prop) all pass. Verified visually in Storybook (`FormSection/Multiple Sections` and `Foundations/Layout/Stretched Row`) in light theme; dark theme and the full `pnpm check`/packed-consumer/release pipeline have not been run yet — do that before any tag.

**Diagnosed but not yet built — app-side gaps in cd_capacity, not library bugs (keep cd_capacity read-only; this is reference only):**
- `components/shared/PageHeader.tsx` and most page bodies (Settings, Change Requests) don't wrap in `Stack`, so the gap between the header and the next block is inconsistent page to page (zero on Settings, a manual `mb-5`/`space-y-*` guess elsewhere).
- Settings (`app/(dashboard)/settings/page.tsx`) uses a local shadcn-style `@/components/ui/card`, not cui's `Card`.
- `components/settings/ChangeRequestsView.tsx` is fully hand-rolled: raw filter-tab buttons (cui has `Tabs`/`SegmentedControl`), a hand-built status badge (cui has `Badge`), raw uppercase field-label pairs (now exactly what `FormSection` is for), a plain `<div className="card p-6">` instead of `Card`.
- `components/forecasting/ForecastingPage.tsx`'s Actuals/What-if/Demand switcher is a hand-rolled underlined button row; cui's `Tabs` (Radix-backed) already does this.
- `components/grid/LeadAllocationGrid.tsx`'s toolbar (pool label, week range, project filter, view/skill/platform controls, Today/Refresh/Sync/Book actions) is a raw flex-wrap div, not `FilterToolbar` — it has the same labelled-select-breaks-row-alignment problem 0.11.1 fixed for list pages, just on a screen that was never migrated to the shared toolbar.

None of the above needs a new library API — they're existing components (`Tabs`, `Badge`, `Card`, `FilterToolbar`, `Stack`) that the relevant cd_capacity screens simply never adopted. Once `FormSection` ships, the natural next step is a second Claude Code adoption prompt (same shape as `docs/claude-code-adoption-prompt.md`) covering these five screens.

**Also added to the branch: `DashboardSidebar` fix.** Confirmed real bug, not app misuse: `.cui-nav-section-nested`'s shrink rule only ever targeted a nested section's own trigger and its children, never a plain leaf sibling in the same list (cd_capacity's `Allocation` section holds nested `FE`/`BE` subgroups alongside plain `Solution Architects`/`Business Analysts`/`Design`/`QA`/`PM` leaves at the identical indent — exactly the shape the component's own `DeeplyNestedSections` story already modelled with `QA`, just never asserted `QA`'s size). Fixed with a `:has()` selector (already an established pattern elsewhere in this codebase); extended the existing story's test to assert `QA` too. No cd_capacity app change needed for this one — it resolves on the next package upgrade, since `AppSidebar.tsx`'s nav data is already structured correctly.

**Second diagnosis pass, 15 September 2026 — Retainer Capacity and per-department Allocation pages.** Re-synced the read-only cd_capacity clone (`030064c`, unchanged since the last check — nothing newer pushed). Read `components/retainer/RetainerCapacityView.tsx` and `app/(dashboard)/allocations/[pool]/page.tsx` + `components/grid/LeadAllocationGrid.tsx` in full.

- Retainer Capacity's three summary sections (Pool Summary, Available Capacity by Week, Per-Client Burndown) are hand-rolled `<table>`s with hand-copied `text-xs font-bold uppercase tracking-widest` headings — i.e. consumers had already independently invented almost exactly `FormSection`'s heading treatment. All three fit `DataTable` as-is today: numeric alignment and footer totals already exist (Per-Client Burndown), and the colour-coded "Available Capacity by Week" grid is a plain pool-by-week table (rows × week columns), not a matrix/heatmap component — a `cell` render function already covers a coloured value cell. **No new DataTable capability needed for this page.**
- "Convert FE Devs Assignments" (`RetainerAllocationGrid`) and the per-department Allocation grids (`LeadAllocationGrid`/`DevAllocationGrid`) are genuinely different: click-and-drag booking with cell editing, not a read-only presentation table. The user correctly caught this — these should stay custom, not be pushed onto `DataTable` or the (still unbuilt) read-only heatmap/Gantt roadmap items, which are explicitly scoped read-only. Do not attempt to replace them.
- The per-department Allocation page's toolbar (pool label, week range, project filter, view/skill/platform controls, Today/Refresh/Sync/Book) is a raw flex-wrap div, not `FilterToolbar` — same diagnosis as before, still unaddressed. The "Sufficiency — [Pool]" table at the bottom of each page is plain read-only tabular data (Project/Pool est./Allocated/Gap/Window/RAG) and fits `DataTable` directly, same RAG-marker pattern already proven on `ProjectTable`.
- Conclusion: none of this needs new library work beyond what's already on this branch (`FormSection`, `Grid.align`, the sidebar fix). It's entirely an application adoption pass. A second Claude Code prompt for cd_capacity was given to the user directly in chat, covering: Retainer Capacity's three tables + FE Devs Assignments section heading, the Allocation toolbar migration to `FilterToolbar`, and the Sufficiency table — conditioned on installing the next package release (not yet tagged).

---

# List-page consistency patch 0.11.1

The user authorised shared fixes, a new release and improved Claude Code adoption guidance on 15 September 2026. Work is on `fix/list-page-consistency`. Header actions now centre; FilterToolbar has a bounded search/action row and separate wrapping filters. New canonical Projects, Retainers, Clients and narrow stories exercise the composition. docs/list-pages.md and docs/claude-code-adoption-prompt.md specify application migration and verification.

Local validation passed: pnpm check (306 tests), 246 dark stories, coverage, API/CSS contracts, formatting, catalogue/release metadata, registry drift, packed React/Vite consumption (324 files), Next.js 16/pnpm and independent Next.js 15/npm/Tailwind 4 plus Tailwind 3 processing. Packed browser checks assert equal 32px desktop and 48px mobile buttons, readable contrast, bounded search, header alignment and no document overflow. All three canonical examples were reviewed at 1440px/390px, including menu Escape/focus return and final pagination page. See docs/audits/2026-09-15-list-pages.md. GitHub PR/CI, merge and tagged publication remain. Keep cd_capacity read-only; the application owner runs its migration. The user has authorised this library release, including the necessary release workflow. Do not claim authenticated consumer validation or independent human review.

---

# Release 0.11.0

Work is on `release/0.11.0`, based on merged PRs [#38](https://github.com/tomrosscd/cd-product-ui/pull/38) and [#39](https://github.com/tomrosscd/cd-product-ui/pull/39). The release adds optional comfortable sidebar typography, corrects nested navigation hierarchy, and fixes adopted filter-toolbar layout, button-styled link presentation and sortable-header spacing. It also includes the public-safe hosted Storybook work merged after 0.10.0.

The user approved merging, preparing, verifying and tagging 0.11.0 on 14 September 2026. Package metadata, installation guidance, examples, validation guidance, changelog, release notes and completed roadmap entries now target 0.11.0.

Local release validation passed on the combined branch: formatting, catalogue, release metadata and registry drift; API and CSS contracts; 302 light tests; 242 dark stories; build and static Storybook; a 322-file packed React/Vite consumer; Next.js 16/pnpm; and independent Next.js 15/npm/Tailwind 4 plus Tailwind 3 CSS compatibility. The ErrorBoundary stories intentionally log their caught failure while passing. Open the release PR, require green GitHub CI, merge it, then tag the exact merged commit as `v0.11.0`. The tag workflow publishes the immutable archive and checksum.

Keep `cd_capacity` read-only. Its owner controls installation, lockfile reconciliation and authenticated verification.

---

# Hosted Storybook

The user authorised public Storybook hosting on GitHub Pages on 14 September 2026. Work is on `feat/host-storybook-pages`, based on the released `main` commit `0f1567f`.

[PR #36](https://github.com/tomrosscd/cd-product-ui/pull/36) adds `.github/workflows/pages.yml`. It waits for the existing CI workflow to succeed on `main`, runs `pnpm build-storybook:public`, uploads `storybook-static` and deploys it through the `github-pages` environment. A manual trigger is also available for recovery. GitHub Pages must use GitHub Actions as its publishing source. The expected URL is <https://tomrosscd.github.io/cd-product-ui/>.

README and release guidance now distinguish the hosted catalogue from release-archive distribution. The hosted catalogue follows current `main`; fixed package versions remain on GitHub Releases. The public build excludes licensed local fonts and clears stale output before building.

Local validation passed: documentation and release metadata checks, repository formatting, the public Storybook build, and a browser load from the production-style `/cd-product-ui/` subpath. The welcome page rendered with no unexpected failed requests. The generated font files are Storybook's bundled Nunito interface assets; no Roobert or Geist binaries were included. PR #36's complete GitHub CI suite passed before merge.

## Previous release: 0.10.0

The user authorised the release on 11 September 2026, including the merge and tagged archive. Work is on `feature/adoption-quality`, based on `78dd64e16d2aa7ae7e106687e11cb18bcc46ea04`. GitHub main matched this base during readiness checks.

## Scope and validation

The release includes the adoption audit fixes, controlled DataTable state, FileUpload, Wizard, workflow guards and the user-reviewed pagination and select refinements. Larger roadmap features remain deferred. Use the supplied tech-doc-style skill for documentation.

Full local readiness checks passed after the visual fixes: 59 unit tests, 231 light stories, 231 dark stories, coverage, types, lint, formatting, API/CSS contracts, catalogue, registry drift and static Storybook. Independent Vite, Next.js 16/pnpm, Next.js 15/npm/Tailwind 4 and Tailwind 3 CSS checks passed. Stable 0.10.0 metadata and packed-archive checks also passed before pushing. The PR and tag workflows gate the release on their exact commits.

The release version, installation guidance and migration notes target 0.10.0. [PR #35](https://github.com/tomrosscd/cd-product-ui/pull/35) records the source changes, review evidence and CI results. [The v0.10.0 release](https://github.com/tomrosscd/cd-product-ui/releases/tag/v0.10.0) is the destination for the archive and checksum once the tag workflow completes. Review [the release notes](docs/release-0.10.md), [implementation record](docs/audits/2026-09-10-implementation.md) and [audit](docs/audits/2026-09-10-adoption-audit.md). Dated candidate evidence is historical and keeps its original version identifiers.

## Local previews

Storybook runs at `http://127.0.0.1:6008/`. Synthetic dashboard, projects and capacity demos run at `http://127.0.0.1:3217/demo/dashboard` from `/private/tmp/cui-audit-20260910-fixture`. The demo uses the visual-review candidate in `artifacts/visual-2026-09-11/`; it is not an installed consumer upgrade. Local servers may need restarting after their sessions end.

The fully checked candidate archive is preserved in `artifacts/readiness-2026-09-11/`. Stable package checks write their exact archive path and checksum to `artifacts/package-check.json`. Never replace earlier archives or tags.

## Boundaries

Keep `cd_capacity` read-only. No installs, builds, tests, file changes, messages or external writes there. Its owner must reconcile the application lockfile and review the upgrade notes before adoption. No consumer upgrade is implied by this library release.

The user has approved the release scope and visual changes. Do not claim independent reviewer approval unless GitHub records it. Use the linked PR and release for the authoritative merge and publication status. Local post-publication verification is recorded in the ignored `artifacts/release-0.10.0-verification.json` when complete.

The [historical handoff](docs/history/handoff-2026-09-10.md) retains earlier checkpoints.
