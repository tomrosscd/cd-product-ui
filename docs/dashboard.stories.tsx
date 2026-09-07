import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { DashboardExample } from './dashboard-example.js'
const meta = {
  title: 'Patterns/Dashboard',
  component: DashboardExample,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof DashboardExample>
export default meta
type Story = StoryObj<typeof meta>
export const Overview: Story = {}
export const Mobile: Story = { globals: { viewport: { value: 'mobile', isRotated: false } } }
export const FilterAndReview: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.selectOptions(canvas.getByRole('combobox', { name: 'Project view' }), 'active')
    await expect(canvas.getByText('2 projects shown')).toBeVisible()
    await expect(canvas.queryByText('Team onboarding guide')).not.toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: 'Mark as reviewed' }))
    await expect(canvas.getByRole('button', { name: 'Reviewed' })).toBeDisabled()
    await expect(canvas.getByText('Marked as reviewed in this demo.')).toBeVisible()
  },
}
