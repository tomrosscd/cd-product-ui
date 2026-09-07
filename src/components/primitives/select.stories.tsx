import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { useState } from 'react'
import { Select } from './select.js'
const options = [
  { value: 'all', label: 'All projects' },
  { value: 'active', label: 'Active projects' },
  { value: 'completed', label: 'Completed projects' },
]
const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  args: { label: 'Project view', options, defaultValue: 'all', hint: 'Choose which projects to display.' },
  parameters: {
    docs: {
      description: {
        component:
          'A native single-select dropdown for a short, known list of choices. Supports browser keyboard navigation and mobile pickers. Always supply a visible label. Errors and hints are associated automatically. Supply value + onChange for controlled use, or defaultValue for uncontrolled use. The native menu appearance varies by operating system.',
      },
    },
  },
} satisfies Meta<typeof Select>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Disabled: Story = { args: { disabled: true } }
export const Loading: Story = { args: { loading: true, hint: 'Options are being loaded.' } }
export const NoOptions: Story = { args: { options: [], hint: 'No projects are available yet.' } }
export const Required: Story = { args: { required: true, placeholder: 'Choose a project view', defaultValue: '' } }
export const Error: Story = {
  args: {
    error: 'Choose a project view to continue.',
    required: true,
    placeholder: 'Choose a project view',
    defaultValue: '',
  },
}
export const LongLabels: Story = {
  args: {
    label: 'Projects assigned to your cross-functional working group',
    options: [
      { value: 'long', label: 'All projects across design, development and operations for the current quarter' },
    ],
    defaultValue: 'long',
  },
}
export const DisabledOption: Story = {
  args: { options: [...options, { value: 'archived', label: 'Archived projects (unavailable)', disabled: true }] },
}
function ControlledSelect() {
  const [value, setValue] = useState('all')
  return (
    <div className="cui-stack">
      <Select label="Project view" options={options} value={value} onChange={(event) => setValue(event.target.value)} />
      <p role="status">Showing: {value}</p>
    </div>
  )
}
export const Controlled: Story = {
  render: () => <ControlledSelect />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const select = canvas.getByRole('combobox', { name: 'Project view' })
    await userEvent.selectOptions(select, 'active')
    await expect(select).toHaveValue('active')
    await expect(canvas.getByRole('status')).toHaveTextContent('Showing: active')
  },
}
export const KeyboardFocus: Story = {
  play: async ({ canvasElement }) => {
    const select = within(canvasElement).getByRole('combobox')
    select.focus()
    await expect(select).toHaveFocus()
  },
}
