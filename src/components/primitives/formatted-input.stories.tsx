import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { CurrencyInput, PercentageInput, HoursInput } from './formatted-input.js'
const meta = {
  title: 'Components/Formatted inputs',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'CurrencyInput, PercentageInput and HoursInput format and display a numeric value with a prefix or suffix; the application keeps calculations, rounding and totals. PercentageInput shows a plain number (42 for 42%), not a 0-1 fraction.',
      },
    },
  },
} satisfies Meta
export default meta
type Story = StoryObj<typeof meta>
export const Currency: Story = {
  render: function Demo() {
    const [value, setValue] = useState<number | undefined>(1250)
    return <CurrencyInput label="Budget" value={value} onValueChange={setValue} />
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    const input = c.getByLabelText('Budget')
    await expect(input).toHaveValue('1,250.00')
    await userEvent.click(input)
    await expect(input).toHaveValue('1250')
    await userEvent.clear(input)
    await userEvent.type(input, '980.5')
    await userEvent.tab()
    await expect(input).toHaveValue('980.50')
  },
}
export const Percentage: Story = {
  render: function Demo() {
    const [value, setValue] = useState<number | undefined>(42)
    return <PercentageInput label="Completion" value={value} onValueChange={setValue} />
  },
}
export const Hours: Story = {
  render: function Demo() {
    const [value, setValue] = useState<number | undefined>(7.5)
    return <HoursInput label="Logged time" value={value} onValueChange={setValue} />
  },
}
export const Empty: Story = {
  render: function Demo() {
    const [value, setValue] = useState<number | undefined>(undefined)
    return <CurrencyInput label="Estimate" value={value} onValueChange={setValue} placeholder="0.00" hint="Optional." />
  },
}
export const WithError: Story = {
  render: () => (
    <CurrencyInput label="Budget" value={undefined} onValueChange={() => {}} error="Enter a budget." required />
  ),
}
