import type { Meta, StoryObj } from '@storybook/react-vite'
import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { Button } from '../src/components/primitives/button.js'
import { Checkbox, Input, PasswordInput, RadioGroup, Switch, Textarea } from '../src/components/primitives/fields.js'
import { CurrencyInput, PercentageInput } from '../src/components/primitives/formatted-input.js'
import { StyledSelect } from '../src/components/primitives/styled-select.js'
import { Combobox } from '../src/components/primitives/combobox.js'
import { DatePicker } from '../src/components/primitives/date-picker.js'
import { ActionMenu } from '../src/components/primitives/workspace-controls.js'
import { TextLink } from '../src/components/primitives/text-link.js'
import { Chip } from '../src/components/primitives/chip.js'
import { Tabs } from '../src/components/primitives/tabs.js'
import { Icon } from '../src/components/primitives/icon.js'

/* Only one element in a document can genuinely hold focus, so a page showing focus beside every
   other state has to mark the ring some other way. FocusPreview finds the control inside it and
   tags the element that actually owns the ring with data-cui-focus-preview, styled in
   .storybook/preview.css (Storybook only, never shipped). Ring ownership is resolved here the same
   way the real CSS resolves it: an input inside .cui-affixed-input has no ring of its own, because
   the wrapper draws one perimeter around the prefix, input and suffix together. The Focus ring
   parity story asserts a previewed ring computes identically to a really focused control, in
   whichever theme the run uses, so this cannot quietly diverge from the real :focus-visible rules. */
const FOCUSABLE = 'a[href], button:not(:disabled), input:not(:disabled), textarea:not(:disabled)'
function FocusPreview({ children }: { children: ReactNode }) {
  const host = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    const control = host.current?.querySelector<HTMLElement>(FOCUSABLE)
    if (!control) return
    const owner = control.closest('.cui-affixed-input') ?? control
    owner.setAttribute('data-cui-focus-preview', '')
    return () => owner.removeAttribute('data-cui-focus-preview')
  }, [])
  return <div ref={host}>{children}</div>
}

function Group({ name, note, children }: { name: string; note: string; children: ReactNode }) {
  return (
    <section className="cui-states-group">
      <header>
        <h3>{name}</h3>
        <p className="cui-secondary">{note}</p>
      </header>
      <div className="cui-states-grid">{children}</div>
    </section>
  )
}
function Cell({ state, children }: { state: string; children: ReactNode }) {
  return (
    <div className="cui-states-cell">
      <span className="cui-states-caption">{state}</span>
      {children}
    </div>
  )
}

const noop = () => {}
const sizes = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large', disabled: true },
]
const owners = [
  { value: 'ap', label: 'Alex Poole' },
  { value: 'jr', label: 'Jo Reid' },
]
const menuItems = [
  { id: 'rename', label: 'Rename', onSelect: noop },
  { id: 'duplicate', label: 'Duplicate', onSelect: noop, disabled: true },
]

