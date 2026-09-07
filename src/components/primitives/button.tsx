import type { ComponentProps, ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
const buttonVariants = cva('cui-button', {
  variants: {
    variant: { primary: 'cui-button-primary', secondary: 'cui-button-secondary', quiet: 'cui-button-quiet' },
  },
  defaultVariants: { variant: 'secondary' },
})
export interface ButtonProps extends ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  loading?: boolean
  leadingIcon?: ReactNode
}
export function Button({
  variant,
  className,
  loading = false,
  disabled,
  leadingIcon,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={buttonVariants({ variant, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {loading ? <span className="cui-spinner" aria-hidden="true" /> : leadingIcon}
      {children}
    </button>
  )
}
