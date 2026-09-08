'use client'
import * as Menu from '@radix-ui/react-dropdown-menu'
import * as Tip from '@radix-ui/react-tooltip'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { useId, useState, type ReactElement, type ReactNode } from 'react'
import { Input, Checkbox } from './fields.js'
import { Button } from './button.js'
import { TextLink } from './text-link.js'
import { useProductTheme } from './theme.js'
import type { ChoiceOption } from './option.js'

export interface ActionMenuItem {
  id: string
  label: string
  onSelect: () => void
  disabled?: boolean
  destructive?: boolean
}
export interface ActionMenuProps {
  label?: string
  items: readonly ActionMenuItem[]
  disabled?: boolean
}
/** Action menu, not route navigation. Use ConfirmationDialog before irreversible actions. */
export function ActionMenu({ label = 'Actions', items, disabled }: ActionMenuProps) {
  const theme = useProductTheme()
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button disabled={disabled}>{label}</Button>
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Content data-cui-theme={theme} className="cui-root cui-popover" sideOffset={8} collisionPadding={16}>
          {items.map((item) => (
            <Menu.Item
              key={item.id}
              className={`cui-menu-item ${item.destructive ? 'cui-negative' : ''}`}
              disabled={item.disabled}
              onSelect={item.onSelect}
            >
              {item.label}
            </Menu.Item>
          ))}
        </Menu.Content>
      </Menu.Portal>
    </Menu.Root>
  )
}

export function Tooltip({ children, content }: { children: ReactElement; content: string }) {
  const theme = useProductTheme()
  return (
    <Tip.Provider delayDuration={300}>
      <Tip.Root>
        <Tip.Trigger asChild>{children}</Tip.Trigger>
        <Tip.Portal>
          <Tip.Content data-cui-theme={theme} className="cui-root cui-tooltip" sideOffset={8} collisionPadding={16}>
            {content}
          </Tip.Content>
        </Tip.Portal>
      </Tip.Root>
    </Tip.Provider>
  )
}

export interface ToastMessage {
  id: string
  title: string
  description?: string
}
/** Controlled queue. Host removes dismissed IDs; notifications never store application data. */
export function ToastRegion({
  messages,
  onDismiss,
}: {
  messages: readonly ToastMessage[]
  onDismiss: (id: string) => void
}) {
  return (
    <ToastPrimitive.Provider duration={8000}>
      {messages.map((message) => (
        <ToastPrimitive.Root
          key={message.id}
          className="cui-toast"
          open
          onOpenChange={(open) => {
            if (!open) onDismiss(message.id)
          }}
        >
          <ToastPrimitive.Title className="cui-label">{message.title}</ToastPrimitive.Title>
          {message.description && <ToastPrimitive.Description>{message.description}</ToastPrimitive.Description>}
          <ToastPrimitive.Close asChild>
            <Button aria-label={`Dismiss ${message.title}`}>Dismiss</Button>
          </ToastPrimitive.Close>
        </ToastPrimitive.Root>
      ))}
      <ToastPrimitive.Viewport className="cui-toast-viewport" label="Notifications ({hotkey})" />
    </ToastPrimitive.Provider>
  )
}

