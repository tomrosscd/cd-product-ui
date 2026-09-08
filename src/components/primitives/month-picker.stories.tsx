import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { MonthPicker } from './date-picker.js'
const meta = {
  title: 'Components/Month picker',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Two Convert-styled selects for choosing a month and year, for budget/reporting-period pickers that never need a day. See Components/Date picker for day-level selection.',
      },
    },
  },
} satisfies Meta
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {
  render: function Demo() {
    const [value, setValue] = useState('2026-09')
    return <MonthPicker label="Budget month" value={value} onValueChange={setValue} startYear={2024} endYear={2030} />
  },
}
