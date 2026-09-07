import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../lib/classes.js'
export interface DisclosureProps extends Omit<ComponentProps<'details'>, 'title'> {
  title: ReactNode
}
export function Disclosure({ title, children, className, ...props }: DisclosureProps) {
  return (
    <details {...props} className={cn('cui-root cui-disclosure', className)}>
      <summary>{title}</summary>
      <div className="cui-disclosure-body">{children}</div>
    </details>
  )
}
