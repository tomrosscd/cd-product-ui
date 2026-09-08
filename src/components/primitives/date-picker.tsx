'use client'
import { useEffect, useId, useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import { DayPicker, getDefaultClassNames, type DateRange as CalendarRange } from 'react-day-picker'
import { useProductTheme } from './theme.js'
import { Button } from './button.js'
import { Input } from './fields.js'
import { StyledSelect } from './styled-select.js'
const classNames = Object.fromEntries(Object.keys(getDefaultClassNames()).map((key) => [key, `cui-calendar-${key}`]))
export interface DateSelection {
  start: string
  end?: string
}
export interface DatePreset {
  label: string
  value: DateSelection
}
export interface CalendarProps {
  mode?: 'single' | 'range'
  value?: DateSelection
  onValueChange: (value: DateSelection | undefined) => void
  min?: string
  max?: string
  label?: string
}
function parse(value?: string) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined
  const [year = 0, month = 0, day = 0] = value.split('-').map(Number)
  const result = new Date(year, month - 1, day, 12)
  return result.getFullYear() === year && result.getMonth() === month - 1 && result.getDate() === day
    ? result
    : undefined
}
function iso(date?: Date) {
  return date
    ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    : ''
}
function display(value?: string) {
  const date = parse(value)
  return date ? new Intl.DateTimeFormat('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }).format(date) : ''
}
export function Calendar({ mode = 'single', value, onValueChange, min, max, label = 'Choose dates' }: CalendarProps) {
  const [compact, setCompact] = useState(true)
  useEffect(() => {
    const media = window.matchMedia('(max-width: 650px)')
    const update = () => setCompact(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  const lower = parse(min),
    upper = parse(max)
  const disabled = [...(lower ? [{ before: lower }] : []), ...(upper ? [{ after: upper }] : [])]
  const common = {
    classNames,
    weekStartsOn: 1 as const,
    numberOfMonths: mode === 'range' && !compact ? 2 : 1,
    defaultMonth: parse(value?.start) || lower,
    disabled,
    'aria-label': label,
  }
  return mode === 'range' ? (
    <DayPicker
      {...common}
      mode="range"
      excludeDisabled
      selected={value ? { from: parse(value.start), to: parse(value.end) } : undefined}
      onSelect={(range: CalendarRange | undefined) =>
        onValueChange(range?.from ? { start: iso(range.from), end: iso(range.to) || undefined } : undefined)
      }
    />
  ) : (
    <DayPicker
      {...common}
      mode="single"
      selected={parse(value?.start)}
      onSelect={(date) => onValueChange(date ? { start: iso(date) } : undefined)}
    />
  )
}
export interface DatePickerProps extends CalendarProps {
  label: string
  disabled?: boolean
  error?: string
  presets?: readonly DatePreset[]
  name?: string
}
/** Combined field with draft/apply selection. ISO date-only values, no persistence. */
export function DatePicker({
  label,
  mode = 'single',
  value,
  onValueChange,
  min,
  max,
  disabled,
  error,
  presets = [],
  name,
}: DatePickerProps) {
  const id = useId(),
    theme = useProductTheme()
  const [open, setOpen] = useState(false),
    [draft, setDraft] = useState(value),
    [typed, setTyped] = useState('')
  function edit(next: DateSelection | undefined) {
    setDraft(next)
    setTyped(next ? `${next.start}${mode === 'range' ? ` / ${next.end || ''}` : ''}` : '')
  }
  function changeOpen(next: boolean) {
    if (next) edit(value)
    setOpen(next)
  }
  const pieces = typed.split('/').map((piece) => piece.trim())
  const parsed = typed ? { start: pieces[0] || '', ...(mode === 'range' ? { end: pieces[1] } : {}) } : undefined
  const valid =
    !typed ||
    !!(
      parse(parsed?.start) &&
      (mode === 'single' || (parse(parsed?.end) && parsed!.end! >= parsed!.start)) &&
      (!min || parsed!.start >= min) &&
      (!max || (parsed!.end || parsed!.start) <= max) &&
      pieces.length === (mode === 'range' ? 2 : 1)
    )
  return (
    <div className="cui-field">
      <label className="cui-label" htmlFor={id}>
        {label}
      </label>
      <Popover.Root open={open} onOpenChange={changeOpen}>
        <Popover.Trigger asChild>
          <button
            type="button"
            id={id}
            className="cui-select cui-date-trigger"
            disabled={disabled}
            aria-describedby={error ? `${id}-error` : undefined}
          >
            {value
              ? `${display(value.start)}${mode === 'range' ? ` – ${display(value.end) || 'Choose end date'}` : ''}`
              : mode === 'range'
                ? 'Choose date range'
                : 'Choose date'}
            <span aria-hidden="true">▦</span>
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            data-cui-theme={theme}
            className="cui-root cui-date-panel"
            align="start"
            sideOffset={8}
            collisionPadding={12}
            aria-label={label}
          >
            {presets.length > 0 && (
              <div className="cui-row">
                {presets.map((preset) => (
                  <Button key={preset.label} onClick={() => edit(preset.value)}>
                    {preset.label}
                  </Button>
                ))}
              </div>
            )}
            <Calendar mode={mode} value={draft} onValueChange={edit} min={min} max={max} label={label} />
            <Input
              label={mode === 'range' ? 'Enter date range' : 'Enter date'}
              value={typed}
              onChange={(event) => {
                setTyped(event.target.value)
              }}
              hint={mode === 'range' ? 'YYYY-MM-DD / YYYY-MM-DD' : 'YYYY-MM-DD'}
              error={!valid ? 'Enter valid dates within the allowed period.' : undefined}
            />
            <div className="cui-row">
              <Button onClick={() => edit(undefined)}>Clear</Button>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button
                variant="primary"
                disabled={!valid}
                onClick={() => {
                  onValueChange(parsed)
                  setOpen(false)
                }}
              >
                Apply
              </Button>
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
      {error && (
        <p id={`${id}-error`} className="cui-negative">
          {error}
        </p>
      )}
      {name && (
        <>
          <input
            type="hidden"
            name={mode === 'range' ? `${name}.start` : name}
            value={value?.start || ''}
            disabled={disabled}
          />
          {mode === 'range' && (
            <input type="hidden" name={`${name}.end`} value={value?.end || ''} disabled={disabled} />
          )}
        </>
      )}
    </div>
  )
}
export interface MonthPickerProps {
  label: string
  value: string
  onValueChange: (value: string) => void
  startYear: number
  endYear: number
  disabled?: boolean
}
export function MonthPicker({ label, value, onValueChange, startYear, endYear, disabled }: MonthPickerProps) {
  const [year, month] = value.split('-')
  const years = Array.from({ length: Math.max(0, Math.min(300, endYear - startYear + 1)) }, (_, i) => startYear + i)
  return (
    <fieldset className="cui-fieldset">
      <legend className="cui-label">{label}</legend>
      <div className="cui-date-range">
        <StyledSelect
          label="Month"
          disabled={disabled}
          value={month || undefined}
          options={Array.from({ length: 12 }, (_, i) => ({
            value: String(i + 1).padStart(2, '0'),
            label: new Intl.DateTimeFormat('en-AU', { month: 'long' }).format(new Date(2026, i, 1)),
          }))}
          onValueChange={(next) => onValueChange(`${year || startYear}-${next}`)}
        />
        <StyledSelect
          label="Year"
          disabled={disabled}
          value={year || undefined}
          options={years.map((n) => ({ value: String(n), label: String(n) }))}
          onValueChange={(next) => onValueChange(`${next}-${month || '01'}`)}
        />
      </div>
    </fieldset>
  )
}
