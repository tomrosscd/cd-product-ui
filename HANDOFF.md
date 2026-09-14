# Sidebar navigation density, issue #37

Work is on `feat/sidebar-density`, based on `fcb19a4` (hosted Storybook merged). The user asked to review issue #37 and implement it if appropriate. The request is a reusable adoption gap: navigation typography has no supported variant.

Add `density="compact" | "comfortable"` to DashboardSidebar, inherited by DashboardShell. Compact preserves existing CSS. Comfortable uses existing body (16px) and semibold (600) tokens, with compact (14px) nested section headings. This deliberately reuses the approved scale rather than adding a 15px value for one consumer. Keep row spacing and line height, icon size, routing, rail state and portal behaviour unchanged. Scope the CSS class to the nav inside shared contents so the mobile portal receives it too.

Implementation and local validation are complete. The [review record](docs/audits/2026-09-14-sidebar-density.md) includes the API decision, before/after screenshots and checks. Passed: 60 unit tests, 237 light stories, 237 dark stories, coverage, build, types, lint, formatting, API/CSS contracts, registry drift, catalogue/release metadata, packed Vite consumer, Next.js and npm/Tailwind compatibility. Dedicated browser checks passed for desktop/mobile themes, keyboard focus, long labels, rail expansion and both exported components using the installed archive's CSS. An initial existing inline-edit focus test failed transiently; the unchanged rerun and coverage run passed.

Next: push this focused branch and open its PR for review, then inspect GitHub CI. Keep main and release tags unchanged until the PR is reviewed. The new prop is not in a released archive; do not distribute the local 0.10.0 validation archive as a release. Do not change or contact the consumer application.

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
