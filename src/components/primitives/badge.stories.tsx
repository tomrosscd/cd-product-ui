import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from './badge.js'
const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { children: 'In progress', tone: 'neutral' },
  parameters: {
    docs: {
      description: {
        component:
          'Descriptive categories, statuses and counts. Supply meaningful text: colour alone must not carry meaning. Warning uses the existing neutral palette. Use a button for an action or a link for navigation.',
      },
    },
  },
} satisfies Meta<typeof Badge>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const AllTones: Story = {
  render: () => (
    <div className="cui-row">
      <Badge>Planned</Badge>
      <Badge tone="accent">Improvement</Badge>
      <Badge tone="positive">Complete</Badge>
      <Badge tone="warning">Needs attention</Badge>
      <Badge tone="negative">Blocked</Badge>
      <Badge variant="outline">Operations</Badge>
      <Badge aria-label="4 items">4</Badge>
    </div>
  ),
}
export const LongLabel: Story = {
  args: { children: 'Awaiting a review from the cross-functional working group', variant: 'outline' },
}
