'use client'
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { useProductTheme } from './theme.js'
import { Chip } from './chip.js'
import { Icon } from './icon.js'
import type { ChoiceOption } from './option.js'
export interface ComboboxOption extends ChoiceOption {
  avatar?: ReactNode
}
interface ComboboxBaseProps {
  label: string
  options: readonly ComboboxOption[]
  placeholder?: string
  hint?: string
  error?: string
  disabled?: boolean
  required?: boolean
  name?: string
  loading?: boolean
  /** Supply to filter remotely (e.g. an API search) instead of the built-in local label match. Called on every keystroke; `options` should reflect the current result set. */
  onSearchChange?: (query: string) => void
}
export type ComboboxProps = ComboboxBaseProps &
  (
    | { multiple?: false; value?: string; onValueChange: (value: string) => void }
    | { multiple: true; value: readonly string[]; onValueChange: (value: string[]) => void }
  )
/** Searchable single or multi-select. Filters `options` locally by label unless `onSearchChange` is supplied, in which case the host owns fetching/filtering entirely. */
export function Combobox(props: ComboboxProps) {
  const {
    label,
    options,
    placeholder = 'Search…',
    hint,
    error,
    disabled,
    required,
    name,
    loading,
    onSearchChange,
  } = props
  const id = useId()
  const theme = useProductTheme()
  const inputRef = useRef<HTMLInputElement>(null)
  const suppressOpenOnFocusRef = useRef(false)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const selectedValues = props.multiple ? props.value : props.value ? [props.value] : []
  const filtered = onSearchChange
    ? options
    : options.filter((option) => option.label.toLocaleLowerCase().includes(query.toLocaleLowerCase()))
  useEffect(() => setActiveIndex(0), [query, open])
  function select(optionValue: string) {
    if (props.multiple) {
      props.onValueChange(
        props.value.includes(optionValue)
          ? props.value.filter((item) => item !== optionValue)
          : [...props.value, optionValue],
      )
    } else {
      props.onValueChange(optionValue)
      setQuery('')
      setOpen(false)
      suppressOpenOnFocusRef.current = true
      inputRef.current?.focus()
    }
  }
  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setOpen(true)
      setActiveIndex((index) => Math.min(index + 1, filtered.length - 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => Math.max(index - 1, 0))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const option = filtered[activeIndex]
      if (option && !option.disabled) select(option.value)
    } else if (event.key === 'Escape') {
      setOpen(false)
    } else if (event.key === 'Backspace' && props.multiple && query === '' && props.value.length > 0) {
      props.onValueChange(props.value.slice(0, -1))
    }
  }
  const activeOption = filtered[activeIndex]
  const selectedSingleLabel = !props.multiple && props.value ? options.find((o) => o.value === props.value)?.label : ''
  const selectedOptions = options.filter((option) => selectedValues.includes(option.value))
  return (
    <div className="cui-field">
      <label className="cui-label" htmlFor={id}>
        {label}
        {required ? ' (required)' : ''}
      </label>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Anchor asChild>
          <div className="cui-combobox">
            {props.multiple && selectedOptions.length > 0 && (
              <div className="cui-combobox-tags">
                {selectedOptions.map((option) => (
                  <Chip
                    key={option.value}
                    label={option.label}
                    onRemove={() => select(option.value)}
                    disabled={disabled}
                  />
                ))}
              </div>
            )}
            <input
              ref={inputRef}
              id={id}
              role="combobox"
              aria-expanded={open}
              aria-controls={`${id}-listbox`}
              aria-activedescendant={open && activeOption ? `${id}-option-${activeOption.value}` : undefined}
              aria-autocomplete="list"
              aria-describedby={hint || error ? `${id}-note` : undefined}
              aria-invalid={error ? true : undefined}
              className="cui-input"
              autoComplete="off"
              disabled={disabled}
              placeholder={placeholder}
              value={open ? query : query || selectedSingleLabel || ''}
              onFocus={() => {
                if (suppressOpenOnFocusRef.current) {
                  suppressOpenOnFocusRef.current = false
                  return
                }
                setOpen(true)
              }}
              onChange={(event) => {
                setQuery(event.target.value)
                setOpen(true)
                onSearchChange?.(event.target.value)
              }}
              onKeyDown={handleKeyDown}
            />
            {name && !props.multiple && <input type="hidden" name={name} value={props.value ?? ''} />}
            {name &&
              props.multiple &&
              props.value.map((item) => <input key={item} type="hidden" name={`${name}[]`} value={item} />)}
          </div>
        </Popover.Anchor>
        <Popover.Portal>
          <Popover.Content
            data-cui-theme={theme}
            className="cui-root cui-select-panel cui-combobox-panel"
            align="start"
            sideOffset={4}
            collisionPadding={12}
            aria-label={label}
            onOpenAutoFocus={(event) => event.preventDefault()}
            onInteractOutside={(event) => {
              // The click that focuses the input and opens the panel is still "outside" Content
              // (which hasn't mounted yet) from Radix's perspective — without this, that same click
              // immediately dismisses the panel it just opened.
              if (event.target === inputRef.current) event.preventDefault()
            }}
          >
            <ul
              role="listbox"
              id={`${id}-listbox`}
              aria-label={label}
              aria-multiselectable={props.multiple || undefined}
              className="cui-combobox-listbox"
            >
              {!loading &&
                !error &&
                filtered.map((option, index) => (
                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- ARIA combobox listbox pattern: the input owns keyboard navigation via aria-activedescendant, not each option
                  <li
                    key={option.value}
                    id={`${id}-option-${option.value}`}
                    role="option"
                    aria-selected={selectedValues.includes(option.value)}
                    aria-disabled={option.disabled}
                    data-highlighted={index === activeIndex ? '' : undefined}
                    data-state={selectedValues.includes(option.value) ? 'checked' : undefined}
                    data-disabled={option.disabled ? '' : undefined}
                    className="cui-select-option"
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => !option.disabled && select(option.value)}
                  >
                    {option.avatar}
                    <span className="cui-select-option-label">{option.label}</span>
                    <Icon name="check" aria-hidden="true" className="cui-select-option-indicator" />
                  </li>
                ))}
            </ul>
            {loading ? (
              <p className="cui-secondary">Loading options…</p>
            ) : error ? (
              <p className="cui-negative">{error}</p>
            ) : (
              filtered.length === 0 && <p className="cui-secondary">No matching options</p>
            )}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      {(hint || error) && (
        <p id={`${id}-note`} className={error ? 'cui-negative' : 'cui-secondary'}>
          {error || hint}
        </p>
      )}
    </div>
  )
}
