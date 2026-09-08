import type { ComponentProps } from 'react'
import { cn } from '../../lib/classes.js'
import { safeHref } from '../../lib/href.js'
export interface TextLinkProps extends ComponentProps<'a'> {
  href: string
  external?: boolean
  variant?: 'inline' | 'standalone'
}
export function TextLink({
  external,
  variant = 'inline',
  className,
  children,
  target,
  rel,
  href,
  ...props
}: TextLinkProps) {
  const newTab = target === '_blank'
  return (
    <a
      {...props}
      href={safeHref(href)}
      target={target}
      rel={newTab ? [...new Set([...(rel || '').split(' '), 'noopener', 'noreferrer'])].filter(Boolean).join(' ') : rel}
      className={cn('cui-text-link', `cui-text-link-${variant}`, className)}
    >
      {children}
      {external && <span aria-hidden="true"> ↗</span>}
      {newTab && <span className="cui-sr-only"> (opens in a new tab)</span>}
    </a>
  )
}
