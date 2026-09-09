import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ReactNode } from 'react'
import { Icon } from './icon.js'

/**
 * A static reference for the five states a dropdown/listbox row (Select, Combobox, ActionMenu)
 * can be in. These rows use the exact same classes and data attributes the real components
 * render — data-highlighted, data-state and data-disabled — rather than reproducing the visual
 * design separately, so this page can never drift from the actual implementation in pickers.css
 * and workspace.css. See Components/Styled select, Components/Combobox and Components/Workspace
 * controls for the interactive versions.
 */
function Row({
  label,
  highlighted,
  selected,
  disabled,
}: {
  label: string
  highlighted?: boolean
  selected?: boolean
  disabled?: boolean
}) {
  return (
    <li
      role="option"
      aria-selected={selected}
      aria-disabled={disabled}
      data-highlighted={highlighted ? '' : undefined}
      data-state={selected ? 'checked' : undefined}
      data-disabled={disabled ? '' : undefined}
      className="cui-select-option"
    >
      <span className="cui-select-option-label">{label}</span>
      <Icon name="check" aria-hidden="true" className="cui-select-option-indicator" />
    </li>
  )
}
function List({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section>
      <p className="cui-secondary" style={{ marginBottom: 8 }}>
        {label}
      </p>
      <ul
        role="listbox"
        aria-label={label}
        className="cui-combobox-listbox cui-select-panel"
        style={{ position: 'static' }}
      >
        {children}
      </ul>
    </section>
  )
}
function StatesDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 320 }}>
      <List label="Default">
        <Row label="Option" />
      </List>
      <List label="Hover (pointer)">
        <Row label="Option" highlighted />
      </List>
      <List label="Selected">
        <Row label="Option" selected />
      </List>
      <List label="Keyboard-active (own outline, regardless of selection)">
        <Row label="Not selected, keyboard-active" highlighted />
        <Row label="Already selected, keyboard-active" highlighted selected />
      </List>
      <List label="Disabled">
        <Row label="Option" disabled />
      </List>
    </div>
  )
}
const meta = {
  title: 'Foundations/Dropdown states',
  component: StatesDemo,
  parameters: {
    docs: {
      description: {
        component:
          "The state model Select, Combobox and ActionMenu options share: a neutral hover/keyboard-active background (--cui-dropdown-hover) distinct from a neutral selected background (--cui-dropdown-selected) — deliberately not the brand-green --cui-surface-selected navigation and calendar-range selection use, since a picked option and the current page are different meanings. The checkmark carries 'this is selected', not the row colour, so keyboard-active still shows its own outline on an already-selected row. In Select and ActionMenu (Radix-managed, real roving focus) hover and keyboard navigation render identically, because Radix moves real DOM focus on pointer hover too — there is no reliable way to tell them apart, and native <select> behaves the same way. Combobox (hand-rolled, DOM focus stays on the input) can and does tell them apart: see its own stories for a plain hover with no ring next to a keyboard-navigated row that keeps its ring.",
      },
    },
  },
} satisfies Meta<typeof StatesDemo>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
