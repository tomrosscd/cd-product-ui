import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { ColumnConfigPanel, type ColumnConfigColumn } from './column-config-panel.js'
import { Button } from './button.js'

const columns: ColumnConfigColumn[] = [
  { key: 'project', label: 'Project', locked: true },
  { key: 'pm', label: 'PM' },
  { key: 'phase', label: 'Phase' },
  { key: 'fe_lead', label: 'FE lead' },
  { key: 'dev_start', label: 'Dev start' },
  { key: 'launch_date', label: 'Launch date' },
  { key: 'days_to_launch', label: 'Days to launch' },
  { key: 'margin', label: 'Margin', adminOnly: true },
]
const defaultVisible = ['project', 'pm', 'phase', 'fe_lead', 'dev_start', 'launch_date', 'days_to_launch']

const meta = {
  title: 'Components/Column config panel',
  component: ColumnConfigPanel,
  tags: ['autodocs'],
  args: {
    trigger: <Button>Configure columns</Button>,
    columns,
    visibleKeys: defaultVisible,
    defaultKeys: defaultVisible,
    onChange: () => {},
  },
} satisfies Meta<typeof ColumnConfigPanel>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: function Demo(args) {
    const [visibleKeys, setVisibleKeys] = useState<readonly string[]>(args.visibleKeys)
    return <ColumnConfigPanel {...args} visibleKeys={visibleKeys} onChange={setVisibleKeys} />
  },
}

export const ToggleAndReorder: Story = {
  render: function Demo(args) {
    const [visibleKeys, setVisibleKeys] = useState<readonly string[]>(args.visibleKeys)
    return <ColumnConfigPanel {...args} visibleKeys={visibleKeys} onChange={setVisibleKeys} />
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    await userEvent.click(c.getByRole('button', { name: 'Configure columns' }))
    const panel = within(canvasElement.ownerDocument.body)
    await expect(panel.getByText('Project')).toBeVisible()

    const margin = panel.getByLabelText('Margin (admin)')
    await expect(margin).not.toBeChecked()
    await userEvent.click(margin)
    await expect(margin).toBeChecked()

    await userEvent.click(panel.getByRole('button', { name: 'Move PM down' }))
    await userEvent.click(panel.getByText('Reset to defaults'))
    await expect(margin).not.toBeChecked()
  },
}
