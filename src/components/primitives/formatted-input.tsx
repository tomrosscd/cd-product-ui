'use client'
import { useEffect, useId, useState } from 'react'
import { Field } from './fields.js'
interface FormattedInputSharedProps {
  label: string
  value: number | undefined
  onValueChange: (value: number | undefined) => void
  hint?: string
  error?: string
  disabled?: boolean
  required?: boolean
  name?: string
  placeholder?: string
}
function parseNumber(raw: string): number | undefined {
  const cleaned = raw.replace(/[^0-9.-]/g, '')
  if (cleaned === '' || cleaned === '-') return undefined
  const value = Number(cleaned)
  return Number.isFinite(value) ? value : undefined
}
function FormattedNumberInput({
  label,
  value,
  onValueChange,
  prefix,
  suffix,
  format,
  hint,
  error,
  disabled,
  required,
  name,
  placeholder,
}: FormattedInputSharedProps & { prefix?: string; suffix?: string; format: (value: number) => string }) {
  const id = useId()
  const [focused, setFocused] = useState(false)
  const [draft, setDraft] = useState('')
  useEffect(() => {
    if (!focused) setDraft(value === undefined ? '' : format(value))
  }, [value, focused, format])
  return (
    <Field id={id} label={label} hint={hint} error={error} required={required}>
      {(field) => (
        <div className="cui-affixed-input">
          {prefix && (
            <span className="cui-input-affix" aria-hidden="true">
              {prefix}
            </span>
          )}
          <input
            {...field}
            type="text"
            inputMode="decimal"
            name={name}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            value={focused ? draft : value === undefined ? '' : format(value)}
            onFocus={() => {
              setFocused(true)
              setDraft(value === undefined ? '' : String(value))
            }}
            onChange={(event) => {
              setDraft(event.target.value)
              onValueChange(parseNumber(event.target.value))
            }}
            onBlur={() => setFocused(false)}
          />
          {suffix && (
            <span className="cui-input-affix" aria-hidden="true">
              {suffix}
            </span>
          )}
        </div>
      )}
    </Field>
  )
}
function currencySymbol(locale: string, currency: string) {
  return (
    new Intl.NumberFormat(locale, { style: 'currency', currency })
      .formatToParts(0)
      .find((part) => part.type === 'currency')?.value ?? ''
  )
}
export interface CurrencyInputProps extends FormattedInputSharedProps {
  /** ISO 4217 currency code. */
  currency?: string
  locale?: string
}
/** Formats and displays a currency amount; keep calculations, totals and rounding rules in the application. */
export function CurrencyInput({ currency = 'AUD', locale = 'en-AU', ...props }: CurrencyInputProps) {
  return (
    <FormattedNumberInput
      {...props}
      prefix={currencySymbol(locale, currency)}
      format={(value) =>
        new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)
      }
    />
  )
}
export interface PercentageInputProps extends FormattedInputSharedProps {
  locale?: string
}
/** Displays a plain percentage number (42 for 42%), not a 0-1 fraction. Keep the fraction/percentage conversion in the application if it stores one. */
export function PercentageInput({ locale = 'en-AU', ...props }: PercentageInputProps) {
  return (
    <FormattedNumberInput
      {...props}
      suffix="%"
      format={(value) => new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value)}
    />
  )
}
export interface HoursInputProps extends FormattedInputSharedProps {
  locale?: string
}
/** Displays a decimal hours value (7.5, not 7:30). */
export function HoursInput({ locale = 'en-AU', ...props }: HoursInputProps) {
  return (
    <FormattedNumberInput
      {...props}
      suffix="hrs"
      format={(value) => new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value)}
    />
  )
}