function StatesReference() {
  return (
    <div className="cui-states-page">
      <Group
        name="Button"
        note="Loading disables the button and sets aria-busy, so a second submit cannot be queued. The primary variant offsets its focus ring by the ring's own width, because the shared focus colour is also its background colour and a flush ring would merge into its border."
      >
        <Cell state="Secondary, default">
          <Button>Save draft</Button>
        </Cell>
        <Cell state="Secondary, focus">
          <FocusPreview>
            <Button>Save draft</Button>
          </FocusPreview>
        </Cell>
        <Cell state="Primary, default">
          <Button variant="primary">Publish</Button>
        </Cell>
        <Cell state="Primary, focus">
          <FocusPreview>
            <Button variant="primary">Publish</Button>
          </FocusPreview>
        </Cell>
        <Cell state="Quiet">
          <Button variant="quiet" leadingIcon={<Icon name="plus" />}>
            Add row
          </Button>
        </Cell>
        <Cell state="Loading">
          <Button variant="primary" loading>
            Publishing
          </Button>
        </Cell>
        <Cell state="Disabled">
          <Button disabled>Save draft</Button>
        </Cell>
      </Group>

      <Group
        name="Text input"
        note="The error message is associated with the input through aria-describedby and announced through role=alert, so the red border is never the only signal."
      >
        <Cell state="Empty, with placeholder">
          <Input label="Project name" placeholder="Quarterly review" />
        </Cell>
        <Cell state="Filled">
          <Input label="Project name" defaultValue="Quarterly review" />
        </Cell>
        <Cell state="Focus">
          <FocusPreview>
            <Input label="Project name" defaultValue="Quarterly review" />
          </FocusPreview>
        </Cell>
        <Cell state="With hint">
          <Input label="Project name" defaultValue="Quarterly review" hint="Shown to everyone in the workspace." />
        </Cell>
        <Cell state="Error">
          <Input label="Project name" defaultValue="" error="Enter a project name." />
        </Cell>
        <Cell state="Read only">
          <Input label="Project name" defaultValue="Quarterly review" readOnly />
        </Cell>
        <Cell state="Disabled">
          <Input label="Project name" defaultValue="Quarterly review" disabled />
        </Cell>
      </Group>

      <Group
        name="Search and password"
        note="Both put a real button inside the field. Password toggles between visibility icons and keeps its accessible name on the button. See Components/Data table for the search field that clears its value and returns focus to the input."
      >
        <Cell state="Search, empty">
          <Input type="search" label="Search projects" placeholder="Search projects" />
        </Cell>
        <Cell state="Search, with value">
          <Input
            type="search"
            label="Search projects"
            defaultValue="review"
            trailingAction={
              <Button variant="quiet" aria-label="Clear search" data-cui-search-clear="">
                <Icon name="close" />
              </Button>
            }
          />
        </Cell>
        <Cell state="Password, hidden">
          <PasswordInput label="Password" defaultValue="correct horse" />
        </Cell>
        <Cell state="Password, disabled">
          <PasswordInput label="Password" defaultValue="correct horse" disabled />
        </Cell>
      </Group>

      <Group
        name="Formatted input"
        note="Currency, percentage and hours inputs draw one focus perimeter on the wrapper so it covers the prefix and suffix. The inner input's own ring is suppressed, which is why focus here shows a single outline rather than two nested ones."
      >
        <Cell state="Default">
          <CurrencyInput label="Budget" value={4200} onValueChange={noop} />
        </Cell>
        <Cell state="Focus">
          <FocusPreview>
            <CurrencyInput label="Budget" value={4200} onValueChange={noop} />
          </FocusPreview>
        </Cell>
        <Cell state="Empty">
          <PercentageInput label="Completion" value={undefined} onValueChange={noop} />
        </Cell>
        <Cell state="Error">
          <CurrencyInput label="Budget" value={undefined} onValueChange={noop} error="Enter a budget." />
        </Cell>
        <Cell state="Disabled">
          <CurrencyInput label="Budget" value={4200} onValueChange={noop} disabled />
        </Cell>
      </Group>

      <Group
        name="Textarea"
        note="Takes the same label, hint and error treatment as a single-line input, and the same focus ring."
      >
        <Cell state="Default">
          <Textarea label="Summary" defaultValue="Delivery is on track." rows={3} />
        </Cell>
        <Cell state="Focus">
          <FocusPreview>
            <Textarea label="Summary" defaultValue="Delivery is on track." rows={3} />
          </FocusPreview>
        </Cell>
        <Cell state="Disabled">
          <Textarea label="Summary" defaultValue="Delivery is on track." rows={3} disabled />
        </Cell>
      </Group>

      <Group
        name="Checkbox, switch and radio"
        note="Native controls throughout, so checked, indeterminate and disabled semantics come from the browser rather than from styling."
      >
        <Cell state="Checkbox, unchecked">
          <Checkbox label="Include archived" />
        </Cell>
        <Cell state="Checkbox, checked">
          <Checkbox label="Include archived" defaultChecked />
        </Cell>
        <Cell state="Checkbox, focus">
          <FocusPreview>
            <Checkbox label="Include archived" defaultChecked />
          </FocusPreview>
        </Cell>
        <Cell state="Checkbox, disabled">
          <Checkbox label="Include archived" defaultChecked disabled />
        </Cell>
        <Cell state="Switch">
          <Switch label="Email notifications" defaultChecked />
        </Cell>
        <Cell state="Radio group, one disabled option">
          <RadioGroup label="Size" options={sizes} defaultValue="medium" />
        </Cell>
      </Group>

      <Group
        name="Select"
        note="Loading and disabled both stop the listbox opening. For the states an individual option can be in, see Foundations/Dropdown states."
      >
        <Cell state="Placeholder">
          <StyledSelect label="Size" options={sizes} placeholder="Choose a size" />
        </Cell>
        <Cell state="With value">
          <StyledSelect label="Size" options={sizes} defaultValue="medium" />
        </Cell>
        <Cell state="Focus">
          <FocusPreview>
            <StyledSelect label="Size" options={sizes} defaultValue="medium" />
          </FocusPreview>
        </Cell>
        <Cell state="Error">
          <StyledSelect label="Size" options={sizes} placeholder="Choose a size" error="Choose a size." />
        </Cell>
        <Cell state="Loading">
          <StyledSelect label="Size" options={[]} placeholder="Loading" loading />
        </Cell>
        <Cell state="Disabled">
          <StyledSelect label="Size" options={sizes} defaultValue="medium" disabled />
        </Cell>
      </Group>

      <Group
        name="Combobox"
        note="Focus stays on the text input while the arrow keys move through the list, so unlike Select it can tell a pointer hover apart from a keyboard-active row. Multi-select renders each chosen value as a removable Chip."
      >
        <Cell state="Default">
          <Combobox label="Owner" options={owners} onValueChange={noop} />
        </Cell>
        <Cell state="Focus">
          <FocusPreview>
            <Combobox label="Owner" options={owners} onValueChange={noop} />
          </FocusPreview>
        </Cell>
        <Cell state="Multiple, with values">
          <Combobox label="Owners" multiple options={owners} value={['ap', 'jr']} onValueChange={noop} />
        </Cell>
        <Cell state="Error">
          <Combobox label="Owner" options={owners} onValueChange={noop} error="Choose an owner." />
        </Cell>
        <Cell state="Loading">
          <Combobox label="Owner" options={[]} onValueChange={noop} loading />
        </Cell>
        <Cell state="Disabled">
          <Combobox label="Owner" options={owners} value="ap" onValueChange={noop} disabled />
        </Cell>
      </Group>

      <Group
        name="Menu"
        note="An action menu, not navigation. Its trigger is an ordinary Button, so it takes the same rest, focus and disabled treatment."
      >
        <Cell state="Default">
          <ActionMenu items={menuItems} />
        </Cell>
        <Cell state="Focus">
          <FocusPreview>
            <ActionMenu items={menuItems} />
          </FocusPreview>
        </Cell>
        <Cell state="Disabled">
          <ActionMenu items={menuItems} disabled />
        </Cell>
      </Group>

      <Group
        name="Date picker"
        note="The trigger reports the current selection as its accessible name. Range selection and presets are covered in Components/Date picker."
      >
        <Cell state="Default">
          <DatePicker label="Due date" value={{ start: '2026-03-18' }} onValueChange={noop} />
        </Cell>
        <Cell state="Focus">
          <FocusPreview>
            <DatePicker label="Due date" value={{ start: '2026-03-18' }} onValueChange={noop} />
          </FocusPreview>
        </Cell>
        <Cell state="Error">
          <DatePicker label="Due date" value={undefined} onValueChange={noop} error="Choose a due date." />
        </Cell>
        <Cell state="Disabled">
          <DatePicker label="Due date" value={{ start: '2026-03-18' }} onValueChange={noop} disabled />
        </Cell>
      </Group>

      <Group
        name="Link"
        note="An inline link is underlined so it is not identified by colour alone. The external variant adds an icon that scales with the surrounding text."
      >
        <Cell state="Inline">
          <p>
            Read the <TextLink href="#states">release notes</TextLink> before upgrading.
          </p>
        </Cell>
        <Cell state="Focus">
          <FocusPreview>
            <TextLink href="#states">Release notes</TextLink>
          </FocusPreview>
        </Cell>
        <Cell state="Standalone">
          <TextLink href="#states" variant="standalone">
            View all projects
          </TextLink>
        </Cell>
        <Cell state="External, new tab">
          <TextLink href="https://example.com" external target="_blank">
            Convert website
          </TextLink>
        </Cell>
      </Group>

      <Group
        name="Chip"
        note="Always at least one real button. Selection is carried by aria-pressed, not by colour alone. Use Badge instead for a status label nobody can click."
      >
        <Cell state="Unselected">
          <Chip label="In review" selected={false} onSelect={noop} />
        </Cell>
        <Cell state="Selected">
          <Chip label="In review" selected onSelect={noop} />
        </Cell>
        <Cell state="Focus">
          <FocusPreview>
            <Chip label="In review" selected onSelect={noop} />
          </FocusPreview>
        </Cell>
        <Cell state="Removable">
          <Chip label="Design" onRemove={noop} />
        </Cell>
        <Cell state="Disabled">
          <Chip label="Archived" selected disabled onSelect={noop} />
        </Cell>
      </Group>

      <Group
        name="Tabs"
        note="Roving tab order: one Tab press reaches the tab list, then the arrow keys move between tabs. The selected and disabled states below are the real ones, rendered together."
      >
        <Cell state="Selected, unselected and disabled together">
          <Tabs
            label="Project sections"
            items={[
              { value: 'overview', label: 'Overview', content: <p>Selected tab.</p> },
              { value: 'activity', label: 'Activity', content: <p>Unselected tab.</p> },
              { value: 'billing', label: 'Billing', content: <p>Disabled tab.</p>, disabled: true },
            ]}
          />
        </Cell>
      </Group>

      <Group
        name="Navigation"
        note="These rows use the classes and attributes DashboardSidebar renders, rather than a redrawn copy, so they cannot drift from it. The sidebar itself is position: fixed and cannot sit inline here, so see Components/Dashboard sidebar for the live one. The current page is marked with aria-current, which is what carries the meaning; the green background only reflects it."
      >
        <Cell state="Default, current and disabled together">
          <nav className="cui-nav" aria-label="Example navigation">
            <a href="#states" className="cui-nav-item">
              <Icon name="overview" />
              <span>Overview</span>
            </a>
            <a href="#states" className="cui-nav-item" aria-current="page">
              <Icon name="projects" />
              <span>Projects</span>
            </a>
            <span className="cui-nav-item" aria-disabled="true">
              <Icon name="team" />
              <span>Team</span>
              <span className="cui-sr-only">, unavailable</span>
            </span>
          </nav>
        </Cell>
      </Group>
    </div>
  )
}

