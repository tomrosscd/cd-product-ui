'use client'
import { useEffect, useRef, type ReactNode } from 'react'
import { Stepper, type StepperStep } from '../components/primitives/stepper.js'
import { Button } from '../components/primitives/button.js'
export interface WizardProps {
  steps: readonly StepperStep[]
  activeId: string
  children: ReactNode
  onNext: () => void
  onBack?: () => void
  onCancel?: () => void
  loading?: boolean
  error?: string
  nextLabel?: string
  backLabel?: string
  cancelLabel?: string
}
/** A controlled sequence of forms. The host validates, saves and changes activeId or renders completion. */
export function Wizard({
  steps,
  activeId,
  children,
  onNext,
  onBack,
  onCancel,
  loading,
  error,
  nextLabel = 'Continue',
  backLabel = 'Back',
  cancelLabel = 'Cancel',
}: WizardProps) {
  const heading = useRef<HTMLHeadingElement>(null)
  const previous = useRef(activeId)
  const active = steps.find((step) => step.id === activeId)
  useEffect(() => {
    if (previous.current !== activeId) heading.current?.focus()
    previous.current = activeId
  }, [activeId])
  if (!active) throw new Error('Wizard activeId must identify one of its steps.')
  return (
    <form
      className="cui-stack"
      aria-label={active.label}
      onSubmit={(event) => {
        event.preventDefault()
        if (!loading) onNext()
      }}
    >
      <Stepper steps={steps} activeId={activeId} />
      <h2 ref={heading} tabIndex={-1}>
        {active.label}
      </h2>
      <fieldset className="cui-wizard-fields" disabled={loading}>
        <legend className="cui-sr-only">{active.label}</legend>
        {children}
      </fieldset>
      {error && (
        <p role="alert" className="cui-negative">
          {error}
        </p>
      )}
      <div className="cui-row">
        {onCancel && (
          <Button type="button" variant="quiet" disabled={loading} onClick={onCancel}>
            {cancelLabel}
          </Button>
        )}
        {onBack && (
          <Button type="button" disabled={loading} onClick={onBack}>
            {backLabel}
          </Button>
        )}
        <Button type="submit" variant="primary" loading={loading}>
          {nextLabel}
        </Button>
      </div>
    </form>
  )
}
