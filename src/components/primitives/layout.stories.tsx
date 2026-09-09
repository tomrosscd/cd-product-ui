import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card } from './card.js'
import { Grid, PageHeader, SplitLayout, Stack } from './layout.js'
const meta = {
  title: 'Foundations/Layout',
  component: Grid,
  tags: ['autodocs'],
  args: { columns: 4, gap: 24, minItemWidth: 220 },
  parameters: {
    docs: {
      description: {
        component:
          'Grid columns are a maximum, not a forced count. The grid responds to available parent width, including inside an existing app shell. Use Stack for vertical section gaps and SplitLayout for a two-to-one summary layout. Card only owns its internal padding. See docs/dashboard-composition.md for the adoption recipe.',
      },
    },
  },
} satisfies Meta<typeof Grid>
export default meta
type Story = StoryObj<typeof meta>
export const EqualColumns: Story = {
  render: (args) => (
    <Grid {...args}>
      {['One', 'Two', 'Three', 'Four'].map((heading) => (
        <Card key={heading} heading={heading}>
          Content can wrap without widening the page.
        </Card>
      ))}
    </Grid>
  ),
}
export const SectionSpacing: Story = {
  render: () => (
    <Stack gap={32}>
      <PageHeader heading="Workspace" description="Consistent rhythm between independent sections." />
      <SplitLayout
        primary={<Card heading="Summary">Primary content</Card>}
        secondary={<Card heading="Supporting information">Secondary content</Card>}
      />
      <Card heading="Next section">Space belongs to the parent Stack.</Card>
    </Stack>
  ),
}
