# Roadmap

Everything here came out of a full codebase review (8 September 2026) and was deliberately deferred rather than fixed immediately — either because it's a breaking change that needs coordinating with [CONSUMERS.md](CONSUMERS.md) first, or because it's a real feature that deserves its own stories, tests and docs rather than being rushed into a "quick fix" batch. Nothing on this list is urgent; work through it whenever there's appetite. See [docs/release-process.md](docs/release-process.md#backward-compatibility) for how to ship the breaking items safely.

When you pick something up, move it from here into a normal feature branch and PR — don't edit components directly against this list. Delete an item once it ships, and note it in CHANGELOG.md as usual.

## 1. Naming and consistency refactor — done in 0.4.0, one item left

Most of this shipped in 0.4.0 (see [docs/release-0.4.md](docs/release-0.4.md)): the `title`→`heading` rename across seven components, `SignInForm.pending`→`loading`, the `ChoiceOption` consolidation, `Button`'s `forwardRef` fix and the sidebar swap, `Card`/`Skeleton` reuse, and `RadioGroup`/`Field`'s shared `describedByIds` helper. Two things from the original review were considered and deliberately left alone — see CHANGELOG.md's 0.4.0 entry for why (`BadgeTone`/Alert tone vocabularies, and the `state` unions not getting a matching `'empty'` value). Don't re-propose either without new information.

One item remains, lower priority since it's an internal typing concern rather than a public API inconsistency:

- Consider tightening `ChartConfig`/`ChartDatum` (currently loose index signatures in `src/charts/index.tsx` that force `!` non-null assertions and `unknown` casts elsewhere in the same file).

## 2. New components

Each of these is a real feature — stories, interaction tests, and a docs/component-catalogue.md entry, not just a source file.

