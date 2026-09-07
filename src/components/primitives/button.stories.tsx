import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './button.js'
const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Review changes' },
  parameters: {
    docs: {
      description: {
        component:
          'Supporting primitive for explicit actions. Use primary for the main action, secondary for alternatives and quiet for low emphasis. Loading keeps the accessible label and disables repeat activation. Use an anchor for navigation.',
      },
    },
  },
} satisfies Meta<typeof Button>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Primary: Story = { args: { variant: 'primary' } }
export const Quiet: Story = { args: { variant: 'quiet' } }
export const Disabled: Story = { args: { disabled: true } }
export const Loading: Story = { args: { loading: true, children: 'Saving changes' } }
