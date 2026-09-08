import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../lib/classes.js'
export interface DisclosureProps extends ComponentProps<'details'> {
  heading: ReactNode
}
export function Disclosure({ heading, children, className, ...props }: DisclosureProps) {
  return (
    <details {...props} className={cn('cui-root cui-disclosure', className)}>
      <summary>{heading}</summary>
      <div className="cui-disclosure-body">{children}</div>
    </details>
  )
}
