import { useId, type ComponentProps } from 'react'
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
  const captionId = useId(),
    hintId = `${captionId}-hint`
  return (
    <div
      className={cn('cui-root cui-table-scroll', layout === 'scroll' && 'cui-table-readable')}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- WCAG/APG scrollable-region pattern: keyboard users need tabIndex=0 to reach and arrow-scroll this region
      tabIndex={0}
      role="region"
      aria-labelledby={captionId}
      aria-describedby={hintId}
    >
      <span id={hintId} className="cui-sr-only">
        Scrollable table
      </span>
      <table
        {...props}
        style={{
          ...props.style,
          ...(layout === 'scroll' ? { minWidth: Number.isFinite(minWidth) ? Math.max(0, minWidth) : 640 } : {}),
        }}
        className={cn('cui-table', `cui-table-${density}`, className)}
      >
        <caption id={captionId}>{caption}</caption>
        {children}
      </table>
    </div>
  )
}
