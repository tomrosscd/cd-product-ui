# Claude Code handoff: rebuild Quick Capture on cell controls

Copy the prompt below into Claude Code in the cd_capacity repository once 0.13.0 is available.

---

Upgrade Product UI to 0.13.0 and rebuild the Projects Quick Capture mode on the cell controls it adds. This is a rewrite of that mode, not only a dependency bump. Leave the read-only List mode alone.

Read the installed package's `docs/release-0.13.md`, `docs/quick-capture-pattern.md`, `docs/adopting-in-an-app.md` and `docs/ai-guidance.md` before editing. The hosted catalogue has **Patterns / Quick capture** and **Patterns / Projects capture**; the second recreates this repository's own Projects screen and is the closest reference. The catalogue follows main, so use the v0.13.0 tag for exact-version behaviour.

1. Inspect the repository instructions, current branch, package manager, authoritative lockfile, installed Product UI version and vendor archive. Inventory `components/project/QuickCaptureTable.tsx` and its editors (`InlineSelect`, `InlineTextarea`, `InlineDatePicker`, `MultiSelect`) before changing anything. Preserve unrelated work.

2. Install 0.13.0 from https://github.com/tomrosscd/cd-product-ui/releases/tag/v0.13.0, verifying the checksum if SHA256SUMS is published, and update the authoritative lockfile. Preserve the established vendor workflow. Do not substitute a branch checkout or overwrite an older versioned archive.

3. Replace the four inline editors with the library's cell controls and wrap the table in `CellGrid`. Every cell is editable while Quick Capture is on; there is no click-to-edit. That is what removes the layout shift, because there is no longer a resting shape and an editing shape that differ.

4. Choose each control deliberately, because the three are not interchangeable:
   - `CellSelect` for plain text options (Disco Tier, Size). Native, so its popup is drawn by the operating system and cannot carry colour.
   - `StyledSelect` with `cell` for Health, using an `icon` on each option. This is what preserves the red/amber/green dot. A native select cannot show it. Pair `.cui-icon-filled` with `.cui-positive`, `.cui-warning` and `.cui-negative`.
   - `Combobox` with `cell` for the person columns (BA, SA/TL, Designer, PM, AM), which are too long for a native select to be pleasant.

5. Set widths on the `<th>`, never on the controls. The current `max-w-[180px]` on a select and `minWidth: 140` on a textarea are unrelated to their columns and are why a value overlaps its neighbour. Pin the Client column with `cui-cell-sticky` so the identifier survives horizontal scrolling across twenty-one columns.

6. Give every control a specific `label`, such as `BA for ${row.client}`. It is announced to assistive technology and never rendered, because the column header is the visible label. Do not add a visible label per row.

7. Keep the Supabase writes, audit logging and `triggerAllocationGeneration` behaviour, but debounce per cell and keep the value optimistic. Do not `await` a save on blur: that is a large part of why tabbing feels broken today. Show failure next to the cell that failed using the control's `invalid` prop plus a message, not a page-level banner, and never colour alone.

8. Leave `ColumnConfigPanel`, `SavedViewsMenu`, `ColumnResizeHandle`, `RAGDot`, `PhaseBadge`, `ThirdPartyPopover` and column-preference persistence in place. Keep `MultiSelect` for skills and platforms: there is no multi-select cell control yet.

9. Do not override the cell controls' borders, padding or height with utility classes. Their box is deliberately identical resting, hovered and focused.

10. Verify before opening a PR: a cell does not change size when focused, and no row moves as you work down a column; Tab crosses a row, Enter fills down a column, Escape leaves the grid; the Client column stays put when scrolling sideways; the Health dot appears in both the open list and the chosen cell; no control overlaps a neighbouring column at any supported width; and the whole mode is usable with the keyboard alone. Run the repository's own checks and report what passed.

Report anything the library still cannot express rather than working around it with local CSS. Known gaps are a multi-select cell, bulk paste, and a saving helper.
