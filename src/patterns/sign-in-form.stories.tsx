import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { SignInForm } from './sign-in-form.js'
import { Alert } from '../components/primitives/feedback.js'
function SignInExample() {
  const [submitted, setSubmitted] = useState(false)
  return (
    <div className="cui-stack">
      <SignInForm recoveryHref="#recovery" onSubmit={() => setSubmitted(true)} />
      {submitted && (
        <Alert title="Demo submitted">
          No account was accessed. Connect your authentication service in the consuming application.
        </Alert>
      )}
    </div>
  )
}
const meta = {
  title: 'Patterns/Sign in',
  component: SignInForm,
  tags: ['autodocs'],
  args: { onSubmit: (event) => event.preventDefault() },
  parameters: {
    docs: {
      description: {
        component:
          'Presentation only. The host handles authentication, session management, error messages and recovery routing. Required fields support browser validation and password managers. onSubmit receives a prevented form event. Do not log credentials or use Storybook with real credentials. Pending state prevents repeated submission.',
      },
    },
  },
} satisfies Meta<typeof SignInForm>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = { render: () => <SignInExample /> }
export const Pending: Story = { args: { pending: true } }
export const Error: Story = { args: { error: 'Check your details and try again.' } }
export const FieldErrors: Story = {
  args: { emailError: 'Enter your work email address.', passwordError: 'Enter your password.' },
}
export const Submit: Story = {
  render: () => <SignInExample />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    await userEvent.type(c.getByLabelText('Email address (required)'), 'demo@example.com')
    await userEvent.type(c.getByLabelText('Password (required)'), 'Example only')
    await userEvent.click(c.getByRole('button', { name: 'Sign in' }))
    await expect(c.getByText('Demo submitted')).toBeVisible()
  },
}
