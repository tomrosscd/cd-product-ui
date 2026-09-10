import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { InlineEdit } from './inline-edit.js'

const meta = {
  title: 'Components/Inline edit',
  component: InlineEdit,
  tags: ['autodocs'],
  args: {
    label: 'PM',
    value: 'Jordan Lee',
    onSave: async () => {},
    children: () => null,
  },
  parameters: {
    docs: {
      description: {
        component:
          'A click-to-edit field for a table cell or detail row. The application supplies the actual control (a select, textarea, date input, ...) since that varies per field — this only owns the shared shell: the trigger, focusing the control on open, Escape to cancel, and disabling it while the save is pending.',
      },
    },
  },
} satisfies Meta<typeof InlineEdit>
export default meta
type Story = StoryObj<typeof meta>

const pmOptions = [
  { value: 'jordan', label: 'Jordan Lee' },
  { value: 'sam', label: 'Sam Rivera' },
  { value: 'priya', label: 'Priya Nair' },
]

export const SelectField: Story = {
  render: function Demo() {
    const [value, setValue] = useState<string | null>('jordan')
    return (
      <InlineEdit
        label="PM"
        value={value}
        displayValue={pmOptions.find((o) => o.value === value)?.label}
        onSave={async (next) => {
          await new Promise((resolve) => setTimeout(resolve, 200))
          setValue(next)
        }}
      >
        {({ commit, cancel, saving }) => (
          <select
            className="cui-inline-edit-control"
            defaultValue={value ?? ''}
            disabled={saving}
            onBlur={cancel}
            onChange={(e) => commit(e.target.value || null)}
          >
            <option value="">— None —</option>
            {pmOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        )}
      </InlineEdit>
    )
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    const trigger = c.getByRole('button', { name: 'Edit PM: Jordan Lee' })
    await userEvent.click(trigger)
    const select = c.getByRole('combobox')
    await expect(select).toHaveFocus()
    await userEvent.selectOptions(select, 'sam')
    await waitFor(() => expect(c.getByRole('button', { name: 'Edit PM: Sam Rivera' })).toBeInTheDocument())
  },
}

export const TextareaField: Story = {
  render: function Demo() {
    const [value, setValue] = useState<string | null>('Blocked on client sign-off.')
    return (
      <InlineEdit
        label="Notes"
        value={value}
        onSave={async (next) => {
          await new Promise((resolve) => setTimeout(resolve, 200))
          setValue(next)
        }}
      >
        {({ commit, saving }) => (
          <textarea
            className="cui-inline-edit-control"
            defaultValue={value ?? ''}
            disabled={saving}
            rows={2}
            onBlur={(e) => commit(e.target.value.trim() || null)}
          />
        )}
      </InlineEdit>
    )
  },
}

export const DisabledField: Story = {
  args: { disabled: true },
}

export const EmptyValue: Story = {
  args: { value: null },
}
