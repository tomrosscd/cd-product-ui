'use client'
import * as Primitive from '@radix-ui/react-select'
import { useId } from 'react'
import { useProductTheme } from './theme.js'
import { Icon } from './icon.js'
import type { ReactNode } from 'react'
import type { ChoiceOption } from './option.js'
/**
 * `icon` renders inside the option's text, so it appears both in the open list and in the trigger
 * once chosen. A native `<select>` cannot do this at all: its options hold text and nothing else,
 * which is why a status colour has to come from a branded listbox rather than `CellSelect`.
 * Colour is never the whole signal here: the icon sits beside the label, it does not replace it.
 */
export type StyledSelectOption = ChoiceOption & { group?: string; icon?: ReactNode }
export interface StyledSelectProps {
  label: string
  options: readonly StyledSelectOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  hint?: string
  error?: string
  disabled?: boolean
  loading?: boolean
  required?: boolean
  name?: string
  /**
   * Sizes the trigger for a table cell and stops rendering the label, which moves to `aria-label`.
   * Use it in a capture grid where the column header is already the visible label.
   */
  cell?: boolean
}
/** Branded single-value listbox. Native Select remains available for existing consumers. */
export function StyledSelect({
  cell = false,
  label,
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = 'Choose an option',
  hint,
  error,
  disabled,
  loading,
  required,
  name,
}: StyledSelectProps) {
  const id = useId(),
    theme = useProductTheme()
  const groups = [...new Set(options.map((option) => option.group || ''))]
  return (
    <div className={cell ? 'cui-styled-select-cell' : 'cui-field'}>
      {!cell && (
        <label className="cui-label" htmlFor={id}>
          {label}
          {required ? ' (required)' : ''}
        </label>
      )}
      <Primitive.Root
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled || loading || !options.length}
        required={required}
        name={name}
      >
        <Primitive.Trigger
          id={id}
          aria-label={cell ? label : undefined}
          className={cell ? 'cui-cell-control cui-cell-select cui-styled-select' : 'cui-select cui-styled-select'}
          aria-invalid={error ? true : undefined}
          aria-describedby={hint || error ? `${id}-note` : undefined}
          aria-busy={loading || undefined}
        >
          <Primitive.Value
            placeholder={loading ? 'Loading options…' : !options.length ? 'No options available' : placeholder}
          />
          <Primitive.Icon>
            <Icon name="chevron" />
          </Primitive.Icon>
        </Primitive.Trigger>
        <Primitive.Portal>
          <Primitive.Content
            data-cui-theme={theme}
            className="cui-root cui-select-panel"
            position="popper"
            sideOffset={4}
            collisionPadding={12}
          >
            <Primitive.ScrollUpButton className="cui-select-scroll">
              <Icon name="chevron-up" />
            </Primitive.ScrollUpButton>
            <Primitive.Viewport>
              {groups.map((group) => (
                <Primitive.Group key={group}>
                  {group && <Primitive.Label className="cui-select-group">{group}</Primitive.Label>}
                  {options
                    .filter((option) => (option.group || '') === group)
                    .map((option) => (
                      <Primitive.Item
                        key={option.value}
                        value={option.value}
                        disabled={option.disabled}
                        className="cui-select-option"
                      >
                        <span className="cui-select-option-label">
                          <Primitive.ItemText>
                            {option.icon ? (
                              <span className="cui-select-option-icon">
                                {option.icon}
                                {option.label}
                              </span>
                            ) : (
                              option.label
                            )}
                          </Primitive.ItemText>
                        </span>
                        <Icon name="check" aria-hidden="true" className="cui-select-option-indicator" />
                      </Primitive.Item>
                    ))}
                </Primitive.Group>
              ))}
            </Primitive.Viewport>
            <Primitive.ScrollDownButton className="cui-select-scroll">
              <Icon name="chevron" />
            </Primitive.ScrollDownButton>
          </Primitive.Content>
        </Primitive.Portal>
      </Primitive.Root>
      {(hint || error) && (
        <p id={`${id}-note`} className={error ? 'cui-negative' : 'cui-secondary'}>
          {error || hint}
        </p>
      )}
    </div>
  )
}
