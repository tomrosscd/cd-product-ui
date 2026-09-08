import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, within } from 'storybook/test'
import { DateRange } from './workspace-controls.js'
const meta = {
  title: 'Components/Date range',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Two plain native date inputs with no timezone conversion or range calculations, kept unchanged for existing consumers. See Components/Date picker for the newer single combined field with typed entry and presets.',
      },
    },
  },
} satisfies Meta
export default meta
type Story = StoryObj<typeof meta>
export const Dates: Story = {
  render: function Example() {
    const [value, setValue] = useState({ start: '2026-09-01', end: '2026-09-30' })
    return <DateRange label="Reporting period" value={value} onValueChange={setValue} name="period" />
  },
}
export const InvalidDates: Story = {
  render: () => (
    <DateRange label="Reporting period" value={{ start: '2026-09-30', end: '2026-09-01' }} onValueChange={() => {}} />
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByLabelText('End date')).toHaveAttribute('aria-invalid', 'true')
  },
}
