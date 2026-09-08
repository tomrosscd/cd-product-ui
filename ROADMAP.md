# Roadmap

Everything here came out of a full codebase review (8 September 2026) and was deliberately deferred rather than fixed immediately — either because it's a breaking change that needs coordinating with [CONSUMERS.md](CONSUMERS.md) first, or because it's a real feature that deserves its own stories, tests and docs rather than being rushed into a "quick fix" batch. Nothing on this list is urgent; work through it whenever there's appetite. See [docs/release-process.md](docs/release-process.md#backward-compatibility) for how to ship the breaking items safely.

When you pick something up, move it from here into a normal feature branch and PR — don't edit components directly against this list. Delete an item once it ships, and note it in CHANGELOG.md as usual.

## 1. Naming and consistency refactor (breaking — coordinate with CONSUMERS.md first)

The foundations (tokens, theming, TypeScript strictness) are consistent; the component layer isn't, because different components were built in different sessions without cross-referencing each other. None of this is urgent to fix, but it should be done as one dedicated, focused release — not mixed into feature work — so a consumer's upgrade diff is easy to read.

- **Unify the "what to call this thing" prop.** Currently four different names for the same concept: `heading` (Card), `caption` (Table), `title` (Alert, EmptyState, Disclosure, ConfirmationDialog, DataChart, RoadmapBoard, SignInForm), `label` (Tabs, Progress, AllocationBar, ChartContainer, Breadcrumbs). Pick one (`heading` is the most established) and rename the rest.
- **Unify the "is this busy" prop/pattern.** `loading?: boolean` (Button, Select) vs `state: 'loading' | ...` (Card, DataTable, DataChart, RoadmapBoard) vs `pending` (SignInForm). Pick one pattern — probably keep the `state` union for components with multiple states (loading/empty/error/ready) and `loading: boolean` for simple toggles, but make every component that has an equivalent concept use the same union values.
- **Make the `state` union consistent.** Card is `'ready' | 'loading' | 'empty' | 'error'`; DataTable, DataChart and RoadmapBoard all drop `'empty'`. Decide whether every stateful component needs all four, and if so add the missing ones.
- **Consolidate the three structurally-identical option types**: `SelectOption`, `RadioOption`, `SearchSelectOption` (all `{value, label, disabled?}`). Export one shared type from a common location instead.
- **Fix `Button` to forward refs, then use it in the two remaining hand-rolled spots.** `dashboard-sidebar.tsx`'s `Dialog.Trigger asChild` and `Dialog.Close asChild` wrap raw `<button>` elements instead of `<Button>` specifically because `Button` isn't `React.forwardRef` — Radix needs the ref for its close-then-return-focus behaviour. Convert `Button` to `forwardRef` (purely additive, safe on its own), swap both sidebar buttons to use it, and **re-run the focus-return-after-Escape test** (`tests/components.test.tsx`) to confirm nothing regressed before merging.
- **Reconcile `BadgeTone` (`neutral | accent | positive | warning | negative`) and Alert's tone vocabulary (`info | success | warning | error`)** where it makes sense — they only overlap on `warning` today.
- **Have Card reuse `Skeleton`** instead of re-implementing the same skeleton markup inline (`card.tsx`); `Skeleton` currently exists but has no consumer other than its own story.
- **Have `RadioGroup` reuse `Field`'s `aria-describedby`/error-id logic** instead of re-implementing it from scratch — they compute the same thing two different ways today.
- Consider tightening `ChartConfig`/`ChartDatum` (currently loose index signatures in `src/charts/index.tsx` that force `!` non-null assertions and `unknown` casts elsewhere in the same file) — lower priority than the above, since it's an internal typing concern rather than a public API inconsistency.

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

- **Live-region overuse.** `EmptyState` hardcodes `role="status"` even when its content is static, so `RoadmapBoard` renders one live region _per empty column_ and `DataTable` renders one inside a table cell. Consider making `role="status"` opt-in (e.g. a `live` prop defaulting to `false`) rather than automatic.
- **Duplicate accessible-name announcement** on `Table`: `aria-label={caption + ", scrollable table"}` on the scroll region plus the same text again in the native `<caption>` — a screen reader announces it twice.
- **Broken heading hierarchy in RoadmapBoard**: board title is `h2`, column label is `h3`, and cards _inside_ the column are also `h3` (should be `h4`, or use `Card`'s existing `headingLevel` prop, which `RoadmapCard` currently ignores).
- **Dropped `href` on the current breadcrumb.** `Breadcrumbs` gives the last item `aria-current="page"` as a `<span>` and silently discards `item.href` if one was supplied — worth deciding whether that's intentional (current page usually shouldn't be a link) and documenting it, or supporting a linked "current page" for cases where it should still navigate (e.g. a refresh action).

## 5. Testing and tooling, further out

- **Interaction test coverage for `Button` and `DashboardSidebar`'s mobile drawer.** Both are genuinely interactive and currently have zero Storybook play-function coverage (they're covered only by the jsdom unit tests in `tests/components.test.tsx`, which don't exercise real browser focus/keyboard behaviour the way the Storybook/Playwright project does for other components).
- **A coverage threshold in CI**, once there's a sense of what's realistic per-directory (the current 97% baseline is generous because most components at least render in a story even without an interaction assertion — don't just gate on that number without thinking about what it actually measures).
- **`typescript-eslint` `recommendedTypeChecked`** instead of the current plain `recommended`, for stricter type-aware linting.
- **`eslint-plugin-storybook`**, and lint coverage for `examples/**` (currently excluded from both ESLint and `tsc`, so the Next.js/React consumer fixtures that `next:check` builds are never linted or type-checked).
- **Print stylesheet** (`@media print`) — currently doesn't exist anywhere in `src/styles/`.
- **RTL language support.** A handful of logical CSS properties exist already, but there's no `[dir="rtl"]` handling or story — directionality has been unconsidered rather than actively supported.
- **Visual regression testing (Chromatic or similar).** Deliberately deferred by decision on 8 September 2026 — not worth the external-account overhead at the current team/contributor size. Revisit if the component count or number of people submitting UI PRs grows meaningfully.
