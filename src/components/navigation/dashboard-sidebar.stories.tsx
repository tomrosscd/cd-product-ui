import type { Meta, StoryObj } from '@storybook/react-vite'
import { DashboardShell } from '../../patterns/dashboard-shell.js'
import { DashboardSidebar } from './dashboard-sidebar.js'
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
