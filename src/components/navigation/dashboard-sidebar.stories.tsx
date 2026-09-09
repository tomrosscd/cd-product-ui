import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor, within } from 'storybook/test'
import { DashboardShell } from '../../patterns/dashboard-shell.js'
import { DashboardSidebar, type SidebarEntry } from './dashboard-sidebar.js'
import { Icon } from '../primitives/icon.js'
import { Badge } from '../primitives/badge.js'
import { demoNavigation } from '../../../docs/dashboard-example.js'
const meta = {
  title: 'Components/Dashboard sidebar',
  component: DashboardSidebar,
  tags: ['autodocs'],
  args: { items: demoNavigation, activeId: 'overview', workspace: 'Studio workspace' },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Persistent workspace navigation on desktop, with an accessible menu drawer below 900px. The current page uses aria-current. Disabled destinations are not focusable. The mobile drawer supports Escape, focus containment and focus return, and closes when a destination is chosen. Supply href values from the consuming application and onNavigate only when integrating a client router.',
      },
    },
  },
  render: (args) => (
    <DashboardShell {...args}>
      <div className="cui-page">
        <h1 className="cui-page-heading">Workspace navigation</h1>
        <p>Resize the preview below 900px to use the mobile menu. Links belong to the consuming application.</p>
      </div>
    </DashboardShell>
  ),
} satisfies Meta<typeof DashboardSidebar>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const CurrentPage: Story = { args: { activeId: 'projects' } }
export const UnavailableDestination: Story = {
  args: { items: [...demoNavigation, { id: 'settings', label: 'Settings', href: '#settings', disabled: true }] },
}
export const BadgedDestination: Story = {
  args: {
    items: [
      ...demoNavigation,
      { id: 'forecasting', label: 'Forecasting', href: '#forecasting', badge: <Badge tone="accent">Beta</Badge> },
    ],
  },
}
export const LongLabels: Story = {
  args: {
    workspace: 'A workspace with a longer descriptive name',
    items: [
      ...demoNavigation,
      { id: 'resources', label: 'Resources and operational documentation', href: '#resources' },
    ],
  },
}
export const Mobile: Story = { globals: { viewport: { value: 'mobile', isRotated: false } } }

const groupedNavigation: readonly SidebarEntry[] = [
  { id: 'overview', label: 'Dashboard', href: '#overview', icon: <Icon name="overview" /> },
  {
    id: 'projects',
    label: 'Projects',
    icon: <Icon name="projects" />,
    items: [
      { id: 'projects-active', label: 'Active', href: '#projects-active' },
      { id: 'projects-archive', label: 'Archive', href: '#projects-archive' },
    ],
  },
  {
    id: 'allocation',
    label: 'Allocation',
    icon: <Icon name="users" />,
    items: [
      { id: 'allocation-capacity', label: 'Capacity', href: '#allocation-capacity' },
      { id: 'allocation-queue', label: 'Over-allocation', href: '#allocation-queue' },
    ],
  },
  { id: 'invoicing', label: 'Invoicing', href: '#invoicing', icon: <Icon name="status" /> },
  { id: 'config', label: 'Config', href: '#config', icon: <Icon name="settings" />, disabled: true },
]

/** Sections are disclosures, not links. The one holding the current page opens on load and stays marked. */
export const NestedSections: Story = {
  args: { items: groupedNavigation, activeId: 'allocation-queue' },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    // Runs in a real browser on purpose. A closed section carries the `hidden` attribute, but a
    // class-based `display` value outranks the user-agent's [hidden] rule, so the attribute alone
    // proves nothing: this once left a closed section's children visible and tabbable while it
    // reported aria-expanded="false". jsdom applies no user-agent stylesheet and cannot catch it.
    const projects = c.getAllByRole('button', { name: 'Projects' })[0] as HTMLElement
    await expect(projects).toHaveAttribute('aria-expanded', 'false')
    const list = canvasElement.ownerDocument.getElementById(projects.getAttribute('aria-controls') || '')
    await expect(list).not.toBeNull()
    await expect(getComputedStyle(list as HTMLElement).display).toBe('none')
    // offsetParent is null only when an ancestor is display:none, so this is the rendered truth.
    await expect((list as HTMLElement).querySelector('a')?.offsetParent).toBeNull()
  },
}

const deeplyNestedNavigation: readonly SidebarEntry[] = [
  { id: 'overview', label: 'Dashboard', href: '#overview', icon: <Icon name="overview" /> },
  {
    id: 'allocation',
    label: 'Allocation',
    icon: <Icon name="users" />,
    items: [
      {
        id: 'allocation-fe',
        label: 'FE',
        items: [
          { id: 'allocation-fe-lead', label: 'FE Lead', href: '#allocation-fe-lead' },
          { id: 'allocation-fe-overall', label: 'Frontend overall', href: '#allocation-fe-overall' },
        ],
      },
      {
        id: 'allocation-be',
        label: 'BE',
        items: [
          { id: 'allocation-be-lead', label: 'BE Lead', href: '#allocation-be-lead' },
          { id: 'allocation-be-overall', label: 'Backend overall', href: '#allocation-be-overall' },
        ],
      },
      { id: 'allocation-qa', label: 'QA', href: '#allocation-qa' },
    ],
  },
  { id: 'invoicing', label: 'Invoicing', href: '#invoicing', icon: <Icon name="status" /> },
]

