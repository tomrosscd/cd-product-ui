# Convert Product UI: AI contribution rules

Read HANDOFF.md at the start of each task. Update it at meaningful checkpoints and before stopping so another coding tool can continue from verified state. CLAUDE.md points to the same handoff; do not maintain conflicting plans. Check ROADMAP.md before starting new work — it's the list of deferred items from the last full audit, so as not to duplicate or contradict it. Check CONSUMERS.md and docs/release-process.md#backward-compatibility before shipping anything that renames or removes an existing export, prop or CSS class.

These instructions apply to this repository. Product UI version: 0.4.0. The user-approved Convert product system is authoritative.

- Read README.md, docs/architecture.md and docs/ai-guidance.md before changing components.
- Koko Monthly Review V4 is the visual reference. The website archive supplies technical conventions only. Do not edit either reference, previous Koko versions or V8.
- Use tokens/tokens.json as the only token source. Edit semantic roles, not generated outputs. Run pnpm tokens and commit generated changes.
- Use existing components before introducing a new abstraction. Keep exported components generic and typed; colocate stories.
- Use named exports, kebab-case filenames, strict TypeScript, single quotes and no semicolons. Run the formatter.
- Use cui-prefixed component classes and variables. Tailwind authoring utilities have the separate cdu prefix. Do not ship a global reset or unprefixed colour tokens.
- Every margin, padding and gap uses the approved spacing scale. Keep Roobert with Geist fallback and the neutral page/band/card hierarchy. Avoid large green content areas and nested elevated cards.
- Preserve native control semantics, visible labels, associated errors, focus outlines, current-page semantics, disabled states and reduced motion. Test real browser interactions.
- Use Australian English and no em dashes in interface copy. Keep examples neutral and illustrative.
- Keep client data, API integrations, authentication, persistence, calculations and routing ownership outside the library.
- Keep React external as a peer dependency. Preserve use-client boundaries. Test the packed version, not only source imports.
- Impeccable reviews must work within these approved rules. Do not introduce an unrelated aesthetic. Record intentional rule changes and why they are needed.
- Do not install or update an unpinned AI skill automatically. Record and review the version/source of any external design tooling used.
- Run pnpm check, pnpm format:check, pnpm package:check and pnpm api:check for a release. Follow docs/release-process.md. Automated accessibility checks supplement manual review. .github/workflows/ci.yml runs the same checks on every push/PR — a red CI check blocks the merge regardless of what ran locally.
- pnpm api:check fails CI if the public API (component props, exported types, across `.`, `./tokens` and `./charts`) changed from the accepted snapshot in `etc/*.api.md`. If the change is intentional, run pnpm api:update and commit the updated `etc/*.api.md` files with it — do not delete or hand-edit them to make the check pass.
- Exclude local fonts, secrets and client reference content from release packages. See README.md for preview font handling.
- No sub-agents unless the user explicitly asks for delegation.

- Read docs/component-catalogue.md before composing new forms, data views or roadmaps.
- Import charts only through @convert/product-ui/charts. Preserve optional chart dependencies and text/data-table alternatives.
- Keep metric direction independent from sentiment. Never silently treat missing observations as zero.
- SignInForm is presentation only. Never log credentials or add authentication/session storage to the library.
- Keep main and release tags unchanged during feature work. Use focused commits and a reviewed pull request. Run pnpm next:check after package:check for chart/client-boundary releases.

- Read docs/release-0.3.md for new APIs, asset provenance and theme boundaries. Run pnpm test:dark for theme-affecting releases. Preserve official logo downloads and keep marketing serif fonts out of the UI.
- Read docs/release-0.4.md before touching Alert, EmptyState, Disclosure, ConfirmationDialog, DataChart, RoadmapBoard or SignInForm — their `title` prop is `heading` as of 0.4.0 (SignInForm's `pending` is `loading`). Do not reintroduce `title`/`pending` on these seven components.
