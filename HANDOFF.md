# Active work and handoff

Last updated: 8 September 2026. Update this file at each meaningful checkpoint and before stopping or handing off. Record completed checks separately from pending checks. Read AGENTS.md and the linked release documentation before editing.

## Current state

No active work in progress. Convert Product UI 0.3.0 shipped: merged to `main` (commit 439b642) and tagged `v0.3.0`. `feature/product-ui-0.3` and `feature/product-ui-expansion` remain on GitHub as historical branches; neither has unmerged work.

Released versions: v0.1.0 (foundations, Card/Select/DashboardSidebar), v0.2.0 (forms, badges, tables, charts, roadmap board, sign-in, card compositions), v0.3.0 (dark theme, official brand assets/logos, ActionMenu/Tooltip/ToastRegion/Breadcrumbs/SearchSelect/DateRange). See CHANGELOG.md for details and docs/validation.md for what was checked at each release.

When starting the next release cycle: update "User-approved objective" and "Repository and branch" below with the new scope and branch name, and follow docs/release-process.md.

## References and boundaries

- Original Convert logo archive: /Users/tomross/Downloads/Convert_Logos_2024 (2) 2.zip. Raw downloads were copied unchanged into assets/brand with SHA256 hashes recorded in src/brand-assets.ts.
- Preserve original Koko reference projects, all versions including V8, and the website project byte for byte. No writes to them.
- Brand Hub planning is in the sibling convert-brand-hub repository (latest planning commit c769b4f at last check). No Brand Hub application build is authorised from this repository. Brand Hub phase 1: local guide/assets/stack creator, one colour for the whole stack. Phase 2: Google sign-in, invitations, gated downloads and saved presets. Phase 3: stack image masks and supplied tagline lockup.
- Brand serif Denton x Condensed is never used in Product UI; Roobert with Geist fallback remains the UI font.
- The Brand Hub will be the real internal-tool example. Do not add authentication, databases or a duplicate full admin application to Product UI.
- No sub-agents unless the user asks. No unsolicited remote publishing or licence/font distribution changes.
