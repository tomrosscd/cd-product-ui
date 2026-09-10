# Active work and handoff

Last updated: 10 September 2026 (post-0.9.0, second round: four more PRs open, none tagged yet). Update this file at each meaningful checkpoint and before stopping or handing off. Read AGENTS.md and the linked release documentation before editing.

## Current release: v0.9.0 on `main`. See PR status below

`main` is at `v0.9.0` ("tables that carry real data" — see `docs/release-0.9.md`) plus PRs #22/#23/#25/#26/#27 already merged on top of it (nested sidebar sections, Button variants/sizes, Stepper, NotificationCentre, a HANDOFF checkpoint) — none of that has been tagged/released yet. PRs #12, #16–#21 are all merged and released as part of v0.9.0; treat `main`/`CHANGELOG.md`/git log as the source of truth for released work, not this file's older sections below (kept for history). **`CHANGELOG.md` has no entry yet for the post-0.9.0 work on `main`** — write one before the next tag.

The first real external consumer, **Sebastian's `cd_capacity` app (Planwerk)**, continues to drive this work. This round used a **fresh** read-only clone (never pushed to, per standing instruction — push URL disabled immediately after cloning) rather than the earlier scratchpad one, confirmed no new upstream commits, and installed a package built fresh from `main` HEAD (`pnpm pack`, not a tagged release, since none exists yet for this work) — clean install, clean `next build` across all 60 routes, 104/104 app tests passing. No blockers.

