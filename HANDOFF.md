# Active work and handoff

Last updated: 8 September 2026. Update this file at each meaningful checkpoint and before stopping or handing off. Record completed checks separately from pending checks. Read AGENTS.md and the linked release documentation before editing.

## User-approved objective

Prepare the next Convert Product UI release: official brand assets and logos; action menus, searchable single/multiple selection, date ranges, tooltips, toast feedback and breadcrumbs; scoped dark mode; Storybook guidance and examples; versioned installation/release documentation. Keep the library reusable, neutral and independent of the Brand Hub application. Use focused Git commits and review before releasing.

User called this the second release, but v0.1.0 and v0.2.0 already exist. We explained that the next version is 0.3.0. Do not reuse or move either existing tag. The package is set to 0.3.0 on the candidate branch; there is no v0.3.0 tag yet. Stable README clone instructions deliberately remain on v0.2.0 until release approval.

## Repository and branch

- Repository: https://github.com/tomrosscd/cd-product-ui
- Branch: feature/product-ui-0.3
- Starting commit: 061d4b4, clean main after Claude completed 0.2.0.
- At this checkpoint implementation changes are in the working tree, not yet committed. Preserve them and check Git before continuing.
- No PR or remote push for this branch yet. No release tag, registry publication or hosting change.

## Implemented

- Dark overrides on the existing 92 tokens in tokens/tokens.json. Generator emits complete light/dark scopes and darkTokens; nested scopes resolve aliases correctly. Original palette tokens unchanged.
- ThemeProvider and useProductTheme; Storybook theme toolbar; theme-aware mobile sidebar and confirmation portals. New menu/tooltip portals also use theme context.
- ConvertLogo variants logo/straight/mark from original artwork. Existing ConvertMark preserved. Sidebar now uses official straight artwork.
- 80 original SVG/PNG/JPG files under assets/brand, with filename/category/format/SHA256 manifest in src/brand-assets.ts. Illustrator and fonts excluded. Storybook searchable download gallery and packaging exports added.
- ActionMenu, Tooltip, ToastRegion, Breadcrumbs, SearchSelect and DateRange in workspace-controls.tsx with stories. SearchSelect deliberately uses a searchable native-choice disclosure, not an ARIA combobox. DateRange uses native date pickers. Application owns all data and persistence.
- docs/release-0.3.md explains API contracts, adoption and boundaries. README, changelog, catalogue, examples and AI guidance updated for the candidate.
- Added dark contrast tests and original-asset hash checks; packed-consumer checks extended to require new component and asset exports.

## Verification completed so far

- Type checking and ESLint passed before the latest documentation/packaging additions.
- 23 unit/token tests passed before the additional brand-assets test was added.
- All 134 Storybook tests passed in Chromium with light default.
- All 134 Storybook tests passed with VITE_CUI_THEME=dark. Theme stories also explicitly cover dark portal inheritance, Escape and focus return.
- Manual dark chart/card/form review and 390px searchable-selection review passed visually.
- Logs: /tmp/cui-unit.log, /tmp/cui-stories-light.log, /tmp/cui-stories-dark.log.

## In progress at checkpoint

Full `pnpm check` is running, with output in /tmp/cui-check-final.log. Do not assume it passed: inspect its completion or rerun if the process is gone. It covers token drift, type/lint, unit/browser tests, package build and static Storybook build.

## Exact next steps

1. Inspect full-check outcome, fix any failures and rerun affected checks.
2. Finish manual review: desktop dashboard/logo, 390px dates and mobile sidebar, brand previews/downloads. Check dark and light, long content, overflow and keyboard paths.
3. Run pnpm format:check, pnpm package:check and pnpm next:check. Run test:dark again only if relevant implementation changes warrant it. Package/Next checks require network access and temp consumer installs.
4. Update docs/validation.md with actual 0.3.0 results; it still describes initial 0.1.0 validation. Update this handoff with final results and limitations.
5. Make focused commits for foundations/branding, shared controls and release documentation as feasible. Keep commits coherent if files overlap. Review diff and package contents.
6. Push feature branch and open a reviewed PR. Do not merge main or create v0.3.0 before the repository's release review. After approval, update stable installation examples, tag the approved commit and build the final archive. User has authorised GitHub work and proper Git process.

## Local preview and tools

Port 6006 currently serves the website team's Storybook. Leave it untouched. Product UI preview is on http://127.0.0.1:6008, started with `pnpm exec storybook dev -p 6008 --host 127.0.0.1 --no-open --disable-telemetry`. Log: /tmp/cui-storybook-6008.log. Restart this command if needed. Browser pages can be stale after a tool/session switch.

Pinned environment: Node 22.22.2 and pnpm 10.33.0. Existing node_modules uses /Users/tomross/Library/pnpm/store. For dependency changes use that store path instead of globally changing pnpm settings. New pinned Radix packages: dropdown-menu 2.1.24, tooltip 1.2.16, toast 1.2.23. Local browser servers and network installs needed escalated execution in Codex's sandbox; this is an environment constraint, not a test failure.

## References and boundaries

- Original logo archive: /Users/tomross/Downloads/Convert_Logos_2024 (2) 2.zip. All variants are current per user. Raw downloads were copied unchanged and hashes recorded.
- Preserve original Koko reference projects, all versions including V8, and the website project byte for byte. No writes to them.
- Brand Hub planning is in the sibling convert-brand-hub repository. Latest planning commit c769b4f. No Brand Hub application build is authorised in this task.
- Brand Hub phase 1: local guide/assets/stack creator, one colour for the whole stack. Phase 2: Google sign-in, invitations, gated downloads and saved presets. Phase 3: stack image masks and supplied tagline lockup. Ignore PDF Google Templates section.
- Brand serif Denton x Condensed is never used in Product UI; Roobert with Geist fallback remains the UI font. Marketing Google alternatives do not replace UI fallback.
- The Brand Hub will be the real internal-tool example. Do not add authentication, databases or a duplicate full admin application to Product UI.
- No sub-agents unless the user asks. No unsolicited remote publishing or licence/font distribution changes.
