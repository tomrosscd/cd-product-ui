# Adopting Convert Product UI in an existing application

Written for a developer, or a coding agent working on their behalf, moving an existing dashboard onto this library. It covers which component to reach for, what to leave alone, and how to upgrade without breaking a working screen.

Read [the composition guide](dashboard-composition.md) for worked layout code, and [the component guide](component-catalogue.md) for full APIs.

## Adopt in this order

Do not convert a whole screen in one change. Each step below is independently shippable and independently revertable.

1. Install the release and import the stylesheet. Change nothing else. Confirm the application still builds and looks unchanged.
2. Replace tokens. Swap hard-coded colours, spacing and type for `--cui-*` variables. This is the highest-value step and the lowest risk.
3. Replace layout. `Stack`, `Grid`, `SplitLayout`, `PageHeader`.
4. Replace rows and cards. `ContentList`, `Card`, `Metric`.
5. Replace navigation last. It is the most structural change and the easiest to get wrong.

## What to use for what

### Page structure

| You have                                                        | Use                                                                                                                   |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| A page title, a date or context line, and a button on the right | `PageHeader` with `heading`, `context`, `description` and `actions`                                                   |
| A row of summary tiles                                          | `Grid` with `columns={4}` and `Metric` or `Card` inside                                                               |
| A wide panel beside a narrow one                                | `SplitLayout` with `primary` and `secondary`. `ratio="primary"` is a two-to-one split, `ratio="balanced"` an even one |
| Vertical rhythm between sections                                | `Stack` with `gap` from the spacing scale                                                                             |

`Grid` collapses on the width available to it, not on the viewport, so it behaves correctly inside a narrow panel.

### Lists and queues

Use `ContentList` with `ContentListItem` for any row carrying more than a label.

`ContentListItem` takes `leading` (an avatar, a status dot, a badge), `title`, `description`, `meta` (trailing text such as a date or a percentage) and `actions` (a link or button).

The row is deliberately not a click target. Put a real link in `title` and real buttons in `actions`, so keyboard users get one predictable target each rather than a nested one.

Use `ActivityList` or `ResourceList` only for simple string-only rows. They cannot carry a per-row action.

### Status and RAG

Use `Badge` with `tone`: `positive`, `warning` (amber), `negative`, `accent`, `neutral`.

**Known limitation.** A badge's background sits close to the surface behind it, measuring between 1.00:1 and 1.37:1, so the chip shape reads faintly and the text colour carries most of the meaning. If your application already has stronger status chips, keep them and use the `--cui-text-warning`, `--cui-text-positive` and `--cui-text-negative` tokens for their colour. A softer tint is on the roadmap.

Never rely on colour alone. Every status needs a text label.

### Capacity and progress

Use `Progress` with `tone` for a capacity bar, and always pair it with `valueLabel` or `hint`.

Pass the real value even when it exceeds `max`. The track rescales, a marker shows where the maximum sits, and the percentage reads above 100, so 142% and 168% are distinguishable. Do not pre-clamp values before passing them in: that throws away the information the bar exists to show.

Use `AllocationBar` for a part-to-whole split, not `Progress`.

### Boards

Use `RoadmapBoard` with `readOnly` for a pipeline nobody edits. Without it, every card renders a stage select and a priority checkbox.

`readOnly` is presentation, not permission. Enforce authorisation in the application.

### Navigation

Use `DashboardSidebar`. `items` accepts a mix of:

- `SidebarItem` for a destination: `{ id, label, href, icon?, disabled? }`
- `SidebarSection` for a group: `{ id, label, icon?, items, defaultOpen? }`

Set `collapsible` for a menu button that reduces the rail to icons, and `defaultCollapsed` to start collapsed. Use `collapsed` with `onCollapsedChange` to drive it from your own state.

Use `DashboardShell` only if you do not already have an application shell. It renders its own fixed sidebar and offsets the main region. **If you already have a shell, use `DashboardSidebar` on its own** and keep your existing layout, or you will nest two shells.

### Tables

Use `Table` or `DataTable` as they are. Be aware of what they do not yet do: no column width control, no pinned columns, no column visibility, no server-driven pagination, and column `size` on a TanStack column definition is not applied to rendered cells. For a dense financial table these matter; see [ROADMAP.md](../ROADMAP.md) section 1b.

## What to leave alone

- **Your application shell**, if you have one.
- **Your router.** Pass `href` values your router understands and use `onNavigate` to intercept clicks. The library never navigates by itself.
- **Your data fetching, permissions, calculations and formatting of business values.** The library holds none of this and should not start.
- **Fonts.** The package ships no font files. Load licensed Roobert yourself; without it the stack falls back to Geist then Arial, which is expected.

## Upgrading safely

1. Read [the changelog](../CHANGELOG.md) for every version between yours and the target, not only the target. Look for entries marked "Behaviour change".
2. Install the exact archive filename and commit it with your lockfile. Never point at a moving link.
3. Run your own checks, then walk the screens you changed with the keyboard alone: tab order, focus visibility, Escape closing overlays, focus returning to the control that opened them.
4. Check both themes if you support dark, and check one screen at 320px wide.
5. Commit the archive, dependency and lockfile changes in one pull request so a rollback is one revert.

To roll back, revert that commit and reinstall from the restored lockfile.

### Upgrading to 0.8.0 specifically

Everything is additive except one change: `Progress` no longer clamps a value to `max`. If you pass values above `max` anywhere, those bars will now show the true overrun instead of a full bar. That is the intended fix, but look at those screens before you ship.

If you were clamping values yourself before passing them in, stop. Pass the real number.

## When something is missing

Do not fork a component to change its appearance. Either compose the primitives (`Card`, `Badge`, `TextLink`, `ContentList`) into what you need, or [open an issue](https://github.com/tomrosscd/cd-product-ui/issues/new/choose) describing the screen you are building. Overriding library CSS is a deliberate exception worth reviewing, not a default.
