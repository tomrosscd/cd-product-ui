import type { Meta, StoryObj } from '@storybook/react-vite'
import { Progress, AllocationBar } from './progress.js'
const meta = {
  title: 'Components/Progress',
  component: Progress,
  tags: ['autodocs'],
  args: { label: 'Review progress', value: 65, target: 80, hint: '13 of 20 items reviewed.' },
  parameters: {
    docs: {
      description: {
        component:
          'Labelled progress with an optional target. Omit value for indeterminate work. Values outside the supported range are clamped. AllocationBar shows parts of a total with exact values in its legend; it is not a completion indicator.',
      },
    },
  },
} satisfies Meta<typeof Progress>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Complete: Story = { args: { value: 100, hint: 'All items reviewed.' } }
export const NotStarted: Story = { args: { value: 0, hint: 'Review has not started.' } }
export const Indeterminate: Story = { args: { value: undefined, target: undefined, hint: 'Preparing the workspace.' } }
/** Colour the fill by state for a red/amber/green capacity view. Colour is never the only signal:
 *  each bar keeps a text label saying what the state is. */
export const Tones: Story = {
  render: () => (
    <div className="cui-stack">
      <Progress label="Design capacity" value={54} tone="positive" hint="Within capacity." />
      <Progress label="Build capacity" value={86} tone="warning" hint="Approaching capacity." />
      <Progress label="QA capacity" value={112} max={120} tone="negative" hint="Over capacity." />
      <Progress label="Discovery capacity" value={40} hint="No state applied." />
    </div>
  ),
}
export const Allocation: Story = {
  render: () => (
    <AllocationBar
      label="Time allocation"
      unit="hours"
      segments={[
        { label: 'Improvements', value: 28 },
        { label: 'Operations', value: 16 },
        { label: 'Planning', value: 8 },
      ]}
    />
  ),
}
export const EmptyAllocation: Story = {
  render: () => <AllocationBar label="Time allocation" segments={[{ label: 'Improvements', value: 0 }]} />,
}
