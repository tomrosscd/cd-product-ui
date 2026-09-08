import { forwardRef, type ReactNode } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
const buttonVariants = cva('cui-button', {
  variants: {
    variant: { primary: 'cui-button-primary', secondary: 'cui-button-secondary', quiet: 'cui-button-quiet' },
  },
  defaultVariants: { variant: 'secondary' },
})
export interface ButtonProps extends ComponentPropsWithoutRef<'button'>, VariantProps<typeof buttonVariants> {
  loading?: boolean
  leadingIcon?: ReactNode
}
/** Forwards its ref so Radix asChild triggers (Dialog, AlertDialog) can restore focus to it on close. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, className, loading = false, disabled, leadingIcon, children, type = 'button', ...props },
  ref,
) {
  return (
    <button
      {...props}
      ref={ref}
      type={type}
      className={buttonVariants({ variant, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {loading ? <span className="cui-spinner" aria-hidden="true" /> : leadingIcon}
      {children}
    </button>
  )
})
