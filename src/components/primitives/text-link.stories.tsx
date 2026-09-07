import type { Meta, StoryObj } from '@storybook/react-vite'
import { TextLink } from './text-link.js'
const meta = {
  title: 'Components/Text link',
  component: TextLink,
  tags: ['autodocs'],
  args: { href: '#example', children: 'View project details' },
  parameters: {
    docs: {
      description: {
        component:
          'An anchor for navigation. External icons do not force a new tab; explicitly supply target="_blank" when necessary. That choice adds a screen-reader announcement and safe rel attributes. Use Button for actions, including actions styled as quiet text.',
      },
    },
  },
} satisfies Meta<typeof TextLink>
export default meta
type Story = StoryObj<typeof meta>
export const Inline: Story = {
  render: (args) => (
    <p>
      Read the <TextLink {...args} /> before continuing.
    </p>
  ),
}
export const Standalone: Story = { args: { variant: 'standalone' } }
export const External: Story = {
  args: { href: 'https://example.com', external: true, target: '_blank', children: 'Open source roadmap' },
}
