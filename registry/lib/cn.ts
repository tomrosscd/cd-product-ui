import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Registry-only cn() — separate from this package's own src/lib/classes.js.
 * Components distributed through the registry use Tailwind utility classNames
 * (to preserve the pinned upstream API), so conflicting utility classes need
 * merging, unlike this library's own npm-published components, which are
 * styled with semantic `cui-*` classes and never need a merge step.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
