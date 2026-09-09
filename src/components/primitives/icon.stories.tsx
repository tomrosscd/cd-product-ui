import type { Meta, StoryObj } from '@storybook/react-vite'
import { Icon, type IconName } from './icon.js'

// Kept in sync with icon.tsx's `icons` map by TypeScript, not by hand: IconName is a strict union,
// so an entry added or removed there without a matching update here fails type-check rather than
// silently drifting out of date.
const allNames: IconName[] = [
  'overview',
  'activity',
  'projects',
  'team',
  'users',
  'menu',
  'close',
  'arrow',
  'arrow-up',
  'arrow-down',
  'chevron',
  'chevron-up',
  'check',
  'help',
  'search',
  'filter',
  'sort',
  'sort-up',
  'sort-down',
  'plus',
  'minus',
  'calendar',
  'clock',
  'edit',
  'delete',
  'upload',
  'download',
  'copy',
  'external-link',
  'settings',
  'status',
  'overflow',
  'visibility',
  'visibility-off',
  'loading',
]
function IconReference() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: 16,
      }}
    >
      {allNames.map((name) => (
        <div
          key={name}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            padding: 16,
            border: '1px solid var(--cui-border-subtle)',
            borderRadius: 'var(--cui-radius-control)',
          }}
        >
          <Icon name={name} />
          <code style={{ fontSize: 12 }}>{name}</code>
        </div>
      ))}
    </div>
  )
}
const meta = {
  title: 'Foundations/Icons',
  component: IconReference,
  parameters: {
    docs: {
      description: {
        component:
          'The curated Lucide set (https://lucide.dev/guide/react) `<Icon name="...">` resolves. Import icons through this component, not directly from lucide-react — that keeps every usage at the same optical size, stroke weight (1.5) and currentColor, and keeps the name stable if the underlying Lucide icon ever changes. `name="overview"`/`name="activity"` intentionally resolve to the same icon (Activity) — they predate this catalogue and are kept for existing consumers rather than merged into one name, which would be a breaking rename. Decorative usage (the default: aria-hidden, no visible label of its own) is the common case — pair with a visible label or an aria-label on the interactive element it sits in, the way PasswordInput\'s reveal button does. `name="loading"` pairs with the .cui-icon-spin utility class for a spinning state; most loading UI should still reach for the dedicated Spinner component first.',
      },
    },
  },
} satisfies Meta<typeof IconReference>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
