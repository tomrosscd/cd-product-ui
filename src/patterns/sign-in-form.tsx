'use client'
import type { FormEventHandler, ReactNode } from 'react'
import { Card } from '../components/primitives/card.js'
import { Input, PasswordInput } from '../components/primitives/fields.js'
import { Button } from '../components/primitives/button.js'
import { TextLink } from '../components/primitives/text-link.js'
import { Alert } from '../components/primitives/feedback.js'
export interface SignInFormProps {
  onSubmit: FormEventHandler<HTMLFormElement>
  title?: string
  description?: string
  pending?: boolean
  error?: string
  recoveryHref?: string
  alternativeAction?: ReactNode
  emailError?: string
  passwordError?: string
}
/** Sign-in presentation only. The host handles authentication and errors. Never log credentials. */
export function SignInForm({
  onSubmit,
  title = 'Sign in to your workspace',
  description = 'Use your work account to continue.',
  pending,
  error,
  recoveryHref,
  alternativeAction,
  emailError,
  passwordError,
}: SignInFormProps) {
  return (
    <div className="cui-root cui-sign-in">
      <Card heading={title} description={description} elevation="flat">
        <form
          className="cui-stack"
          aria-label="Sign in"
          onSubmit={(event) => {
            event.preventDefault()
            if (!pending) onSubmit(event)
          }}
          aria-busy={pending || undefined}
        >
          {error && (
            <Alert title="Unable to sign in" tone="error">
              {error}
            </Alert>
          )}
          <Input
            label="Email address"
            type="email"
            name="email"
            autoComplete="username"
            required
            readOnly={pending}
            error={emailError}
          />
          <PasswordInput
            label="Password"
            name="password"
            autoComplete="current-password"
            required
            readOnly={pending}
            error={passwordError}
          />
          {recoveryHref && <TextLink href={recoveryHref}>Forgot your password?</TextLink>}
          <Button type="submit" variant="primary" loading={pending}>
            {pending ? 'Signing in…' : 'Sign in'}
          </Button>
          {alternativeAction}
        </form>
      </Card>
    </div>
  )
}
