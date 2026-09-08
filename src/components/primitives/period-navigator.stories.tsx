import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { PeriodNavigator } from './period-navigator.js'
const meta = {
  title: 'Components/Period navigator',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Previous/next navigation for an application-defined period. The application supplies the already-formatted current label and calculates what "next" means (a day, a week, a month) — this component only renders the chrome.',
      },
    },
  },
} satisfies Meta
export default meta
type Story = StoryObj<typeof meta>
const weeks = ['25 – 31 August 2026', '1 – 7 September 2026', '8 – 14 September 2026']
export const Default: Story = {
  render: function Demo() {
    const [index, setIndex] = useState(1)
    return (
      <PeriodNavigator
        label={weeks[index] ?? ''}
        onPrevious={() => setIndex((value) => Math.max(0, value - 1))}
        onNext={() => setIndex((value) => Math.min(weeks.length - 1, value + 1))}
        disabledPrevious={index === 0}
        disabledNext={index === weeks.length - 1}
        onToday={() => setIndex(1)}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    await expect(c.getByText('1 – 7 September 2026')).toBeVisible()
    await userEvent.click(c.getByRole('button', { name: 'Next period' }))
    await expect(c.getByText('8 – 14 September 2026')).toBeVisible()
    await expect(c.getByRole('button', { name: 'Next period' })).toBeDisabled()
    await userEvent.click(c.getByRole('button', { name: 'Today' }))
    await expect(c.getByText('1 – 7 September 2026')).toBeVisible()
  },
}
export const WithReportingPresets: Story = {
  render: function Demo() {
    const [label, setLabel] = useState('September 2026')
    return (
      <PeriodNavigator
        label={label}
        onPrevious={() => setLabel('August 2026')}
        onNext={() => setLabel('October 2026')}
        presets={[
          { label: 'This month', onSelect: () => setLabel('September 2026') },
          { label: 'This quarter', onSelect: () => setLabel('Q3 2026') },
        ]}
      />
    )
  },
}
