import type { Meta, StoryObj } from '@storybook/react-vite'
import { SummaryCard, DetailsCard, ProgressCard, ActionCard } from './card-patterns.js'
import { Button } from '../components/primitives/button.js'
import { TextLink } from '../components/primitives/text-link.js'
const meta = {
  title: 'Patterns/Card compositions',
  component: SummaryCard,
  tags: ['autodocs'],
  args: { heading: 'Workspace summary', children: <p>The team is preparing the next set of improvements.</p> },
} satisfies Meta<typeof SummaryCard>
export default meta
type Story = StoryObj<typeof meta>
export const Summary: Story = {}
export const Details: Story = {
  render: () => (
    <DetailsCard
      heading="Project details"
      items={[
        { label: 'Owner', value: 'Design team' },
        { label: 'Estimate', value: '20–40 hours' },
      ]}
    />
  ),
}
export const Progress: Story = {
  render: () => (
    <ProgressCard
      heading="Workspace refresh"
      progress={{ label: 'Checklist complete', value: 60, hint: '6 of 10 tasks complete.' }}
    />
  ),
}
export const Action: Story = {
  render: () => (
    <ActionCard
      heading="Review the guide"
      description="Check that the introduction is ready."
      primaryAction={<Button>Mark as reviewed</Button>}
    >
      <TextLink href="#guide">Read the guide</TextLink>
    </ActionCard>
  ),
}
