import type { Meta, StoryObj } from '@storybook/react-vite'
import { Stepper } from './stepper.js'

const projectSteps = [
  { id: 'identity', label: 'Identity & Team' },
  { id: 'dates', label: 'Dates' },
  { id: 'budget', label: 'Hours & Budget' },
  { id: 'review', label: 'Client & Review' },
]

const meta = {
  title: 'Components/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  args: { steps: projectSteps, activeId: 'dates' },
  parameters: {
    docs: {
      description: {
        component:
          "Progress indicator for a multi-step flow — a step's state (done/current/upcoming) is derived from its position relative to activeId, not a separate flag, since a wizard's steps are strictly sequential. Presentation only: step content, next/back navigation and validation stay with the consuming application. Scrolls horizontally rather than wrapping if there isn't room for every label.",
      },
    },
  },
} satisfies Meta<typeof Stepper>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const FirstStep: Story = { args: { activeId: 'identity' } }
export const LastStep: Story = { args: { activeId: 'review' } }

/** A five-step import flow, one step further than the project-creation example above — the
 *  pattern this component replaces was built twice, independently, for exactly these two flows. */
export const ImportFlow: Story = {
  args: {
    steps: [
      { id: 'identity', label: 'Identity' },
      { id: 'team', label: 'Team' },
      { id: 'dates', label: 'Dates' },
      { id: 'budget', label: 'Budget' },
      { id: 'review', label: 'Review' },
    ],
    activeId: 'budget',
  },
}

export const ManySteps: Story = {
  name: 'Many steps (horizontal scroll)',
  args: {
    steps: Array.from({ length: 10 }, (_, i) => ({ id: `step-${i + 1}`, label: `Step ${i + 1}` })),
    activeId: 'step-4',
  },
  decorators: [(Story) => <div style={{ maxWidth: 400 }}>{Story()}</div>],
}
