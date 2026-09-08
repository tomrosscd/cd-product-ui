import type { SVGProps } from 'react'
import { cn } from '../../lib/classes.js'
const paths = {
  overview: 'M3 3h6v6H3z M15 3h6v6h-6z M3 15h6v6H3z M15 15h6v6h-6z',
  activity: 'M3 18V6m0 12h18M6 14l4-5 4 3 6-8',
  projects: 'M3 6h7l2 3h9v11H3z',
  team: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3a4 4 0 0 1 0 8m6 10v-2a4 4 0 0 0-3-3.87 M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
  menu: 'M4 6h16M4 12h16M4 18h16',
  close: 'm6 6 12 12M6 18 18 6',
  arrow: 'M4 12h16m-6-6 6 6-6 6',
  chevron: 'm6 9 6 6 6-6',
  check: 'm5 12 4 4L19 6',
  help: 'M9 9a3 3 0 1 1 5 2c-2 1-2 2-2 3m0 3h.01 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
} as const
export type IconName = keyof typeof paths
export function Icon({ name, className, ...props }: SVGProps<SVGSVGElement> & { name: IconName }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
      className={cn('cui-icon', className)}
    >
      <path d={paths[name]} />
    </svg>
  )
}
