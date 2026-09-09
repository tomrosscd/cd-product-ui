import type { Meta, StoryObj } from '@storybook/react-vite'
import { ContentList, ContentListItem } from './content-list.js'
import { Avatar } from './content.js'
import { Badge } from './badge.js'
import { TextLink } from './text-link.js'
import { Button } from './button.js'
const meta = {
  title: 'Components/Content list',
  component: ContentList,
  tags: ['autodocs'],
  args: { 'aria-label': 'Work to review' },
  parameters: {
    docs: {
      description: {
        component:
          'Read-only list rows with leading content, title, supporting text, trailing metadata and separate actions. Use links for navigation and buttons for operations. Metadata wraps below when needed, without truncating content. A list is not a replacement for a table whose columns must be compared.',
      },
    },
  },
} satisfies Meta<typeof ContentList>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {
  render: (args) => (
    <ContentList {...args}>
      <ContentListItem
        title={<TextLink href="#project">Workspace improvements</TextLink>}
        description="Week 38 · 2 projects"
        leading={<Avatar name="Amelia Chen" />}
        meta={<Badge tone="warning">At watch</Badge>}
        actions={<Button variant="quiet">Review allocation</Button>}
      />
      <ContentListItem
        title="A longer project title that should stay readable when the available content area narrows"
        meta="Week 39"
      />
      <ContentListItem title="Supporting information" />
    </ContentList>
  ),
}
export const Compact: Story = { ...Default, args: { density: 'compact' } }
