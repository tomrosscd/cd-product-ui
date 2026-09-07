import type { ComponentProps } from 'react'
import { cn } from '../../lib/classes.js'
export interface TableProps extends ComponentProps<'table'> {
  caption: string
  density?: 'comfortable' | 'compact'
}
/** Semantic table. Keep headers and numeric alignment explicit in the supplied children. */
export function Table({ caption, density = 'comfortable', children, className, ...props }: TableProps) {
  return (
    <div className="cui-root cui-table-scroll" tabIndex={0} role="region" aria-label={`${caption}, scrollable table`}>
      <table {...props} className={cn('cui-table', `cui-table-${density}`, className)}>
        <caption>{caption}</caption>
        {children}
      </table>
    </div>
  )
}
