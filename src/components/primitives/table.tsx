import type { ComponentProps } from 'react'
import { cn } from '../../lib/classes.js'
export interface TableProps extends ComponentProps<'table'> {
  caption: string
  layout?: 'legacy' | 'scroll'
  minWidth?: number
  density?: 'comfortable' | 'compact'
}
/** Semantic table. Keep headers and numeric alignment explicit in the supplied children. */
export function Table({
  caption,
  density = 'comfortable',
  layout = 'legacy',
  minWidth = 640,
  children,
  className,
  ...props
}: TableProps) {
  return (
    <div
      className={cn('cui-root cui-table-scroll', layout === 'scroll' && 'cui-table-readable')}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- WCAG/APG scrollable-region pattern: keyboard users need tabIndex=0 to reach and arrow-scroll this region
      tabIndex={0}
      role="region"
      aria-label={`${caption}, scrollable table`}
    >
      <table
        {...props}
        style={{
          ...props.style,
          ...(layout === 'scroll' ? { minWidth: Number.isFinite(minWidth) ? Math.max(0, minWidth) : 640 } : {}),
        }}
        className={cn('cui-table', `cui-table-${density}`, className)}
      >
        <caption>{caption}</caption>
        {children}
      </table>
    </div>
  )
}
