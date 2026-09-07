import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../lib/classes.js'
export interface AlertProps extends ComponentProps<'div'> {
  title: string
  tone?: 'info' | 'success' | 'warning' | 'error'
}
export function Alert({ title, tone = 'info', children, className, role, ...props }: AlertProps) {
  return (
    <div
      {...props}
      className={cn('cui-alert', `cui-alert-${tone}`, className)}
      role={role ?? (tone === 'error' ? 'alert' : 'status')}
    >
      <strong>{title}</strong>
      {children && <div>{children}</div>}
    </div>
  )
}
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="cui-empty" role="status">
      <strong>{title}</strong>
      {description && <p className="cui-secondary">{description}</p>}
      {action}
    </div>
  )
}
export function Spinner({ label = 'Loading' }: { label?: string }) {
  return (
    <span className="cui-row" role="status">
      <span className="cui-spinner" aria-hidden="true" />
      <span>{label}</span>
    </span>
  )
}
export function Skeleton({ label = 'Loading content', lines = 3 }: { label?: string; lines?: number }) {
  return (
    <div className="cui-stack" role="status">
      <span className="cui-sr-only">{label}</span>
      {Array.from({ length: Math.max(1, Math.min(10, lines)) }, (_, i) => (
        <div key={i} className={cn('cui-skeleton', i === lines - 1 && 'cui-skeleton-short')} />
      ))}
    </div>
  )
}
