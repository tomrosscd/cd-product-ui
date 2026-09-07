'use client'
import { useId, type ComponentProps } from 'react'
import { cn } from '../../lib/classes.js'
import { Icon } from './icon.js'
export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}
export interface SelectProps extends Omit<ComponentProps<'select'>, 'children' | 'multiple' | 'size'> {
  label: string
  options: readonly SelectOption[]
  hint?: string
  error?: string
  placeholder?: string
  loading?: boolean
}
/** Native single select. React controlled and uncontrolled modes follow the HTML select contract. */
export function Select({
  label,
  options,
  hint,
  error,
  placeholder,
  loading = false,
  id,
  className,
  disabled,
  required,
  'aria-describedby': describedBy,
  'aria-invalid': invalid,
  ...props
}: SelectProps) {
  const generatedId = useId()
  const inputId = id || generatedId
  const description =
    [describedBy, hint && `${inputId}-hint`, error && `${inputId}-error`].filter(Boolean).join(' ') || undefined
  return (
    <div className={cn('cui-field', className)}>
      <label className="cui-label" htmlFor={inputId}>
        {label}
        {required && <span className="cui-secondary"> (required)</span>}
      </label>
      <div className="cui-select-wrap">
        <select
          {...props}
          id={inputId}
          className="cui-select"
          disabled={disabled || loading || options.length === 0}
          required={required}
          aria-describedby={description}
          aria-invalid={error ? true : invalid}
          aria-busy={loading || undefined}
        >
          {loading ? (
            <option value="">Loading options…</option>
          ) : options.length === 0 ? (
            <option value="">No options available</option>
          ) : (
            <>
              {placeholder && (
                <option value="" disabled={required}>
                  {placeholder}
                </option>
              )}
              {options.map((option) => (
                <option key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </option>
              ))}
            </>
          )}
        </select>
        <Icon name="chevron" />
      </div>
      {hint && (
        <p className="cui-field-note cui-secondary" id={`${inputId}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className="cui-field-note cui-negative" id={`${inputId}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
