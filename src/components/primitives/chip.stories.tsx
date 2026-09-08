import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { Chip, ChipGroup } from './chip.js'
const meta = {
  title: 'Components/Chip',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'An interactive tag: selectable (onSelect, a toggle button) and/or removable (onRemove). Use Badge instead for a non-interactive status label — Chip always renders at least one real button.',
      },
    },
  },
} satisfies Meta
export default meta
type Story = StoryObj<typeof meta>
export const Selectable: Story = {
  render: function Demo() {
    const [selected, setSelected] = useState(false)
    return <Chip label="In review" selected={selected} onSelect={() => setSelected((value) => !value)} />
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    const chip = c.getByRole('button', { name: 'In review' })
    await expect(chip).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(chip)
    await expect(chip).toHaveAttribute('aria-pressed', 'true')
  },
}
export const Removable: Story = {
  render: function Demo() {
    const [present, setPresent] = useState(true)
    return present ? <Chip label="Design" onRemove={() => setPresent(false)} /> : <p>Removed.</p>
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    await userEvent.click(c.getByRole('button', { name: 'Remove Design' }))
    await expect(c.getByText('Removed.')).toBeVisible()
  },
}
export const SelectableAndRemovable: Story = {
  render: function Demo() {
    const [selected, setSelected] = useState(true)
    return (
      <Chip
        label="Overdue"
        selected={selected}
        onSelect={() => setSelected((value) => !value)}
        onRemove={() => setSelected(false)}
      />
    )
  },
}
export const Disabled: Story = { render: () => <Chip label="Archived" selected disabled onSelect={() => {}} /> }
export const Group: Story = {
  render: function Demo() {
    const [value, setValue] = useState<string[]>(['design'])
    return (
      <ChipGroup
        label="Teams"
        value={value}
        onValueChange={setValue}
        options={[
          { value: 'design', label: 'Design' },
          { value: 'development', label: 'Development' },
          { value: 'operations', label: 'Operations', disabled: true },
        ]}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    await expect(c.getByRole('button', { name: 'Design' })).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(c.getByRole('button', { name: 'Development' }))
    await expect(c.getByRole('button', { name: 'Development' })).toHaveAttribute('aria-pressed', 'true')
    await expect(c.getByRole('button', { name: 'Operations' })).toBeDisabled()
  },
}
