# Active work and handoff

Last updated: 8 September 2026 (Claude checkpoint). Update this file at each meaningful checkpoint and before stopping or handing off. Record completed checks separately from pending checks. Read AGENTS.md and the linked release documentation before editing.

## User-approved objective

Prepare the next Convert Product UI release: official brand assets and logos; action menus, searchable single/multiple selection, date ranges, tooltips, toast feedback and breadcrumbs; scoped dark mode; Storybook guidance and examples; versioned installation/release documentation. Keep the library reusable, neutral and independent of the Brand Hub application. Use focused Git commits and review before releasing.

User called this the second release, but v0.1.0 and v0.2.0 already exist. The next version is 0.3.0. Do not reuse or move either existing tag. The package is set to 0.3.0 on the candidate branch; there is no v0.3.0 tag yet. Stable README clone instructions deliberately remain on v0.2.0 until release approval.

## Repository and branch

- Repository: https://github.com/tomrosscd/cd-product-ui
- Branch: feature/product-ui-0.3
- Starting commit: 061d4b4, clean main after Claude completed 0.2.0.
- All implementation is now committed in four focused commits (cdfa208 dark theme, 8f63d1d brand assets/logos, fda8d4a workspace controls, 520e6f1 documentation/validation), on top of 8ee7720 (this handoff file).
- Branch is pushed to `origin/feature/product-ui-0.3`. **No PR opened yet at this checkpoint** — see next steps.
- No release tag, registry publication or hosting change. Do not merge main or create v0.3.0 before the repository's release review.

## Implemented

- Dark overrides on the existing 92 tokens in tokens/tokens.json. Generator emits complete light/dark scopes and darkTokens; nested scopes resolve aliases correctly. Original palette tokens unchanged.
- ThemeProvider and useProductTheme; Storybook theme toolbar; theme-aware mobile sidebar and confirmation portals. New menu/tooltip portals also use theme context. Native `<input type="date">` carries `color-scheme` so its browser-drawn icon stays visible in dark mode (verified visually).
- ConvertLogo variants logo/straight/mark from original artwork. Existing ConvertMark preserved. Sidebar now uses official straight artwork.
- 80 original SVG/PNG/JPG files under assets/brand (verified: no Illustrator/font files slipped in, 4.7MB total), with filename/category/format/SHA256 manifest in src/brand-assets.ts. Storybook searchable download gallery (verified search filtering works) and packaging exports added.
- ActionMenu, Tooltip, ToastRegion, Breadcrumbs, SearchSelect and DateRange in workspace-controls.tsx with stories. SearchSelect deliberately uses a searchable native-choice disclosure, not an ARIA combobox. DateRange uses native date pickers. Application owns all data and persistence.
- docs/release-0.3.md explains API contracts, adoption and boundaries. README, changelog, catalogue, examples and AI guidance updated for the candidate.
- Added dark contrast tests and original-asset hash checks; packed-consumer checks extended to require new component and asset exports.
- docs/validation.md rewritten as a per-version history (0.1.0/0.2.0/0.3.0) with the actual 0.3.0 results below, replacing the stale 0.1.0-only content.

## Verification completed (all reconfirmed fresh by Claude, not just carried over from Codex's earlier run)

- `pnpm tokens:check`: 92 tokens verified, no drift.
- `pnpm type-check`, `pnpm lint`: clean.
- `pnpm test:unit`: 24/24 passed. `pnpm test:stories` (light): 134/134 passed. `pnpm test:dark`: 134/134 passed.
- `pnpm format:check`: clean.
- `pnpm package:check`: 214 package files verified, isolated consumer install + SSR render + Vite build passed.
- `pnpm next:check`: Next.js 16.3.4 App Router build passed.
- `pnpm check` (full chain including build + build-storybook): passed end-to-end on the final committed tree.
- Manual Storybook review (both themes, port 6008): brand asset gallery and search, dashboard dark mode (sidebar logo, cards, charts), ActionMenu keyboard interaction test (7 assertions, all pass — arrow keys, Enter, focus return), DateRange and SearchSelect at 390px mobile, DateRange dark-mode calendar icon visibility, ToastRegion trigger/dismiss. No visual bugs found (contrast with the 0.2.0 release, where manual review did catch a real CSS bug automated checks missed).
- Not separately re-verified by Claude: exhaustive pixel-level review of all 134 stories at every breakpoint. Automated a11y (axe, error-level) passed for all of them in both themes, which is the primary signal relied on here.

## Exact next steps

1. Open a pull request for `feature/product-ui-0.3` into `main` (branch is already pushed). Link this handoff and docs/release-0.3.md in the description.
2. Get the release actually reviewed (a person, not just automated checks) before any merge.
3. After approval: merge, then update README's stable install instructions to v0.3.0, tag the approved commit v0.3.0, rebuild the archive from that tag, and update docs/validation.md's 0.3.0 entry from "release candidate" to a dated release if anything changed during review.
4. Do not tag or merge before that approval, per the user's own instruction to Codex.

## Local preview and tools

Port 6006 previously served the website team's Storybook during Codex's session; that may no longer be true in a later session — check `lsof -i :6006` before assuming. Product UI preview during this checkpoint is on http://127.0.0.1:6008, started with `pnpm exec storybook dev -p 6008 --host 127.0.0.1 --no-open --disable-telemetry` (backgrounded, PID varies by session — check `ps aux | grep storybook` rather than assuming it's still running).

Pinned environment: Node 22.22.2 and pnpm 10.33.0. New pinned Radix packages: dropdown-menu 2.1.24, tooltip 1.2.16, toast 1.2.23.

## References and boundaries

- Original logo archive: /Users/tomross/Downloads/Convert_Logos_2024 (2) 2.zip. All variants are current per user. Raw downloads were copied unchanged and hashes recorded.
- Preserve original Koko reference projects, all versions including V8, and the website project byte for byte. No writes to them.
- Brand Hub planning is in the sibling convert-brand-hub repository. Latest planning commit c769b4f at last check. No Brand Hub application build is authorised in this task.
- Brand Hub phase 1: local guide/assets/stack creator, one colour for the whole stack. Phase 2: Google sign-in, invitations, gated downloads and saved presets. Phase 3: stack image masks and supplied tagline lockup. Ignore PDF Google Templates section.
- Brand serif Denton x Condensed is never used in Product UI; Roobert with Geist fallback remains the UI font. Marketing Google alternatives do not replace UI fallback.
- The Brand Hub will be the real internal-tool example. Do not add authentication, databases or a duplicate full admin application to Product UI.
- No sub-agents unless the user asks. No unsolicited remote publishing or licence/font distribution changes.
