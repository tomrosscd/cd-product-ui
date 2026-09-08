import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { DatePicker, type DateSelection } from './date-picker.js'
const meta = {
  title: 'Components/Date picker',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A single combined field for single-date or date-range selection, with typed entry, optional presets and draft/apply/cancel editing so an in-progress selection never commits until confirmed. Two months on desktop, one on mobile. See Components/Calendar for the inline grid on its own, Components/Month picker for month/year-only selection, and Components/Date range for the older two-native-input alternative kept for existing consumers.',
      },
    },
  },
} satisfies Meta
export default meta
type Story = StoryObj<typeof meta>
function PickerDemo({ range = false }: { range?: boolean }) {
  const [value, setValue] = useState<DateSelection | undefined>({
    start: '2026-09-01',
    ...(range ? { end: '2026-09-30' } : {}),
  })
  return (
    <>
      <DatePicker
        label="Reporting period"
        mode={range ? 'range' : 'single'}
        value={value}
        onValueChange={setValue}
        presets={range ? [{ label: 'September', value: { start: '2026-09-01', end: '2026-09-30' } }] : []}
      />
      <p role="status">{JSON.stringify(value) || 'No dates selected'}</p>
    </>
  )
}
export const SingleDate: Story = { render: () => <PickerDemo /> }
export const CombinedRange: Story = {
  render: () => <PickerDemo range />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement),
      page = within(canvasElement.ownerDocument.body)
    await userEvent.click(c.getByRole('button', { name: 'Reporting period' }))
    const input = page.getByRole('textbox', { name: 'Enter date range' })
    await userEvent.clear(input)
    await userEvent.type(input, '2026-09-10 / 2026-09-15')
    await userEvent.click(page.getByRole('button', { name: 'Apply' }))
    await expect(c.getByRole('status')).toHaveTextContent('2026-09-10')
    await userEvent.click(c.getByRole('button', { name: 'Reporting period' }))
    await userEvent.click(page.getByRole('button', { name: 'Clear' }))
    await userEvent.click(page.getByRole('button', { name: 'Cancel' }))
    await expect(c.getByRole('status')).toHaveTextContent('2026-09-10')
    await expect(c.getByRole('button', { name: 'Reporting period' })).toHaveFocus()
  },
}
export const InvalidRange: Story = {
  render: () => <PickerDemo range />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement),
      page = within(canvasElement.ownerDocument.body)
    await userEvent.click(c.getByRole('button', { name: 'Reporting period' }))
    const input = page.getByRole('textbox', { name: 'Enter date range' })
    await userEvent.clear(input)
    await userEvent.type(input, '2026-02-30 / 2026-02-01')
    await expect(page.getByRole('button', { name: 'Apply' })).toBeDisabled()
    await userEvent.keyboard('{Escape}')
    await expect(c.getByRole('status')).toHaveTextContent('2026-09-01')
  },
}
