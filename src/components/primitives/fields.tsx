'use client'
import { useId, useState, type ComponentProps, type ReactNode } from 'react'
import { cn } from '../../lib/classes.js'
import { Button } from './button.js'

export interface FieldProps {
  id?: string
  label: string
  hint?: string
  error?: string
  required?: boolean
  className?: string
  describedBy?: string
  children: (props: {
    id: string
    'aria-describedby': string | undefined
    'aria-invalid': true | undefined
  }) => ReactNode
}
/** Associates a visible label and supporting text with a consumer-supplied control. */
export function Field({ id, label, hint, error, required, className, describedBy, children }: FieldProps) {
  const generated = useId()
  const controlId = id || generated
  return (
    <div className={cn('cui-field', className)}>
      <label className="cui-label" htmlFor={controlId}>
        {label}
        {required && <span className="cui-secondary"> (required)</span>}
      </label>
      {children({
        id: controlId,
        'aria-describedby':
          [describedBy, hint && `${controlId}-hint`, error && `${controlId}-error`].filter(Boolean).join(' ') ||
          undefined,
        'aria-invalid': error ? true : undefined,
      })}
      {hint && (
        <p className="cui-field-note cui-secondary" id={`${controlId}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className="cui-field-note cui-negative" id={`${controlId}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
export interface InputProps extends Omit<ComponentProps<'input'>, 'type' | 'size'> {
  label: string
  type?: 'text' | 'email' | 'password' | 'search' | 'url' | 'tel' | 'number' | 'date' | 'time'
  hint?: string
  error?: string
  trailingAction?: ReactNode
}
export function Input({
  label,
  hint,
  error,
  id,
  required,
  className,
  trailingAction,
  'aria-describedby': describedBy,
  'aria-invalid': invalid,
  ...props
}: InputProps) {
  return (
    <Field {...{ label, hint, error, id, required, className, describedBy }}>
      {(field) => (
        <div className="cui-input-row">
          <input
            {...props}
            {...field}
            aria-invalid={error ? true : invalid}
            required={required}
            className="cui-input"
          />
          {trailingAction}
        </div>
      )}
    </Field>
  )
}
export function PasswordInput(props: Omit<InputProps, 'type' | 'trailingAction'>) {
  const [visible, setVisible] = useState(false)
  return (
    <Input
      {...props}
      type={visible ? 'text' : 'password'}
      trailingAction={
        <Button
          variant="quiet"
          disabled={props.disabled}
          aria-pressed={visible}
          aria-label={visible ? 'Hide password' : 'Show password'}
          onClick={() => setVisible(!visible)}
        >
          {visible ? 'Hide' : 'Show'}
        </Button>
      }
    />
  )
}
export interface TextareaProps extends ComponentProps<'textarea'> {
  label: string
  hint?: string
  error?: string
}
export function Textarea({
  label,
  hint,
  error,
  id,
  required,
  className,
  'aria-describedby': describedBy,
  'aria-invalid': invalid,
  ...props
}: TextareaProps) {
  return (
    <Field {...{ label, hint, error, id, required, className, describedBy }}>
      {(field) => (
        <textarea
          rows={4}
          {...props}
          {...field}
          aria-invalid={error ? true : invalid}
          required={required}
          className="cui-input cui-textarea"
        />
      )}
    </Field>
  )
}
export interface CheckboxProps extends Omit<ComponentProps<'input'>, 'type' | 'size'> {
  label: string
  hint?: string
  error?: string
}
function Choice({
  label,
  hint,
  error,
  id,
  className,
  required,
  role,
  'aria-describedby': describedBy,
  'aria-invalid': invalid,
  ...props
}: CheckboxProps) {
  const generated = useId()
  const controlId = id || generated
  return (
    <div className={cn('cui-field', className)}>
      <label className="cui-choice" htmlFor={controlId}>
        <input
          {...props}
          id={controlId}
          type="checkbox"
          role={role}
          required={required}
          className={role === 'switch' ? 'cui-switch' : 'cui-checkbox'}
          aria-invalid={error ? true : invalid}
          aria-describedby={
            [describedBy, hint && `${controlId}-hint`, error && `${controlId}-error`].filter(Boolean).join(' ') ||
            undefined
          }
        />
        <span>
          {label}
          {required && ' (required)'}
        </span>
      </label>
      {hint && (
        <p id={`${controlId}-hint`} className="cui-field-note cui-secondary">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${controlId}-error`} className="cui-field-note cui-negative" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
export function Checkbox(props: CheckboxProps) {
  return <Choice {...props} />
}
export function Switch(props: Omit<CheckboxProps, 'role'>) {
  return <Choice {...props} role="switch" />
}
export interface RadioOption {
  value: string
  label: string
  disabled?: boolean
}
export interface RadioGroupProps {
  label: string
  name?: string
  options: readonly RadioOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  required?: boolean
  hint?: string
  error?: string
}
export function RadioGroup({
  label,
  name,
  options,
  value,
  defaultValue,
  onValueChange,
  disabled,
  required,
  hint,
  error,
}: RadioGroupProps) {
  const id = useId()
  return (
    <fieldset
      className="cui-field cui-fieldset"
      disabled={disabled}
      aria-describedby={[hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined}
      aria-invalid={error ? true : undefined}
    >
      <legend className="cui-label">
        {label}
        {required && ' (required)'}
      </legend>
      {options.map((option) => (
        <label className="cui-choice" key={option.value}>
          <input
            className="cui-checkbox"
            type="radio"
            name={name || id}
            value={option.value}
            required={required}
            disabled={option.disabled}
            checked={value === undefined ? undefined : value === option.value}
            defaultChecked={value === undefined ? defaultValue === option.value : undefined}
            onChange={() => onValueChange?.(option.value)}
          />
          {option.label}
        </label>
      ))}
      {hint && (
        <p className="cui-field-note cui-secondary" id={`${id}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className="cui-field-note cui-negative" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </fieldset>
  )
}
