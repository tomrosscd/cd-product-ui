'use client'
import { useState, useId, useRef, useEffect, type CSSProperties, type ReactNode } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  functionalUpdate,
  getExpandedRowModel,
  type PaginationState,
  type VisibilityState,
  type ColumnOrderState,
  type ColumnPinningState,
  type RowSelectionState,
  type ExpandedState,
  type OnChangeFn,
  type Updater,
  type Column,
  type ColumnDef,
  type RowData,
  type SortingState,
} from '@tanstack/react-table'
import { Table } from '../primitives/table.js'
import { Input } from '../primitives/fields.js'
import { Pagination } from '../primitives/pagination.js'
import { Button } from '../primitives/button.js'
import { EmptyState, Alert, Spinner } from '../primitives/feedback.js'
import { Icon } from '../primitives/icon.js'
export type { ColumnDef } from '@tanstack/react-table'

/**
 * Per-column presentation, set through a column definition's `meta`. TanStack's documented
 * augmentation point, so a consumer gets these typed on their own column definitions.
 *
 * `numeric` is the one that matters for a financial table: it aligns the column to the end and
 * switches on tabular figures, so digits line up down the column instead of drifting with glyph
 * width. Formatting the value itself, including currency, hours, negatives and what "missing"
 * looks like, stays with the application, per the boundaries in AGENTS.md.
 */
declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- both parameters are required by the interface being augmented
  interface ColumnMeta<TData extends RowData, TValue> {
    align?: 'start' | 'center' | 'end'
    numeric?: boolean
    /**
     * Pins the column while the table scrolls horizontally, so an identifier stays readable. Only
     * useful with `tableLayout="scroll"`, and only on leading columns: a pinned column in the
     * middle would detach from its neighbours. Declare a `size` alongside it, since the offset of
     * a second pinned column is computed from the widths of the ones before it.
     */
    sticky?: boolean
  }
}

/** Column definitions may declare a `size`; TanStack fills in a default for the rest, so only an
 *  explicitly declared width is applied. Otherwise every column would be pinned to 150px. */
