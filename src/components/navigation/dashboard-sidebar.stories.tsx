import type { Meta, StoryObj } from '@storybook/react-vite'
import { DashboardShell } from '../../patterns/dashboard-shell.js'
import { DashboardSidebar, type SidebarEntry } from './dashboard-sidebar.js'
import { Icon } from '../primitives/icon.js'
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
}

/** `collapsible` adds a menu button that reduces the rail to icons. A section has no room for its
 *  children there, so choosing one expands the rail rather than opening in place. */
export const CollapsibleRail: Story = {
  args: { items: groupedNavigation, activeId: 'allocation-queue', collapsible: true },
}

export const CollapsedByDefault: Story = {
  args: { items: groupedNavigation, activeId: 'overview', collapsible: true, defaultCollapsed: true },
}
