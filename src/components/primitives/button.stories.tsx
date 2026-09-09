import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon } from './icon.js'
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
          'Supporting primitive for explicit actions. Use primary for the main action, secondary for alternatives, quiet for a low-emphasis action with no border or fill, outline for a present-but-not-competing action (bordered, unfilled), destructive for an irreversible/dangerous action, and link for a tertiary action that should read as inline text (e.g. "Cancel" beside a primary submit). size defaults to a 40px control; sm and lg are 32px/44px, and icon is a square control for an icon with no visible label — pair icon with aria-label. Loading keeps the accessible label and disables repeat activation. Use an anchor for navigation.',
      },
    },
  },
} satisfies Meta<typeof Button>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Primary: Story = { args: { variant: 'primary' } }
export const Quiet: Story = { args: { variant: 'quiet' } }
export const Outline: Story = { args: { variant: 'outline' } }
export const Destructive: Story = { args: { variant: 'destructive', children: 'Delete project' } }
export const Link: Story = { args: { variant: 'link', children: 'Cancel' } }
export const Disabled: Story = { args: { disabled: true } }
export const Loading: Story = { args: { loading: true, children: 'Saving changes' } }
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="quiet">Quiet</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
}
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" aria-label="Settings">
        <Icon name="settings" />
      </Button>
    </div>
  ),
}
