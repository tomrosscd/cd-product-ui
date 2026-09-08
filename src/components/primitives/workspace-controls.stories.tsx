import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { ActionMenu, Breadcrumbs, SearchSelect, ToastRegion, Tooltip, type ToastMessage } from './workspace-controls.js'
import { Button } from './button.js'
const meta = {
  title: 'Components/Workspace controls',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Controlled building blocks for internal tools. Menus support arrow keys and Escape. SearchSelect uses searchable native choices. Tooltips supplement visible labels. ToastRegion is a controlled queue with F8 access and manual dismissal. See Components/Date range and Components/Date picker for date selection.',
      },
    },
  },
} satisfies Meta
export default meta
type Story = StoryObj<typeof meta>
export const Menu: Story = {
  render: function Example() {
    const [message, setMessage] = useState('No action selected')
    return (
      <div className="cui-stack">
        <ActionMenu
          label="Project actions"
          items={[
            { id: 'edit', label: 'Edit project', onSelect: () => setMessage('Editing project') },
            { id: 'export', label: 'Export', disabled: true, onSelect: () => {} },
          ]}
        />
        <p role="status">{message}</p>
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    await userEvent.click(c.getByRole('button', { name: 'Project actions' }))
    const page = within(canvasElement.ownerDocument.body)
    await userEvent.keyboard('{ArrowDown}{Home}{Enter}')
    await expect(c.getByText('Editing project')).toBeVisible()
    await expect(c.getByRole('button')).toHaveFocus()
    await userEvent.click(c.getByRole('button'))
    await expect(page.getByRole('menuitem', { name: 'Export' })).toHaveAttribute('aria-disabled', 'true')
    await userEvent.keyboard('{Escape}')
  },
}
export const DisabledMenu: Story = { render: () => <ActionMenu label="Unavailable actions" items={[]} disabled /> }
export const Help: Story = {
  render: () => (
    <Tooltip content="Download the currently filtered rows.">
      <Button>Export rows</Button>
    </Tooltip>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    await userEvent.tab()
    await expect(c.getByRole('button')).toHaveFocus()
    await expect(within(canvasElement.ownerDocument.body).getByRole('tooltip')).toHaveTextContent(
      'Download the currently filtered rows.',
    )
    await userEvent.keyboard('{Escape}')
  },
}
export const Navigation: Story = {
  render: () => (
    <Breadcrumbs
      items={[
        { label: 'Workspace', href: '#workspace' },
        { label: 'Projects', href: '#projects' },
        { label: 'Review' },
      ]}
    />
  ),
}
const options = [
  { value: 'design', label: 'Design' },
  { value: 'development', label: 'Development' },
  { value: 'delivery', label: 'Delivery', disabled: true },
]
function Selection({
  multiple = false,
  disabled = false,
  error,
}: {
  multiple?: boolean
  disabled?: boolean
  error?: string
}) {
  const [value, setValue] = useState<string[]>([])
  return (
    <SearchSelect
      label="Teams"
      options={options}
      value={value}
      onValueChange={setValue}
      multiple={multiple}
      disabled={disabled}
      error={error}
      name="teams"
    />
  )
}
export const SingleSelection: Story = {
  render: () => <Selection />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    await userEvent.click(c.getByText('Choose an option'))
    await userEvent.type(c.getByRole('searchbox'), 'design')
    await userEvent.click(c.getByRole('radio', { name: 'Design' }))
    await expect(c.getByRole('radio')).toBeChecked()
    await userEvent.keyboard('{Escape}')
    await expect(c.getByText('Design', { selector: 'summary' })).toHaveFocus()
  },
}
export const MultipleSelection: Story = {
  render: () => <Selection multiple />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    await userEvent.click(c.getByText('Choose an option'))
    await userEvent.click(c.getByRole('checkbox', { name: 'Design' }))
    await userEvent.click(c.getByRole('checkbox', { name: 'Development' }))
    await expect(c.getByText('Design, Development')).toBeVisible()
    await userEvent.type(c.getByRole('searchbox'), 'nothing')
    await expect(c.getByRole('status')).toHaveTextContent('0 options')
    await userEvent.click(c.getByRole('button', { name: 'Clear selection' }))
    await expect(c.getByText('Choose an option')).toBeVisible()
  },
}
export const SelectionError: Story = { render: () => <Selection error="Choose a team before continuing." /> }
export const SelectionDisabled: Story = { render: () => <Selection disabled /> }
export const Notification: Story = {
  render: function Example() {
    const [messages, setMessages] = useState<ToastMessage[]>([])
    return (
      <>
        <Button
          onClick={() =>
            setMessages([{ id: 'saved', title: 'Settings saved', description: 'Your changes are ready.' }])
          }
        >
          Save settings
        </Button>
        <ToastRegion
          messages={messages}
          onDismiss={(id) => setMessages((items) => items.filter((item) => item.id !== id))}
        />
      </>
    )
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    await userEvent.click(c.getByRole('button', { name: 'Save settings' }))
    const page = within(canvasElement.ownerDocument.body)
    await expect(page.getByText('Settings saved', { exact: true })).toBeVisible()
    await userEvent.click(page.getByRole('button', { name: 'Dismiss Settings saved' }))
    await expect(page.queryByRole('button', { name: 'Dismiss Settings saved' })).not.toBeInTheDocument()
  },
}
