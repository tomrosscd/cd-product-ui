import type { SVGProps } from 'react'
import {
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpDown,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Circle,
  CircleQuestionMark,
  Clock,
  Copy,
  Download,
  Ellipsis,
  ExternalLink,
  Eye,
  EyeOff,
  Folder,
  ListFilter,
  LoaderCircle,
  Menu,
  Minus,
  Pencil,
  Plus,
  Search,
  Settings,
  Trash,
  Upload,
  Users,
  X,
} from 'lucide-react'
import { cn } from '../../lib/classes.js'

/**
 * Curated Lucide set (https://lucide.dev/guide/react), explicit imports only — never the whole
 * dynamic icon catalogue — so unused icons tree-shake out of consumers' bundles. Names predate
 * this file's move to Lucide (see git history for the original hand-drawn paths); kept stable so
 * `<Icon name="chevron">` etc. in existing applications and stories keeps resolving to a sensible
 * equivalent rather than a breaking rename.
 */
const icons = {
  overview: Activity,
  activity: Activity,
  projects: Folder,
  team: Users,
  users: Users,
  menu: Menu,
  close: X,
  arrow: ArrowRight,
  'arrow-up': ArrowUp,
  'arrow-down': ArrowDown,
  chevron: ChevronDown,
  'chevron-up': ChevronUp,
  check: Check,
  help: CircleQuestionMark,
  search: Search,
  filter: ListFilter,
  sort: ArrowUpDown,
  'sort-up': ArrowUp,
  'sort-down': ArrowDown,
  plus: Plus,
  minus: Minus,
  calendar: Calendar,
  clock: Clock,
  edit: Pencil,
  delete: Trash,
  upload: Upload,
  download: Download,
  copy: Copy,
  'external-link': ExternalLink,
  settings: Settings,
  status: Circle,
  overflow: Ellipsis,
  visibility: Eye,
  'visibility-off': EyeOff,
  loading: LoaderCircle,
} as const
export type IconName = keyof typeof icons
export function Icon({ name, className, ...props }: SVGProps<SVGSVGElement> & { name: IconName }) {
  const Component = icons[name]
  return (
    <Component
      strokeWidth={1.5}
      aria-hidden="true"
      focusable="false"
      {...props}
      className={cn('cui-icon', className)}
    />
  )
}