function columnWidth<T>(column: Column<T, unknown>) {
  return column.columnDef.size === undefined ? undefined : { width: column.getSize() }
}
function cellClass<T>(column: Column<T, unknown>, pinned: boolean) {
  const meta = column.columnDef.meta
  if (!meta) return pinned ? 'cui-cell-sticky' : undefined
  const alignment = meta.numeric
    ? 'cui-cell-numeric'
    : meta.align && meta.align !== 'start'
      ? `cui-cell-${meta.align}`
      : ''
  return [alignment, pinned ? 'cui-cell-sticky' : ''].filter(Boolean).join(' ') || undefined
}
export interface DataTableState {
  sorting: SortingState
  globalFilter: string
  pagination: PaginationState
  columnVisibility: VisibilityState
  columnOrder: ColumnOrderState
  columnPinning: ColumnPinningState
  rowSelection: RowSelectionState
  expanded: ExpandedState
}
export interface DataTableProps<T> {
  caption: string
  data: T[]
  columns: ColumnDef<T>[]
  pagination?: 'legacy' | 'full'
  tableLayout?: 'legacy' | 'scroll'
  tableMinWidth?: number
  pageSize?: number
  searchable?: boolean
  searchLabel?: string
  state?: 'ready' | 'loading' | 'error'
  onRetry?: () => void
  getRowId?: (row: T) => string
  density?: 'comfortable' | 'compact'
  /** Control any state slice. Omitted slices remain internal. Pair with onTableStateChange. */
  tableState?: Partial<DataTableState>
  onTableStateChange?: OnChangeFn<Partial<DataTableState>>
  initialTableState?: Partial<DataTableState>
  /** Data is already paginated. Supply the server's filtered rowCount. */
  manualPagination?: boolean
  rowCount?: number
  manualSorting?: boolean
  manualFiltering?: boolean
  /** Stable getRowId values are required for selection across server pages. */
  enableRowSelection?: boolean
  selectionActions?: (selectedIds: readonly string[]) => ReactNode
  /** Supply nested rows and precomputed summary values; the library does not calculate totals. */
  getSubRows?: (row: T) => T[] | undefined
  getRowLabel?: (row: T) => string
}
/** Semantic table with optional controlled state and server data. Routing, fetching and totals belong to the host. */
export function DataTable<T>({
  caption,
  data,
  columns,
  pageSize = 10,
  pagination = 'legacy',
  tableLayout = 'legacy',
  tableMinWidth = 640,
  searchable = true,
  searchLabel = 'Search table',
  state = 'ready',
  onRetry,
  getRowId,
  density,
  tableState,
  onTableStateChange,
  initialTableState,
  manualPagination = false,
  rowCount,
  manualSorting = false,
  manualFiltering = false,
  enableRowSelection = false,
  selectionActions,
  getSubRows,
  getRowLabel,
}: DataTableProps<T>) {
  const [internalState, setInternalState] = useState<DataTableState>(() => ({
    sorting: [],
    globalFilter: '',
    pagination: { pageIndex: 0, pageSize: Math.max(1, Math.floor(pageSize) || 10) },
    columnVisibility: {},
    columnOrder: [],
    columnPinning: { left: [], right: [] },
    rowSelection: {},
    expanded: {},
    ...initialTableState,
  }))
  const effectiveState = { ...internalState, ...tableState }
  const { globalFilter } = effectiveState
  function change<K extends keyof DataTableState>(key: K, updater: Updater<DataTableState[K]>) {
    setInternalState((previous) => ({
      ...previous,
      [key]: functionalUpdate(updater, tableState?.[key] ?? previous[key]),
    }))
    onTableStateChange?.((previous) => ({
      ...previous,
      [key]: functionalUpdate(updater, previous[key] ?? effectiveState[key]),
    }))
  }
  const containerRef = useRef<HTMLDivElement>(null)
  const [widths, setWidths] = useState<Record<string, number>>({})
  // Measure rendered leaf headers: fixed-layout ratios, fonts and container resizing can all
  // make their actual widths differ from TanStack's declared sizes.
  useEffect(() => {
    const container = containerRef.current
    if (!container || typeof ResizeObserver === 'undefined') return
    const measure = () => {
      const next: Record<string, number> = {}
      container.querySelectorAll<HTMLElement>('[data-cui-column]').forEach((cell) => {
        next[cell.dataset.cuiColumn!] = cell.getBoundingClientRect().width
      })
      setWidths((previous) => (JSON.stringify(previous) === JSON.stringify(next) ? previous : next))
    }
    const observer = new ResizeObserver(measure)
    container.querySelectorAll('[data-cui-column]').forEach((cell) => observer.observe(cell))
    measure()
    return () => observer.disconnect()
  }, [columns, effectiveState.columnVisibility, effectiveState.columnOrder, effectiveState.columnPinning, state])
  const id = useId()
  const searchRef = useRef<HTMLInputElement>(null)
  const table = useReactTable({
    data,
    columns,
    defaultColumn: { sortDescFirst: false },
    getRowId,
    state: effectiveState,
    onSortingChange: (next) => change('sorting', next),
    onGlobalFilterChange: (next) => change('globalFilter', next),
    onPaginationChange: (next) => change('pagination', next),
    onColumnVisibilityChange: (next) => change('columnVisibility', next),
    onColumnOrderChange: (next) => change('columnOrder', next),
    onColumnPinningChange: (next) => change('columnPinning', next),
    onRowSelectionChange: (next) => change('rowSelection', next),
    onExpandedChange: (next) => change('expanded', next),
    manualPagination,
    rowCount,
    manualSorting,
    manualFiltering,
    enableRowSelection,
    getSubRows,
    getExpandedRowModel: getExpandedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })
  if (manualPagination && (rowCount === undefined || !Number.isInteger(rowCount) || rowCount < 0)) {
    throw new Error('DataTable manualPagination requires a non-negative integer rowCount from the server.')
  }
  if (enableRowSelection && manualPagination && !getRowId) {
    throw new Error('DataTable selection across server pages requires a stable getRowId.')
  }
  const leafColumns = [
    ...table.getLeftVisibleLeafColumns(),
    ...table.getCenterVisibleLeafColumns(),
    ...table.getRightVisibleLeafColumns(),
  ]
  const pinnedSide = (column: Column<T, unknown>) =>
    column.getIsPinned() || (column.columnDef.meta?.sticky ? 'left' : false)
  function stickyStyle(column: Column<T, unknown>): CSSProperties | undefined {
    const side = pinnedSide(column)
    if (!side) return undefined
    const index = leafColumns.indexOf(column)
    const neighbours = side === 'left' ? leafColumns.slice(0, index) : leafColumns.slice(index + 1)
    const offset = neighbours
      .filter((other) => pinnedSide(other) === side)
      .reduce((total, other) => total + (widths[other.id] ?? other.getSize()), 0)
    return side === 'left' ? { insetInlineStart: offset } : { insetInlineEnd: offset, insetInlineStart: 'auto' }
  }
  const totalRows = manualPagination ? rowCount : table.getFilteredRowModel().rows.length
  const selectedIds = Object.keys(effectiveState.rowSelection).filter((key) => effectiveState.rowSelection[key])
  // A totals row only appears when a column asks for one, so no existing table gains a tfoot.
  const hasFooter = columns.some((column) => column.footer !== undefined)
  return (
    <div ref={containerRef} className="cui-root cui-stack cui-data-table">
      {searchable && (
        <Input
          ref={searchRef}
          label={searchLabel}
          type="search"
          value={globalFilter}
          disabled={state !== 'ready'}
          onChange={(event) => {
            table.setGlobalFilter(event.target.value)
            table.setPageIndex(0)
          }}
          trailingAction={
            globalFilter ? (
              <Button
                variant="quiet"
                data-cui-search-clear=""
                aria-label="Clear search"
                disabled={state !== 'ready'}
                onClick={() => {
                  table.setGlobalFilter('')
                  table.setPageIndex(0)
                  searchRef.current?.focus()
                }}
              >
                <Icon name="close" />
              </Button>
            ) : undefined
          }
        />
      )}
      {enableRowSelection && selectedIds.length > 0 && (
        <div className="cui-row" aria-label="Selected rows">
          <span role="status">{selectedIds.length} selected</span>
          {selectionActions?.(selectedIds)}
          <Button variant="quiet" onClick={() => table.resetRowSelection(true)}>
            Clear selection
          </Button>
        </div>
      )}
      {state === 'loading' ? (
        <Spinner label="Loading rows" />
      ) : state === 'error' ? (
        <Alert heading="Rows could not be loaded" tone="error">
          {onRetry ? <Button onClick={onRetry}>Try again</Button> : 'Try again later.'}
        </Alert>
      ) : (
        <>
          <Table
            caption={caption}
            density={density}
            layout={tableLayout}
            minWidth={tableMinWidth}
            // A declared width is only a hint under the browser's default auto layout, which is to
            // say it is often ignored. Fixed layout makes declared sizes decide the columns: a
            // table filling its container distributes any surplus proportionally, so the sizes act
            // as ratios rather than absolute pixels. This only applies when a column actually asks
            // for a width, so tables that declare none keep the automatic sizing they have today.
            className={columns.some((column) => column.size !== undefined) ? 'cui-table-sized' : undefined}
          >
            <thead>
              {table.getHeaderGroups().map((group) => (
                <tr key={group.id}>
                  {enableRowSelection && (
                    <th scope="col">
                      <input
                        type="checkbox"
                        className="cui-checkbox"
                        aria-label="Select all rows on this page"
                        checked={table.getIsAllPageRowsSelected()}
                        ref={(input) => {
                          if (input) input.indeterminate = table.getIsSomePageRowsSelected()
                        }}
                        onChange={table.getToggleAllPageRowsSelectedHandler()}
                      />
                    </th>
                  )}
                  {getSubRows && (
                    <th scope="col">
                      <span className="cui-sr-only">Expand rows</span>
                    </th>
                  )}
                  {group.headers.map((header) => (
                    <th
                      key={header.id}
                      scope="col"
                      colSpan={header.colSpan}
                      data-cui-column={header.column.columns.length === 0 ? header.column.id : undefined}
                      style={{ ...columnWidth(header.column), ...stickyStyle(header.column) }}
                      className={cellClass(header.column, Boolean(pinnedSide(header.column)))}
                      aria-sort={
                        header.column.getCanSort()
                          ? header.column.getIsSorted() === 'asc'
                            ? 'ascending'
                            : header.column.getIsSorted() === 'desc'
                              ? 'descending'
                              : 'none'
                          : undefined
                      }
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <button
                          type="button"
                          className="cui-table-sort"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          <Icon
                            name={
                              header.column.getIsSorted() === 'asc'
                                ? 'sort-up'
                                : header.column.getIsSorted() === 'desc'
                                  ? 'sort-down'
                                  : 'sort'
                            }
                            className="cui-icon-inline"
                          />
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {enableRowSelection && (
                    <td>
                      <input
                        type="checkbox"
                        className="cui-checkbox"
                        aria-label={`Select ${getRowLabel?.(row.original) ?? row.id}`}
                        checked={row.getIsSelected()}
                        disabled={!row.getCanSelect()}
                        onChange={row.getToggleSelectedHandler()}
                      />
                    </td>
                  )}
                  {getSubRows && (
                    <td>
                      {row.getCanExpand() && (
                        <Button
                          variant="quiet"
                          size="icon"
                          aria-label={`${row.getIsExpanded() ? 'Collapse' : 'Expand'} ${getRowLabel?.(row.original) ?? row.id}`}
                          aria-expanded={row.getIsExpanded()}
                          onClick={row.getToggleExpandedHandler()}
                        >
                          <Icon name={row.getIsExpanded() ? 'chevron' : 'arrow'} />
                        </Button>
                      )}
                    </td>
                  )}
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={cellClass(cell.column, Boolean(pinnedSide(cell.column)))}
                      style={stickyStyle(cell.column)}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
              {table.getRowModel().rows.length === 0 && (
                <tr>
                  <td
                    colSpan={Math.max(leafColumns.length + Number(enableRowSelection) + Number(Boolean(getSubRows)), 1)}
                  >
                    <EmptyState
                      heading={globalFilter ? 'No matching results' : 'No rows yet'}
                      description={globalFilter ? 'Try a different search.' : 'Rows will appear here when available.'}
                      live={Boolean(globalFilter)}
                    />
                  </td>
                </tr>
              )}
            </tbody>
            {hasFooter && (
              <tfoot>
                {table.getFooterGroups().map((group) => (
                  <tr key={group.id}>
                    {enableRowSelection && <td />}
                    {getSubRows && <td />}
                    {group.headers.map((header) => (
                      <td
                        key={header.id}
                        className={cellClass(header.column, Boolean(pinnedSide(header.column)))}
                        style={stickyStyle(header.column)}
                      >
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.footer, header.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tfoot>
            )}
          </Table>
          <nav
            hidden={pagination === 'full'}
            className="cui-row cui-table-pagination"
            aria-label={`${caption} pagination`}
          >
            <p id={id} role="status">
              {totalRows ?? 'Unknown total'} {totalRows === 1 ? 'row' : 'rows'} · Page{' '}
              {table.getState().pagination.pageIndex + 1} of {Math.max(1, table.getPageCount())}
            </p>
            <div className="cui-row">
              <Button aria-describedby={id} disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}>
                Previous
              </Button>
              <Button aria-describedby={id} disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}>
                Next
              </Button>
            </div>
          </nav>
          {pagination === 'full' && (
            <Pagination
              label={`${caption} pagination`}
              page={table.getState().pagination.pageIndex + 1}
              pageSize={table.getState().pagination.pageSize}
              total={totalRows ?? data.length}
              onPageChange={(page) => table.setPageIndex(page - 1)}
              onPageSizeChange={(size) => table.setPageSize(size)}
            />
          )}
        </>
      )}
    </div>
  )
}
