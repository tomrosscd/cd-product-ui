# 0.4.0: naming consistency and public API guarantees

This is the one deliberately breaking release in this library's history so far, done now while it has exactly one known consumer (see [CONSUMERS.md](../CONSUMERS.md)) rather than later once more projects depend on it. No new components ship in 0.4.0 — everything here is either the rename below, or an internal change with no effect on how you use the library.

## Migration: rename `title` to `heading`

Seven components used `title` where Card already used `heading` for the same concept — the identifying text of a content block. Update every usage of these components:

| Component            | Old prop  | New prop  |
| -------------------- | --------- | --------- |
| `Alert`              | `title`   | `heading` |
| `EmptyState`         | `title`   | `heading` |
| `Disclosure`         | `title`   | `heading` |
| `ConfirmationDialog` | `title`   | `heading` |
| `DataChart`          | `title`   | `heading` |
| `RoadmapBoard`       | `title`   | `heading` |
| `SignInForm`         | `title`   | `heading` |
| `SignInForm`         | `pending` | `loading` |

This is a plain rename — the value you were passing works exactly the same under the new prop name. A find-and-replace of `title=` to `heading=` on these seven components' JSX usages (and `pending` to `loading` on `SignInForm`) is the entire migration. TypeScript will catch anything missed: `title`/`pending` will report as an unknown prop, not silently do nothing.

**Not affected by this rename** (these keep their existing prop names — see the reasoning in the commit that made this change if you want the full explanation):

- `Table.caption` — matches the native `<caption>` element, kept distinct on purpose.
- `Tabs.label`, `Progress.label`, `AllocationBar.label`, `ChartContainer.label`, `Breadcrumbs.label` — these are accessible-name/paired-label roles, not "this block's heading."
- `RoadmapItem.title` (a field on each roadmap item, not a component prop) and `ToastMessage.title` (a field on each toast) — unchanged, since these are data-record shapes, not component instantiation props.

## New: public API surface guarantee

Starting with this release, every public export (every component prop, every exported type, across all three entry points — `.`, `./tokens`, `./charts`) is snapshotted in `etc/*.api.md` and checked in CI (`pnpm api:check`). A future breaking change will show up as an explicit, reviewable diff against that snapshot rather than relying on someone noticing a renamed prop by eye. See [the backward-compatibility policy](release-process.md#backward-compatibility).

## Internal changes with no effect on usage

- `SelectOption`, `RadioOption` and `SearchSelectOption` are now type aliases of one shared `ChoiceOption` (also exported) instead of three separately-maintained identical interfaces. Nothing that imports them by name needs to change.
- `Button` now forwards its ref (`React.forwardRef`). If you were passing a `ref` to `Button` before, it was silently discarded at runtime (React would have logged a dev warning); it now actually attaches to the underlying `<button>`.
- `Card`'s loading state and `RadioGroup`'s error/hint description logic were internally consolidated with `Skeleton` and `Field` respectively — visually and behaviourally identical, just no longer duplicated.
- `RoadmapCard`'s heading level moved from `h3` to `h4`, correcting a skipped heading level under the board's `h2` → column's `h3` hierarchy. Class-based styling, not a tag selector, so no visual change.

## Review and adoption

Run the existing release checks plus `pnpm api:check`. If you maintain a project that installs this package, update the seven prop names above, reinstall, and run your own visual/keyboard review of anywhere you use these components — this is exactly the kind of change [CONSUMERS.md](../CONSUMERS.md) exists to help coordinate.
