import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { RoadmapBoard } from './roadmap-board.js'
import { RoadmapExample, roadmapColumns, roadmapItems } from '../../docs/roadmap-example.js'
const meta = {
  title: 'Patterns/Roadmap board',
  component: RoadmapBoard,
  tags: ['autodocs'],
  args: { title: 'Workspace roadmap', columns: roadmapColumns, items: roadmapItems },
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The Koko roadmap pattern with configurable columns, counts, badges, metadata and controls. The host owns stage/priority state. Omit callbacks for read-only cards. Moving by dropdown is available to keyboard and touch users. Drag-and-drop is not included. Columns scroll within the board on narrow screens, and focus follows a moved item or returns to the stage filter when that item leaves the filtered view.',
      },
    },
  },
} satisfies Meta<typeof RoadmapBoard>
export default meta
type Story = StoryObj<typeof meta>
export const Interactive: Story = { render: () => <RoadmapExample /> }
export const ReadOnly: Story = {}
export const EmptyColumns: Story = { args: { items: [] } }
export const Loading: Story = { args: { state: 'loading' } }
export const Error: Story = { args: { state: 'error' } }
export const UnassignedItem: Story = {
  args: {
    items: [{ id: 'unassigned', title: 'An item with an unknown stage', stage: 'review', category: 'Operations' }],
  },
}
export const Mobile: Story = {
  render: () => <RoadmapExample />,
  globals: { viewport: { value: 'mobile', isRotated: false } },
}
export const MoveAndPrioritise: Story = {
  render: () => <RoadmapExample />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    await userEvent.selectOptions(
      c.getByRole('combobox', { name: 'Stage for A clearer workspace introduction' }),
      'ready',
    )
    const ready = c.getByRole('region', { name: 'Ready to build' })
    await expect(within(ready).getByText('A clearer workspace introduction')).toBeVisible()
    await expect(c.getByRole('combobox', { name: 'Stage for A clearer workspace introduction' })).toHaveFocus()
    await userEvent.click(c.getByRole('checkbox', { name: 'Prioritise next: A clearer workspace introduction' }))
    await expect(c.getByRole('checkbox', { name: 'Prioritise next: A clearer workspace introduction' })).toBeChecked()
  },
}
export const AddIdea: Story = {
  render: () => <RoadmapExample />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    await userEvent.click(c.getByRole('button', { name: '+ Add an idea' }))
    await userEvent.type(c.getByRole('textbox', { name: 'Idea title (required)' }), 'A reusable workspace template')
    await userEvent.click(c.getByRole('button', { name: 'Add to ideas' }))
    await expect(c.getByText('A reusable workspace template')).toBeVisible()
    await expect(c.getByRole('button', { name: '+ Add an idea' })).toHaveFocus()
  },
}
