# Release 0.10.0

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