**PR status this round (all four CI-green, none merged yet — #28 and #30 are blocked, see below):**

1. **[PR #28](https://github.com/tomrosscd/cd-product-ui/pull/28)** (`feature/drawer`) — **open, CI-green, blocked on merge** (see below). `Drawer`: a right-side slide-out panel, justified by the consumer's `GanttProjectRow.tsx` (a ~110-line hand-rolled shadcn `Sheet` for a project-details panel). ROADMAP.md #13.
2. **[PR #29](https://github.com/tomrosscd/cd-product-ui/pull/29)** (`feature/column-config-panel`) — open, CI-green, **stacked on `feature/drawer`, not `main`** (built on top of `Drawer`) — retarget to `main` once #28 merges. `ColumnConfigPanel`: show/hide/reorder/reset table columns with locked and admin-only columns, justified by the consumer's 188-line `ColumnConfigPanel.tsx`. Deliberately improves on the original: resetting to defaults keeps every optional column reachable (only which are _checked_ resets), instead of dropping a manually re-added column out of the list entirely. ROADMAP.md #11.
3. **[PR #30](https://github.com/tomrosscd/cd-product-ui/pull/30)** (`feature/inline-edit`) — **open, CI-green, blocked on merge** (see below). `InlineEdit`: click-to-edit shell for a table cell, with the actual control (select/textarea/date input/...) supplied via a render-prop child. Justified by three separate hand-rolled fields in the consumer (`InlineSelect.tsx`/`InlineTextarea.tsx`/`InlineDatePicker.tsx`) that all follow the identical shape. ROADMAP.md #14.
4. **[PR #31](https://github.com/tomrosscd/cd-product-ui/pull/31)** (`feature/sidebar-item-badge`) — open, CI-green. Adds `SidebarItem.badge`. Found while auditing the consumer's **app-wide** sidebar (`AppSidebar.tsx`, wired into their real root layout — distinct from the Dashboard-page pilot) for a `DashboardSidebar` migration: everything else it needs (`brand`/`brandMark`, `footer`, `collapsible` icon rail, unlimited nesting) already exists; this badge was the one real gap. See "AppSidebar migration" below — the migration itself is not this PR, and is not this library's to do.

**Merge is blocked on PRs #25/#26/#28/#30 by the Claude Code auto-mode permission classifier** (`gh pr merge` denied outright, no explanation beyond "Blocked by classifier"). This is a recurring block, not a one-off — every `gh pr merge` attempt this project has hit it. Needs the user to merge directly, or grant a Bash permission rule for `gh pr merge` if they want it to stop recurring. Do not attempt to work around it. (#25/#26 were later merged by the user directly; #28/#30 are the same situation now.)

**A third undocumented local/CI gate found this round, on top of the two below: `pnpm format:check` (Prettier).** It is not part of `pnpm check` and was missed for all of PRs #28–#31 initially — PR #29 failed CI on it (a wrapped `useState` call Prettier wanted on one line) before being caught and fixed locally. `docs/release-process.md` step 2 already lists `format:check` alongside `check`/`test:dark`/`package:check`/`next:check` as required before pushing — this is a process-adherence miss, not a doc gap. Always run all five, not just `pnpm check`, before pushing a branch.

**Two more follow-up fixes needed after a first CI run, worth knowing about for next time (applies to any PR that adds a `.cui-*` class or touches tokens):**

- `etc/product-ui.css.md` is a CSS-class-surface snapshot (parallel to `api:check`'s API snapshot) — `pnpm css:update` regenerates it (`css:check` is part of CI's "Tokens, types, lint, unit/browser tests, build, CSS surface, static Storybook" job).
- `registry/tokens/tokens.json`/`tokens.css` are the shadcn registry pilot's own copy of canonical tokens, checked for drift by a dedicated CI job. Any token change needs `pnpm registry:sync` then manually regenerating `registry/tokens/tokens.css` (registry's own `generate-tokens.mjs`, then `pnpm exec prettier --write`) and committing both. `pnpm check` alone does not catch either gate — always also run `pnpm css:check` and `pnpm registry:check` before pushing.

## AppSidebar migration: a real gap closed, but the migration itself is the consumer's

The consumer has **two** sidebars: `DashboardSidebar` from this library, piloted on one Dashboard page, and their own local shadcn `Sidebar` (`components/ui/Sidebar.tsx`), still wired into the actual app-wide root layout (`app/(dashboard)/layout.tsx` → `AppSidebar.tsx`) with a real three-level nav tree (groups → collapsible items → FE/BE sub-groups → destinations) and a "Beta" badge on one item. Auditing `AppSidebar.tsx` against `DashboardSidebar`'s API found only one real gap (the badge, now PR #31) — `brand`/`brandMark` (header), `footer` (their user-avatar/role/sign-out block), `collapsible` (their icon rail), and unlimited section nesting (their FE/BE sub-groups) all already exist and match what `AppSidebar` needs.

**This does not mean migrate `AppSidebar.tsx` from here.** It's the consumer's own application code — role-based area gating (`hasArea`), Supabase sign-out, Next.js routing — correctly out of scope for this library per AGENTS.md, and the read-only clone used for this audit was never going to be pushed to regardless. The right next step is telling Sebastian the gap is closed and the migration looks newly viable, and letting him do it as his own PR when he has appetite — not attempting it here.

## Notification centre: a real Vitest browser-mode crash (PR #26)

`pnpm test` on `notification-centre.stories.tsx` was crashing the whole test file (`Inspector.targetCrashed` / "Browser connection was closed") rather than failing normally, every run. Root cause: the story's `play` function clicked a real `<a href="#allocations/solution-architect">` notification item to verify link items mark-read-and-close on click. In this repo's real-Chromium Vitest browser-mode harness specifically, following that link is an actual page navigation that tears down the test's own page mid-run. A live manual Storybook session doesn't show this (the panel just closes normally), which is why it's easy to miss.

**Fix, and a trap to avoid repeating:** don't call `event.preventDefault()` to stop the navigation — Radix's `Popover.Close` uses `composeEventHandlers` internally and skips its own close logic once `event.defaultPrevented` is already true, so `preventDefault()` silently breaks the very close behaviour under test. Instead, remove the anchor's `href` attribute immediately before the `userEvent.click` call — no href, nothing to navigate to, and Radix's close handler still runs normally. If any future story clicks a real navigating `<a>` in a `play` function, use this same pattern.

Also caught along the way: the Popover panel (`role="dialog"`) had no accessible name (`aria-dialog-name` axe violation) — fixed with `aria-label={label}` on `Popover.Content`. `.cui-notification-panel` is its own CSS class (not `.cui-popover`) because a real Radix Popover sizes itself with `--radix-popover-content-available-height`, not DropdownMenu's `--radix-dropdown-menu-content-available-height` — same gap Combobox's panel had against Select.

**Two roadmap items had real, verified justification from this same consumer** (Notification centre and Wizard/stepper, both above) — both are now built and in PRs #25/#26. No further roadmap items currently have the same standard of verified evidence; check the consumer's actual source before starting anything else off ROADMAP.md rather than reading it speculatively.

The GitHub Pages / shadcn-registry-hosting approach was tried and abandoned this session: two successful Actions deployments never actually took effect on the live site (stale content served despite the API reporting success — a genuine, unresolved platform issue, not a config mistake), and the user explicitly chose to drop it in favour of the GitHub Release `.tgz` install method, which is what the real consumer actually uses and what was verified working end-to-end. GitHub Pages has been disabled on the repository. The registry pilot's source files remain in the repo (registry hardening from PR #17 is still real, useful work), but hosting it is no longer the plan — don't resume that thread without the user raising it again.

## Historical: dashboard composition (branch `feature/dashboard-composition`, PR #12) — merged

Scope: token-spaced `Stack`/`Grid`/`SplitLayout`/`PageHeader`, flexible `ContentList` rows, explicit read-only roadmap, and a neutral dashboard exercising four metrics, a wide pipeline with supporting card, capacity and dense lists. Legacy layout helpers and editing defaults preserved. No Tailwind directives, no consumer business logic. The coworker's application source was unavailable, so this closes the library's composition gap and supplies an adoption recipe rather than an unverified patch to their app.

**Status: implemented by Codex, independently verified and pushed. Awaiting review.** Codex ran out of context mid-verification; the checks it could not confirm have since been run and passed.

### Verification, re-run rather than inherited

Every gate `.github/workflows/ci.yml` runs was executed fresh against commit `3370a12`, not carried over from Codex's logs:

- `format:check`, `check` (tokens, types, lint, tests, build, CSS surface, static Storybook), `api:check`, `css:check`, `test:dark` (186 stories, 43 files) all pass.
- **`package:check` and `next:check` are the two Codex left running and could not confirm.** Both pass: 279 package files including the new `docs/dashboard-composition.md`, and the Next.js App Router fixture builds from the packed archive.
- `test:coverage`: 213 tests, 92.39% statements / 86.51% branches / 92.43% functions / 93.08% lines, matching what Codex recorded.

### Independent review findings

- **Additive, confirmed by diffing both snapshots.** The API report has no removals. The CSS surface gained 17 classes (`cui-content-list-*`, `cui-layout-*`) with none removed; the only `-` line in that diff is the class-count header moving 207 to 224.
- **`RoadmapBoard`/`RoadmapCard` `readOnly` defaults to `false`**, so existing consumers keep the editing controls they have today. This is the additive shape the roadmap asked for.
- **Dark theme reviewed and measured, not eyeballed.** Badge text contrast across the new dashboard runs 8.48:1 to 14.37:1. No failure.
- **320px reflow re-verified independently**: `scrollWidth` equals the 320px viewport, zero elements crossing the boundary, clean single-column stack.
- Measured badge backgrounds sit at 1.00 to 1.22 against the card behind them, so the chip shape barely reads and only the text colour carries the state. That is the pre-existing issue already logged as item 5 below, not something this branch introduced.

### Known gaps in this branch

- Codex's commit message (`3370a12`) is a single line for a 939-line change, which is thinner than this repository's convention. The reasoning is in the PR description instead. The commit was left unamended so authorship stays accurate.
- Codex started a second Storybook on port 6020 and did not stop the earlier one on 6017. Both may still be running locally; neither affects the repository.

## Active: sidebar collapse control redesign (branch `feature/sidebar-brand-slot`, PR #16)

Open and green, not merged. Started as the consumer's four adoption findings, then took the user's collapse-control redesign brief.

**Fixed a defect the consumer did not report but would have hit.** A closed section still rendered its children and kept them in the tab sequence while reporting `aria-expanded="false"`: `.cui-nav-section-list` sets `display: flex` in a class rule, which outranks the user agent's `[hidden] { display: none }`. The unit test written with the feature asserted `hasAttribute('hidden')` and passed throughout, because jsdom applies no user-agent stylesheet. The regression test now lives in a story play function running in real Chromium, and was confirmed to fail without the fix.

**Collapse control redesign, to the user's brief.** Expanded: a quiet panel-collapse button on the trailing edge of the branding row; the old hamburger and "Collapse" row is gone. Collapsed: a panel-expand button centred beneath the mark, occupying the workspace block's space. Branding is never a toggle.

Measured in a real browser rather than eyeballed: the first destination sits at 192px in **both** states (drift 0, previously 32px), widths stay at the approved 208px and 64px tokens, the control is 47x48 so the pointer target clears 44px, it sits entirely inside the rail and is centred to within 1px. A play test pins the zero-drift invariant and was confirmed to fail (168 vs 192) when the alignment rule is removed.

Also added `brand`/`brandMark`, closing the last open part of navigation on ROADMAP.md, and `sidebar-collapse`/`sidebar-expand` icons.

**Consumer findings, resolved:** the brand slot and the section defect are fixed; collapse persistence was never a library gap and the adoption guide now shows the `collapsed`/`onCollapsedChange` wiring with code; two-level nesting remains a real limit, recorded on the roadmap with the note that a third level is worth questioning before building.

**Verified here, because the consumer's app is auth-gated and their agent has no browser:** full keyboard walk of the rail, closed sections absent from the tab order, both toggle directions, light and dark, and the mobile drawer at 320px with no horizontal overflow.

Checks: format:check, check, api:check, css:check, test:dark (192), package:check (285 files), next:check. Snapshots additive, nothing removed.

**Next on this branch:** finish the shadcn registry (the four prerequisites at item 6 below), which the user approved as the home for Planwerk-shaped components that are not yet proven generic.

## Start here: what to work on next

Read AGENTS.md first, then this section. `main` is at 0.7.0 with PR #10 and PR #11 merged. Nothing is tagged. Do not merge or tag without the user's explicit approval: that standing rule has not changed.

The library works and is internally consistent. What follows is ordered by what unblocks the first coworker actually using it, not by size.

### 1. Tag the release, then simplify the install (highest value, small)

`v0.7.0` is fully prepared: `package.json`, `CHANGELOG.md`, `docs/release-0.7.md` and the README version labels are all done, and every CI gate passes. Only steps 6 and 7 of `docs/release-process.md` remain, and both need the user.

`.github/workflows/release.yml` builds the archive on a `v*` tag and attaches it to the GitHub Release, after checking the tag matches `package.json`. It has never run, because no tag has been pushed since it landed. **Watch its first run.**

Once a tag produces a release asset, update the README's install section: it still documents clone, install, pack, copy, install. With an asset it collapses to a single `pnpm add <release asset URL>`. **Do not make that edit before the asset exists**, or the README documents a URL that 404s.

### 2. Fill in CONSUMERS.md (small, and it protects everything else)

Still entirely placeholder rows. It is the only mechanism protecting consumers from a breaking change: there is no telemetry and no registry download counts. `pnpm api:check` and `pnpm css:check` catch a breaking change mechanically, but only this file says who to warn. Add the coworker's project, contact and installed version the moment they install.

### 3. Read-only list and board patterns (implemented on the active branch, pending review)

The first external consumer needed these and got nothing usable, so they hand-composed `Card`, `Badge` and `TextLink` instead. Full context in ROADMAP.md section 2. In short: `ActivityList` and `ResourceList` take fixed, string-only shapes with no way to combine a leading indicator, a per-row action link and trailing metadata; `RoadmapBoard` forces an editable stage `Select` and priority `Checkbox` onto every card, which is wrong for a view nobody edits.

PR #12 supplies `ContentList`/`ContentListItem` and explicit `readOnly` props on `RoadmapBoard`/`RoadmapCard`, verified additive. Editing defaults are unchanged, so adopt `readOnly` explicitly. Read the checkpoint above before starting duplicate work.

### 4. Decide what to do about `assets/` (needs the user, not a coding decision)

`assets/` is 4.8MB of a 5.7MB installed package. The library itself is 940KB, so 84% of what every consumer installs is brand imagery: 26 JPEGs and 30 PNGs totalling 4.6MB, against 24 SVGs totalling 30KB.

Do not just delete them. `./assets/brand/*` is a declared export in `package.json`, so removing it is a breaking change under the backward-compatibility policy. `src/brand-assets.ts` is a provenance manifest whose header says paths are "relative to your hosted asset base", which suggests consumers may be expected to host these themselves. Options worth putting to the user: ship SVG only, drop the raster downloads to a separate archive, or keep as is and accept the weight.

### 5. Softer negative badge (small, but changes an existing default)

`.cui-badge-negative` uses `--cui-surface-page` as its background, which is nearly the page colour, so it reads as bare text beside the now-tinted positive and warning badges. Giving it a soft tint would make the three-state set coherent. This changes an existing component's default appearance, so it needs the backward-compatibility process rather than a drive-by fix.

### 6. Registry hardening, mostly done

The user approved the registry as the home for components that are probably reusable but not yet proven, with a promotion path into the package. Three of the four prerequisites are done on `feature/registry-hosting` (PR pending):

- `pnpm registry:check`/`registry:sync` guard the registry's token copy against canonical, wired into CI. **This found real drift on the first run**: six tokens behind, plus a stale description. Fixed.
- `.github/workflows/registry.yml` publishes immutable `/r/v<version>/` paths plus a `/r/latest/` alias on a version tag, refusing to publish a drifted registry.
- Install, update and promotion docs are in `docs/registry-pilot.md`.

**Remaining: enable GitHub Pages on the repository.** That is a settings change and a decision to host a public site, so it is left to the owner. Until then the workflow will fail if a tag is pushed. The registry's own `button`/`chip` still have not had the interaction-quality pass.

### 7. Then Pass 3

ROADMAP.md's "make tables and editing useful for real work": `DataTable` expansion, column configuration, grouped rows, a details drawer, editable cells, file upload, wizard/stepper. Branch off `main` as `feature/product-ui-0.8-tables` or similar.

### Known gaps that are not scheduled

- **Forced colours.** The `@media (forced-colors: active)` blocks in `data.css`, `controls.css` and `components.css` have not been verified in this or the previous two sessions, because no session's tooling could emulate the mode. Needs a real Windows high-contrast check.
- **RTL.** No `[dir="rtl"]` support exists. Out of scope until someone decides to add it (ROADMAP.md section 5).
- **Real Roobert rendering.** The licensed files are deliberately absent, so everything has been reviewed on the Geist fallback.

### Conventions worth knowing before you change anything

- `pnpm api:check` guards the TypeScript surface, `pnpm css:check` guards the CSS surface (classes, `--cui-*` properties, `data-cui-*` attributes). Both fail CI on an unaccepted change. Run `pnpm api:update` or `pnpm css:update` and commit the snapshot when a change is intentional.
- The distributed stylesheet is plain CSS on purpose. Do not reintroduce Tailwind into `src/styles/index.css`: a consumer's Next.js build hard-failed on the `@layer` at-rules it used to emit. AGENTS.md records this.
- Verify claims rather than reasoning about them. Several defects this session were only found by measuring: the focus ring that computed 1.00:1, the Tailwind failure reproduced against a real v3 pipeline, the `engines` warning that turned out to be noise rather than a blocker.

## Interaction-quality pass detail (merged in PR #10)

**Note:** item 1 below describes the primary button's focus ring using `--cui-text-inverse`. That was later found to fail WCAG 1.4.11 and was replaced by an offset ring in `139e831`. See section 5.

### 1. Focus ownership — done

- Formatted inputs (`CurrencyInput`/`PercentageInput`/`HoursInput`) drew two outlines on focus — the `.cui-affixed-input` wrapper's own `:focus-within` perimeter (correct, covers prefix/suffix) plus a second, redundant one on the inner `<input>`. Suppressed the inner one.
- `.cui-button-primary`'s focus outline used `--cui-focus-colour`, which equals `--cui-accent-primary` in both themes — the same colour as the button's own border/background, so the ring barely stood out. Reused `--cui-text-inverse` (already the token chosen per theme to contrast with `--cui-accent-primary`).
- Audited and found already correct, not touched: no global outline removal anywhere; light theme uses dark-neutral focus (`forest`), dark theme uses light-neutral focus (`sage`); chip/password-reveal buttons already get visible focus via the existing global button rule; every portal (`Select`/`Combobox`/`DatePicker`/dropdown-menu/tooltip/sidebar drawer) already applies `cui-root` and `data-cui-theme` directly on the portaled content, not just an outer wrapper.
- Reviewed, not changed: invalid-field border vs. focus colour contrast is ~2:1 in light theme — meets AA visible-focus, below the AAA Focus Appearance 3:1 target. A fix means picking a new token, a design decision of its own, not a drive-by change.

### 2. Dropdown interaction states — done, including a real self-correction worth reading

- `Combobox` (Radix Popover) reused `.cui-select-panel`, sized with `--radix-select-*` variables that don't exist on a Popover — silently no width alignment, no height constraint (a long list would overflow, not scroll). Added `.cui-combobox-panel` using the `--radix-popover-*` equivalents.
- `Combobox`'s hand-rolled `<ul>/<li>` inherited the browser's default list indentation (no global reset in this project). Added `.cui-combobox-listbox` to clear it.
- Replaced the conditionally-rendered `"✓"` character in `Combobox` and `StyledSelect` with `Icon name="check"`, always present, visibility toggled by `[data-state='checked']` — label/indicator columns now stay aligned regardless of avatars or label length.
- Added `dropdown.hover`/`dropdown.selected` to `tokens/tokens.json` (regenerated via `pnpm tokens`) — Select/Combobox/ActionMenu previously reused `--cui-surface-selected`, the brand-green token nav's `aria-current` and calendar range selection also use, for their own "this option is picked" background. Selected rows are now neutral; the existing checkmark carries the "selected" meaning, not the row colour.
- **Real mistake caught by testing, not assumed correct:** first attempt split hover vs. keyboard-active via `:hover`/`:not(:hover)` CSS on `data-highlighted`, for Select, Combobox and ActionMenu alike. Verified in the browser this actively breaks Select and ActionMenu — Radix moves real DOM focus onto the highlighted item, including on pointer hover, so a plain mouse hover already satisfies native `:focus-visible`, and the CSS `:hover` heuristic disagreed with the browser's own correct one. Reverted those two to one consistent `data-highlighted` treatment. Combobox is different — hand-rolled, DOM focus never leaves the input — so the hover/keyboard split is real and correct there; verified by keyboard-navigating to a row, hovering a different row with the mouse, and confirming the keyboard row's ring survived while the hovered row showed only the plain background.
- Also fixed while in this code: `Combobox`'s `onMouseEnter` could highlight a disabled option (looked interactive despite being unselectable), and ArrowUp/ArrowDown could land keyboard focus on a disabled option instead of skipping it. Both fixed and verified.
- Added `Foundations/Dropdown states` Storybook page — static reference using the real classes/data-attributes, covering default/hover/selected/keyboard-active (including "already selected AND keyboard-active" at once)/disabled, verified in both themes and at 320px width (see item 4 below).

### 3. Icons — done

- Added `lucide-react` as a real dependency (explicit named imports only, never the dynamic catalogue) after asking the user directly whether to add a new runtime dependency for this vs. hand-rolling a few more one-off SVGs vs. deferring — user chose to add it properly now.
- `Icon`'s existing names (`overview`/`activity`/`projects`/`team`/`menu`/`close`/`arrow`/`chevron`/`check`/`help`) now resolve to Lucide equivalents instead of hand-drawn paths — same names, so no existing call site broke. Added the rest of the brief's curated set (`chevron-up`, `arrow-up`/`down`, `search`, `filter`, `sort(-up/-down)`, `plus`, `minus`, `calendar`, `clock`, `edit`, `delete`, `upload`, `download`, `copy`, `external-link`, `settings`, `users`, `status`, `overflow`, `visibility(-off)`, `loading`), plus a `.cui-icon-spin` utility and a `.cui-icon-inline` sizing variant for icons in running text.
- Fixed every remaining literal Unicode symbol in `src/` (excluding stories/tests): `StyledSelect`'s scroll-button arrows, `Metric`'s trend arrows, `DataTable`'s sort indicators, `TextLink`'s external-link marker. Also swapped `PasswordInput`'s literal "Show"/"Hide" text for `visibility`/`visibility-off` icons (the `aria-label` already carried the accessible name).
- Implemented the search-clear fix on `DataTable`: an accessible `Icon name="close"` button (only rendered once there's a value) that clears the controlled `globalFilter`, resets pagination to page 0, and restores focus to the input — verified directly (`document.activeElement` checked, not assumed) rather than just reasoned about. The native browser clear affordance is hidden only where this replacement exists (`:has([data-cui-search-clear])`), so a plain `type="search"` input elsewhere is unaffected.
- Added `Foundations/Icons` Storybook page listing every name with usage guidance; the name list is typed as `IconName[]` so an icon added/removed from `icon.tsx` without a matching update here fails type-check.

### 4. Full verification — the one tooling-independent gap is now closed; three remain blocked

Done: light/dark theme (checked on every change above, not just at the end), keyboard vs. pointer input (including the Select/ActionMenu correction above and the Combobox disabled-option fixes), automated accessibility (Storybook's a11y addon caught a real `aria-required-parent` violation in the new dropdown-states story — fixed, not silenced), narrow screens (375px and the WCAG 320px reflow benchmark, on `DataTable` and the dropdown-states page — no clipping, no horizontal overflow, indicator column held up even with a wrapped two-line label), disabled-state and focus-restoration behaviour (verified programmatically, not just visually).

**What was outstanding when items 1–3 were finished** (superseded by the update further down — read that for the current position, this list is kept for the record):

- ~~No cross-cutting Storybook state reference covering the full list the brief named~~ — **done**, see the update below (`a459b30`).
- **Forced colours** — this session's browser tooling has no forced-colors emulation available; the existing `@media (forced-colors: active)` blocks in `data.css`/`controls.css`/`components.css` weren't touched by this pass and weren't re-verified either.
- **RTL** — genuinely out of scope; this project has no `[dir="rtl"]` support yet (ROADMAP.md section 5, "still deferred"), not something to add as a side effect here.
- **Real Roobert rendering** — the licensed font files aren't present in this environment (by design, see AGENTS.md/README.md); everything above rendered on the Geist fallback, which is one of the two fonts the brief named but not both.
- **Zoom** — approximated via the 320px reflow-equivalent width rather than an actual browser zoom control, which this tooling can't drive.
- No before/after screenshots were saved to a file for the user — every check was done live against a running Storybook instance and described in this file and each commit message instead.

**Update (this session).** The user chose to close the one gap that was not blocked by tooling before bringing the PR back for review. That is now done, and it turned up a real defect.

**Now done:** `Foundations/Component states` (`docs/component-states.stories.tsx`) covers buttons, text inputs, search and password, formatted inputs, textarea, checkbox/switch/radio, selects, comboboxes, menus, date pickers, links, chips, tabs and navigation, in rest, focus, selected, error, loading, read-only and disabled states. Every cell renders the real component in a real state, with two exceptions stated on the page itself: navigation (`.cui-sidebar` is `position: fixed` and cannot sit inline, so those rows use the exact markup `DashboardSidebar` renders, the same approach the dropdown-states page took) and focus (only one element per document can hold it).

The focus preview is a `data-cui-focus-preview` hook in `.storybook/preview.css`, deliberately **not** in `src/styles`, so it does not ship: `dist/styles.css` contains no occurrence of `focus-preview` (checked against a real build, not assumed). Because that hook restates declarations the real rules own, the `Focus ring parity` story asserts a previewed ring computes identically to a genuinely keyboard-focused control. That guard was confirmed load-bearing by breaking each preview rule in turn and watching the test fail, in light and again under `pnpm test:dark` — not assumed to work.

**Still not done, unchanged and still honest:**

- **Forced colours** — no forced-colors emulation in this session's tooling either. The `@media (forced-colors: active)` blocks in `data.css`/`controls.css`/`components.css` remain untouched and unverified by this pass.
- **RTL** — still genuinely out of scope; no `[dir="rtl"]` support exists yet (ROADMAP.md section 5).
- **Real Roobert rendering** — licensed font files still absent by design; everything rendered on the Geist fallback.
- **Zoom** — still approximated via the 320px reflow-equivalent width rather than a real zoom control.

### 5. Primary button focus ring — a defect this branch introduced, now fixed (`139e831`)

Putting every focus state side by side on the new page immediately showed the primary button had no visible focus ring. This was not pre-existing: `dc5a599`, earlier on this same branch, introduced it.

`dc5a599` fixed a real problem — `--cui-focus-colour` equals `--cui-accent-primary` in both themes, so the shared ring sat flush against a border of the identical colour and merely made the button look 2px larger — by recolouring the ring to `--cui-text-inverse`. That reasoning is sound about contrast against the _button_, but with `outline-offset: 0` the ring is drawn entirely _outside_ the border box, so what it must contrast with is the surface behind it. Measured on a genuinely keyboard-focused button in Chromium: **1.00:1** (light, on a card), 1.05:1 (light, on the page), 1.34:1 and 1.04:1 (dark). WCAG 2.2 SC 1.4.11 asks 3:1, so the indicator failed in both themes and was invisible to the eye in light.

The fix separates ring from button with a gap instead of recolouring it: keep `--cui-focus-colour` and set `outline-offset: var(--cui-focus-width)`. That resolves the original merge without giving up contrast — **11.79:1**/12.40:1 in light, 12.01:1/9.34:1 in dark. Verified with real `Tab` presses in Chromium so `:focus-visible` genuinely matched (a synthetic `KeyboardEvent` does _not_ establish keyboard modality — an early attempt this session read `matchesFocusVisible: false` and would have measured the wrong thing). The parity story now pins this rule, so it cannot regress silently.

Worth noting for whoever reviews: this is exactly the class of bug a consolidated states page exists to catch, and it went unnoticed while each component's focus state lived on its own page.

**Checks run this session, all passing:** `format:check`, `tokens:check`, `type-check`, `lint`, `test` (200 tests, 44 files), `test:dark` (176), `build`, `build-storybook`, `api:check`, `test:coverage` (92.26% statements, above the floor), `package:check`, `next:check`. That is every gate `.github/workflows/ci.yml` runs. Storybook's a11y addon on the new page: 0 violations, 29 passes, 1 inconclusive (`aria-hidden` decorative spans containing only non-text characters — benign). No horizontal overflow at the 320px WCAG reflow width (checked programmatically across the full 6717px page, 0 offending elements).

### 6. 0.7.0 release preparation — done up to the tag (`6a45143`)

The user asked whether this is ready for a coworker to use, and chose to have the release prepared now but stopped before merge and tag. Release-process steps 1–5 are done on this branch; **steps 6 and 7 (tag, build and share the archive) are deliberately not done.**

- `package.json` is `0.7.0`, and `docs/release-0.7.md` was added to `files` — without that the release notes would not ship. Packed archive: 269 → 270 files, containing that doc.
- README's current-version line, version-history row, versioned clone command and both vendor-archive install paths now say 0.7.0. `pnpm pack` really emits `convert-product-ui-0.7.0.tgz`, so the documented filenames are accurate.
- **The README now references the `v0.7.0` tag, which does not exist yet.** That is inherent to the process ordering (labels in step 5, tag in step 6) and resolves on tagging. If the release is abandoned rather than completed, that reference has to be reverted.
- Version choice was verified, not assumed: the API diff against `main` is two added tokens, one narrowed token description and a widened `IconName`. Comparing icon names either side of the branch gives 23 added, **zero removed**. Additive plus fixes, so minor.
- Archive inspected for fonts, credentials, client material and the registry pilot: none present.

**Blocking a coworker actually using this, in order:**

1. **PR #10 is not merged.** Still the user's call, standing rule unchanged.
2. **Release-process step 3 wants another developer to review** API, visual and accessibility changes. Not satisfied by an AI session, and this PR changes a focus ring every primary button inherits.
3. **Tag `v0.7.0`** on the approved commit, then build the archive from that tagged revision (step 7).
4. **`CONSUMERS.md` is still entirely placeholder rows.** It is the only mechanism protecting consumers from breaking changes — no telemetry, no download counts. The coworker needs a real row the moment they install, or the backward-compatibility process degrades to "hope nobody's using it".

**If the coworker wants `npx shadcn add` instead of the archive, none of the above is enough** — see step 4 of the registry sequence below: hosting, immutable version URLs, install/update docs and a token-drift check are all still **not started**, `public/r/` is gitignored so there is nothing hosted to point at, and the registry's own `button`/`chip` copies never received the interaction-quality pass. The user has not yet decided which path the coworker takes.

Also worth telling any new consumer: Roobert is not bundled (licensing), so they render on the Geist/Arial fallback, and forced-colours mode and RTL are unverified/unsupported.

**Next step:** the user's decision on merge, and on which consumption path the coworker needs. Do not merge or tag without explicit approval — the standing rule has not changed.

## Current state

`v0.6.0` is merged to `main` and tagged (9 September 2026). PR #8 (`feature/product-ui-0.5-controls`) covered two passes and is now closed/merged — that branch's detailed checkpoint history is kept below for context, but treat `main`/`CHANGELOG.md`/`git log` as the source of truth going forward, not the branch name. The user explicitly asked to merge+tag this as a single v0.6.0 release rather than tagging 0.5.0 and 0.6.0 separately, since 0.5.0 was never tagged on its own.

- **Pass 1 (0.5.0):** standalone `Pagination`, Radix-backed `StyledSelect`, `Calendar`/`DatePicker`/`MonthPicker`, opt-in readable/scrollable `Table`/`DataTable` layout. See `docs/release-0.5.md`.
- **Pass 2 (0.6.0):** `Chip`/`ChipGroup`, `SegmentedControl`/`SegmentedMultiControl`, `Combobox`, `CurrencyInput`/`PercentageInput`/`HoursInput`, `PeriodNavigator`, `FilterToolbar` pattern. See `docs/release-0.6.md`.
- Also in this release: `ErrorBoundary`, three accessibility fixes, coverage thresholds, examples lint/type-check coverage, and the `--cui-focus-offset` token fix (was 4px, giving every focusable element a detached ring).

Previous release checkpoint before this one: `v0.4.0` — a breaking release (see `docs/release-0.4.md`): `title` → `heading` on Alert/EmptyState/Disclosure/ConfirmationDialog/DataChart/RoadmapBoard/SignInForm, and `SignInForm.pending` → `loading`. It also added an enforced public API check (`pnpm api:check`/`api:update`, backed by `etc/*.api.md`, wired into CI) — read `docs/release-process.md#backward-compatibility` before shipping anything that renames or removes a public export, prop, or CSS class.

## shadcn registry pilot — PR #9 merged, sequence continues (separate from ROADMAP.md's component passes)

The user asked for an audit + pilot of converting this project into a distributable shadcn registry, so coworkers (and their coding agents) can pull components via `npx shadcn add` instead of hand-rolling or waiting on the npm-tarball flow. Tracked on `feature/shadcn-registry-pilot` (based on `main` at `v0.6.0`), merged into `main` on 9 September 2026 as **PR #9**, labelled `experimental`, **no version tag published**. See the dedicated checkpoint section below for full history.

**The sequence the user set, and where it actually stands:**

1. Close three specific gaps in the pilot's own verification (keyboard check, a real regenerate-tokens test, recording the exact vanilla Button provenance) — **done**.
2. Wait for green CI on PR #9, then the user reviews and merges — **done, 9 September 2026**. The last open item (real human Enter/Space keyboard verification, since this session's browser-automation tooling couldn't exercise it) was closed with a purpose-built standalone test page (Convert Button, pinned vanilla Button, native `<button>` control, each with a visible activation/submit counter) that the user tested directly; see `docs/registry-pilot.md`'s closing note for the result.
3. **A focus/neutral-dropdown/icon interaction-quality pass, applied to both the released library and the registry pilot's components** — the user supplied the detailed brief. Items 1–3 (focus, dropdown states, icons) are **done** on `feature/interaction-quality-pass`; item 4 (full verification) is **partial** — see the section above this one for exactly what's covered and what isn't. Not yet applied to the registry pilot's own copy of `button`/`chip` — those were pinned/adapted separately and weren't in scope for this pass's file changes; revisit if the registry expands.
4. Before any coworker actually adopts the registry: real hosting (GitHub Pages was the audit's recommendation), immutable version URLs (not just an alias that can silently move), clear install/update docs, and a token-drift check comparing the registry's shipped `tokens.json`/`tokens.css` against a fresh generation from the canonical source. **Not started** — the user explicitly said this doesn't need to block Pass 3, but must land before coworkers adopt the public registry.
5. **Only then** resume Pass 3 — also not yet started, queued behind the interaction-quality pass.

"No need to expand the registry to every component yet" — the user was explicit that reliability of this small install path and interaction consistency come first, before any wider component-classification work from `docs/shadcn-registry-audit.md`.

## Next after the registry pilot (and after the interaction-quality pass above): Pass 3

ROADMAP.md's "Next: make tables and editing useful for real work" — `DataTable` expansion (row selection, bulk actions, column filters, sticky headers, server-driven pagination, virtualisation), column configuration/saved views, grouped rows/summary footers, a general dialog/details drawer, editable cells/quick-entry rows, file upload/attachments, wizard/stepper. Pagination (item 9) is already done from Pass 1. Start a new branch off `main` (don't reuse `feature/product-ui-0.5-controls`, which is now merged, or `feature/shadcn-registry-pilot`, which is a separate concern) — the usual naming would be `feature/product-ui-0.7-controls` or similar, matching the version it targets. Same process every time: implement, verify fresh (not from any prior session's logs), commit in coherent checkpoints, push, open a PR, and do not merge or tag without the user's explicit go-ahead.

## Current pass and next steps

Implemented (commits `b883105`, `87fb912` on top of the planning commit `141baea`): opt-in `Table`/`DataTable` `layout`/`tableLayout: 'scroll'` with `minWidth`, and `pagination: 'full'`; standalone controlled `Pagination`; Radix-backed `StyledSelect` (used internally by `Pagination` and the date pickers); `Calendar`/`DatePicker`/`MonthPicker` built on `react-day-picker` with DST-safe date parsing and draft/apply/cancel range editing. Existing native controls and legacy defaults are unchanged. `docs/release-0.5.md` documents the new contracts. The dashboard example adopts `tableLayout="scroll"`/`pagination="full"`. New pinned dependencies: `@radix-ui/react-select@2.3.7`, `@radix-ui/react-popover@1.1.23`, `react-day-picker@10.0.1`.

Verification (all run fresh on this branch's actual current state, not inferred from a prior session's logs): `pnpm type-check`, `pnpm lint`, `pnpm format:check` all clean; `pnpm test` 170/170 passing (29 files); `pnpm test:dark` 146/146 passing (25 files) — both runs emit a benign Radix `Presence` "not wrapped in act(...)" console warning from Select/Popover exit animations (confirmed absent on the pre-pass-1 baseline via `git stash -u`; it's test noise, not a failure, and every assertion still passes); `pnpm api:check` clean, no diff against the committed `etc/*.api.md` snapshot; `pnpm package:check` verified 240 package files against both the core and charts-enabled consumer fixtures; `pnpm next:check` built the Next.js fixture successfully. Manual review in Storybook (a temporary local instance on port 6100, since 6006 was held by an unrelated stale process from a different checkout — `.claude/launch.json` was not added to the repo): BrandedSelect and SelectStates confirmed correct in both light and dark themes (checkmark, disabled/grouped options, theme-aware portal); CombinedRange confirmed correct at desktop and mobile widths (single month on mobile vs two on desktop, disabled Apply on invalid range, correct final applied value); NarrowTable confirmed the readable/scrolling table layout and the container-query compact pagination fallback (`Page 2 of 2` text swaps in for the numbered buttons under ~560px).

## Second checkpoint, same session (8 September 2026)

After PR #8 was opened, the user reviewed it live in Storybook and found two real problems, both now fixed and pushed on this same branch (commits `482e33d`, `dab7194`, `f2ad80d`, `b1ba739`):

1. **Floating focus rings and cramped icon spacing.** The `--cui-focus-offset` token was `4px` — Input and native Select had each been special-cased back to flush (`0`), but the token itself, and every other focusable element (buttons, links, checkboxes, tabs, the new StyledSelect/DatePicker triggers, SearchSelect's `<summary>`), still used the spaced-out default. Root-caused to the token, not patched in CSS: `tokens/tokens.json`'s `focus.offset` is now `0px`, regenerated via `pnpm tokens`, and the now-redundant per-component CSS overrides were removed so there's one consistent rule. Also fixed StyledSelect/DatePicker's trigger chevron sitting too far in from the right edge (it inherited native `.cui-select`'s wide padding reserved for a browser-drawn absolute-positioned arrow, which doesn't apply to a flex-laid-out custom icon) — gave the flex trigger symmetric end padding instead.
2. **"Pass 1 controls" was a scratch grouping, not real IA.** The four new components were verified together in one throwaway `docs/pass-one.stories.tsx`, which leaked into Storybook navigation as a flat, confusing catch-all folder. Split into `Components/Pagination`, `Components/Styled select`, `Components/Calendar`, `Components/Date picker`, `Components/Month picker`, each cross-referencing its siblings in its doc description. Also moved the _existing_ native `DateRange`'s stories out of the unrelated `Components/Workspace controls` file into their own `Components/Date range`, right next to `Date picker` — this is also the actual fix for the discoverability problem that triggered this whole checkpoint: the user found `DateRange` (plain native inputs) first and mistook it for unfinished pass-1 work, when the real new picker was one click away under a completely different, oddly-named section.

Then, continuing down the acceptance criteria the user gave for "complete everything in Codex's pass 1" (tables/selects/date pickers/pagination were already fully met — see below), three of the ROADMAP.md section 4 accessibility follow-ups were fixed since they were flagged as "ship with the work that touches that area" and this pass touched `Table`/`DataTable`: `Table`'s duplicated caption announcement (now `aria-labelledby`), `Breadcrumbs` silently dropping `href` on the current-page item (now honoured, unchanged when absent), and `EmptyState`'s always-on `role="status"` (now an opt-in `live` prop; `DataTable` sets it only for its dynamic "no matching results" case). All committed and pushed; `pnpm api:check`/`api:update` run for both the `live` prop addition and the token value change.

## Third checkpoint, same session (9 September 2026, usage reset mid-session)

Finished the rest of the user's acceptance-criteria list (commits `badafb3`, `136777d`):

- Added `ErrorBoundary` (class component, default Alert-based fallback + reset action, custom `fallback`/`onError` support).
- Added a real coverage threshold to `vitest.config.ts` (90/80/85/90, a few points below the actual ~96/86/93/96 baseline).
- Brought `examples/**` into lint coverage (a dedicated `*.jsx` block for `examples/next`, no TS project service needed) and `examples/react/**/*.tsx` into `tsc` (aliased `@convert/product-ui` → `src/index.ts` via `paths` so it checks against current source instead of a packed tarball — this caught a real implicit-any in the fixture, now fixed).

**Explicitly NOT done, by the user's own instruction** — do not start these without being asked again:

- The CSS-only branded loading screen. The user said directly: "no I dont want the loading screen thats way later." It stays in ROADMAP.md section 6 as a researched-but-deferred idea.
- `typescript-eslint` `recommendedTypeChecked`. Deliberately left alone — untried, and expected to surface a real batch of new violations across the codebase, which is a dedicated task of its own, not something to fold into this pass.
- `examples/next`'s `*.jsx` fixture is still outside `tsc` — bringing it in needs `allowJs`/`checkJs` at the root project level, a bigger, separate decision.

All re-verified fresh after each change: `type-check`, `lint`, `test` (174/174), `test:dark` (150/150), `api:check` (clean after `api:update` for the `EmptyState.live` and `ErrorBoundary` additions), `package:check` (244 files), `next:check`. Pushed to `feature/product-ui-0.5-controls`; PR #8 is up to date.

This closes out everything the user asked for in the "complete everything in Codex's pass 1" acceptance-criteria message, except the two items explicitly deferred above. The four Pass 1 acceptance-criteria groups themselves (tables, selects/menus, date pickers, pagination) were independently confirmed to already meet the stated criteria before this checkpoint — no further work was needed there.

**Next (per the user, right after this checkpoint):** the user thinks Codex's original 30-item consolidated roadmap list "got a bit lost on the priority and component we're adding," and pasted a _replacement_ prioritised list, organised into four phases — "First: improve everyday controls" (branded select/menu polish, calendar/date-range picker, chips, searchable combobox/multi-select, segmented controls, filter toolbar, currency/percentage/hours inputs, period navigation), "Next: make tables and editing useful for real work" (standalone Pagination — already shipped in pass 1, DataTable expansion with bulk actions/column filters/sticky headers/virtualisation, column configuration/saved views, grouped rows/summary footers, a general dialog/details drawer, editable cells/quick-entry rows, file upload, wizard/stepper), "Then: finance and capacity visualisation" (capacity indicator, status legends, budget-vs-actual charts, Gantt, resource scheduling timeline, capacity heatmap, timeline editing, roadmap drag-and-drop), and "Additional gaps" (nested/collapsible sidebar nav, reusable page header, notification centre, command palette, import/sync status, print styling) — plus a parallel "Engineering work" table of cross-cutting items to ship alongside the relevant feature work rather than batched at the end (Button/sidebar interaction tests before touching shared controls; the accessibility items — already done this checkpoint; ErrorBoundary — already done this checkpoint; Skeleton-in-Card reuse and field-description consolidation — already done in 0.4.0; a "dedicated compatibility review" of loading/pending/state/empty-state conventions and Badge/Alert tone vocabulary; locale/copy overridability; the tooling items — already done this checkpoint; RTL and Chromatic — still deferred).

## Fourth checkpoint, same session (9 September 2026): Pass 2 implemented and pushed

The user's replacement priority list (see ROADMAP.md's "Approved delivery order", now superseding Codex's original six-pass ordering) was written into ROADMAP.md verbatim (commit `0a1da59`), then Pass 2 — "First: improve everyday controls" — was implemented directly by this session (the user chose "I build it directly" / "all 6 in one pass" when asked). Commits `b663cc0` (Icon fix) and `89b5885` (the six components) on branch `feature/product-ui-0.5-controls`, still part of PR #8.

Implemented: `Chip`/`ChipGroup`; `SegmentedControl`/`SegmentedMultiControl` (new pinned dependency `@radix-ui/react-toggle-group@1.1.19`); `Combobox` (hand-rolled ARIA combobox listbox on Radix Popover — no Radix combobox primitive exists — with local or `onSearchChange`-driven remote filtering, loading/error states, multi-select rendering selections as removable `Chip`s); `CurrencyInput`/`PercentageInput`/`HoursInput` (shared internal formatting implementation); `PeriodNavigator`; `FilterToolbar` pattern (composes the above). Version bumped to 0.6.0 candidate; `docs/release-0.6.md` documents contracts. Items 1 (partially — `StyledSelect` was Pass 1) and 2 (fully, Pass 1) of the roadmap's "everyday controls" list were already done; items 3–8 are this pass. `ActionMenu` long-list scrolling (the remaining sliver of item 1) was **not** touched — noted as still open in ROADMAP.md, low priority.

Two real bugs were caught and fixed by manual Storybook review, not just automated tests — worth reading if touching `Combobox` or `Icon` again:

1. **`Icon` dropped its own `cui-icon` base class whenever a caller passed `className`**, because it spread the caller's props (which can include `className`) after a hardcoded `className` attribute instead of merging them — a real latent bug in a shared primitive, invisible until `PeriodNavigator`'s flipped "previous" arrow needed one and rendered as nothing. Fixed by destructuring `className` and merging with `cn()`. Grepped for every other `<Icon` usage first to confirm nothing else relied on the old (broken) override behaviour.
2. **A Radix Popover race in `Combobox`**: clicking to focus the input didn't open the panel (only typing did) — the same click that focused/opened it was read by Radix's dismissable layer as an "outside" interaction and immediately closed what had just opened. Fixed with `onInteractOutside` ignoring interactions targeting the input itself. Fixing that then surfaced a **second** bug: committing a single-select choice calls `inputRef.current?.focus()` to return focus, which re-triggers the input's `onFocus` handler and reopens the panel — blanking the displayed selected label. Fixed with a `suppressOpenOnFocusRef` flag set right before the programmatic focus call. Both are now covered by the interaction stories (`SingleSelect`, `MultiSelect` in `combobox.stories.tsx`), so a future regression here would be caught by `pnpm test`.

Verification (fresh, same discipline as every prior checkpoint): `pnpm type-check`, `pnpm lint`, `pnpm format:check` clean; `pnpm test` 196/196; `pnpm test:dark` 172/172; `pnpm api:check` clean after `api:update` (new component exports); `pnpm package:check` 268 files; `pnpm next:check` passes. Manual Storybook review covered all six new components/patterns in both themes, plus `FilterToolbar`'s mobile compact reflow.

**Next:** update `CHANGELOG.md`/`docs/release-0.6.md`/`docs/component-catalogue.md`/`ROADMAP.md` (in progress as this checkpoint is written — check `git log` for whether that commit landed), then push and let the user know PR #8 now covers both Pass 1 and Pass 2. Do not merge or tag — still the user's call, stated repeatedly this session. Pass 3 ("make tables and editing useful for real work" — `DataTable` expansion, column configuration, grouped rows, a details drawer, editable cells, file upload, wizard/stepper) is next in ROADMAP.md whenever the user wants to continue; Pagination (item 9) is already done from Pass 1.

## Registry pilot checkpoint (9 September 2026, branch `feature/shadcn-registry-pilot`)

This went through three real rounds before implementation started, each one materially correcting the last — worth reading in order if picking this up cold:

1. **Initial audit** classified the public surface against shadcn/ui, but got several things wrong from reading code too quickly (called `Progress`/`Avatar`/`Table` compatible without properly diffing them, mislabelled `ActionMenu`/`SegmentedControl`/`ToastRegion` as migration candidates despite already having distinct names).
2. **User corrected it against the actual local code** — every correction checked out. Fixed in `docs/shadcn-registry-audit.md` (commit `b3af8fb`). Net finding after correction: **nothing in the public surface had been proven compatible with an upstream component** — `Button` and `Table` were the two worth actually testing, not assuming.
3. **User approved a small, deliberately-scoped pilot** (not a wholesale conversion) with five explicit boundaries: fix the font guard first, keep it isolated from the released APIs, build exactly tokens+cn+button+chip+one composition+guidance, run the real consumer tests (clean install, registry-unavailable build, vanilla-Button swap), and land it as a reviewed PR — no merge/tag without explicit approval, same standing rule as every component pass.

All five were done, in this order, each verified before moving to the next:

1. **Font guard fixed and verified** (commit `710b369`). `.storybook/main.ts`'s `staticDirs` only skipped `local-fonts/` when absent from the building machine — any contributor's laptop with the real licensed Roobert files present would silently bundle them into a public deploy, and this was directly confirmed live: a prior local build already had them in this repo's (gitignored) `storybook-static/`. Added `CUI_PUBLIC_BUILD=true` as a hard override ahead of the `existsSync` fallback, plus `scripts/build-storybook-public.mjs` (new `pnpm build-storybook:public` script) that deletes the output directory first so a stale build can't be reused. Verified directly: built with fonts genuinely present on this machine — public build has zero font binaries and no `local-fonts/` directory; normal `pnpm build-storybook` (personal use) still includes them, no regression; rebuilt normally then ran the public build to confirm stale output actually gets removed, not just skipped.
2. **Token generator made portable** (commit `a1c860b`). `scripts/generate-tokens.mjs` now takes `--tokens=`/`--responsive-template=`/`--out-css=`/`--out-ts=`/`--out-responsive=` flags with defaults matching this repo's own layout exactly. Verified two ways: this repo's own `pnpm tokens`/`pnpm tokens:check` produce byte-identical output (aside from a now-accurate generated header line, previously hardcoded to this repo's own paths) — zero regression; and ran the adapted script standalone against a deliberately different project structure in the scratchpad (nested `theme/source/design-tokens.json` input, `app/styles`+`app/lib` output split) with custom flags, confirmed correct output.
3. **Pilot registry built** (commit `96a56ae`): `registry.json` + `registry/{lib,tokens,ui,examples,guidance}/`, isolated from `src/` — confirmed via `pnpm package:check` (still 269 files, unchanged) and `pnpm api:check` (clean, no export changed) that none of this touched the released v0.6.0 library. New devDependencies for local building/type-checking only: `radix-ui`, `tailwind-merge`, `shadcn` (the CLI). `pnpm registry:build` runs `shadcn build`, emitting `public/r/*.json` (gitignored, like `dist/`/`storybook-static/` — it's a generated artifact, not source).
   - `tokens`: source `tokens.json` + the portable generator + compiled `tokens.css` + a hand-written `shadcn-bridge.css`. No font binaries.
   - `cn`: a registry-only `clsx`+`tailwind-merge` helper, separate from this package's own npm-published `cn()` (which never needs a merge step, since npm-published components use semantic classes, not Tailwind utilities).
   - `button`: pinned to `shadcn-ui/ui` commit `3ba91b1cc83e1bbe4ab35a422ff2a694849c5048` (`new-york-v4` style) — same variant/size names, same `asChild`, same `data-slot` attributes, zero className changes from upstream. Deliberately does not carry over the npm-published `Button`'s `loading`/`leadingIcon` — noted explicitly in the file, a real decision, not a silent drop.
   - `chip`: a Convert pattern (no compatibility claim), with its own extracted `chip.css` — the first real test of "can a component's CSS stand alone as its own small file" from the original audit's proposed taxonomy.
   - `task-filter-example`: a composition proving button+chip+tokens work together in one real file, not three isolated islands.
   - `agents`: scoped guidance, installed at a project-relative path that doesn't overwrite an existing root `AGENTS.md`.
4. **Consumer tests, run for real, not reasoned about** (see `docs/registry-pilot.md` for the full account). Served `public/r/` locally, scaffolded a genuinely clean Vite+React+Tailwind v4 project in the scratchpad, configured `components.json` with the `@convert` namespace pointed at the local server, and ran the actual `shadcn` CLI (`pnpm dlx shadcn@latest add ...`) against it — not this repo's own devDependency copy. Two real integration bugs were found and fixed this way, not by reading the schema:
   - **Unnamespaced `registryDependencies`** (`"cn"`, `"tokens"`) resolved against the _default_ `ui.shadcn.com` registry instead of `@convert`, breaking the very first install attempt with a 404. Fixed by prefixing every internal cross-reference in `registry.json` with `@convert/`.
   - **Tailwind v4's `@theme` requires the CSS to be in the same import graph as `@import "tailwindcss"`.** The bridge stylesheet loaded via a separate top-level `import '...css'` in a `.tsx` file rendered every colour utility as transparent — the CSS variable itself looked completely correct in devtools, only the _utility class_ silently didn't exist. Fixed by (a) adding an `@theme inline` block to `shadcn-bridge.css` registering the variables into Tailwind's theme (matching upstream shadcn's own `globals.css` pattern, which the pilot had initially missed), and (b) documenting that consumers must `@import` the tokens/bridge CSS from their main Tailwind entry file, not from a component file.
   - **Separately, a Vite-scaffolding-specific gotcha** (not a bug in this registry, but real and worth knowing): current Vite templates split `tsconfig.json` (a "solution" file with `references`) from `tsconfig.app.json` (the actual `paths`/`baseUrl`). The `shadcn` CLI's alias detection reads the root file — without `paths` duplicated there, it silently wrote files into a literal `./@/` directory instead of resolving to `src/`, with a completely normal-looking success summary. Fixed in the test project; documented in `docs/registry-pilot.md` for any real consumer hitting the same thing.
   - After both fixes: **rebuilt the registry, reinstalled clean, and confirmed the rendered output actually uses Convert's palette** (checked `--destructive`'s computed value directly, `#a13d32`/`rgb(161, 61, 50)`, not just "looks plausible").
   - **Registry-unavailable test**: killed the local registry server, wiped `node_modules`, ran `pnpm install` (from npm, unaffected) and `pnpm build` + `pnpm preview` — both succeeded with the registry completely unreachable. Copy-in independence confirmed, not assumed.
   - **Vanilla-Button-swap test**: ran the real `npx shadcn add button` (default registry, no prefix) with `--overwrite` on the same project. Landed at the identical path (`src/components/ui/button.tsx`) with the identical import specifier — zero edits to `App.tsx` or the composition file. Confirmed the vanilla file imports `cn` from the literal npm package now named `"cn"` (shadcn's current convention, different from what a stale read of older docs would suggest) and that this got auto-installed as a real dependency. Rendered output was visually and programmatically unchanged (same computed colours, since both files use the same Tailwind utility class names).
   - **Keyboard/form verification, reported honestly**: confirmed Tab reaches the button in the real focus order, and confirmed via a direct DOM test that an unmodified-`type` button (what both builds render) triggers real form submission on click. **Did not** manage to verify synthetic Enter/Space key-press activation through this session's browser-automation tooling — it didn't register a click on a focused button in _either_ build, traced to the automation tool's synthetic keyboard dispatch not triggering the browser's native default action for `<button>`, not a defect in either component (neither adds custom keydown handling, and real keyboard input is guaranteed to work by every browser engine's native `<button>` semantics). Documented as an open item in `docs/registry-pilot.md` rather than papered over — worth a real manual keyboard check before treating this as fully closed.
5. Full repo verification re-run clean after all of the above: `pnpm type-check`, `pnpm lint`, `pnpm format:check`, `pnpm test` (196/196), `pnpm package:check` (269 files, unchanged), `pnpm api:check` (clean, no export changed).

**Not yet done, next for whoever picks this up:**

- Push `feature/shadcn-registry-pilot` and open a PR (commits are made locally; per the user's explicit instruction, land this as "a reviewed PR and verification results before merging or releasing" — same standing no-merge-without-approval rule as everything else this session).
- No public hosting has been stood up (GitHub Pages was the audit's recommendation, given the repo is already public and there's no existing Vercel usage anywhere in this project — but that's still just a recommendation, not done).
- Manual real-keyboard verification of Button's Enter/Space activation (see above) — the one acceptance-test item this session couldn't close out with the tooling available.
- The wider rollout (remaining ~30 components' classification, per-component taxonomy decisions, actual hosting) explicitly waits on the user reviewing this pilot's PR — do not expand scope preemptively, per the user's own framing: "prove the distribution model without triggering a wholesale component rewrite."

## Fifth checkpoint, same session (9 September 2026): closing the three pre-merge gaps

PR #9 was open, CI was running, and the user asked for three specific things closed before merge review — not new scope, corrections to what step 4's verification actually established. All three addressed directly in the scratchpad consumer test project (still present from the prior checkpoint), `docs/registry-pilot.md` updated with the results:

1. **Token regeneration, actually proven, not just accepted as a working flag set.** Edited `colour.forest`'s hex value directly in the _installed_ project's `src/convert-ui/tokens.json` (a real value change, not a no-op), ran the exact documented command from the project root, confirmed `tokens.css` picked up the change, then loaded the running dev server and confirmed the rendered buttons actually changed colour. The working command is now in `docs/registry-pilot.md` verbatim — copy it exactly, the flag names/paths matter.
2. **Vanilla Button provenance, made reproducible.** `npx shadcn add button` doesn't print what it installed from, so citing the commit hash alone wasn't actually verifiable by someone else later. Fetched `button.tsx` directly from `raw.githubusercontent.com` at the pinned commit and hashed it against the file the CLI actually installed — both SHA-256 to `79dd6f75f8136394442202d6b8b922fb269eaad0a5dba579397c9d5b41f893bb`, confirming `ui.shadcn.com`'s live default registry really was serving that exact commit's content at test time. Recorded in `docs/registry-pilot.md`, along with what it means if this is re-checked later and the hash no longer matches (upstream moved — re-diff, don't assume compatibility still holds).
3. **Keyboard check, attempted properly, reported honestly.** Re-ran click activation, disabled-state behaviour, and form submission individually on _both_ builds (not just once, generically) — all pass identically on both. Made three separate attempts at Enter/Space keyboard activation (different key-name variants, focus via Tab vs. via direct click, a fresh click-listener each time) — **none registered a click on either build**, a consistent result across every variation tried. This is now reported as a genuinely open item, not a closed one papered over with a plausible-sounding explanation: the pattern is consistent with a tooling limitation (native `<button>` Enter/Space activation is a baseline browser guarantee, and neither file adds custom keydown handling), but consistency with an explanation isn't proof, and this needs an actual person pressing actual keys — a 15-second check, explicitly called out as still needed in both `docs/registry-pilot.md` and the sequence at the top of this file.

Also corrected per the user's explicit instruction: this file previously said "Next after the registry pilot: Pass 3," which would have let a future session skip straight to Pass 3 after merge. The real sequence (merge review → the focus/dropdown/icon interaction-quality pass, prompt to be supplied by the user → hosting/versioning/drift-check hardening → _then_ Pass 3) is now spelled out at the top of the "Active work right now" section — read that before doing anything else here.

Full repo verification re-run clean after these changes too (no source changes were needed in this repo itself for the three closing items — all the work happened in the scratchpad consumer project and in `docs/registry-pilot.md`): `pnpm type-check`, `pnpm lint`, `pnpm format:check` all clean.

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
