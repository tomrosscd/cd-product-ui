import type { Meta, StoryObj } from '@storybook/react-vite'
import { ThemeProvider } from '../src/components/primitives/theme.js'
import { Card } from '../src/components/primitives/card.js'
import { Button } from '../src/components/primitives/button.js'
import { ConfirmationDialog } from '../src/components/primitives/confirmation-dialog.js'
import { Input } from '../src/components/primitives/fields.js'
import { Badge } from '../src/components/primitives/badge.js'
import { DataChart } from '../src/charts/index.js'
import { expect, userEvent, within } from 'storybook/test'
const meta = {
  title: 'Foundations/Themes',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Wrap React content in ThemeProvider with theme="light" or "dark". The host controls preferences and persistence. Themes can be nested; portalled menus, tooltips and dialogs inherit React context. CSS-only consumers can use data-cui-theme on their scope, and must carry it to any custom portals. Switch the Storybook Theme toolbar to review any component.',
      },
    },
  },
} satisfies Meta
export default meta
type Story = StoryObj<typeof meta>
function Example({ theme }: { theme: 'light' | 'dark' }) {
  return (
    <ThemeProvider theme={theme} className="cui-story-frame">
      <Card
        heading={`${theme === 'dark' ? 'Dark' : 'Light'} workspace`}
        description="Clear hierarchy across page, band and card surfaces."
      >
        <div className="cui-stack">
          <Badge tone="positive">Ready for review</Badge>
          <Input label="Workspace name" defaultValue="Studio" />
          <Input label="Reference" error="Enter a reference." />
          <ConfirmationDialog
            trigger={<Button>Review changes</Button>}
            title="Apply changes?"
            description="This example does not save data."
            onConfirm={() => {}}
          />
          <DataChart
            title="Completed work"
            summary="Completion increased during the period."
            kind="bar"
            data={[
              { period: 'Week 1', count: 4 },
              { period: 'Week 2', count: 7 },
            ]}
            xKey="period"
            series={[{ key: 'count', label: 'Completed' }]}
          />
        </div>
      </Card>
    </ThemeProvider>
  )
}
export const Light: Story = { render: () => <Example theme="light" /> }
export const Dark: Story = {
  render: () => <Example theme="dark" />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    await userEvent.click(c.getByRole('button', { name: 'Review changes' }))
    const page = within(canvasElement.ownerDocument.body)
    await expect(page.getByRole('alertdialog')).toHaveAttribute('data-cui-theme', 'dark')
    await userEvent.keyboard('{Escape}')
    await expect(c.getByRole('button', { name: 'Review changes' })).toHaveFocus()
  },
}
export const Nested: Story = {
  render: () => (
    <ThemeProvider theme="dark">
      <Example theme="light" />
    </ThemeProvider>
  ),
}
