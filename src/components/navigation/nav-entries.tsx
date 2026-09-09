'use client'
import { useId, useState, type MouseEvent, type ReactNode } from 'react'
import { safeHref } from '../../lib/href.js'
import { cn } from '../../lib/classes.js'
import { Icon } from '../primitives/icon.js'

export interface SidebarItem {
  id: string
  label: string
  href: string
  icon?: ReactNode
  disabled?: boolean
}
/**
 * A collapsible group of destinations. Modelled on Material Design 3's expanded navigation rail,
 * which reveals secondary destinations that a collapsed rail cannot show
 * (https://m3.material.io/components/navigation-rail/guidelines, read 9 September 2026). The
 * structure and interaction model come from there; the appearance stays on Convert's own tokens.
 */
export interface SidebarSection {
  id: string
  label: string
  icon?: ReactNode
  /**
   * Destinations, or nested sub-sections for a second level of grouping (e.g. "Allocation" holding
   * separate "FE" and "BE" sub-groups). Nesting is not depth-limited, but keep it to two levels in
   * practice — a third level has no established visual treatment and starts to fight the rail's
   * job of staying scannable.
   */
  items: readonly SidebarEntry[]
  /** Open on first render. A section holding the active destination opens regardless. */
  defaultOpen?: boolean
}
export type SidebarEntry = SidebarItem | SidebarSection

export function isSection(entry: SidebarEntry): entry is SidebarSection {
  return Array.isArray((entry as SidebarSection).items)
}
export function sectionHoldsActive(section: SidebarSection, activeId: string): boolean {
  return section.items.some((entry) => (isSection(entry) ? sectionHoldsActive(entry, activeId) : entry.id === activeId))
}

interface NavLinkProps {
  item: SidebarItem
  activeId: string
  collapsed: boolean
  onNavigate?: (item: SidebarItem, event: MouseEvent<HTMLAnchorElement>) => void
}
/** A disabled destination stays out of the tab sequence: it renders as text, never a link. */
export function NavLink({ item, activeId, collapsed, onNavigate }: NavLinkProps) {
  const label = collapsed ? undefined : <span>{item.label}</span>
  if (item.disabled) {
    return (
      <span className="cui-nav-item" aria-disabled="true" title={collapsed ? item.label : undefined}>
        {item.icon}
        {label}
        <span className="cui-sr-only">{collapsed ? `${item.label}, ` : ''}unavailable</span>
      </span>
    )
  }
  return (
    <a
      href={safeHref(item.href)}
      className="cui-nav-item"
      aria-current={activeId === item.id ? 'page' : undefined}
      aria-label={collapsed ? item.label : undefined}
      title={collapsed ? item.label : undefined}
      onClick={(event) => onNavigate?.(item, event)}
    >
      {item.icon}
      {label}
    </a>
  )
}

interface NavSectionProps {
  section: SidebarSection
  activeId: string
  collapsed: boolean
  onExpandRail?: () => void
  onNavigate?: (item: SidebarItem, event: MouseEvent<HTMLAnchorElement>) => void
  /** True for a section rendered inside another section's list (one level of nesting only ever
   * renders here — a nested section's own children are always further-nested `NavSection`s, not a
   * separate concept). Only affects sizing/indent; behaviour is identical at any depth. */
  nested?: boolean
}
/**
 * A disclosure, not a link. The button owns the expanded state and the list it controls, which is
 * the standard pattern for nested navigation and keeps the whole group reachable by keyboard.
 */
export function NavSection({
  section,
  activeId,
  collapsed,
  onExpandRail,
  onNavigate,
  nested = false,
}: NavSectionProps) {
  const listId = useId()
  const holdsActive = sectionHoldsActive(section, activeId)
  const [open, setOpen] = useState(section.defaultOpen || holdsActive)
  // Holding the current page decides the *initial* state and reopens the section if the route later
  // moves into it. It must not force the section open, or a reader could never collapse the group
  // they are currently in. This is React's adjust-state-during-render pattern, not an effect.
  const [wasActive, setWasActive] = useState(holdsActive)
  if (holdsActive !== wasActive) {
    setWasActive(holdsActive)
    if (holdsActive) setOpen(true)
  }
  // A collapsed rail has no room for child destinations, so the section expands the rail instead of
  // opening in place. M3 treats revealing secondary destinations as the expanded rail's job. Only
  // the outermost section can be rendered inside a collapsed rail — a nested section only ever
  // renders once its parent's list is already showing, which itself requires the rail to be
  // expanded — so `collapsed` is always false by the time a nested NavSection mounts.
  const expanded = collapsed ? false : open
  return (
    <div
      className={cn('cui-nav-section', nested && 'cui-nav-section-nested')}
      data-cui-current-section={holdsActive ? '' : undefined}
    >
      <button
        type="button"
        className="cui-nav-item cui-nav-section-trigger"
        aria-expanded={collapsed ? undefined : expanded}
        aria-controls={collapsed ? undefined : listId}
        aria-label={collapsed ? section.label : undefined}
        title={collapsed ? section.label : undefined}
        onClick={() => (collapsed ? onExpandRail?.() : setOpen(!expanded))}
      >
        {section.icon}
        {!collapsed && (
          <>
            <span>{section.label}</span>
            <Icon name={expanded ? 'chevron-up' : 'chevron'} className="cui-nav-section-marker" aria-hidden="true" />
          </>
        )}
      </button>
      {!collapsed && (
        <ul id={listId} className="cui-nav-section-list" hidden={!expanded}>
          {section.items.map((entry) =>
            isSection(entry) ? (
              <li key={entry.id}>
                <NavSection section={entry} activeId={activeId} collapsed={false} onNavigate={onNavigate} nested />
              </li>
            ) : (
              <li key={entry.id}>
                <NavLink item={entry} activeId={activeId} collapsed={false} onNavigate={onNavigate} />
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  )
}
