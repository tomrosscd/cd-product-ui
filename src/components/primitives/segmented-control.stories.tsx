import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { SegmentedControl, SegmentedMultiControl } from './segmented-control.js'
const meta = {
  title: 'Components/Segmented control',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'SegmentedControl is a single-selection toggle group that always keeps exactly one option on, e.g. switching a calendar between Weeks and Months. SegmentedMultiControl allows any number of options on or off.',
      },
    },
  },
} satisfies Meta
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {
  render: function Demo() {
    const [value, setValue] = useState('weeks')
    return (
      <SegmentedControl
        label="View"
        value={value}
        onValueChange={setValue}
        options={[
          { value: 'weeks', label: 'Weeks' },
          { value: 'months', label: 'Months' },
        ]}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    await userEvent.click(c.getByRole('radio', { name: 'Months' }))
    await expect(c.getByRole('radio', { name: 'Months' })).toHaveAttribute('data-state', 'on')
    await userEvent.click(c.getByRole('radio', { name: 'Months' }))
    await expect(c.getByRole('radio', { name: 'Months' })).toHaveAttribute('data-state', 'on')
  },
}
export const WithDisabledOption: Story = {
  render: function Demo() {
    const [value, setValue] = useState('list')
    return (
      <SegmentedControl
        label="Mode"
        value={value}
        onValueChange={setValue}
        options={[
          { value: 'list', label: 'List' },
          { value: 'quick', label: 'Quick capture' },
          { value: 'pipeline', label: 'Pipeline', disabled: true },
        ]}
      />
    )
  },
}
export const Multiple: Story = {
  render: function Demo() {
    const [value, setValue] = useState<string[]>(['design'])
    return (
      <SegmentedMultiControl
        label="Teams"
        value={value}
        onValueChange={setValue}
        options={[
          { value: 'design', label: 'Design' },
          { value: 'development', label: 'Development' },
        ]}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    await userEvent.click(c.getByRole('button', { name: 'Design' }))
    await expect(c.getByRole('button', { name: 'Design' })).toHaveAttribute('data-state', 'off')
  },
}
