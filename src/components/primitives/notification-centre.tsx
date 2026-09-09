'use client'
import * as Popover from '@radix-ui/react-popover'
import type { ReactNode } from 'react'
import { safeHref } from '../../lib/href.js'
import { useProductTheme } from './theme.js'
import { Button } from './button.js'
import { Icon } from './icon.js'
export interface NotificationItem {
  id: string
  title: string
  description?: string
  /** Pre-formatted by the consuming application (e.g. "2 hours ago") — relative-time formatting
   * is a real dependency decision (date-fns, Intl.RelativeTimeFormat, or otherwise), not this
   * library's to make. */
  timestamp?: string
  read?: boolean
  href?: string
  /** Per-notification-type icon, chosen by the consuming application — the type taxonomy itself
   * (over-allocation, invoice due, launch reminder, ...) is application data, not library concern. */
  icon?: ReactNode
}
export interface NotificationCentreProps {
  items: readonly NotificationItem[]
  onItemClick?: (item: NotificationItem) => void
  onMarkAllRead?: () => void
  footer?: ReactNode
  emptyLabel?: string
  /** Accessible name for the trigger and the panel heading. */
  label?: string
}
/**
 * Presentation only, like every other component here: fetching, marking read and any realtime
 * subscription stay with the consuming application. An unread count badge is derived from
 * `items[].read` rather than taken as a separate prop, so it can never disagree with the list.
 */
export function NotificationCentre({
  items,
  onItemClick,
  onMarkAllRead,
  footer,
  emptyLabel = 'No notifications yet.',
  label = 'Notifications',
}: NotificationCentreProps) {
  const theme = useProductTheme()
  const unreadCount = items.filter((item) => !item.read).length
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button variant="quiet" size="icon" aria-label={unreadCount > 0 ? `${label} (${unreadCount} unread)` : label}>
          <span className="cui-notification-trigger">
            <Icon name="notifications" />
            {unreadCount > 0 && (
              <span className="cui-notification-badge" aria-hidden="true">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </span>
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          data-cui-theme={theme}
          className="cui-root cui-notification-panel"
          align="end"
          sideOffset={8}
          collisionPadding={16}
          aria-label={label}
        >
          <div className="cui-notification-header">
            <span className="cui-notification-heading">{label}</span>
            {unreadCount > 0 && onMarkAllRead && (
              <button type="button" className="cui-notification-mark-all" onClick={onMarkAllRead}>
                Mark all read
              </button>
            )}
          </div>
          <ul className="cui-notification-list">
            {items.length === 0 ? (
              <li className="cui-notification-empty">{emptyLabel}</li>
            ) : (
              items.map((item) => {
                const inner = (
                  <>
                    {item.icon && (
                      <span className="cui-notification-icon" aria-hidden="true">
                        {item.icon}
                      </span>
                    )}
                    <span className="cui-notification-body">
                      <span className="cui-notification-title">
                        {item.title}
                        {!item.read && (
                          <span className="cui-notification-dot" aria-hidden="true">
                            <span className="cui-sr-only">, unread</span>
                          </span>
                        )}
                      </span>
                      {item.description && <span className="cui-notification-description">{item.description}</span>}
                      {item.timestamp && <span className="cui-notification-timestamp">{item.timestamp}</span>}
                    </span>
                  </>
                )
                return (
                  <li key={item.id}>
                    {item.href ? (
                      <Popover.Close asChild>
                        <a
                          href={safeHref(item.href)}
                          className="cui-notification-item"
                          onClick={() => onItemClick?.(item)}
                        >
                          {inner}
                        </a>
                      </Popover.Close>
                    ) : (
                      <button type="button" className="cui-notification-item" onClick={() => onItemClick?.(item)}>
                        {inner}
                      </button>
                    )}
                  </li>
                )
              })
            )}
          </ul>
          {footer && <div className="cui-notification-footer">{footer}</div>}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
