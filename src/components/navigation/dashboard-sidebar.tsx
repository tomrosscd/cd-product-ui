'use client'
import { useProductTheme } from '../primitives/theme.js'
import * as Dialog from '@radix-ui/react-dialog'
import { useEffect, useState, type MouseEvent, type ReactNode } from 'react'
import { cn } from '../../lib/classes.js'
import { tokens } from '../../tokens.js'
import { ConvertLogo } from '../primitives/convert-logo.js'
import { ConvertMark } from '../primitives/convert-mark.js'
import { Icon } from '../primitives/icon.js'
import { Button } from '../primitives/button.js'
import { NavLink, NavSection, isSection, type SidebarEntry, type SidebarItem } from './nav-entries.js'
export type { SidebarItem, SidebarSection, SidebarEntry } from './nav-entries.js'
export interface DashboardSidebarProps {
  /** A flat list of destinations, or a mix of destinations and collapsible sections. */
  items: readonly SidebarEntry[]
  activeId: string
  /** Show a menu button that collapses the rail to icons. Off by default, so existing usage is unchanged. */
  collapsible?: boolean
  /** Controlled collapsed state. Supply `onCollapsedChange` with it. */
  collapsed?: boolean
  defaultCollapsed?: boolean
  onCollapsedChange?: (collapsed: boolean) => void
  workspace?: string
  workspaceDescription?: string
  footer?: ReactNode
  onNavigate?: (item: SidebarItem, event: MouseEvent<HTMLAnchorElement>) => void
  className?: string
}
export function DashboardSidebar({
  items,
  activeId,
  workspace = 'Workspace',
  workspaceDescription = 'Product workspace',
  footer,
  onNavigate,
  className,
  collapsible = false,
  collapsed,
  defaultCollapsed = false,
  onCollapsedChange,
}: DashboardSidebarProps) {
  const theme = useProductTheme()
  const [open, setOpen] = useState(false)
  const [selfCollapsed, setSelfCollapsed] = useState(defaultCollapsed)
  const isCollapsed = collapsible && (collapsed === undefined ? selfCollapsed : collapsed)
  function setCollapsed(next: boolean) {
    if (collapsed === undefined) setSelfCollapsed(next)
    onCollapsedChange?.(next)
  }
  useEffect(() => {
    const media = window.matchMedia(`(min-width: ${tokens['breakpoint.sidebar']})`)
    const closeOnDesktop = () => {
      if (media.matches) setOpen(false)
    }
    media.addEventListener('change', closeOnDesktop)
    return () => media.removeEventListener('change', closeOnDesktop)
  }, [])
  function contents(mobile: boolean) {
    const rail = isCollapsed && !mobile
    return (
      <>
        <div className="cui-brand">
          {rail ? <ConvertMark /> : <ConvertLogo variant="straight" label="Convert" className="cui-brand-logo" />}
        </div>
        {collapsible && !mobile && (
          <Button
            variant="quiet"
            className="cui-nav-toggle"
            aria-expanded={!rail}
            aria-label={rail ? 'Expand navigation' : 'Collapse navigation'}
            onClick={() => setCollapsed(!rail)}
          >
            <Icon name="menu" />
            {!rail && <span>Collapse</span>}
          </Button>
        )}
        {!rail && (
          <div className="cui-workspace">
            <strong>{workspace}</strong>
            <span>{workspaceDescription}</span>
          </div>
        )}
        <nav className="cui-nav" aria-label={mobile ? 'Mobile navigation' : 'Main navigation'}>
          {items.map((entry) =>
            isSection(entry) ? (
              <NavSection
                key={entry.id}
                section={entry}
                activeId={activeId}
                collapsed={rail}
                onExpandRail={() => setCollapsed(false)}
                onNavigate={(item, event) => {
                  onNavigate?.(item, event)
                  setOpen(false)
                }}
              />
            ) : (
              <NavLink
                key={entry.id}
                item={entry}
                activeId={activeId}
                collapsed={rail}
                onNavigate={(item, event) => {
                  onNavigate?.(item, event)
                  setOpen(false)
                }}
              />
            ),
          )}
        </nav>
        {footer && <div className="cui-sidebar-footer">{footer}</div>}
      </>
    )
  }
  return (
    <div className={cn('cui-sidebar-root', className)} data-cui-nav={isCollapsed ? 'collapsed' : undefined}>
      <aside className="cui-sidebar cui-root" aria-label="Workspace sidebar">
        {contents(false)}
      </aside>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <div className="cui-mobile-bar">
          <div className="cui-brand">
            <ConvertMark />
            <span>{workspace}</span>
          </div>
          <Dialog.Trigger asChild>
            <Button aria-label="Open navigation">
              <Icon name="menu" />
              <span>Menu</span>
            </Button>
          </Dialog.Trigger>
        </div>
        <Dialog.Portal>
          <Dialog.Overlay className="cui-sidebar-overlay" />
          <Dialog.Content data-cui-theme={theme} className="cui-sidebar-drawer cui-root" aria-describedby={undefined}>
            <Dialog.Title className="cui-sr-only">Workspace navigation</Dialog.Title>
            <Dialog.Close asChild>
              <Button variant="quiet" className="cui-drawer-close" aria-label="Close navigation">
                <Icon name="close" />
              </Button>
            </Dialog.Close>
            {contents(true)}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
