import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Input, PasswordInput, Textarea, Checkbox, Switch, RadioGroup } from './fields.js'
const meta = {
  title: 'Components/Forms',
  component: Input,
  tags: ['autodocs'],
  args: { label: 'Workspace name', hint: 'Use a name your team will recognise.' },
  parameters: {
    docs: {
      description: {
        component:
          'Native form controls with shared visible labels, hints and errors. Use value/onChange or defaultValue. Applications own validation. Password fields allow password managers and paste; the reveal button never submits a form.',
      },
    },
  },
} satisfies Meta<typeof Input>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Required: Story = { args: { required: true } }
export const Error: Story = { args: { error: 'Enter a workspace name.' } }
export const Disabled: Story = { args: { disabled: true, defaultValue: 'Studio workspace' } }
export const ReadOnly: Story = { args: { readOnly: true, defaultValue: 'Studio workspace' } }
export const EmailAndSearch: Story = {
  render: () => (
    <div className="cui-stack">
      <Input label="Email address" type="email" autoComplete="email" />
      <Input label="Search projects" type="search" />
    </div>
  ),
}
export const Password: Story = {
  render: () => <PasswordInput label="Password" autoComplete="current-password" defaultValue="Example password" />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    await userEvent.click(c.getByRole('button', { name: 'Show password' }))
    await expect(c.getByLabelText('Password')).toHaveAttribute('type', 'text')
    await userEvent.click(c.getByRole('button', { name: 'Hide password' }))
    await expect(c.getByLabelText('Password')).toHaveAttribute('type', 'password')
  },
}
export const Multiline: Story = {
  render: () => <Textarea label="Describe the idea" hint="Explain the problem and who it affects." required />,
}
export const Choices: Story = {
  render: () => (
    <div className="cui-stack">
      <Checkbox label="Prioritise next" />
      <Checkbox label="Unavailable choice" disabled />
      <Switch label="Email notifications" defaultChecked />
      <RadioGroup
        label="Workspace visibility"
        name="visibility"
        defaultValue="team"
        options={[
          { value: 'team', label: 'Team only' },
          { value: 'company', label: 'Company' },
          { value: 'public', label: 'Public', disabled: true },
        ]}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    await userEvent.click(c.getByRole('checkbox', { name: 'Prioritise next' }))
    await expect(c.getByRole('checkbox', { name: 'Prioritise next' })).toBeChecked()
    await userEvent.click(c.getByRole('switch'))
    await expect(c.getByRole('switch')).not.toBeChecked()
    await userEvent.click(c.getByRole('radio', { name: 'Company' }))
    await expect(c.getByRole('radio', { name: 'Company' })).toBeChecked()
  },
}
export const ChoiceErrors: Story = {
  render: () => (
    <div className="cui-stack">
      <Checkbox label="Confirm review" required error="Confirm that you reviewed the details." />
      <RadioGroup
        label="Choose a team"
        required
        error="Select a team."
        options={[
          { value: 'design', label: 'Design' },
          { value: 'operations', label: 'Operations' },
        ]}
      />
    </div>
  ),
}
