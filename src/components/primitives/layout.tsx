import type { ComponentProps, CSSProperties, ReactNode } from 'react'
import { cn } from '../../lib/classes.js'

export type LayoutGap = 0 | 4 | 8 | 12 | 16 | 20 | 24 | 32 | 40 | 48 | 64
export interface StackProps extends ComponentProps<'div'> {
  gap?: LayoutGap
}
export function Stack({ gap = 24, className, style, ...props }: StackProps) {
  return (
    <div
      {...props}
      className={cn('cui-root cui-layout-stack', className)}
      style={{ '--cui-layout-gap': `var(--cui-space-${gap})`, ...style } as CSSProperties}
    />
  )
}
export interface GridProps extends StackProps {
  /** Maximum number of equal columns. Columns collapse to fit the parent. */
  columns?: 1 | 2 | 3 | 4
  /** Preferred minimum item width in pixels, not a forced minimum on small screens. */
  minItemWidth?: number
}
export function Grid({ columns = 3, minItemWidth = 240, gap = 16, className, style, ...props }: GridProps) {
  return (
    <div
      {...props}
      className={cn('cui-root cui-layout-grid', className)}
      style={
        {
          '--cui-layout-gap': `var(--cui-space-${gap})`,
          '--cui-grid-columns': columns,
          '--cui-grid-min': `${Number.isFinite(minItemWidth) && minItemWidth > 0 ? minItemWidth : 240}px`,
          ...style,
        } as CSSProperties
      }
    />
  )
}
export interface SplitLayoutProps extends Omit<StackProps, 'children'> {
  primary: ReactNode
  secondary: ReactNode
}
/** A two-to-one split that wraps in reading order when its parent becomes narrow. */
export function SplitLayout({ primary, secondary, gap = 24, className, style, ...props }: SplitLayoutProps) {
  return (
    <div
      {...props}
      className={cn('cui-root cui-layout-split', className)}
      style={{ '--cui-layout-gap': `var(--cui-space-${gap})`, ...style } as CSSProperties}
    >
      <div className="cui-layout-primary">{primary}</div>
      <div className="cui-layout-secondary">{secondary}</div>
    </div>
  )
}
export interface PageHeaderProps extends Omit<ComponentProps<'header'>, 'children'> {
  heading: string
  headingLevel?: 1 | 2
  description?: ReactNode
  context?: ReactNode
  actions?: ReactNode
}
export function PageHeader({
  heading,
  headingLevel = 1,
  description,
  context,
  actions,
  className,
  ...props
}: PageHeaderProps) {
  const Heading = headingLevel === 1 ? 'h1' : 'h2'
  return (
    <header {...props} className={cn('cui-root cui-layout-header', className)}>
      <div className="cui-layout-header-copy">
        {context && <div className="cui-caption cui-secondary">{context}</div>}
        <Heading className="cui-layout-heading">{heading}</Heading>
        {description && <div className="cui-secondary">{description}</div>}
      </div>
      {actions && <div className="cui-layout-header-actions">{actions}</div>}
    </header>
  )
}
