import type { ReactNode } from 'react'
import { DashboardSidebar, type DashboardSidebarProps } from '../components/navigation/dashboard-sidebar.js'
export interface DashboardShellProps extends DashboardSidebarProps {
  children: ReactNode
  mainId?: string
}
export function DashboardShell({ children, mainId = 'cui-main', ...sidebarProps }: DashboardShellProps) {
  return (
    <div className="cui-root cui-dashboard">
      <a className="cui-skip" href={`#${mainId}`}>
        Skip to content
      </a>
      <DashboardSidebar {...sidebarProps} />
      <main id={mainId} tabIndex={-1} className="cui-dashboard-main">
        {children}
      </main>
    </div>
  )
}
