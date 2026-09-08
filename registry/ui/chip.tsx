import { cn } from '@/registry/lib/cn'

/**
 * Convert pattern — no upstream shadcn equivalent, no compatibility claim. Styling lives in the
 * sibling chip.css (import it once, globally) rather than Tailwind utility classNames, matching
 * how this component is actually built in the npm-published library. The one adaptation for
 * standalone registry distribution: the remove icon is inlined here instead of routing through
 * this package's own Icon component, so this item doesn't pull in an unrelated icon system for
 * one glyph.
 */
export interface ChipProps {
  label: string
  /** Present to render as a toggleable filter chip (aria-pressed). Omit for a plain, non-selectable chip. */
  selected?: boolean
  onSelect?: () => void
  /** Present to add a remove control. Combine with onSelect for a chip that's both toggleable and removable. */
  onRemove?: () => void
  disabled?: boolean
}

function RemoveIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="m6 6 12 12M6 18 18 6" />
    </svg>
  )
}

/** A selectable or removable interactive tag. Use a status badge instead for a non-interactive label. */
export function Chip({ label, selected, onSelect, onRemove, disabled }: ChipProps) {
  return (
    <span className={cn('cui-chip', selected && 'cui-chip-selected')}>
      {onSelect ? (
        <button
          type="button"
          className="cui-chip-select"
          aria-pressed={selected}
          disabled={disabled}
          onClick={onSelect}
        >
          {label}
        </button>
      ) : (
        <span className="cui-chip-label">{label}</span>
      )}
      {onRemove && (
        <button
          type="button"
          className="cui-chip-remove"
          aria-label={`Remove ${label}`}
          disabled={disabled}
          onClick={onRemove}
        >
          <RemoveIcon />
        </button>
      )}
    </span>
  )
}

export interface ChipOption {
  value: string
  label: string
  disabled?: boolean
}
export interface ChipGroupProps {
  label: string
  options: readonly ChipOption[]
  value: readonly string[]
  onValueChange: (value: string[]) => void
  disabled?: boolean
}
/** A set of selectable filter chips sharing one multi-select value, e.g. active filters. */
export function ChipGroup({ label, options, value, onValueChange, disabled }: ChipGroupProps) {
  return (
    <div className="cui-chip-group" role="group" aria-label={label}>
      {options.map((option) => (
        <Chip
          key={option.value}
          label={option.label}
          selected={value.includes(option.value)}
          disabled={disabled || option.disabled}
          onSelect={() =>
            onValueChange(
              value.includes(option.value) ? value.filter((item) => item !== option.value) : [...value, option.value],
            )
          }
        />
      ))}
    </div>
  )
}
