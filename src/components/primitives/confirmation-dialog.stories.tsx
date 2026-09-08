import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { ConfirmationDialog } from './confirmation-dialog.js'
import { Button } from './button.js'
const meta = {
  title: 'Components/Confirmation dialog',
  component: ConfirmationDialog,
  tags: ['autodocs'],
  args: {
    trigger: <Button>Archive project</Button>,
    heading: 'Archive this project?',
    description: 'It will leave the active project list. You can restore it later.',
    confirmLabel: 'Archive project',
    onConfirm: fn(),
  },
} satisfies Meta<typeof ConfirmationDialog>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const CancelWithKeyboard: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    const trigger = c.getByRole('button', { name: 'Archive project' })
    await userEvent.click(trigger)
    const body = within(canvasElement.ownerDocument.body)
    await expect(body.getByRole('alertdialog')).toBeVisible()
    await expect(body.getByRole('button', { name: 'Cancel' })).toHaveFocus()
    await userEvent.keyboard('{Escape}')
    await expect(body.queryByRole('alertdialog')).not.toBeInTheDocument()
    await expect(trigger).toHaveFocus()
  },
}
export const Confirm: Story = {
  play: async ({ canvasElement, args }) => {
    await userEvent.click(within(canvasElement).getByRole('button'))
    const dialog = within(canvasElement.ownerDocument.body).getByRole('alertdialog')
    await userEvent.click(within(dialog).getByRole('button', { name: 'Archive project' }))
    await expect(args.onConfirm).toHaveBeenCalledOnce()
  },
}
