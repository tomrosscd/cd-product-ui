import { forwardRef, type ReactNode } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
const buttonVariants = cva('cui-button', {
  variants: {
    variant: {
      primary: 'cui-button-primary',
      secondary: 'cui-button-secondary',
      quiet: 'cui-button-quiet',
      outline: 'cui-button-outline',
      destructive: 'cui-button-destructive',
      link: 'cui-button-link',
    },
    size: {
      default: '',
      sm: 'cui-button-sm',
      lg: 'cui-button-lg',
      icon: 'cui-button-icon',
    },
  },
  defaultVariants: { variant: 'secondary', size: 'default' },
})
export interface ButtonProps extends ComponentPropsWithoutRef<'button'>, VariantProps<typeof buttonVariants> {
  loading?: boolean
  leadingIcon?: ReactNode
}
/** Forwards its ref so Radix asChild triggers (Dialog, AlertDialog) can restore focus to it on close. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, className, loading = false, disabled, leadingIcon, children, type = 'button', ...props },
  ref,
) {
  return (
    <button
      {...props}
      ref={ref}
      type={type}
      className={buttonVariants({ variant, size, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {loading ? <span className="cui-spinner" aria-hidden="true" /> : leadingIcon}
      {children}
    </button>
  )
})
