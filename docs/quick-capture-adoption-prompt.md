# Brief: rebuild Quick Capture on the shared cell controls

Hand this to whoever works on `cd_capacity`. It assumes no knowledge of the Product UI repository.

---

## Context

Quick Capture on the Projects page has inputs that jump around and overlap. The cause is not a styling bug to patch: it is the click-to-edit approach itself, plus four hand-rolled editors that the design system could not previously replace.

Product UI now ships controls built for table cells, and a keyboard wrapper for bulk entry. Rebuild Quick Capture on them.

**Upgrade to Product UI 0.13.0 or later first.** These components do not exist before it. Read `node_modules/@convert/product-ui/docs/quick-capture-pattern.md` after installing, and open Storybook at **Patterns / Quick capture** for a working reference built to mirror this exact table.

## What is wrong now

In `components/project/QuickCaptureTable.tsx` and its editors (`InlineSelect`, `InlineTextarea`, `InlineDatePicker`, `MultiSelect`):

1. **The cell changes size when clicked.** The resting cell is a `<button>` with no border or padding; the editing cell is a `<select>` with `border px-1.5 py-0.5`. Different box, so the row grows and the columns shift the moment you click. This is the "all over the place" the user is describing.
2. **Controls size themselves, not their column.** `max-w-[180px]` on the select and `minWidth: 140` on the textarea are unrelated to the actual column width, which is why the Designer select overlaps the BA value.
3. **Each editor has its own focus ring** (`focus:ring-1 focus:ring-(--forest)`), matching nothing else in the product.
4. **One cell at a time.** Every value costs a click, a type and a click away. There is no way to run down a column, which is what bulk entry is.

## What to build

Replace the four inline editors with `CellInput`, `CellSelect` and `CellTextarea`, and wrap the table in `CellGrid`.

```tsx
import { CellGrid, CellInput, CellSelect, CellTextarea } from '@convert/product-ui'

;<CellGrid>
  <Table caption="Projects" density="compact" layout="scroll" minWidth={1010}>
    {/* thead: the column headers are the visible labels */}
    <tbody>
      {rows.map((row) => (
        <tr key={row.id}>
          <th scope="row">{row.client}</th>
          <td>
            <CellSelect
              label={`BA for ${row.client}`}
              options={people}
              value={row.ba ?? ''}
              onChange={(event) => save(row.id, 'ba', event.target.value || null)}
            />
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
</CellGrid>
```

### Rules that matter

- **Every cell is editable while the mode is on.** No click-to-edit. The List / Quick Capture toggle already declares intent, and this is what removes the layout shift: there is no resting shape and editing shape to differ.
- **Never add a border, padding or height on focus.** The cell controls already handle this; do not override it with utility classes.
- **Do not set widths on the controls.** Set widths on the `<th>` instead and let the control fill its cell.
- **`label` is for assistive technology and is never rendered.** Make it specific: `` `BA for ${row.client}` ``, not `BA`. The column header is the visible label.
- **Do not take the arrow keys.** They belong to the controls. `CellGrid` provides Enter to move down a column, Shift+Enter to move up, Escape to release.
- **Keep the read-only List mode** as it is. Only Quick Capture changes.

### Saving

Product UI deliberately does not model saving. Keep your Supabase writes, but:

- **Debounce per cell** and keep the value optimistic. Do not `await` a save on blur: it makes tabbing feel broken, which is a large part of the current problem.
- **Show failure next to the cell that failed**, using the control's `invalid` prop plus a message. Do not use a page-level banner, and do not rely on colour alone.
- Keep the existing audit logging and `triggerAllocationGeneration` behaviour.

### Leave alone

`ColumnConfigPanel`, `SavedViewsMenu`, `ColumnResizeHandle`, `RAGDot`, `PhaseBadge`, `ThirdPartyPopover` and the column-preference persistence are all working and out of scope.

## Known gaps, so you do not wait for them

- **No searchable cell picker yet.** `CellSelect` is a native `<select>`, which gives type-ahead and is fine for tens of options. If a person list runs to hundreds, raise it: a cell-shaped `Combobox` is the next thing planned.
- **No multi-select cell.** Keep your `MultiSelect` for skills and platforms for now.
- **No bulk paste.** Pasting a spreadsheet column is not supported by either side yet.

## Done means

- Quick Capture has no layout shift: a cell is the same size resting, hovered and focused. Check by clicking through a column and watching whether rows move.
- Tab crosses a row, Enter fills down a column, Escape leaves the grid.
- No control overlaps a neighbouring column at any window width you support.
- Focus rings match the rest of the product, because they come from the library.
- `QuickCaptureTable.tsx` is substantially smaller and the four inline editors are deleted or reduced to the ones still genuinely needed.
- Keyboard-only pass: reach every cell, change a value, and leave, without a mouse.
