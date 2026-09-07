import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { useState } from 'react'
import { Card } from './card.js'
import { Button } from './button.js'
const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  args: {
    heading: 'Project summary',
    description: 'Keep related information together.',
    children: 'A reusable surface for the information your team needs.',
    density: 'comfortable',
    elevation: 'raised',
    state: 'ready',
  },
  argTypes: {
    children: { control: 'text' },
    footer: { control: false },
    action: { control: false },
    density: { control: 'radio', options: ['comfortable', 'compact'] },
    elevation: { control: 'radio', options: ['raised', 'flat'] },
    state: { control: 'select', options: ['ready', 'loading', 'empty', 'error'] },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Use a card for one coherent subject. Choose a heading level that fits the page. Keep actions as explicit links or buttons. Raised cards sit within neutral section bands; use flat cards directly on the page. Do not nest elevated cards.',
      },
    },
  },
} satisfies Meta<typeof Card>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Compact: Story = { args: { density: 'compact' } }
export const Flat: Story = { args: { elevation: 'flat' } }
export const Loading: Story = { args: { state: 'loading' } }
export const Empty: Story = {
  args: { state: 'empty', message: 'No projects match this view. Try a different filter.' },
}
export const Error: Story = { args: { state: 'error', message: 'Projects could not be loaded. Try again.' } }
export const LongContent: Story = {
  args: {
    heading: 'A longer heading that explains the purpose of this section clearly',
    children:
      'Content should wrap naturally, including long identifiers such as project_workspace_reference_abcdefghijklmnopqrstuvwxyz0123456789. Cards grow with their content and never hide important text.',
  },
}
function RecoverableCard() {
  const [failed, setFailed] = useState(true)
  return (
    <Card
      heading="Project summary"
      state={failed ? 'error' : 'ready'}
      message="Projects could not be loaded."
      action={<Button onClick={() => setFailed(false)}>Try again</Button>}
    >
      Projects are available.
    </Card>
  )
}
export const Recovery: Story = {
  render: () => <RecoverableCard />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('button', { name: 'Try again' }))
    await expect(canvas.getByText('Projects are available.')).toBeVisible()
  },
}
