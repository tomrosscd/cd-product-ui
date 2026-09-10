# Control table data and saved views

Use `DataTable` for semantic tables with optional controlled state. Keep fetching, permissions, totals and saved-view persistence in your application.

These additions require `0.10.0-rc.1`. The 0.9.0 archive supports client search, sorting, pagination, column sizes, leading sticky columns and summary footers.

## Control state

Pair `tableState` with `onTableStateChange`. Supply only the slices you control; omitted slices remain internal. Use stable data and column references.

This example controls the server page and sort order:

```tsx
import { useState } from 'react'
import { DataTable, type DataTableState } from '@convert/product-ui'

const [tableState, setTableState] = useState<Partial<DataTableState>>({
  pagination: { pageIndex: 0, pageSize: 25 },
  sorting: [],
  globalFilter: '',
})

<DataTable
  caption="Records"
  data={result.rows}
  columns={columns}
  getRowId={(row) => row.id}
  tableState={tableState}
  onTableStateChange={setTableState}
  manualPagination
  manualSorting
  manualFiltering
  rowCount={result.filteredTotal}
  pagination="full"
/>
```

Supply `result` from your request layer. Use `tableState` as request parameters and discard stale responses there. Set the loading/error presentation through `state`.

`pageIndex` is zero-based. `rowCount` is the server's filtered total, not the number of rows on one page. Reset the page when external filters change.

## Configure columns

Use `columnVisibility`, `columnOrder` and `columnPinning` in `tableState`. Column pinning accepts `{ left: ['id'], right: ['actions'] }`. Supply stable column IDs.

Connect `ColumnConfigPanel.onChange` to `columnOrder` and derive `columnVisibility` from its returned keys. Locked columns remain visible first. Hidden columns remain available in definition order.

To load a saved view, replace the relevant controlled slices and panel `visibleKeys`. Persist the view in your application. The panel does not store preferences.

## Select and expand rows

Set `enableRowSelection` and provide `getRowId`. Use `selectionActions` to render actions for the selected IDs. The header checkbox selects the visible page.

Selection across server pages uses IDs retained in `rowSelection`. Your application checks permissions and removes IDs that are no longer valid.

For grouped rows, supply `getSubRows` and `getRowLabel`. The table renders expansion controls. Supply group summary values in the group records; it does not calculate business totals.

Use a column's `footer` for an overall summary. Preserve the distinction between missing values and zero in your renderers and calculations.

## Limits

The component does not provide virtualisation, spreadsheet keyboard navigation or a data-fetching layer. For server pagination, supply a non-negative integer total.

Use `tableLayout="scroll"` for wide tables. Sticky offsets follow rendered widths after resizing. Review grouped headers and long cells in your application's layout.
