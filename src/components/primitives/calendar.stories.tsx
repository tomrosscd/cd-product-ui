import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { Calendar, type DateSelection } from './date-picker.js'
const meta = {
  title: 'Components/Calendar',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The inline calendar grid on its own, without a trigger or popover — for pages where the date choice should always be visible. Supports single or range selection with full keyboard navigation. See Components/Date picker for the combined field/popover version.',
      },
    },
  },
} satisfies Meta
export default meta
type Story = StoryObj<typeof meta>
export const InlineCalendar: Story = {
  render: function Demo() {
    const [value, setValue] = useState<DateSelection | undefined>({ start: '2026-09-01' })
    return <Calendar value={value} onValueChange={setValue} min="2026-09-01" max="2026-12-31" />
  },
}
export const Keyboard: Story = {
  render: function Demo() {
    const [value, setValue] = useState<DateSelection | undefined>({ start: '2026-09-10' })
    return (
      <>
        <Calendar value={value} onValueChange={setValue} />
        <p role="status" aria-label="Selected date">
          {value?.start}
        </p>
      </>
    )
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    const selected = c.getByRole('button', { name: /Thursday, September 10th, 2026/ })
    selected.focus()
    await userEvent.keyboard('{ArrowRight}{Enter}')
    await expect(c.getByRole('status', { name: 'Selected date' })).toHaveTextContent('2026-09-11')
  },
}
