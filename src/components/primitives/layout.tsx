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
  /**
   * Cross-axis alignment of each row's items. 'start' (default) sizes every item to its own
   * content, so rows of unrelated cards keep their natural heights. Use 'stretch' for a row of
   * comparable cards (for example a KPI/metric row) that should share one height per row even
   * when one item's content wraps onto an extra line.
   */
  align?: 'start' | 'stretch'
}
export function Grid({
  columns = 3,
  minItemWidth = 240,
  gap = 16,
  align = 'start',
  className,
  style,
  ...props
}: GridProps) {
  return (
    <div
      {...props}
      className={cn('cui-root cui-layout-grid', className)}
      style={
        {
          '--cui-layout-gap': `var(--cui-space-${gap})`,
          '--cui-grid-columns': columns,
          '--cui-grid-min': `${Number.isFinite(minItemWidth) && minItemWidth > 0 ? minItemWidth : 240}px`,
          '--cui-grid-align': align,
          ...style,
        } as CSSProperties
      }
    />
  )
}
/** Which panel takes the extra width. 'primary' is the default and matches the original two-to-one split. */
export type SplitRatio = 'primary' | 'balanced' | 'secondary'
const splitGrow: Record<SplitRatio, [number, number]> = {
  primary: [2, 1],
  balanced: [1, 1],
  secondary: [1, 2],
}
export interface SplitLayoutProps extends Omit<StackProps, 'children'> {
  primary: ReactNode
  secondary: ReactNode
  ratio?: SplitRatio
}
/** A split that wraps in reading order when its parent becomes narrow. */
export function SplitLayout({
  primary,
  secondary,
  ratio = 'primary',
  gap = 24,
  className,
  style,
  ...props
}: SplitLayoutProps) {
  const [primaryGrow, secondaryGrow] = splitGrow[ratio] ?? splitGrow.primary
  return (
    <div
      {...props}
      className={cn('cui-root cui-layout-split', className)}
      style={
        {
          '--cui-layout-gap': `var(--cui-space-${gap})`,
          '--cui-split-primary': primaryGrow,
          '--cui-split-secondary': secondaryGrow,
          ...style,
        } as CSSProperties
      }
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
