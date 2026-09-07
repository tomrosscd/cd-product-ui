import type { Meta, StoryObj } from '@storybook/react-vite'
import { MetricCard } from './metric.js'
import { Sparkline } from '../../charts/index.js'
const meta = {
  title: 'Components/Metrics',
  component: MetricCard,
  tags: ['autodocs'],
  args: {
    heading: 'Completed items',
    value: '24',
    description: 'Across the workspace this month',
    comparison: { label: '4 more than last month', direction: 'up', sentiment: 'positive' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Reusable statistic or KPI. Supply the formatted value and comparison description. Direction and sentiment are separate: an increase may be good, bad or neutral. Calculations and reporting definitions stay in the application.',
      },
    },
  },
} satisfies Meta<typeof MetricCard>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const IncreasingCost: Story = {
  args: {
    heading: 'Average handling time',
    value: '18',
    unit: 'minutes',
    comparison: { label: '3 minutes more than last month', direction: 'up', sentiment: 'negative' },
  },
}
export const Unchanged: Story = {
  args: { comparison: { label: 'Same as last month', direction: 'flat', sentiment: 'neutral' } },
}
export const WithSparkline: Story = {
  args: {
    sparkline: (
      <Sparkline values={[4, 6, 5, 8, 10, 12]} label="Completed items increased from 4 to 12 across six weeks." />
    ),
  },
}
export const Loading: Story = { args: { state: 'loading' } }
export const Empty: Story = { args: { state: 'empty' } }
export const Error: Story = { args: { state: 'error' } }
