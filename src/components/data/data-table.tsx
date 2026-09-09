'use client'
import { useState, useId, useRef } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
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
function cellClass<T>(column: Column<T, unknown>) {
  const meta = column.columnDef.meta
  if (!meta) return undefined
  const alignment = meta.numeric
    ? 'cui-cell-numeric'
    : meta.align && meta.align !== 'start'
      ? `cui-cell-${meta.align}`
      : ''
  return [alignment, meta.sticky ? 'cui-cell-sticky' : ''].filter(Boolean).join(' ') || undefined
}
/** A pinned column sits after the pinned columns before it, so the offset is their combined width. */
function stickyOffset<T>(column: Column<T, unknown>, all: Column<T, unknown>[]) {
  if (!column.columnDef.meta?.sticky) return undefined
  const before = all.slice(0, all.indexOf(column)).filter((other) => other.columnDef.meta?.sticky)
  return { insetInlineStart: before.reduce((total, other) => total + other.getSize(), 0) }
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
}
/** Client-side sorting, global filtering and pagination. Data fetching remains with the application. */
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
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')
  const id = useId()
  const searchRef = useRef<HTMLInputElement>(null)
  const table = useReactTable({
    data,
    columns,
    defaultColumn: { sortDescFirst: false },
    getRowId,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    initialState: { pagination: { pageSize: Math.max(1, Math.floor(pageSize) || 10) } },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })
  const leafColumns = table.getAllLeafColumns()
  // A totals row only appears when a column asks for one, so no existing table gains a tfoot.
  const hasFooter = columns.some((column) => column.footer !== undefined)
  return (
    <div className="cui-root cui-stack cui-data-table">
      {searchable && (
        <Input
          ref={searchRef}
          label={searchLabel}
          type="search"
          value={globalFilter}
          disabled={state !== 'ready'}
          onChange={(event) => {
            setGlobalFilter(event.target.value)
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
                  setGlobalFilter('')
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
                  {group.headers.map((header) => (
                    <th
                      key={header.id}
                      scope="col"
                      style={{ ...columnWidth(header.column), ...stickyOffset(header.column, leafColumns) }}
                      className={cellClass(header.column)}
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
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className={cellClass(cell.column)} style={stickyOffset(cell.column, leafColumns)}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
              {table.getRowModel().rows.length === 0 && (
                <tr>
                  <td colSpan={Math.max(columns.length, 1)}>
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
                    {group.headers.map((header) => (
                      <td
                        key={header.id}
                        className={cellClass(header.column)}
                        style={stickyOffset(header.column, leafColumns)}
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
              {table.getFilteredRowModel().rows.length} {table.getFilteredRowModel().rows.length === 1 ? 'row' : 'rows'}{' '}
              · Page {table.getState().pagination.pageIndex + 1} of {Math.max(1, table.getPageCount())}
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
              total={table.getFilteredRowModel().rows.length}
              onPageChange={(page) => table.setPageIndex(page - 1)}
              onPageSizeChange={(size) => table.setPageSize(size)}
            />
          )}
        </>
      )}
    </div>
  )
}
