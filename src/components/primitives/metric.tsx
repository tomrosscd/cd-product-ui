import type { ReactNode } from 'react'
import { Card, type CardProps } from './card.js'
import { cn } from '../../lib/classes.js'
export interface MetricComparison {
  label: string
  direction?: 'up' | 'down' | 'flat'
  sentiment?: 'neutral' | 'positive' | 'negative'
}
export interface MetricProps {
  value: ReactNode
  unit?: string
  comparison?: MetricComparison
  description?: string
}
/** Direction and sentiment are independent. Increasing cost may be negative. */
export function Metric({ value, unit, comparison, description }: MetricProps) {
  const arrows = { up: '↑', down: '↓', flat: '→' }
  return (
    <div className="cui-root cui-stack cui-metric-content">
      <div>
        <strong className="cui-metric">{value}</strong>
        {unit && <span className="cui-secondary"> {unit}</span>}
      </div>
      {comparison && (
        <p
          className={cn(
            'cui-caption',
            comparison.sentiment === 'positive'
              ? 'cui-positive'
              : comparison.sentiment === 'negative'
                ? 'cui-negative'
                : 'cui-secondary',
          )}
        >
          {comparison.direction && (
            <>
              <span aria-hidden="true">{arrows[comparison.direction]} </span>
              <span className="cui-sr-only">
                {comparison.direction === 'flat'
                  ? 'Unchanged'
                  : comparison.direction === 'up'
                    ? 'Increased'
                    : 'Decreased'}
                :{' '}
              </span>
            </>
          )}
          {comparison.label}
        </p>
      )}
      {description && <p className="cui-caption cui-secondary">{description}</p>}
    </div>
  )
}
export interface MetricCardProps extends Omit<CardProps, 'description'>, MetricProps {
  sparkline?: ReactNode
}
export function MetricCard({
  value,
  unit,
  comparison,
  description,
  sparkline,
  children,
  className,
  ...props
}: MetricCardProps) {
  return (
    <Card {...props} className={cn('cui-metric-card', className)}>
      <Metric {...{ value, unit, comparison, description }} />
      {sparkline}
      {children}
    </Card>
  )
}
