# Active work and handoff

Last updated: 8 September 2026. Update this file at each meaningful checkpoint and before stopping or handing off. Read AGENTS.md and the linked release documentation before editing.

## Current state

No active work in progress. `v0.4.0` is merged to `main` and tagged. It was a breaking release (see `docs/release-0.4.md`): `title` → `heading` on Alert/EmptyState/Disclosure/ConfirmationDialog/DataChart/RoadmapBoard/SignInForm, and `SignInForm.pending` → `loading`. It also added an enforced public API check (`pnpm api:check`/`api:update`, backed by `etc/*.api.md`, wired into CI) — read `docs/release-process.md#backward-compatibility` before shipping anything that renames or removes a public export, prop, or CSS class.

## User-approved objective for the next session

Build out new components from **ROADMAP.md section 2** ("New components"). These are the candidates, in the order the roadmap suggests but pick whichever makes sense to start with:

1. Standalone Pagination (extract from DataTable's existing TanStack pagination row model)
2. Async/remote Combobox (distinct from the existing local-only SearchSelect)
3. Command palette (cmd-k)
4. Wizard / multi-step stepper
5. File upload / dropzone
6. Real drag-and-drop for RoadmapBoard (progressive enhancement alongside the existing dropdown-based move, not a replacement)
7. Error boundary component

All seven are purely additive — new components, no changes to existing props — so none of them need the CONSUMERS.md/backward-compatibility check that a rename or removal would. Standard process still applies: read `docs/architecture.md` and `docs/ai-guidance.md` first, follow `AGENTS.md`'s conventions (named exports, kebab-case filenames, `cui-` prefixed classes, colocated stories), write real Storybook interaction tests (not just visual stories — see the earlier audit's finding that ~19% interaction coverage was a real gap), update `docs/component-catalogue.md`, and run the full check suite (`pnpm check`, `pnpm format:check`, `pnpm package:check`, `pnpm next:check`, `pnpm api:check`) before opening a PR. `.github/workflows/ci.yml` runs the same checks automatically — don't rely on local runs alone; if CI fails for an environment-specific reason, fix the actual cause rather than skip the check (see 0.3.1's history for a real example of this happening).

Do not merge to `main` or tag a release without the user's explicit go-ahead — open a PR and wait.

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
