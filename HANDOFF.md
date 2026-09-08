# Active work and handoff

Last updated: 8 September 2026. Update this file at each meaningful checkpoint and before stopping or handing off. Read AGENTS.md and the linked release documentation before editing.

## Current state

**0.4.0 is prepared and verified on branch `feature/product-ui-0.4`, not yet pushed/PR'd/tagged.** This is a deliberate breaking release (see docs/release-0.4.md) done now while there's exactly one known consumer (CONSUMERS.md), so it costs that consumer one migration instead of two.

## Repository and branch

- Repository: https://github.com/tomrosscd/cd-product-ui
- Branch: `feature/product-ui-0.4`, started from `main` at the merged/tagged 0.3.1 checkpoint.
- Six commits: (1) api-extractor setup with the 0.3.1 baseline, (2) non-breaking internal consolidation (ChoiceOption, Button forwardRef, Skeleton/aria reuse), (3) a correction commit for an overclaim in commit 2's message, (4) the actual `title`→`heading`/`pending`→`loading` rename across 7 components, (5) a RoadmapCard heading-level fix, (6) version bump + migration docs + roadmap update.
- Not yet pushed to origin, no PR opened, no tag created.

## Exact next steps

1. Push `feature/product-ui-0.4` to origin and open a PR into `main`.
2. Watch CI, including the new `pnpm api:check` step running on GitHub Actions for the first time (it's only been run locally so far, same caution as 0.3.1's CI=true lesson).
3. Get it reviewed before merging.
4. After approval: merge, tag `v0.4.0`, rebuild the archive.
5. Tell the coworker on CONSUMERS.md about the rename before/as they upgrade — that's the entire point of doing this now rather than later. Update their row once they've upgraded.

## What NOT to do next

Don't start on ROADMAP.md's remaining items (new components, i18n, further accessibility follow-ups, the loading-animation research in section 6) without the user asking — all deliberately deferred, not forgotten. Section 6 is planning only; no animation library has been added to the project.

## References and boundaries

- Original Convert logo archive: /Users/tomross/Downloads/Convert_Logos_2024 (2) 2.zip. Raw downloads copied unchanged into assets/brand with SHA256 hashes recorded in src/brand-assets.ts.
- Preserve original Koko reference projects, all versions including V8, and the website project byte for byte. No writes to them.
- Brand Hub planning is in the sibling convert-brand-hub repository (latest planning commit c769b4f at last check). No Brand Hub application build is authorised from this repository.
- Brand serif Denton x Condensed is never used in Product UI; Roobert with Geist fallback remains the UI font.
- The Brand Hub will be the real internal-tool example. Do not add authentication, databases or a duplicate full admin application to Product UI.
- No sub-agents unless the user asks. No unsolicited remote publishing or licence/font distribution changes.
- One coworker's project depends on this package (see CONSUMERS.md) — check it and docs/release-process.md#backward-compatibility before shipping anything breaking.