export interface BreadcrumbItem {
  label: string
  href?: string
}
export function Breadcrumbs({ items, label = 'Breadcrumb' }: { items: readonly BreadcrumbItem[]; label?: string }) {
  return (
    <nav aria-label={label}>
      <ol className="cui-breadcrumbs">
        {items.map((item, index) => (
          <li key={`${index}-${item.label}`}>
            {index > 0 && <span aria-hidden="true">/</span>}
            {index === items.length - 1 ? (
              <span aria-current="page">{item.label}</span>
            ) : item.href ? (
              <TextLink href={item.href}>{item.label}</TextLink>
            ) : (
              <span>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export type SearchSelectOption = ChoiceOption
export interface SearchSelectProps {
  label: string
  options: readonly SearchSelectOption[]
  value: readonly string[]
  onValueChange: (value: string[]) => void
  multiple?: boolean
  disabled?: boolean
  name?: string
  hint?: string
  error?: string
}
/** Searchable disclosure with native radio/checkbox choices, intentionally not an ARIA combobox. */
export function SearchSelect({
  label,
  options,
  value,
  onValueChange,
  multiple = false,
  disabled,
  name,
  hint,
  error,
}: SearchSelectProps) {
  const id = useId(),
    [query, setQuery] = useState('')
  const matches = options.filter((option) => option.label.toLocaleLowerCase().includes(query.toLocaleLowerCase()))
  const selected = options.filter((option) => value.includes(option.value)).map((option) => option.label)
  return (
    <fieldset className="cui-fieldset cui-search-select" disabled={disabled} aria-describedby={`${id}-description`}>
      <legend className="cui-label">{label}</legend>
      <p id={`${id}-description`} className={error ? 'cui-negative' : 'cui-secondary'}>
        {error || hint || (multiple ? 'Choose one or more options.' : 'Choose one option.')}
      </p>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- <details> is natively interactive; this only adds an Escape shortcut on top of its default toggle behaviour */}
      <details
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.currentTarget.open = false
            event.currentTarget.querySelector('summary')?.focus()
          }
        }}
      >
        <summary className="cui-selection-summary">
          {selected.length ? selected.join(', ') : 'Choose an option'}
          {disabled ? ' (unavailable)' : ''}
        </summary>
        <div className="cui-selection-panel">
          <Input
            label={`Search ${label.toLocaleLowerCase()}`}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <p role="status" className="cui-secondary">
            {matches.length} options
          </p>
          <div className="cui-selection-options">
            {matches.map((option) =>
              multiple ? (
                <Checkbox
                  key={option.value}
                  label={option.label}
                  disabled={disabled || option.disabled}
                  checked={value.includes(option.value)}
                  onChange={(event) =>
                    onValueChange(
                      event.target.checked ? [...value, option.value] : value.filter((item) => item !== option.value),
                    )
                  }
                />
              ) : (
                <label key={option.value} className="cui-choice">
                  <input
                    type="radio"
                    className="cui-checkbox"
                    name={`${id}-choice`}
                    checked={value.includes(option.value)}
                    disabled={disabled || option.disabled}
                    onChange={() => onValueChange([option.value])}
                  />
                  {option.label}
                </label>
              ),
            )}
          </div>
          <Button disabled={!value.length || disabled} onClick={() => onValueChange([])}>
            Clear selection
          </Button>
        </div>
      </details>
      {name && value.map((item) => <input key={item} type="hidden" name={name} value={item} disabled={disabled} />)}
    </fieldset>
  )
}

export interface DateRangeValue {
  start: string
  end: string
}
export interface DateRangeProps {
  label: string
  value: DateRangeValue
  onValueChange: (value: DateRangeValue) => void
  min?: string
  max?: string
  disabled?: boolean
  required?: boolean
  name?: string
  error?: string
  hint?: ReactNode
}
/** ISO date-only values. Native calendar controls; no timezone conversion or range calculations. */
export function DateRange({
  label,
  value,
  onValueChange,
  min,
  max,
  disabled,
  required,
  name,
  error,
  hint,
}: DateRangeProps) {
  const id = useId()
  const orderError =
    value.start && value.end && value.start > value.end ? 'End date must be on or after the start date.' : undefined
  return (
    <fieldset className="cui-fieldset" disabled={disabled} aria-describedby={`${id}-hint`}>
      <legend className="cui-label">{label}</legend>
      <div className="cui-date-range">
        <Input
          label="Start date"
          type="date"
          name={name ? `${name}.start` : undefined}
          value={value.start}
          min={min}
          max={max}
          required={required}
          onChange={(event) => onValueChange({ ...value, start: event.target.value })}
        />
        <Input
          label="End date"
          type="date"
          name={name ? `${name}.end` : undefined}
          value={value.end}
          min={value.start && (!min || value.start > min) ? value.start : min}
          max={max}
          required={required}
          error={error || orderError}
          onChange={(event) => onValueChange({ ...value, end: event.target.value })}
        />
      </div>
      <p id={`${id}-hint`} className="cui-secondary">
        {hint || 'Choose the first and last day of the period.'}
      </p>
    </fieldset>
  )
}
