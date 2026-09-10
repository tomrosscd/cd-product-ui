'use client'
import { useEffect, useId, useRef, useState } from 'react'
import { Field } from './fields.js'
import { parseLocaleNumber } from '../../lib/parse-number.js'
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
  /** Message for incomplete or invalid numeric text. Invalid drafts do not change the model. */
  invalidInputLabel?: string
}
function FormattedNumberInput({
  label,
  value,
  onValueChange,
  prefix,
  suffix,
  format,
  locale,
  hint,
  error,
  disabled,
  required,
  name,
  placeholder,
  invalidInputLabel = 'Enter a valid number.',
}: FormattedInputSharedProps & {
  prefix?: string
  suffix?: string
  format: (value: number) => string
  locale: string
}) {
  const id = useId()
  const [focused, setFocused] = useState(false)
  const [draft, setDraft] = useState('')
  const [invalid, setInvalid] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    setInvalid(false)
    inputRef.current?.setCustomValidity('')
  }, [value, locale])
  return (
    <Field
      id={id}
      label={label}
      hint={hint}
      error={error || (invalid ? invalidInputLabel : undefined)}
      required={required}
    >
      {(field) => (
        <div className="cui-affixed-input">
          {prefix && (
            <span className="cui-input-affix" aria-hidden="true">
              {prefix}
            </span>
          )}
          <input
            {...field}
            ref={inputRef}
            type="text"
            inputMode="decimal"
            name={name}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            value={focused || invalid ? draft : value === undefined ? '' : format(value)}
            onFocus={() => {
              setFocused(true)
              if (!invalid)
                setDraft(
                  value === undefined
                    ? ''
                    : new Intl.NumberFormat(locale, { useGrouping: false, maximumSignificantDigits: 21 }).format(value),
                )
            }}
            onChange={(event) => {
              setDraft(event.target.value)
              const raw = event.target.value
              const parsed = parseLocaleNumber(raw, locale)
              const bad = raw.trim() !== '' && parsed === undefined
              setInvalid(bad)
              event.target.setCustomValidity(bad ? invalidInputLabel : '')
              if (!bad) onValueChange(parsed)
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
      locale={locale}
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
      locale={locale}
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
      locale={locale}
      suffix="hrs"
      format={(value) => new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(value)}
    />
  )
}
