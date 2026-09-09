'use client'
import * as Primitive from '@radix-ui/react-select'
import { useId } from 'react'
import { useProductTheme } from './theme.js'
import { Icon } from './icon.js'
import type { ChoiceOption } from './option.js'
export interface StyledSelectProps {
  label: string
  options: readonly (ChoiceOption & { group?: string })[]
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
}
/** Branded single-value listbox. Native Select remains available for existing consumers. */
export function StyledSelect({
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
    <div className="cui-field">
      <label className="cui-label" htmlFor={id}>
        {label}
        {required ? ' (required)' : ''}
      </label>
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
          className="cui-select cui-styled-select"
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
            <Primitive.ScrollUpButton className="cui-select-scroll">↑</Primitive.ScrollUpButton>
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
                        <Primitive.ItemText className="cui-select-option-label">{option.label}</Primitive.ItemText>
                        <Icon name="check" aria-hidden="true" className="cui-select-option-indicator" />
                      </Primitive.Item>
                    ))}
                </Primitive.Group>
              ))}
            </Primitive.Viewport>
            <Primitive.ScrollDownButton className="cui-select-scroll">↓</Primitive.ScrollDownButton>
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
