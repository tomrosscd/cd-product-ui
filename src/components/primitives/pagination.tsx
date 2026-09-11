'use client'
import { useId } from 'react'
import { Button } from './button.js'
import { StyledSelect } from './styled-select.js'
export interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
  pageSizes?: readonly number[]
  label?: string
}
/** One-based, controlled pages. The host owns fetching and state. */
export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizes = [10, 25, 50],
  label = 'Pagination',
}: PaginationProps) {
  const id = useId()
  const size = Number.isFinite(pageSize) ? Math.max(1, Math.floor(pageSize)) : 10
  const count = Number.isFinite(total) ? Math.max(0, Math.floor(total)) : 0
  const pages = Math.max(1, Math.ceil(count / size))
  const current = Number.isFinite(page) ? Math.min(pages, Math.max(1, Math.floor(page))) : 1
  const visible = [...new Set([1, current - 1, current, current + 1, pages])]
    .filter((n) => n >= 1 && n <= pages)
    .sort((a, b) => a - b)
  const sizes = [...new Set([size, ...pageSizes.filter((n) => Number.isInteger(n) && n > 0)])].sort((a, b) => a - b)
  return (
    <nav className="cui-pagination" aria-label={label}>
      <p id={id} role="status">
        {count ? `${(current - 1) * size + 1}–${Math.min(current * size, count)} of ${count} results` : '0 results'}
      </p>
      {onPageSizeChange && count > 0 && (
        <StyledSelect
          label="Results per page"
          value={String(size)}
          options={sizes.map((n) => ({ value: String(n), label: String(n) }))}
          onValueChange={(value) => {
            onPageSizeChange(Number(value))
            onPageChange(1)
          }}
        />
      )}
      {pages > 1 && (
        <div className="cui-pagination-controls">
          <Button size="sm" disabled={current === 1} onClick={() => onPageChange(current - 1)} aria-describedby={id}>
            Previous
          </Button>
          <span className="cui-pagination-compact">
            Page {current} of {pages}
          </span>
          <div className="cui-pagination-pages">
            {visible.map((n, index) => (
              <span key={n}>
                {index > 0 && n > (visible[index - 1] ?? 0) + 1 && <span aria-hidden="true">…</span>}
                <Button
                  size="sm"
                  aria-label={`Page ${n}`}
                  aria-current={n === current ? 'page' : undefined}
                  variant={n === current ? 'primary' : 'quiet'}
                  onClick={() => onPageChange(n)}
                >
                  {n}
                </Button>
              </span>
            ))}
          </div>
          <Button
            size="sm"
            disabled={current === pages}
            onClick={() => onPageChange(current + 1)}
            aria-describedby={id}
          >
            Next
          </Button>
        </div>
      )}
    </nav>
  )
}
