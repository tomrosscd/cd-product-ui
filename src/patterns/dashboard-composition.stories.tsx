import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { DashboardCompositionExample } from '../../docs/dashboard-composition-example.js'
const meta = {
  title: 'Patterns/Dashboard composition',
  component: DashboardCompositionExample,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Embed this content inside your existing main area. Stack owns the 24px section gaps; Grid responds to its parent width; SplitLayout provides the wide summary and supporting panel. No second sidebar or fixed main offset is introduced. All data is illustrative.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ padding: 'var(--cui-space-16)', background: 'var(--cui-surface-band)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DashboardCompositionExample>
export default meta
type Story = StoryObj<typeof meta>
export const Overview: Story = {}
export const NarrowParent: Story = {
  render: () => (
    <div style={{ width: 320, maxWidth: '100%' }}>
      <DashboardCompositionExample />
    </div>
  ),
}
export const Tablet: Story = {
  render: () => (
    <div style={{ width: 768, maxWidth: '100%' }}>
      <DashboardCompositionExample />
    </div>
  ),
}
export const LayoutRegression: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    const root = c.getByTestId('dashboard-sections')
    // Exercise available container width independently of the browser viewport or host sidebar.
    const parent = root.parentElement!
    const original = parent.style.cssText
    try {
      for (const width of [1440, 1024, 768, 390, 320]) {
        parent.style.width = `${width}px`
        const sections = [...root.children]
        for (let i = 1; i < sections.length; i++) {
          await expect(
            sections[i]!.getBoundingClientRect().top - sections[i - 1]!.getBoundingClientRect().bottom,
          ).toBeGreaterThanOrEqual(23)
        }
        await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth + 1)
        const metrics = c.getByTestId('metric-grid')
        const columns = getComputedStyle(metrics).gridTemplateColumns.split(' ').length
        await expect(columns).toBe(width === 1440 || width === 1024 ? 4 : width === 768 ? 3 : 1)
        const split = c.getByTestId('pipeline-split')
        const [primary, secondary] = [...split.children].map((el) => el.getBoundingClientRect())
        if (width >= 1024) {
          await expect(Math.abs(primary!.top - secondary!.top)).toBeLessThan(1)
          await expect(primary!.width / secondary!.width).toBeGreaterThan(1.9)
        } else {
          await expect(secondary!.top - primary!.bottom).toBeGreaterThanOrEqual(23)
        }
        for (const list of root.querySelectorAll('.cui-content-list'))
          await expect(list.scrollWidth).toBeLessThanOrEqual(list.clientWidth + 1)
      }
    } finally {
      parent.style.cssText = original
    }
    c.getByRole('button', { name: 'Review workspace' }).focus()
    await userEvent.keyboard('{Enter}')
    await expect(c.getByRole('status')).toHaveTextContent('Review opened')
    await userEvent.click(c.getByRole('button', { name: 'Review allocation for Amelia Chen' }))
    await expect(c.getByRole('status')).toHaveTextContent('Amelia Chen')
  },
}
