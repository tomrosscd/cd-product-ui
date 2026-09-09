import type { ComponentProps, ReactNode } from 'react'
import { cn } from '../../lib/classes.js'

export interface ContentListProps extends ComponentProps<'ul'> {
  density?: 'comfortable' | 'compact'
}
/** Use ContentListItem children. Supply a visible heading or an accessible list label. */
export function ContentList({ density = 'comfortable', className, ...props }: ContentListProps) {
  return <ul {...props} className={cn('cui-root cui-content-list', `cui-content-list-${density}`, className)} />
}
export interface ContentListItemProps extends Omit<ComponentProps<'li'>, 'title' | 'children'> {
  title: ReactNode
  description?: ReactNode
  leading?: ReactNode
  meta?: ReactNode
  actions?: ReactNode
}
/** Links and actions stay separate. The whole row is deliberately not a click target. */
export function ContentListItem({
  title,
  description,
  leading,
  meta,
  actions,
  className,
  ...props
}: ContentListItemProps) {
  return (
    <li {...props} className={cn('cui-content-list-item', className)}>
      {leading && <div className="cui-content-list-leading">{leading}</div>}
      <div className="cui-content-list-copy">
        <div className="cui-content-list-title">{title}</div>
        {description && <div className="cui-caption cui-secondary">{description}</div>}
      </div>
      {meta && <div className="cui-content-list-meta cui-caption cui-secondary">{meta}</div>}
      {actions && <div className="cui-content-list-actions">{actions}</div>}
    </li>
  )
}
