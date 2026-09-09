# 0.8.0: composition and navigation

The pieces needed to build a dashboard out of the library rather than around it: layout primitives, a flexible list row, an opt-in read-only board, and navigation that nests and collapses.

0.7.0 was prepared but never tagged, so its interaction-quality work ships here too. See [the 0.7.0 notes](release-0.7.md) for that half.

Everything is additive except one `Progress` change, described under "Behaviour change" below. Nothing was removed or renamed.

## Layout

`Stack`, `Grid`, `SplitLayout` and `PageHeader` space content from the approved scale so a dashboard does not need hand-written CSS.

`Grid` takes `columns` (1 to 4) and `minItemWidth`, and collapses on available width rather than at a fixed breakpoint, so it works inside a narrow panel as well as a full page.

`SplitLayout` takes `ratio`: `primary` (default, a two-to-one split), `balanced`, or `secondary`.

`PageHeader` takes `heading`, `headingLevel`, `context`, `description` and `actions`.

## Lists

`ContentList` and `ContentListItem` compose a leading indicator, title, supporting content, trailing metadata and actions on one row. Use them where `ActivityList` and `ResourceList` are too fixed: those take string-only fields and cannot carry a per-row action.

The row is deliberately not a click target. Put a real link in `title` or a real button in `actions`, so keyboard users get one predictable target each.

## Read-only boards

`RoadmapBoard` and `RoadmapCard` accept `readOnly`, which hides the stage select and priority checkbox. It defaults to `false`, so a board that does not set it keeps the editing controls it has today.

This is presentation, not permission. Enforce authorisation in the application.

## Navigation

`DashboardSidebar`'s `items` now takes `SidebarEntry`, a union of the existing `SidebarItem` and a new `SidebarSection` holding child destinations. A flat `SidebarItem[]` still works and renders exactly as before.

Sections are disclosures: a button with `aria-expanded` and `aria-controls`, never a link. The section holding the current page opens on load, and reopens if the route later moves into it, but a reader can still close it.

`collapsible` adds a menu button that reduces the rail to icons at the new `--cui-size-rail` width. Use `collapsed` with `onCollapsedChange` for controlled state, or `defaultCollapsed` for uncontrolled. It is off by default. `DashboardShell` owns the state when you use it, because the main region has to move with the rail.

Choosing a section while collapsed expands the rail rather than opening the section in place, since a 64px rail has no room for child destinations.

The structure follows [Material Design 3's navigation rail](https://m3.material.io/components/navigation-rail/guidelines), read 9 September 2026. Two deliberate differences: M3 puts a navigation bar at compact widths, where this library keeps its existing mobile drawer, and M3 does not specify accordion sub-menus, so the disclosure behaviour is this library's own. The appearance uses Convert's tokens throughout.

## Behaviour change: Progress past its maximum

`Progress` no longer clamps a value to `max`.

Clamping meant a value above the maximum reported the same width and the same percentage as the maximum itself, so 142 of 100 and 100 of 100 were indistinguishable. For a capacity bar that is a false reading, not a display quirk.

The track now rescales when the value exceeds the maximum, and a marker shows where the maximum sits. At 142% the marker lands at 70% of the track and at 168% at 60%, so the size of the overrun is visible. The percentage reads above 100, `aria-valuemax` widens with the value so `aria-valuenow` stays inside the range ARIA requires, and `aria-valuetext` carries a reading such as "142% of 100".

**Values at or below the maximum are unchanged**, including width, label and every ARIA attribute. Only inputs that previously produced a false reading behave differently.

Colour is still not a signal on its own: pair `tone` with `valueLabel` or `hint`.

## Upgrading

A version bump and a reinstall. Review any screen that passes a `Progress` value above its `max`, since that is the only place output changes.

## Not covered

`DataTable` is unchanged: no column sizing, pinning, controlled state or server pagination. Forced-colours mode, RTL and rendering with licensed Roobert files remain unverified. See [ROADMAP.md](../ROADMAP.md) section 1b for the sequenced list.
