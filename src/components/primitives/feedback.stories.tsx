import type { Meta, StoryObj } from '@storybook/react-vite'
import { Alert, EmptyState, Spinner, Skeleton } from './feedback.js'
import { Button } from './button.js'
const meta = {
  title: 'Components/Feedback',
  component: Alert,
  tags: ['autodocs'],
  args: { heading: 'Changes are local to this example', children: 'Connect your application to save them.' },
} satisfies Meta<typeof Alert>
export default meta
type Story = StoryObj<typeof meta>
export const Information: Story = {}
export const Error: Story = {
  args: { heading: 'Changes could not be saved', tone: 'error', children: 'Check your connection and try again.' },
}
export const Warning: Story = {
  args: { heading: 'Review needed', tone: 'warning', children: 'Some items need an owner.' },
}
export const Success: Story = { args: { heading: 'Changes saved', tone: 'success' } }
export const Empty: Story = {
  render: () => (
    <EmptyState
      heading="No projects yet"
      description="New projects will appear here."
      action={<Button>Add a project</Button>}
    />
  ),
}
export const Loading: Story = {
  render: () => (
    <div className="cui-stack">
      <Spinner label="Loading projects" />
      <Skeleton />
    </div>
  ),
}
