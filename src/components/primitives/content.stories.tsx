import type { Meta, StoryObj } from '@storybook/react-vite'
import { KeyValueList, Avatar, ResourceList, ActivityList } from './content.js'
const meta = {
  title: 'Components/Supporting content',
  component: KeyValueList,
  tags: ['autodocs'],
  args: {
    items: [
      { label: 'Owner', value: 'Design team' },
      { label: 'Estimate', value: '20–40 hours' },
      { label: 'Review', value: 'Next week' },
    ],
  },
} satisfies Meta<typeof KeyValueList>
export default meta
type Story = StoryObj<typeof meta>
export const Details: Story = {}
export const Avatars: Story = {
  render: () => (
    <div className="cui-row">
      <Avatar name="Alex Taylor" />
      <Avatar name="Jamie Lee" size="small" />
    </div>
  ),
}
export const Resources: Story = {
  render: () => (
    <ResourceList
      items={[
        { title: 'Workspace guide', description: 'Find your way around the workspace.', href: '#guide' },
        { title: 'Source documentation', href: 'https://example.com', external: true },
      ]}
    />
  ),
}
export const Activity: Story = {
  render: () => (
    <ActivityList
      items={[
        {
          id: '1',
          title: 'Workspace guide reviewed',
          description: 'The introduction is ready for the team.',
          dateTime: '2026-09-07',
          dateLabel: '7 September',
          leading: <Avatar name="Alex Taylor" size="small" />,
        },
        { id: '2', title: 'New idea added', dateTime: '2026-09-06', dateLabel: '6 September' },
      ]}
    />
  ),
}
