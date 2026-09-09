import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Drawer } from './drawer.js'
import { Button } from './button.js'
import { Badge } from './badge.js'

const meta = {
  title: 'Components/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  args: {
    trigger: <Button>View project</Button>,
    heading: 'Vets Love Pets — Lyppard',
    description: 'PW-118',
    children: (
      <>
        <p className="cui-secondary">
          Content, loading and saving states are the application's — this only owns the open/close chrome.
        </p>
        <dl className="cui-key-values">
          <div>
            <dt>PM</dt>
            <dd>Jordan Lee</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>
              <Badge tone="warning">At risk</Badge>
            </dd>
          </div>
        </dl>
      </>
    ),
    footer: <Button variant="primary">Edit project</Button>,
  },
} satisfies Meta<typeof Drawer>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const OpenAndClose: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    const trigger = c.getByRole('button', { name: 'View project' })
    await userEvent.click(trigger)
    const body = within(canvasElement.ownerDocument.body)
    await expect(body.getByRole('dialog', { name: 'Vets Love Pets — Lyppard' })).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await expect(body.queryByRole('dialog')).not.toBeInTheDocument()
    await expect(trigger).toHaveFocus()
  },
}

export const NoDescription: Story = {
  args: { description: undefined },
}
