# Release validation history

## 0.4.0 · 8 September 2026

Breaking release (see docs/release-0.4.md) done deliberately while there is exactly one known consumer (CONSUMERS.md). Validated on `feature/product-ui-0.4` before merge.

- `pnpm type-check`, `pnpm lint`, `pnpm format:check`: clean after the rename touched 20 files (7 components, their stories, tests, and 4 docs/examples).
- `pnpm test` (158/158, light theme) and `pnpm test:dark` (134/134): both clean after the rename — no test asserted against the old `title`/`pending` prop names, since TypeScript itself catches those.
- `pnpm api:check`: introduced this release. First real diff reviewed by hand (`--print-api-report-diff`) before accepting via `pnpm api:update`, confirming the reported changes were exactly the intended renames (plus `Button`'s type changing from a plain function to `ForwardRefExoticComponent`) and nothing else.
- Manually verified in Storybook: Alert, SignInForm's new `Loading` story, and RoadmapBoard's `heading` all render correctly. Confirmed `docs/roadmap-example.tsx`'s pre-existing `<Button ref={addButton}>` — previously silently broken, since a plain function component discards a `ref` at runtime — now actually attaches, as a direct check of the forwardRef fix.
- A commit message in this release's history overclaimed "no public API changes" without having run `pnpm api:check` first; caught and corrected in the next commit. Recorded here as the reason `pnpm api:check` (not "I'm confident this didn't change anything") is the actual check from this point forward.

## 0.3.1 · 8 September 2026

Patch release with no public API changes, from a full codebase audit (component code quality, test/CI setup, governance docs, security scan). Validated on `feature/product-ui-0.3.1` before merge.

- `pnpm type-check`, `pnpm lint` (including the newly-added `eslint-plugin-jsx-a11y`, which found and required fixing 4 real violations on introduction), `pnpm format:check`: clean.
- `pnpm test` (158 tests, light theme) and `pnpm test:dark` (134 tests): both clean after the fixes in this release.
- `pnpm test:coverage`: 97.11% statement coverage, first time this has been measured. This measures code executed, not behaviour asserted — a different, complementary signal to the Storybook interaction-play-function coverage (roughly 19% of stories have a `play` function with real assertions; the rest are visual renders plus the automated accessibility scan).
- `pnpm check` (full chain including build + build-storybook), `pnpm package:check` (218 package files), `pnpm next:check`: all passed.
- Manually verified the exact sequence in `.github/workflows/ci.yml` would pass, before it was ever run by GitHub Actions for the first time.
- Security-relevant fixes verified by reading, not just testing: the `dangerouslySetInnerHTML` in `ConvertLogo` was confirmed to only ever receive one of three hardcoded local SVG strings (not reachable from application input); the new `safeHref()` guard in `TextLink` and the sidebar's nav links was verified to block `javascript:`/`vbscript:`/`data:` schemes while passing through relative paths, `https:`, `mailto:` and `tel:` unchanged.

### Limitations

This pass fixed the audit's quick, non-breaking findings only. The larger breaking naming-consistency refactor and the new components identified in the same audit are intentionally deferred — see [ROADMAP.md](../ROADMAP.md).

## 0.3.0 · 8 September 2026

Validated locally on the `feature/product-ui-0.3` branch before merge, on top of the 0.1.0 and 0.2.0 results below. A manual review round after the checks below found three issues (input/select focus styling in dark mode, Alert's accent border, and the brand downloads gallery layout); all three were fixed and the full check suite (including `pnpm test:dark`) reran clean afterward.

### Automated checks

- 24 unit and token tests passed (`pnpm test:unit`), including the added brand-asset manifest/hash checks.
- 134 Storybook examples passed in Chromium with accessibility checks configured as errors, run once with the default light theme and once with `VITE_CUI_THEME=dark` (`pnpm test:stories` / `pnpm test:dark`). Interaction tests cover action-menu arrow-key navigation, Enter selection and focus return; tooltip, breadcrumb, searchable single/multiple selection and date-range behaviour; and theme inheritance into dialogs and the mobile drawer.
- Type checking, ESLint, Prettier formatting, token generation (92 tokens, light and dark scopes) and static Storybook compilation passed (`pnpm check`, `pnpm format:check`).
- The packed archive was verified twice: once as `pnpm package:check` (214 package files, installed into an isolated consumer, rendered through React's server renderer and built as a Vite application using only package imports) and once as `pnpm next:check` (built inside a Next.js 16.3.4 App Router application with `next build --webpack`). Both passed against React 19.2.8.

### Browser and design review

- Dark theme reviewed on the dashboard, sidebar, cards, forms and charts: surface, text, border and chart tokens all resolve to their dark values, and the sidebar renders the official Convert mark rather than typed text, in both themes.
- Native `<input type="date">` controls carry `color-scheme: dark` under the dark theme, so the browser-drawn calendar icon renders light-on-dark instead of disappearing.
- Brand asset downloads gallery confirmed against the manifest: 80 original files searchable by variant, colour and format; search filtering (e.g. "png") returns the expected subset.
- Action menu, searchable single/multiple selection and date range reviewed at 390px: full-width controls, no horizontal overflow, disabled options visibly greyed.
- Confirmation dialogs and the mobile navigation drawer carry the active theme through their portals.

### Limitations

Manual review covered the areas above; it was not an exhaustive pass over all 134 stories at every breakpoint. Reduced-motion, forced-colour, Safari/Firefox coverage and a screen-reader session remain future checks, as in 0.1.0.

## 0.2.0 · 8 September 2026

Automated checks (type checking, ESLint, 140 unit/story tests, build, static Storybook, `package:check`, `next:check`) passed on `main` before tagging. See [CHANGELOG.md](../CHANGELOG.md) for scope. A password-visibility toggle wrapping bug in `Input`'s trailing-action slot was found by manual Storybook review and fixed before release; automated checks alone had not caught it, which is why manual review of new patterns stays part of this process.

## 0.1.0 · 7 September 2026 (initial delivery)

- 12 unit and token tests passed: label and ID associations, hints/errors, controlled values, native form submission, disabled options, empty/loading controls, card loading, action repeat prevention, route semantics, drawer Escape/focus return and navigation callbacks.
- 31 Storybook examples passed in Chromium with accessibility checks configured as errors. Interactive stories cover selection, state updates, recovery and dashboard actions.
- Normal text contrast was checked on page, band and card surfaces. Inverse/selected text, control boundaries and focus contrast were also checked.
- Type checking, ESLint, token generation, component compilation and static Storybook compilation passed during implementation.
- The packed archive was checked for fonts and development files, installed into a separate temporary consumer, rendered through React's server renderer, and built as a Vite application using only package imports. React 19.2.8 and its compiled styles/token exports worked.
- The live catalogue and dashboard were reviewed against the approved Koko hierarchy and Convert rules, using the Impeccable review guidance recorded in this repository. Roobert was confirmed as the computed primary family; desktop (1280px), mobile (390px) and narrow mobile (320px) layouts were reviewed; the mobile drawer's Escape/focus-return behaviour was checked; the user-supplied archives and all existing Koko reference files were checked against preservation baselines, with V8 retaining its recorded SHA256.

## Ongoing limitations

No client services, real data, authentication or production integrations are included at any version. Other frameworks receive tokens and CSS, not the React interaction implementation. Safari/Firefox coverage, screen-reader sessions, forced-colour visual review and a broader assistive-technology audit remain future checks; do not describe automated results as full accessibility certification.

Reduced-motion and forced-colour styles are implemented. Native select menus follow the operating system. Licensed fonts are excluded from Git and the installable package; local Storybook builds may contain ignored preview fonts and need rights review before hosting.

GitHub is the source and contribution destination. Local validation covers the package and catalogue; hosted Storybook, registry distribution and CI services are not configured.
