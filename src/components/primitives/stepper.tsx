import { Icon } from './icon.js'
export interface StepperStep {
  id: string
  label: string
}
export interface StepperProps {
  steps: readonly StepperStep[]
  activeId: string
}
/** Sequential progress display. The host owns step content, validation and navigation. */
export function Stepper({ steps, activeId }: StepperProps) {
  const activeIndex = steps.findIndex((step) => step.id === activeId)
  return (
    <ol
      className="cui-stepper"
      aria-label="Progress"
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- WCAG/APG scrollable-region pattern: keyboard users need tabIndex=0 to reach and arrow-scroll this region when steps overflow
      tabIndex={0}
    >
      {steps.map((step, index) => {
        const state = index < activeIndex ? 'done' : index === activeIndex ? 'current' : 'upcoming'
        return (
          <li key={step.id} className="cui-stepper-step" data-cui-step={state}>
            <div className="cui-stepper-marker" aria-hidden="true">
              {state === 'done' ? <Icon name="check" className="cui-icon-inline" /> : index + 1}
            </div>
            <span className="cui-stepper-label" aria-current={state === 'current' ? 'step' : undefined}>
              {step.label}
            </span>
            {index < steps.length - 1 && <div className="cui-stepper-connector" aria-hidden="true" />}
          </li>
        )
      })}
    </ol>
  )
}
