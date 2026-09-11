import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { StyledSelect } from './styled-select.js'
const options = [
  { value: 'all', label: 'All projects' },
  { value: 'active', label: 'Active projects' },
  { value: 'completed', label: 'Completed projects', disabled: true },
]
const meta = {
  title: 'Components/Styled select',
  component: StyledSelect,
  tags: ['autodocs'],
  args: { label: 'Project view', options },
  parameters: {
    docs: {
      description: {
        component:
          "A Convert-styled single-select with a themed open panel, optional option groups, a checkmark on the selected item and full keyboard support. Use it where the native Select's browser-drawn menu is not distinctive enough. See Components/Select for the plain native alternative, which remains supported unchanged.",
      },
    },
  },
} satisfies Meta<typeof StyledSelect>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {
  render: function Demo(args) {
    const [value, setValue] = useState('all')
    return <StyledSelect {...args} value={value} onValueChange={setValue} />
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    await userEvent.click(c.getByRole('combobox', { name: 'Project view' }))
    const selected = within(canvasElement.ownerDocument.body).getByRole('option', { name: 'All projects' })
    const style = getComputedStyle(selected)
    await expect(style.outlineStyle).toBe('none')
    await expect(style.boxShadow).not.toBe('none')
    const label = selected.querySelector('.cui-select-option-label')!
    const indicator = selected.querySelector('.cui-select-option-indicator')!
    await expect(label.getBoundingClientRect().right).toBeLessThan(indicator.getBoundingClientRect().left)
    await expect(selected.getBoundingClientRect().right - indicator.getBoundingClientRect().right).toBeLessThan(16)
    await userEvent.keyboard('{Home}{ArrowDown}{Enter}')
    await expect(c.getByRole('combobox')).toHaveTextContent('Active projects')
    await expect(c.getByRole('combobox')).toHaveFocus()
  },
}
export const Loading: Story = { args: { label: 'Loading teams', loading: true, options: [] } }
export const Unavailable: Story = { args: { label: 'Unavailable teams', options: [] } }
export const Grouped: Story = {
  args: {
    label: 'Team',
    error: 'Choose a team.',
    options: [
      { value: 'design', label: 'Design', group: 'Delivery' },
      { value: 'build', label: 'Development', group: 'Delivery' },
    ],
  },
}
