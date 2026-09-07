import type { ComponentProps } from 'react'
import { cn } from '../../lib/classes.js'
export type BadgeTone = 'neutral' | 'accent' | 'positive' | 'warning' | 'negative'
export interface BadgeProps extends ComponentProps<'span'> {
  tone?: BadgeTone
  variant?: 'soft' | 'outline'
}
/** A descriptive label. Use a real link or button for an interactive tag. */
export function Badge({ tone = 'neutral', variant = 'soft', className, ...props }: BadgeProps) {
  return <span {...props} className={cn('cui-badge', `cui-badge-${tone}`, `cui-badge-${variant}`, className)} />
}
