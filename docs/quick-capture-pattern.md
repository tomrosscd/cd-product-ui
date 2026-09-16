# Quick capture: editing many table cells at once

How to build a mode where someone fills in a lot of cells quickly, and why the obvious implementation goes wrong. Written for whoever picks this up next, in this library or in a consuming application.

The reference implementation is Storybook **Patterns / Quick capture** (`src/patterns/quick-capture.stories.tsx`).

## The problem with click-to-edit

The usual first attempt renders a read-only cell and swaps in a control when you click it. It fails for bulk entry in four ways, all of which the first consumer hit:

**The cell changes size when you click it.** A resting cell is usually text or a borderless button. An editing cell has a border and padding. That is a different box, so the row grows, the columns shift and the page moves under the cursor. This is the single biggest cause of an editable table feeling unstable.

**Controls size themselves, not their column.** A control with `max-width: 180px` in a column that is not 180px wide either overflows into its neighbour or leaves a gap.

**Each control invents its own focus treatment.** Hand-rolled rings do not match the rest of the product and tend to be heavier than the system's.

**Every value costs a click.** Click the cell, type, click away. There is no way to run down a column, which is exactly what bulk entry is.

## The pattern

**Make it a mode, and commit to it.** A toggle (List / Quick capture) declares intent. Inside the mode every cell holds a live control. There is no click-to-edit because there is nothing to enter: you are already in it.

**Keep the box identical in every state.** The border is always present and only changes colour on hover and focus. Never add a border, padding or height on focus. `Patterns/Quick capture` asserts this to the pixel, because it is easy to lose in a later change.

**Use both axes of the keyboard.**

| Key                 | Moves                                                                                            |
| ------------------- | ------------------------------------------------------------------------------------------------ |
| Tab / Shift+Tab     | Across the row, then on to the next. Free: the controls are real form controls in document order |
| Enter / Shift+Enter | Down and up the same column. This is the one you have to add, and the one repetitive entry needs |
| Escape              | Releases focus from the grid                                                                     |
| Arrow keys          | **Left alone.** They belong to the control: caret movement in text, selection in a dropdown      |

Taking arrow keys for navigation is the usual reason a hand-rolled grid is hostile to type in. `CellGrid` does not take them.

**Label for assistive technology, not for the eye.** The column header is the visible label. Repeating it in every row is noise. Cell controls take `label` and put it on `aria-label`. Make it specific enough to be useful out of context: `` `BA for ${row.client}` `` rather than `BA`.

**Saving belongs to the application.** Debounce per cell, keep the value optimistic so typing is never blocked, and show a failure next to the cell that failed rather than as a page-level banner. Do not `await` a save on blur: it makes tabbing feel broken.

## What this library provides

```tsx
import { CellGrid, CellInput, CellSelect, CellTextarea, Table } from '@convert/product-ui'

;<CellGrid>
  <Table caption="Projects awaiting assignment" density="compact" layout="scroll" minWidth={1010}>
    <thead>{/* column headers carry the visible labels */}</thead>
    <tbody>
      {rows.map((row) => (
        <tr key={row.id}>
          <th scope="row">{row.client}</th>
          <td>
            <CellSelect
              label={`BA for ${row.client}`}
              options={people}
              value={row.ba}
              onChange={(event) => save(row.id, 'ba', event.target.value)}
            />
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
</CellGrid>
```

- **`CellInput`**: text, number, date, time, url, tel.
- **`CellSelect`**: takes `options` and renders its own empty choice, labelled `placeholder` (default "None"). Give the empty option real words: a blank option reads as a broken row.
- **`CellTextarea`**: one row tall, scrolls rather than growing. A cell that expands as you type pushes every row below it down. Long text belongs in the record view.
- **`CellGrid`**: wraps the table and adds the Enter/Shift+Enter/Escape behaviour above. It takes no focus and carries no role; it only observes events bubbling from the controls.

All three take `invalid` to mark a failed cell. Pair it with a message: colour is never a signal on its own.

## Known gaps

**No searchable cell picker.** `CellSelect` is a native `<select>`, which gives type-ahead for free and matches this library's preference for native control semantics. That holds for tens of options. For hundreds, a cell-shaped `Combobox` is wanted and does not exist yet.

**No multi-select cell.** A cell holding several values (skills, platforms) still needs hand-rolling.

**No bulk paste.** Pasting a column from a spreadsheet is the natural next accelerator and is not implemented.

**Saving is not modelled.** There is no `useCellSave` or equivalent. Each consumer writes its own debounce and error handling, which means each gets it slightly differently.
