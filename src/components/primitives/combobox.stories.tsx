import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { Combobox } from './combobox.js'
const teamOptions = [
  { value: 'amelia', label: 'Amelia Chen' },
  { value: 'ben', label: 'Ben Osei' },
  { value: 'carla', label: 'Carla Diaz' },
  { value: 'delroy', label: 'Delroy Fields', disabled: true },
]
const meta = {
  title: 'Components/Combobox',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A searchable single or multi-select. Filters `options` locally by label by default; supply `onSearchChange` for a remote/async search instead, and use `loading`/`error` to reflect the request state. Distinct from StyledSelect, which is for a short, already-known list with no search.',
      },
    },
  },
} satisfies Meta
export default meta
type Story = StoryObj<typeof meta>
export const SingleSelect: Story = {
  render: function Demo() {
    const [value, setValue] = useState('')
    return (
      <Combobox
        label="Assignee"
        placeholder="Search people…"
        options={teamOptions}
        value={value}
        onValueChange={setValue}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    const input = c.getByRole('combobox', { name: 'Assignee' })
    await userEvent.click(input)
    await userEvent.type(input, 'car')
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(page.getByRole('option', { name: 'Carla Diaz' }))
    await expect(input).toHaveValue('Carla Diaz')
    await expect(page.queryByRole('listbox')).not.toBeInTheDocument()
  },
}
export const MultiSelect: Story = {
  render: function Demo() {
    const [value, setValue] = useState<string[]>(['amelia'])
    return (
      <Combobox
        label="Reviewers"
        placeholder="Add a reviewer…"
        options={teamOptions}
        multiple
        value={value}
        onValueChange={setValue}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    await expect(c.getByRole('button', { name: 'Remove Amelia Chen' })).toBeVisible()
    const input = c.getByRole('combobox', { name: 'Reviewers' })
    await userEvent.click(input)
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.click(page.getByRole('option', { name: 'Ben Osei' }))
    await expect(c.getByRole('button', { name: 'Remove Ben Osei' })).toBeVisible()
    await expect(page.getByRole('listbox')).toBeVisible()
    await userEvent.click(c.getByRole('button', { name: 'Remove Ben Osei' }))
    await expect(c.queryByRole('button', { name: 'Remove Ben Osei' })).not.toBeInTheDocument()
  },
}
export const Loading: Story = {
  render: () => <Combobox label="Project" options={[]} loading value="" onValueChange={() => {}} />,
}
export const NoResults: Story = {
  render: function Demo() {
    const [value, setValue] = useState('')
    return <Combobox label="Assignee" options={teamOptions} value={value} onValueChange={setValue} />
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    await userEvent.click(c.getByRole('combobox', { name: 'Assignee' }))
    await userEvent.type(c.getByRole('combobox', { name: 'Assignee' }), 'zzz')
    await expect(within(canvasElement.ownerDocument.body).getByText('No matching options')).toBeVisible()
  },
}
export const RequestError: Story = {
  render: () => (
    <Combobox
      label="Project"
      options={[]}
      error="Couldn't load projects. Try again."
      value=""
      onValueChange={() => {}}
    />
  ),
}
