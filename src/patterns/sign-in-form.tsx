'use client'
import type { FormEventHandler, ReactNode } from 'react'
import { Card } from '../components/primitives/card.js'
import { Input, PasswordInput } from '../components/primitives/fields.js'
import { Button } from '../components/primitives/button.js'
import { TextLink } from '../components/primitives/text-link.js'
import { Alert } from '../components/primitives/feedback.js'
export interface SignInFormProps {
  onSubmit: FormEventHandler<HTMLFormElement>
  heading?: string
  description?: string
  loading?: boolean
  error?: string
  recoveryHref?: string
  alternativeAction?: ReactNode
  emailError?: string
  passwordError?: string
}
/** Sign-in presentation only. The host handles authentication and errors. Never log credentials. */
export function SignInForm({
  onSubmit,
  heading = 'Sign in to your workspace',
  description = 'Use your work account to continue.',
  loading,
  error,
  recoveryHref,
  alternativeAction,
  emailError,
  passwordError,
}: SignInFormProps) {
  return (
    <div className="cui-root cui-sign-in">
      <Card heading={heading} description={description} elevation="flat">
        <form
          className="cui-stack"
          aria-label="Sign in"
          onSubmit={(event) => {
            event.preventDefault()
            if (!loading) onSubmit(event)
          }}
          aria-busy={loading || undefined}
        >
          {error && (
            <Alert heading="Unable to sign in" tone="error">
              {error}
            </Alert>
          )}
          <Input
            label="Email address"
            type="email"
            name="email"
            autoComplete="username"
            required
            readOnly={loading}
            error={emailError}
          />
          <PasswordInput
            label="Password"
            name="password"
            autoComplete="current-password"
            required
            readOnly={loading}
            error={passwordError}
          />
          {recoveryHref && <TextLink href={recoveryHref}>Forgot your password?</TextLink>}
          <Button type="submit" variant="primary" loading={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
          {alternativeAction}
        </form>
      </Card>
    </div>
  )
}
