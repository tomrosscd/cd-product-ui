'use client'
import { useProductTheme } from '../primitives/theme.js'
import * as Dialog from '@radix-ui/react-dialog'
import { useEffect, useState, type MouseEvent, type ReactNode } from 'react'
import { cn } from '../../lib/classes.js'
import { tokens } from '../../tokens.js'
import { ConvertLogo } from '../primitives/convert-logo.js'
import { ConvertMark } from '../primitives/convert-mark.js'
import { Icon } from '../primitives/icon.js'
export interface SidebarItem {
  id: string
  label: string
  href: string
  icon?: ReactNode
  disabled?: boolean
}
export interface DashboardSidebarProps {
  items: readonly SidebarItem[]
  activeId: string
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
}: DashboardSidebarProps) {
  const theme = useProductTheme()
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const media = window.matchMedia(`(min-width: ${tokens['breakpoint.sidebar']})`)
    const closeOnDesktop = () => {
      if (media.matches) setOpen(false)
    }
    media.addEventListener('change', closeOnDesktop)
    return () => media.removeEventListener('change', closeOnDesktop)
  }, [])
  function contents(mobile: boolean) {
    return (
      <>
        <div className="cui-brand">
          <ConvertLogo variant="straight" label="Convert" className="cui-brand-logo" />
        </div>
        <div className="cui-workspace">
          <strong>{workspace}</strong>
          <span>{workspaceDescription}</span>
        </div>
        <nav className="cui-nav" aria-label={mobile ? 'Mobile navigation' : 'Main navigation'}>
          {items.map((item) =>
            item.disabled ? (
              <span key={item.id} className="cui-nav-item" aria-disabled="true">
                {item.icon}
                <span>{item.label}</span>
                <span className="cui-sr-only">, unavailable</span>
              </span>
            ) : (
              <a
                key={item.id}
                href={item.href}
                className="cui-nav-item"
                aria-current={activeId === item.id ? 'page' : undefined}
                onClick={(event) => {
                  onNavigate?.(item, event)
                  setOpen(false)
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </a>
            ),
          )}
        </nav>
        {footer && <div className="cui-sidebar-footer">{footer}</div>}
      </>
    )
  }
  return (
    <div className={cn('cui-sidebar-root', className)}>
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
            <button type="button" className="cui-button cui-button-secondary" aria-label="Open navigation">
              <Icon name="menu" />
              <span>Menu</span>
            </button>
          </Dialog.Trigger>
        </div>
        <Dialog.Portal>
          <Dialog.Overlay className="cui-sidebar-overlay" />
          <Dialog.Content data-cui-theme={theme} className="cui-sidebar-drawer cui-root" aria-describedby={undefined}>
            <Dialog.Title className="cui-sr-only">Workspace navigation</Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className="cui-button cui-button-quiet cui-drawer-close"
                aria-label="Close navigation"
              >
                <Icon name="close" />
              </button>
            </Dialog.Close>
            {contents(true)}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
