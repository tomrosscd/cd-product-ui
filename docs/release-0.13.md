# 0.13.0: filling in a table quickly

Controls that fit a table cell, keyboard movement down a column, and a searchable picker for the columns that need one. Everything is additive; nothing was removed or renamed.

Built after a consuming application's bulk-entry mode was found to import nothing from this library, because the library had nothing it could use: every form control requires `label` and renders it visibly, which is wrong in a cell where the column header is already the label.

## Cell controls

`CellInput`, `CellSelect` and `CellTextarea` take the same `label` as every other control and put it on `aria-label` rather than rendering it.

Their **box does not change between resting, hover and focus**. The border is always present and only changes colour. This is the property that matters: a control that gains a border on focus is taller than it was a moment earlier, which shifts its row and everything below it. That swap is the usual reason a hand-rolled editable table feels unstable.

`CellTextarea` stays one row and scrolls rather than growing, so a long note does not push the rest of the table down mid-entry.

## Keyboard movement

`CellGrid` wraps a table of live controls and adds the axis that repetitive entry needs.

| Key                 | Moves                                                                                   |
| ------------------- | --------------------------------------------------------------------------------------- |
| Tab / Shift+Tab     | Across the row and on to the next. Free: these are real form controls in document order |
| Enter / Shift+Enter | Down and up the same column                                                             |
| Escape              | Releases focus from the grid                                                            |
| Arrow keys          | Untouched. They belong to the control: the caret in a text field, the value in a select |

A textarea keeps Enter for line breaks and navigates on Cmd or Ctrl+Enter.

## Choosing a cell control

Three kinds of dropdown, and the choice is not cosmetic:

- **`CellSelect`** for plain text options. It is a native `<select>`, which gives type-ahead free and keeps native semantics. Its popup is drawn by the operating system, so it **cannot carry an icon or a colour** and will not match your branding.
- **`StyledSelect` with `cell`** when an option needs a colour or an icon, such as a red/amber/green status. Options take an `icon`, rendered inside the item text, so it appears both in the open list and in the chosen cell.
- **`Combobox` with `cell`** when the list is long enough to need searching, such as a person picker.

In `cell` mode a combobox's list **no longer opens on focus**. Opening on focus suits a form; in a grid, Tab crosses a row and would pop a listbox over every picker on the way past. It also keeps Enter unambiguous: closed it moves down the column, open it picks the active option. Typing, ArrowDown and a click still open it.

## Also added

- `.cui-warning` text colour, completing the trio beside `.cui-positive` and `.cui-negative`.
- `.cui-icon-filled`, which fills a curated icon with the current colour. The set is stroked outlines, and at status-dot size a ring reads as an empty state.
- `Patterns/Quick capture` and `Patterns/Projects capture` in Storybook. The second recreates a consuming application's real screen: twelve of its twenty-one columns, five person pickers, most cells empty.

## Fixed

- `.cui-cell-sticky` set `position: sticky` and no inset, which does nothing on its own. Only `DataTable` supplied one, computed in JS, so a hand-composed table got a pinned column that scrolled away with everything else. It now pins to the leading edge by default, and `DataTable`'s computed offset still overrides it.
- `Combobox` did not prevent default on Escape while its list was open, so one press both closed the list and reached any outer handler.

## Not included

Saving is the application's: debounce per cell, keep the value optimistic, and show failure next to the cell that failed. There is no `useCellSave` helper.

Also absent: a multi-select cell, bulk paste of a spreadsheet column, and a cell-shaped date picker beyond `CellInput type="date"`.

## Upgrading

A version bump and a reinstall. Nothing existing changes appearance or behaviour.
