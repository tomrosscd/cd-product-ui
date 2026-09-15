import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../lib/classes.js'
export interface FormSectionProps extends Omit<ComponentProps<'section'>, 'title'> {
  heading: string
  headingLevel?: 2 | 3 | 4
  description?: ReactNode
  children: ReactNode
}
/**
 * Groups related fields or read-only values under a labelled section, for multi-part forms and
 * record-review layouts. Does not lay out its children — compose `Grid` or `Stack` inside for the
 * field arrangement; `FormSection` only supplies the heading treatment and the gap above and below it.
 */
export function FormSection({
  heading,
  headingLevel = 3,
  description,
  children,
  className,
  ...props
}: FormSectionProps) {
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4'
  return (
    <section {...props} className={cn('cui-root cui-form-section', className)}>
      <header className="cui-form-section-header">
        <Heading className="cui-form-section-heading">{heading}</Heading>
        {description && <p className="cui-caption cui-secondary">{description}</p>}
      </header>
      <div className="cui-form-section-body">{children}</div>
    </section>
  )
}
