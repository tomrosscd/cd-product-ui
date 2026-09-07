import type { ComponentProps, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
const cardVariants = cva('cui-card', {
  variants: {
    density: { comfortable: 'cui-card-comfortable', compact: 'cui-card-compact' },
    elevation: { raised: 'cui-card-raised', flat: 'cui-card-flat' },
  },
  defaultVariants: { density: 'comfortable', elevation: 'raised' },
})
export interface CardProps extends Omit<ComponentProps<'article'>, 'children'>, VariantProps<typeof cardVariants> {
  heading: string
  headingLevel?: 2 | 3 | 4
  description?: string
  children?: ReactNode
  footer?: ReactNode
  state?: 'ready' | 'loading' | 'empty' | 'error'
  message?: string
  action?: ReactNode
}
export function Card({
  heading,
  headingLevel = 2,
  description,
  children,
  footer,
  state = 'ready',
  message,
  action,
  density,
  elevation,
  className,
  ...props
}: CardProps) {
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4'
  return (
    <article
      {...props}
      className={cardVariants({ density, elevation, className })}
      aria-busy={state === 'loading' || undefined}
    >
      <header className="cui-card-header">
        <Heading className="cui-card-heading">{heading}</Heading>
        {description && <p className="cui-secondary">{description}</p>}
      </header>
      {state === 'ready' ? (
        children
      ) : state === 'loading' ? (
        <div className="cui-stack" role="status">
          <span className="cui-sr-only">{message || 'Loading content'}</span>
          <div className="cui-skeleton" />
          <div className="cui-skeleton cui-skeleton-short" />
        </div>
      ) : (
        <div className="cui-stack" role={state === 'error' ? 'alert' : 'status'}>
          <p className={state === 'error' ? 'cui-negative' : 'cui-secondary'}>
            {message || (state === 'error' ? 'Content could not be loaded.' : 'There is nothing to show yet.')}
          </p>
          {action}
        </div>
      )}
      {state === 'ready' && footer && <footer className="cui-card-footer">{footer}</footer>}
    </article>
  )
}
