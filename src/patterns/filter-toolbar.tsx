import type { ReactNode } from 'react'
import { Input } from '../components/primitives/fields.js'
import { Chip } from '../components/primitives/chip.js'
import { Button } from '../components/primitives/button.js'
export interface ActiveFilter {
  key: string
  label: string
  onRemove: () => void
}
export interface FilterToolbarProps {
  searchLabel?: string
  searchValue: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  /** Additional filter controls rendered alongside search, e.g. a StyledSelect, Combobox or SegmentedControl. The toolbar doesn't define filter types itself. */
  filters?: ReactNode
  activeFilters?: readonly ActiveFilter[]
  onClearAll?: () => void
  resultCount?: number
  resultLabel?: (count: number) => string
}
/** Composes existing controls into a search/filter bar: search input, application-supplied filters, a result count and removable active-filter chips. Reflows to a compact layout in a narrow container. */
export function FilterToolbar({
  searchLabel = 'Search',
  searchValue,
  onSearchChange,
  searchPlaceholder,
  filters,
  activeFilters = [],
  onClearAll,
  resultCount,
  resultLabel = (count) => `${count} ${count === 1 ? 'result' : 'results'}`,
}: FilterToolbarProps) {
  return (
    <div className="cui-filter-toolbar">
      <div className="cui-filter-toolbar-row">
        <div className="cui-filter-toolbar-search">
          <Input
            label={searchLabel}
            type="search"
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
          />
        </div>
        {filters && <div className="cui-filter-toolbar-filters">{filters}</div>}
        {resultCount !== undefined && (
          <p role="status" className="cui-secondary cui-filter-toolbar-count">
            {resultLabel(resultCount)}
          </p>
        )}
      </div>
      {activeFilters.length > 0 && (
        <div className="cui-filter-toolbar-active" role="group" aria-label="Active filters">
          {activeFilters.map((filter) => (
            <Chip key={filter.key} label={filter.label} onRemove={filter.onRemove} />
          ))}
          {onClearAll && <Button onClick={onClearAll}>Clear all</Button>}
        </div>
      )}
    </div>
  )
}