const meta = {
  title: 'Foundations/Component states',
  component: StatesReference,
  parameters: {
    docs: {
      description: {
        component:
          'One page covering the rest, focus, selected, error, loading and disabled states across the library, so a state can be compared between components instead of being chased through a dozen stories. Every cell renders the real component in a real state rather than a redrawn picture of one, with two documented exceptions: navigation, which is position: fixed and so uses the exact markup DashboardSidebar renders, and focus, which only one element in a document can genuinely hold. Focus is drawn from a Storybook-only rule that the Focus ring parity story pins to a really focused control, so it cannot drift. Hover is deliberately not previewed: it is the one state you can check by pointing at any control on this page. For the states an individual dropdown option can be in, see Foundations/Dropdown states.',
      },
    },
  },
} satisfies Meta<typeof StatesReference>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

/** Pins the Storybook-only focus preview to the real thing: the previewed ring has to compute
 *  identically to a genuinely keyboard-focused control, including the primary button's inverse
 *  outline colour. Runs in whichever theme the suite is in, so pnpm test:dark covers the dark
 *  input override too. If a real focus rule changes and the preview rule is not updated with it,
 *  this fails rather than the states page quietly showing a ring nothing else draws. */
export const FocusRingParity: Story = {
  name: 'Focus ring parity',
  render: () => (
    <div className="cui-stack">
      <Input label="Really focused input" defaultValue="Text" data-testid="live-input" />
      <FocusPreview>
        <Input label="Previewed input" defaultValue="Text" data-testid="preview-input" />
      </FocusPreview>
      <Button variant="primary" data-testid="live-button">
        Really focused
      </Button>
      <FocusPreview>
        <Button variant="primary" data-testid="preview-button">
          Previewed
        </Button>
      </FocusPreview>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    const ring = (element: Element) => {
      const style = getComputedStyle(element)
      return {
        width: style.outlineWidth,
        style: style.outlineStyle,
        colour: style.outlineColor,
        offset: style.outlineOffset,
      }
    }
    const liveInput = c.getByTestId('live-input')
    const previewInput = c.getByTestId('preview-input')
    const liveButton = c.getByTestId('live-button')
    const previewButton = c.getByTestId('preview-button')

    await expect(previewInput).toHaveAttribute('data-cui-focus-preview')
    await expect(previewButton).toHaveAttribute('data-cui-focus-preview')

    await userEvent.tab()
    await expect(liveInput).toHaveFocus()
    await expect(ring(liveInput)).toEqual(ring(previewInput))

    await userEvent.tab()
    await userEvent.tab()
    await expect(liveButton).toHaveFocus()
    await expect(ring(liveButton)).toEqual(ring(previewButton))

    // The offset gap is the whole reason the primary button needs its own rule, so assert it is
    // actually applied rather than the button quietly falling back to the shared flush ring, which
    // would put a ring the same colour as the button hard against the button's own border.
    await expect(ring(previewButton).offset).toEqual('2px')
    await expect(ring(previewButton).offset).not.toEqual(ring(previewInput).offset)
  },
}
