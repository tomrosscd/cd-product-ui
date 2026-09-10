# Adopting Convert Product UI in an existing application

Written for a developer, or a coding agent working on their behalf, moving an existing dashboard onto this library. It covers which component to reach for, what to leave alone, and how to upgrade without breaking a working screen.

Read [the composition guide](dashboard-composition.md) for worked layout code, and [the component guide](component-catalogue.md) for full APIs.

## Adopt in this order

Do not convert a whole screen in one change. Each step below is independently shippable and independently revertable.

1. Install the release and import the stylesheet. Change nothing else. Confirm the application still builds and looks unchanged.

   ```sh
   pnpm add --save-exact https://github.com/tomrosscd/cd-product-ui/releases/download/v0.10.0/convert-product-ui-0.10.0.tgz
   ```

   ```tsx
   import '@convert/product-ui/styles.css'
   ```

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

Set `collapsible` for a menu button that reduces the rail to icons, and `defaultCollapsed` to start collapsed.

**To remember the collapsed state across reloads, drive it yourself.** The library holds no persistence, by design, so pass `collapsed` and `onCollapsedChange` and store the value wherever your application already stores preferences:

```tsx
const [collapsed, setCollapsed] = useState(() => readNavPreference())

<DashboardSidebar
  collapsible
  collapsed={collapsed}
  onCollapsedChange={(next) => {
    setCollapsed(next)
    writeNavPreference(next)
  }}
  {...rest}
/>
```

Without those two props the state is in-memory and resets on reload, which is the expected uncontrolled behaviour rather than a limitation.

To put your own logo in the header, pass `brand`. The collapsed rail and the mobile bar have no room for a wordmark, so pass `brandMark` for those. Both fall back to Convert's own logo.

Use `DashboardShell` only if you do not already have an application shell. It renders its own fixed sidebar and offsets the main region. **If you already have a shell, use `DashboardSidebar` on its own** and keep your existing layout, or you will nest two shells.

### Tables

Use `Table` for static data. Use `DataTable` for search, sorting, pagination and supplied summary footers. Column sizes and leading sticky columns shipped in 0.9.0.

The 0.10 candidate adds controlled state, server pagination, selection, visibility, pinning and expandable rows. Follow [the table guide](data-table.md) for saved views and remote data. These APIs are not in the 0.9.0 archive.

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

### Upgrading to 0.9.0 specifically

Three defaults change what an existing screen looks like. Check these before you ship:

- **`Badge tone="negative"`** now has a soft red tint. It previously used the page colour, so it read as bare text.
- **A closed `SidebarSection`** now actually hides its children. They were still visible and still reachable by Tab, despite the section reporting itself closed.
- **A `DataTable` column that declares a `size`** now gets that size, and the table switches to fixed layout. If you set sizes previously and saw no effect, you will now.

From 0.8.0 there is also one earlier change worth repeating: `Progress` no longer clamps a value to `max`, so a bar above its maximum shows the true overrun. If you were clamping values yourself before passing them in, stop. Pass the real number.

## When something is missing

Do not fork a component to change its appearance. Either compose the primitives (`Card`, `Badge`, `TextLink`, `ContentList`) into what you need, or [open an issue](https://github.com/tomrosscd/cd-product-ui/issues/new/choose) describing the screen you are building. Overriding library CSS is a deliberate exception worth reviewing, not a default.
