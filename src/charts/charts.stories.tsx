import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { DataChart } from './index.js'
const data = [
  { week: 'Week 1', current: 12, previous: 8 },
  { week: 'Week 2', current: 18, previous: 12 },
  { week: 'Week 3', current: 16, previous: 10 },
  { week: 'Week 4', current: 24, previous: 18 },
]
const meta = {
  title: 'Components/Charts',
  component: DataChart,
  tags: ['autodocs'],
  args: {
    heading: 'Weekly completion',
    summary: 'Completed items rose from 12 to 24 over four weeks. Demonstration values.',
    data,
    xKey: 'week',
    series: [
      { key: 'current', label: 'This month' },
      { key: 'previous', label: 'Last month' },
    ],
  },
  parameters: {
    docs: {
      description: {
        component:
          'Import from @convert/product-ui/charts and install the optional Recharts/react-is peers. Convert chart recipes share axes, legends and tooltips. Supply a truthful text summary. Exact values remain accessible in the data table. Line styles supplement colour; animation is disabled. Missing values are gaps, never silently zero. Use ChartContainer with Recharts directly for specialised charts.',
      },
    },
  },
} satisfies Meta<typeof DataChart>
export default meta
type Story = StoryObj<typeof meta>
export const Line: Story = {}
export const Area: Story = { args: { kind: 'area' } }
export const Bar: Story = { args: { kind: 'bar' } }
export const StackedBar: Story = { args: { kind: 'stacked-bar' } }
export const Donut: Story = {
  args: {
    kind: 'donut',
    heading: 'Work allocation',
    summary: 'Improvements account for 28 of 52 hours.',
    xKey: 'category',
    data: [
      { category: 'Improvements', hours: 28 },
      { category: 'Operations', hours: 16 },
      { category: 'Planning', hours: 8 },
    ],
    series: [{ key: 'hours', label: 'Hours' }],
  },
}
export const ExactValues: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    await userEvent.click(c.getByText('View chart data'))
    await expect(c.getByRole('table')).toBeVisible()
    await expect(c.getByRole('table')).toHaveTextContent('Week 4')
    await expect(c.getByRole('table')).toHaveTextContent('24')
  },
}
export const KeyboardTooltip: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    const chart = c.getByRole('application')
    chart.focus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(canvasElement.querySelector('.cui-chart-tooltip')).toBeVisible()
  },
}
export const MissingValues: Story = {
  args: {
    data: [
      { week: 'Week 1', current: 12, previous: 8 },
      { week: 'Week 2', current: null, previous: 0 },
      { week: 'Week 3', current: 16, previous: null },
    ],
    summary: 'Some observations are missing. Gaps are preserved.',
  },
}
export const NegativeValues: Story = {
  args: {
    kind: 'bar',
    data: [
      { week: 'Week 1', current: -4, previous: 8 },
      { week: 'Week 2', current: 3, previous: -2 },
    ],
    summary: 'Values include decreases below zero.',
  },
}
export const Loading: Story = { args: { state: 'loading' } }
export const Empty: Story = { args: { data: [] } }
export const Error: Story = { args: { state: 'error' } }

export const ZeroDonut: Story = {
  args: {
    kind: 'donut',
    heading: 'No allocation yet',
    summary: 'No time has been allocated.',
    xKey: 'category',
    data: [{ category: 'Planning', hours: 0 }],
    series: [{ key: 'hours', label: 'Hours' }],
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('No chart data')).toBeVisible()
  },
}
export const InvalidDonut: Story = {
  args: {
    kind: 'donut',
    heading: 'Allocation',
    summary: 'This dataset contains a negative value.',
    xKey: 'category',
    data: [{ category: 'Planning', hours: -2 }],
    series: [{ key: 'hours', label: 'Hours' }],
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('This data needs a different chart')).toBeVisible()
  },
}
