# 0.9.0: tables that carry real data

Everything the first external consumer needed to stop hand-composing, plus the table work their dense screens run into next. Nothing was removed or renamed. Two existing default appearances change, both listed under "Visible changes" below.

## Tables

A column definition's `size` now reaches the rendered column. Declaring any size switches the table to fixed layout, which is what makes a declared width decide the column: under the browser's default auto layout a width is a hint and is routinely ignored.

Sizes behave as **ratios, not absolute pixels**. A table filling its container distributes the surplus proportionally, so a 220/110/140/140 set stays in that proportion at any container width. Tables that declare no size keep the automatic sizing they had.

Per-column presentation comes from `meta`, typed through TanStack's own `ColumnMeta` augmentation:

- `numeric` aligns the column to the end and switches on tabular figures, so digits line up down the column instead of drifting with glyph width. This is what makes a dense financial column scannable.
- `align` sets `start`, `center` or `end`.
- `sticky` pins a leading column while the table scrolls horizontally, so a row's identifier stays readable. Pair it with `tableLayout="scroll"` and a declared `size`.

A column definition's `footer` renders a totals row into a `tfoot`. This is TanStack's existing field, not a second API, and a table whose columns declare no footer gains no `tfoot`.

Formatting the value stays with your application: currency, hours, negatives and what "missing" looks like are its decisions. The library supplies the cell treatment. **A total must not silently count a missing observation as zero**, per the metric rules in AGENTS.md; the `Sticky column and totals` story shows one way to handle it.

## Navigation

`DashboardSidebar` takes `brand` and `brandMark`, so a product can show its own wordmark inside the Convert system. `brand` replaces the logo in the expanded sidebar; `brandMark` replaces the mark in the collapsed rail and mobile bar, where a wordmark does not fit. Both fall back to Convert's own.

The collapse control moved. Expanded, a quiet panel-collapse button sits on the trailing edge of the branding row, replacing the separate hamburger and label row beneath the logo. Collapsed, a panel-expand button sits centred beneath the mark, in the space the workspace block occupies when expanded, so the first destination holds the same vertical position in both states. Branding is never a toggle: clicking the logo does not collapse navigation.

Adds `sidebar-collapse` and `sidebar-expand` icons and the `--cui-size-rail` token.

## Fixes

**A closed sidebar section still rendered its children and kept them in the tab sequence** while reporting `aria-expanded="false"`. The list carried the `hidden` attribute, but a class-based `display: flex` outranks the user agent's `[hidden] { display: none }`, so the attribute had no effect. The accessibility state and the rendered state disagreed.

**A `negative` badge was invisible as a chip.** It used `--cui-surface-page`, within 1.00:1 of the page behind it, so it read as bare text beside the tinted positive and warning badges.

## Visible changes to review before upgrading

| What                                      | Before                                      | After                                    |
| ----------------------------------------- | ------------------------------------------- | ---------------------------------------- |
| `Badge tone="negative"`                   | Untinted, indistinguishable from the page   | Soft red tint, 1.20:1 against the page   |
| Closed `SidebarSection`                   | Children still visible and tabbable         | Children hidden and out of the tab order |
| Sidebar collapse control                  | Hamburger and "Collapse" row under the logo | Icon button on the branding row          |
| `DataTable` with a declared column `size` | Size ignored                                | Applied, with fixed layout               |

## Repository tooling

`pnpm registry:check` and `registry:sync` guard the shadcn registry's copy of the token source, generator and responsive template against the canonical files, wired into CI. When first run the copy was already six tokens behind. `.github/workflows/registry.yml` publishes the registry to GitHub Pages on a version tag at an immutable `/r/v<version>/` path plus a `/r/latest/` alias. **GitHub Pages must be enabled on the repository before that workflow can run**, which is deliberately left as the owner's decision.

## Upgrading

A version bump and a reinstall. Review any screen using a `negative` badge or a collapsible sidebar section, since those are where output changes.

## Not covered

Controlled sorting, pagination and filter state; column visibility and pinning beyond a leading sticky column; server-driven pagination; the capacity matrix and read-only Gantt. Forced-colours mode, RTL and rendering with licensed Roobert files remain unverified. See [ROADMAP.md](../ROADMAP.md) section 1b.
