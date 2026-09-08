import { cn } from '../../lib/classes.js'
import { Icon } from './icon.js'
import type { ChoiceOption } from './option.js'
export interface ChipProps {
  label: string
  /** Present to render as a toggleable filter chip (aria-pressed). Omit for a plain, non-selectable chip. */
  selected?: boolean
  onSelect?: () => void
  /** Present to add a remove control. Combine with onSelect for a chip that's both toggleable and removable. */
  onRemove?: () => void
  disabled?: boolean
}
/** A selectable or removable interactive tag. Use Badge for a non-interactive status label. */
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
          <Icon name="close" />
        </button>
      )}
    </span>
  )
}
export interface ChipGroupProps {
  label: string
  options: readonly ChoiceOption[]
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