- **Standalone Pagination.** Currently only exists baked into `DataTable` via TanStack's pagination row model. Extract a reusable `Pagination` component (page/pageSize/total, prev/next, page-size selector, optional page-number jumps) that `DataTable` can then use internally too.
- **Async/remote Combobox.** `SearchSelect` is deliberately local-array-only (its own docstring says so). A real async combobox needs `loadOptions`, debounced input, a loading state, and should probably be a genuine ARIA combobox (`SearchSelect` explicitly isn't one, by design, for the local-choice case).
- **Command palette (cmd-k).** Nothing like this exists yet. Worth building on top of the same Radix primitives already in use (`@radix-ui/react-dialog` is already a dependency).
- **Wizard / multi-step stepper.** No component or pattern for this today.
- **File upload / dropzone.** No component for this today — zero references to `type="file"` or drag-drop file handling anywhere in `src/`.
- **Real drag-and-drop for RoadmapBoard.** Today "moving" a card is a `<Select>` dropdown (`onStageChange`), which is genuinely good for keyboard/touch accessibility and should stay as an option — but a mouse-drag interaction (e.g. via `dnd-kit`, which has good accessibility primitives of its own) is worth adding as a progressive enhancement alongside it, not a replacement.
- **Error boundary component.** Components accept `state='error'` props for their own internal error states, but nothing in the library catches a render-time throw from a consumer's own code. A simple `ErrorBoundary` wrapper would round this out.

## 3. Internationalization and locale

Roughly 60 hardcoded English strings live inside components today (several are accessible names, not just visible copy) — see e.g. `card.tsx`, `select.tsx`, `data-table.tsx`, `charts/index.tsx`, `roadmap-board.tsx`, `fields.tsx`, `workspace-controls.tsx`, `sign-in-form.tsx`, `dashboard-sidebar.tsx`. Some are already overridable via props (Card's `message`, Spinner/Skeleton's `label`), most aren't. `charts/index.tsx` also hardcodes `Intl.NumberFormat('en-AU', ...)`.

This is a bigger architectural decision than the others on this list (a full i18n library integration vs. just making every string an overridable prop with an English default) and shouldn't be started casually — pick an approach deliberately before touching components.

## 4. Accessibility follow-ups (beyond what was already fixed)

The initial review turned up a few more real ARIA issues beyond the ones already fixed in this pass. None are urgent, but they're real:

- **Live-region overuse.** `EmptyState` hardcodes `role="status"` even when its content is static, so `RoadmapBoard` renders one live region _per empty column_ and `DataTable` renders one inside a table cell. Consider making `role="status"` opt-in (e.g. a `live` prop defaulting to `false`) rather than automatic — this needs a per-usage decision (does DataTable's dynamic "no results while searching" case want the announcement even if RoadmapBoard's static "no stages" case doesn't?), not a blanket change.
- **Duplicate accessible-name announcement** on `Table`: `aria-label={caption + ", scrollable table"}` on the scroll region plus the same text again in the native `<caption>` — a screen reader announces it twice. Minor; consider `aria-labelledby` pointing at the caption instead of duplicating its text, if the region still needs to convey "scrollable" separately.
- **Dropped `href` on the current breadcrumb.** `Breadcrumbs` gives the last item `aria-current="page"` as a `<span>` and silently discards `item.href` if one was supplied — worth deciding whether that's intentional (current page usually shouldn't be a link) and documenting it, or supporting a linked "current page" for cases where it should still navigate (e.g. a refresh action).

## 5. Testing and tooling, further out

- **Interaction test coverage for `Button` and `DashboardSidebar`'s mobile drawer.** Both are genuinely interactive and currently have zero Storybook play-function coverage (they're covered only by the jsdom unit tests in `tests/components.test.tsx`, which don't exercise real browser focus/keyboard behaviour the way the Storybook/Playwright project does for other components).
- **A coverage threshold in CI**, once there's a sense of what's realistic per-directory (the current 97% baseline is generous because most components at least render in a story even without an interaction assertion — don't just gate on that number without thinking about what it actually measures).
- **`typescript-eslint` `recommendedTypeChecked`** instead of the current plain `recommended`, for stricter type-aware linting.
- **`eslint-plugin-storybook`**, and lint coverage for `examples/**` (currently excluded from both ESLint and `tsc`, so the Next.js/React consumer fixtures that `next:check` builds are never linted or type-checked).
- **Print stylesheet** (`@media print`) — currently doesn't exist anywhere in `src/styles/`.
- **RTL language support.** A handful of logical CSS properties exist already, but there's no `[dir="rtl"]` handling or story — directionality has been unconsidered rather than actively supported.
- **Visual regression testing (Chromatic or similar).** Deliberately deferred by decision on 8 September 2026 — not worth the external-account overhead at the current team/contributor size. Revisit if the component count or number of people submitting UI PRs grows meaningfully.

## 6. Loading animation / a branded loading screen

Requested 8 September 2026: something more polished than the current plain `Spinner` for a full-page or full-screen loading moment, without turning this into an animation-heavy system. Three real options, roughly in the order I'd reach for them:

1. **A branded, CSS-only loading screen using the existing `ConvertLogo` mark geometry.** Animate the "C" mark's stroke drawing on with a `stroke-dasharray`/`stroke-dashoffset` keyframe, or a slow pulse/scale on the existing SVG path — no new dependency, works identically in every framework this library already supports (tokens + CSS, not React-only), and automatically respects the reduced-motion handling already built into `src/styles/components.css`. This is the one I'd build first: it's genuinely on-brand rather than a generic spinner, costs nothing in bundle size, and fits the project's existing "framework-neutral core" architecture instead of cutting against it. Ship it as a `BrandedLoader`/`LoadingScreen` component alongside the existing `Spinner`/`Skeleton`, not a replacement for either — `Spinner` and `Skeleton` are for inline/in-context loading, this would be specifically for a full-screen "the app is starting" moment.
2. **`@formkit/auto-animate`** (npm, ~2KB, MIT) if there's appetite for small automatic transitions elsewhere — e.g. items animating in/out of the RoadmapBoard columns, or a toast sliding in — without hand-writing keyframes per case. It's a single hook (`useAutoAnimate()`) applied to a container, framework-light, and low-risk to try since it degrades gracefully (an unanimated DOM change) if something doesn't suit it.
3. **`motion`** (npm, the renamed/rebuilt Framer Motion, `import { motion } from 'motion/react'`) only if there's a real need for richer orchestration later — staggered list reveals, shared-element/layout transitions, gesture-driven interactions. This is the heaviest option (a real dependency, React-specific, ~30KB gzipped) and would need to be gated the same way Recharts already is: an optional peer dependency behind its own entry point, not bundled into the core. I would not reach for this just for a loading screen — it's overkill for that specific ask, and it's the one place on this list where "don't go over the top" cuts hardest.

Recommendation: build option 1 now if/when this gets picked up, and treat 2 and 3 as separate, later decisions with their own justification — don't pull in an animation library "while we're at it" for a loading screen that doesn't need one.
