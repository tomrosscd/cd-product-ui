import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Tabs } from './tabs.js'
const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  args: {
    label: 'Activity view',
    defaultValue: 'summary',
    items: [
      { value: 'summary', label: 'Summary', content: <p>Workspace summary</p> },
      { value: 'details', label: 'Details', content: <p>Detailed activity</p> },
      { value: 'archived', label: 'Archived', disabled: true, content: null },
    ],
  },
} satisfies Meta<typeof Tabs>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Keyboard: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    c.getByRole('tab', { name: 'Summary' }).focus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(c.getByRole('tab', { name: 'Details' })).toHaveFocus()
    await expect(c.getByRole('tabpanel')).toHaveTextContent('Detailed activity')
  },
}