/**
 * A section's items can themselves be sections — "Allocation" holds separate "FE" and "BE"
 * sub-groups, each with their own destinations, alongside a flat "QA" destination at the same
 * level. This is the structure a real consumer (an internal capacity-planning tool) needed and
 * could not express with a single level of grouping.
 */
export const DeeplyNestedSections: Story = {
  args: { items: deeplyNestedNavigation, activeId: 'allocation-fe-lead' },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    // The active destination sits two levels down — both its immediate parent (FE) and the
    // grandparent (Allocation) must auto-open, not just the immediate one.
    const allocation = c.getByRole('button', { name: 'Allocation' })
    await expect(allocation).toHaveAttribute('aria-expanded', 'true')
    const fe = c.getByRole('button', { name: 'FE' })
    await expect(fe).toHaveAttribute('aria-expanded', 'true')
    await expect(c.getByRole('link', { name: 'FE Lead' })).toBeVisible()

    // BE did not hold the active destination, so it starts closed — nesting does not force every
    // sibling open, only the branch that actually holds the current page.
    const be = c.getByRole('button', { name: 'BE' })
    await expect(be).toHaveAttribute('aria-expanded', 'false')
    const beList = canvasElement.ownerDocument.getElementById(be.getAttribute('aria-controls') || '')
    await expect((beList as HTMLElement).querySelector('a')?.offsetParent).toBeNull()

    // Opening BE independently does not disturb FE, which is still showing its own active item.
    be.click()
    await waitFor(async () => {
      await expect(be).toHaveAttribute('aria-expanded', 'true')
    })
    await expect(c.getByRole('link', { name: 'BE Lead' })).toBeVisible()
    await expect(fe).toHaveAttribute('aria-expanded', 'true')
    await expect(c.getByRole('link', { name: 'FE Lead' })).toBeVisible()
  },
}

/**
 * Starts expanded. The collapse control sits on the trailing edge of the branding row, so the logo
 * stays a logo and never doubles as a button. Compare with **Collapsed by default** below: the
 * first destination holds the same vertical position in both states, because the expand control
 * takes the space the workspace block occupies when expanded.
 *
 * A section has no room for its children in the rail, so choosing one expands the rail rather than
 * opening in place.
 */
export const CollapsibleRail: Story = {
  args: { items: groupedNavigation, activeId: 'allocation-queue', collapsible: true },
  play: async ({ canvasElement }) => {
    const doc = canvasElement.ownerDocument
    const firstNavTop = () =>
      (doc.querySelector('.cui-sidebar .cui-nav-item') as HTMLElement).getBoundingClientRect().top
    const sidebar = () => (doc.querySelector('.cui-sidebar') as HTMLElement).getBoundingClientRect()

    const expandedTop = firstNavTop()
    await expect(Math.round(sidebar().width)).toBe(208)

    const collapse = doc.querySelector('button[aria-label="Collapse navigation"]') as HTMLElement
    await expect(collapse).toHaveAttribute('aria-expanded', 'true')
    collapse.click()

    const expand = await waitFor(() => {
      const el = doc.querySelector('button[aria-label="Expand navigation"]') as HTMLElement
      if (!el) throw new Error('expand control not rendered')
      return el
    })
    await expect(expand).toHaveAttribute('aria-expanded', 'false')
    await expect(Math.round(sidebar().width)).toBe(64)

    // The point of putting the expand control in the workspace block's space: no vertical jump.
    await expect(Math.round(firstNavTop())).toBe(Math.round(expandedTop))

    // Entirely inside the rail, centred, and a real pointer target rather than a bare icon.
    const rail = sidebar()
    const box = expand.getBoundingClientRect()
    await expect(box.left >= rail.left && box.right <= rail.right).toBe(true)
    await expect(Math.abs(box.left - rail.left - (rail.right - box.right)) <= 2).toBe(true)
    await expect(box.height).toBeGreaterThanOrEqual(44)

    expand.click()
    await waitFor(() => {
      if (!doc.querySelector('button[aria-label="Collapse navigation"]')) throw new Error('did not expand back')
    })
  },
}

/** The same navigation starting collapsed, for comparing the two states side by side. */
export const CollapsedByDefault: Story = {
  args: { items: groupedNavigation, activeId: 'overview', collapsible: true, defaultCollapsed: true },
}

/** `brand` and `brandMark` let a product sit inside the Convert system without forking the
 *  component. The mark is used where a wordmark will not fit: the collapsed rail and the mobile bar. */
export const ProductBranding: Story = {
  args: {
    items: groupedNavigation,
    activeId: 'overview',
    collapsible: true,
    workspace: 'Planwerk',
    brand: <strong style={{ fontSize: '1.125rem' }}>Planwerk</strong>,
    brandMark: <strong>PW</strong>,
  },
}
