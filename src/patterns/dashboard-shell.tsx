'use client'
import { useState, type ReactNode } from 'react'
import { DashboardSidebar, type DashboardSidebarProps } from '../components/navigation/dashboard-sidebar.js'
export interface DashboardShellProps extends DashboardSidebarProps {
  children: ReactNode
  mainId?: string
}
/**
 * The shell owns the collapsed state rather than the sidebar, because the main region is a sibling
 * of the rail and has to move with it. A sidebar used on its own still manages its own state; the
 * host is then responsible for its own content offset.
 */
export function DashboardShell({
  children,
  mainId = 'cui-main',
  collapsible = false,
  collapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  ...sidebarProps
}: DashboardShellProps) {
  const [selfCollapsed, setSelfCollapsed] = useState(defaultCollapsed)
  const isCollapsed = collapsible && (collapsed === undefined ? selfCollapsed : collapsed)
  return (
    <div className="cui-root cui-dashboard" data-cui-nav={isCollapsed ? 'collapsed' : undefined}>
      <a className="cui-skip" href={`#${mainId}`}>
        Skip to content
      </a>
      <DashboardSidebar
        {...sidebarProps}
        collapsible={collapsible}
        collapsed={isCollapsed}
        onCollapsedChange={(next) => {
          if (collapsed === undefined) setSelfCollapsed(next)
          onCollapsedChange?.(next)
        }}
      />
      <main id={mainId} tabIndex={-1} className="cui-dashboard-main">
        {children}
      </main>
    </div>
  )
}
