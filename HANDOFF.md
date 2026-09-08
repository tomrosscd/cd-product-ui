# Active work and handoff

Last updated: 8 September 2026. Update this file at each meaningful checkpoint and before stopping or handing off. Read AGENTS.md and the linked release documentation before editing.

## Current state

Branch `feature/product-ui-0.5-controls`, based on main `ac4367b`. Pass 1 of the consolidated ROADMAP.md sequence is implemented, committed and pushed, targeting 0.5.0. A Codex session did the original implementation but ran out of usage mid-way with everything uncommitted; a fresh Claude session (8 September 2026) independently re-verified all of it from scratch — none of Codex's own `/tmp/cui-pass-*.log` claims were trusted — then committed, pushed and opened the PR. No merge or tag is authorised; that is the user's call.

Previous release checkpoint: `v0.4.0` is merged to `main` and tagged. It was a breaking release (see `docs/release-0.4.md`): `title` → `heading` on Alert/EmptyState/Disclosure/ConfirmationDialog/DataChart/RoadmapBoard/SignInForm, and `SignInForm.pending` → `loading`. It also added an enforced public API check (`pnpm api:check`/`api:update`, backed by `etc/*.api.md`, wired into CI) — read `docs/release-process.md#backward-compatibility` before shipping anything that renames or removes a public export, prop, or CSS class.

## Current pass and next steps

Implemented (commits `b883105`, `87fb912` on top of the planning commit `141baea`): opt-in `Table`/`DataTable` `layout`/`tableLayout: 'scroll'` with `minWidth`, and `pagination: 'full'`; standalone controlled `Pagination`; Radix-backed `StyledSelect` (used internally by `Pagination` and the date pickers); `Calendar`/`DatePicker`/`MonthPicker` built on `react-day-picker` with DST-safe date parsing and draft/apply/cancel range editing. Existing native controls and legacy defaults are unchanged. `docs/release-0.5.md` documents the new contracts. The dashboard example adopts `tableLayout="scroll"`/`pagination="full"`. New pinned dependencies: `@radix-ui/react-select@2.3.7`, `@radix-ui/react-popover@1.1.23`, `react-day-picker@10.0.1`.

Verification (all run fresh on this branch's actual current state, not inferred from a prior session's logs): `pnpm type-check`, `pnpm lint`, `pnpm format:check` all clean; `pnpm test` 170/170 passing (29 files); `pnpm test:dark` 146/146 passing (25 files) — both runs emit a benign Radix `Presence` "not wrapped in act(...)" console warning from Select/Popover exit animations (confirmed absent on the pre-pass-1 baseline via `git stash -u`; it's test noise, not a failure, and every assertion still passes); `pnpm api:check` clean, no diff against the committed `etc/*.api.md` snapshot; `pnpm package:check` verified 240 package files against both the core and charts-enabled consumer fixtures; `pnpm next:check` built the Next.js fixture successfully. Manual review in Storybook (a temporary local instance on port 6100, since 6006 was held by an unrelated stale process from a different checkout — `.claude/launch.json` was not added to the repo): BrandedSelect and SelectStates confirmed correct in both light and dark themes (checkmark, disabled/grouped options, theme-aware portal); CombinedRange confirmed correct at desktop and mobile widths (single month on mobile vs two on desktop, disabled Apply on invalid range, correct final applied value); NarrowTable confirmed the readable/scrolling table layout and the container-query compact pagination fallback (`Page 2 of 2` text swaps in for the numbered buttons under ~560px).

Next: push is done; open/confirm the PR is up to date and ask the user to review. Do not merge or tag until the user approves. Later passes (items 2+ of the consolidated 30-item roadmap Codex negotiated with the user, e.g. combobox, chips, segmented controls, filter toolbar, currency/period inputs, advanced tables, Gantt/resource-timeline/capacity visualisations) are tracked in ROADMAP.md — read its "Approved delivery order" section before picking up the next pass.

## What NOT to do

- Don't start the ROADMAP.md item 3 (i18n) casually — it's flagged as a deliberate architectural decision, not a quick addition.
- Don't add Chromatic/visual regression tooling — deliberately deferred by the user's decision on 8 September 2026.
- Don't pull in an animation library (Framer Motion/`motion`, etc.) unless specifically asked — ROADMAP.md section 6 has a researched recommendation (a CSS-only branded loader using existing `ConvertLogo` geometry) that was explicitly chosen over adding a dependency.
- Don't touch the seven renamed props from 0.4.0 (`title`/`pending` are gone from Alert, EmptyState, Disclosure, ConfirmationDialog, DataChart, RoadmapBoard, SignInForm) — use `heading`/`loading`.

## References and boundaries

- Original Convert logo archive: /Users/tomross/Downloads/Convert_Logos_2024 (2) 2.zip. Raw downloads copied unchanged into assets/brand with SHA256 hashes recorded in src/brand-assets.ts.
- Preserve original Koko reference projects, all versions including V8, and the website project byte for byte. No writes to them.
- Brand Hub planning is in the sibling convert-brand-hub repository (latest planning commit c769b4f at last check). No Brand Hub application build is authorised from this repository.
- Brand serif Denton x Condensed is never used in Product UI; Roobert with Geist fallback remains the UI font.
- The Brand Hub will be the real internal-tool example. Do not add authentication, databases or a duplicate full admin application to Product UI.
- No sub-agents unless the user asks. No unsolicited remote publishing or licence/font distribution changes.
- One coworker's project depends on this package (see CONSUMERS.md) — irrelevant for purely additive component work, but check it before ever renaming/removing anything public again.
- Dependabot has open PRs (#3–6 as of this writing) bumping GitHub Actions versions — review each against docs/release-process.md before merging, per AGENTS.md; don't auto-merge them.
