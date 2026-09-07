import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Disclosure } from './disclosure.js'
const meta = {
  title: 'Components/Disclosure',
  component: Disclosure,
  tags: ['autodocs'],
  args: { title: 'View supporting details', children: <p>Supporting information for this view.</p> },
} satisfies Meta<typeof Disclosure>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    await userEvent.click(c.getByText('View supporting details'))
    await expect(c.getByText('Supporting information for this view.')).toBeVisible()
  },
}
export const Expanded: Story = { args: { open: true } }
export const Group: Story = {
  render: () => (
    <div>
      <Disclosure title="How are values calculated?">
        <p>The application supplies the values.</p>
      </Disclosure>
      <Disclosure title="When was this updated?">
        <p>The application supplies the reporting period.</p>
      </Disclosure>
    </div>
  ),
}
