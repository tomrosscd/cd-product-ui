'use client'
import { useState, useId } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import { Table } from '../primitives/table.js'
import { Input } from '../primitives/fields.js'
import { Button } from '../primitives/button.js'
import { EmptyState, Alert, Spinner } from '../primitives/feedback.js'
export type { ColumnDef } from '@tanstack/react-table'
export interface DataTableProps<T> {
  caption: string
  data: T[]
  columns: ColumnDef<T>[]
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
  return (
    <div className="cui-root cui-stack cui-data-table">
      {searchable && (
        <Input
          label={searchLabel}
          type="search"
          value={globalFilter}
          disabled={state !== 'ready'}
          onChange={(event) => {
            setGlobalFilter(event.target.value)
            table.setPageIndex(0)
          }}
        />
      )}
      {state === 'loading' ? (
        <Spinner label="Loading rows" />
      ) : state === 'error' ? (
        <Alert title="Rows could not be loaded" tone="error">
          {onRetry ? <Button onClick={onRetry}>Try again</Button> : 'Try again later.'}
        </Alert>
      ) : (
        <>
          <Table caption={caption} density={density}>
            <thead>
              {table.getHeaderGroups().map((group) => (
                <tr key={group.id}>
                  {group.headers.map((header) => (
                    <th
                      key={header.id}
                      scope="col"
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
                          <span aria-hidden="true">
                            {header.column.getIsSorted() === 'asc'
                              ? ' ↑'
                              : header.column.getIsSorted() === 'desc'
                                ? ' ↓'
                                : ' ↕'}
                          </span>
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
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))}
              {table.getRowModel().rows.length === 0 && (
                <tr>
                  <td colSpan={Math.max(columns.length, 1)}>
                    <EmptyState
                      title={globalFilter ? 'No matching results' : 'No rows yet'}
                      description={globalFilter ? 'Try a different search.' : 'Rows will appear here when available.'}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          <nav className="cui-row cui-table-pagination" aria-label={`${caption} pagination`}>
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
        </>
      )}
    </div>
  )
}
