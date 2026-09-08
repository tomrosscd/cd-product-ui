import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { ErrorBoundary } from './error-boundary.js'
function Bomb({ armed }: { armed: boolean }): never | null {
  if (armed) throw new Error('Deliberate failure for the story.')
  return null
}
const meta = {
  title: 'Components/Error boundary',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "Catches rendering errors in its subtree and shows a fallback instead of a blank page. Only catches render errors, not event-handler or async failures — wrap independent sections of a page rather than once at the root, so one section's crash doesn't take down the rest. Supply `fallback` for a custom recovery UI, or `onError` to report to logging.",
      },
    },
  },
} satisfies Meta
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {
  render: function Demo() {
    const [armed, setArmed] = useState(true)
    return (
      <ErrorBoundary onError={() => setArmed(false)}>
        <Bomb armed={armed} />
        <p>Rendered without error.</p>
      </ErrorBoundary>
    )
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    await expect(c.getByText('Something went wrong')).toBeVisible()
    await userEvent.click(c.getByRole('button', { name: 'Try again' }))
    await expect(c.getByText('Rendered without error.')).toBeVisible()
  },
}
export const CustomFallback: Story = {
  render: () => (
    <ErrorBoundary fallback={(error) => <p>Custom fallback: {error.message}</p>}>
      <Bomb armed />
    </ErrorBoundary>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Custom fallback: Deliberate failure for the story.')).toBeVisible()
  },
}
