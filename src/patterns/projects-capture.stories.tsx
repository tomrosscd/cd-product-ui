import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, within } from 'storybook/test'
import { CellGrid, CellInput, CellSelect, CellTextarea } from '../components/data/cell-controls.js'
import { Combobox } from '../components/primitives/combobox.js'
import { StyledSelect } from '../components/primitives/styled-select.js'
import { Icon } from '../components/primitives/icon.js'
import { Table } from '../components/primitives/table.js'
import { SegmentedControl } from '../components/primitives/segmented-control.js'
import { PageHeader } from '../components/primitives/layout.js'

/**
 * Recreated from a consuming application's Projects capture screen, to check the cell controls hold
 * up at its real shape rather than a convenient one: 21 columns, five person pickers, and most cells
 * empty. The names and codes are from that screen; nothing here connects to it.
 */
const people = [
  { value: 'jm', label: 'Justin Mendonca' },
  { value: 'ad', label: 'Anthony Dang' },
  { value: 'am', label: 'Anthony Mollace' },
  { value: 'ap', label: 'Alex Poole' },
  { value: 'jr', label: 'Jo Reid' },
]
const tiers = ['T1', 'T2', 'T3', 'T4'].map((t) => ({ value: t.toLowerCase(), label: t }))
const sizes = ['S', 'M', 'L', 'XL'].map((s) => ({ value: s.toLowerCase(), label: s }))
const dot = (tone: 'positive' | 'warning' | 'negative') => (
  <Icon name="status" aria-hidden="true" className={`cui-icon-inline cui-icon-filled cui-${tone}`} />
)
const healths = [
  { value: 'green', label: 'On track', icon: dot('positive') },
  { value: 'amber', label: 'At watch', icon: dot('warning') },
  { value: 'red', label: 'At risk', icon: dot('negative') },
]
const phases = ['Discovery', 'Opportunity', 'Design'].map((p) => ({ value: p.toLowerCase(), label: p }))

interface Row {
  id: string
  client: string
  code: string
  discoCode: string
  tier: string
  ba: string
  satl: string
  designer: string
  pm: string
  am: string
  size: string
  health: string
  phase: string
  notes: string
}
const blank = {
  discoCode: '',
  tier: '',
  ba: '',
  satl: '',
  designer: '',
  pm: '',
  am: '',
  size: '',
  health: '',
  notes: '',
}
const seed: Row[] = [
  { id: '1', client: 'Albek', code: 'ALB0001', ...blank, ba: 'jm', pm: 'ad', phase: 'opportunity' },
  { id: '2', client: 'Bon Maxie', code: 'BON0001', ...blank, tier: 't2', phase: 'opportunity' },
  { id: '3', client: 'Brotherhood Books', code: 'BSL', ...blank, phase: 'opportunity' },
  { id: '4', client: 'Bstore', code: 'BS0007', ...blank, tier: 't1', phase: 'opportunity' },
  {
    id: '5',
    client: 'Bulldogs',
    code: 'BULL000X',
    ...blank,
    pm: 'am',
    health: 'amber',
    notes: 'Waiting on scope',
    phase: 'opportunity',
  },
]

function ProjectsCapture() {
  const [mode, setMode] = useState('capture')
  const [rows, setRows] = useState(seed)
  const capture = mode === 'capture'
  const set = (id: string, key: keyof Row, value: string) =>
    setRows((current) => current.map((row) => (row.id === id ? { ...row, [key]: value } : row)))
  const nameOf = (id: string) => people.find((p) => p.value === id)?.label
  const none = <span className="cui-secondary">Not set</span>

  const person = (row: Row, key: 'ba' | 'satl' | 'designer' | 'pm' | 'am', heading: string) => (
    <td key={key}>
      {capture ? (
        <Combobox
          cell
          label={`${heading} for ${row.client}`}
          options={people}
          value={row[key]}
          placeholder="Search"
          onValueChange={(value) => set(row.id, key, value)}
        />
      ) : (
        nameOf(row[key]) || none
      )}
    </td>
  )
  const choice = (row: Row, key: keyof Row, heading: string, options: { value: string; label: string }[]) => (
    <td key={String(key)}>
      {capture ? (
        <CellSelect
          label={`${heading} for ${row.client}`}
          options={options}
          value={String(row[key])}
          onChange={(event) => set(row.id, key, event.target.value)}
        />
      ) : (
        options.find((o) => o.value === row[key])?.label || none
      )}
    </td>
  )

  return (
    <div className="cui-root cui-stack">
      <PageHeader
        heading="Projects"
        description="Discovery, Opportunity and Design"
        actions={
          <SegmentedControl
            label="View mode"
            options={[
              { value: 'list', label: 'List' },
              { value: 'capture', label: 'Quick capture' },
            ]}
            value={mode}
            onValueChange={setMode}
          />
        }
      />
      <CellGrid>
        <Table caption="Projects awaiting assignment" density="compact" layout="scroll" minWidth={1900}>
          <thead>
            <tr>
              <th scope="col" className="cui-cell-sticky" style={{ width: 200 }}>
                Client
              </th>
              <th scope="col" style={{ width: 120 }}>
                Disco code
              </th>
              <th scope="col" style={{ width: 100 }}>
                Disco tier
              </th>
              {['BA', 'SA/TL', 'Designer', 'PM', 'AM'].map((h) => (
                <th scope="col" key={h} style={{ width: 170 }}>
                  {h}
                </th>
              ))}
              <th scope="col" style={{ width: 90 }}>
                Size
              </th>
              <th scope="col" style={{ width: 160 }}>
                Health
              </th>
              <th scope="col" style={{ width: 140 }}>
                Phase
              </th>
              <th scope="col" style={{ width: 240 }}>
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <th scope="row" className="cui-cell-sticky">
                  <span>{row.client}</span> <span className="cui-caption cui-secondary">{row.code}</span>
                </th>
                <td>
                  {capture ? (
                    <CellInput
                      label={`Disco code for ${row.client}`}
                      value={row.discoCode}
                      placeholder="Code"
                      onChange={(event) => set(row.id, 'discoCode', event.target.value)}
                    />
                  ) : (
                    row.discoCode || none
                  )}
                </td>
                {choice(row, 'tier', 'Disco tier', tiers)}
                {person(row, 'ba', 'BA')}
                {person(row, 'satl', 'SA/TL')}
                {person(row, 'designer', 'Designer')}
                {person(row, 'pm', 'PM')}
                {person(row, 'am', 'AM')}
                {choice(row, 'size', 'Size', sizes)}
                <td>
                  {capture ? (
                    <StyledSelect
                      cell
                      label={`Health for ${row.client}`}
                      options={healths}
                      value={row.health}
                      placeholder="Not set"
                      onValueChange={(value) => set(row.id, 'health', value)}
                    />
                  ) : (
                    healths.find((h) => h.value === row.health)?.label || none
                  )}
                </td>
                {choice(row, 'phase', 'Phase', phases)}
                <td>
                  {capture ? (
                    <CellTextarea
                      label={`Notes for ${row.client}`}
                      value={row.notes}
                      placeholder="Add a note"
                      onChange={(event) => set(row.id, 'notes', event.target.value)}
                    />
                  ) : (
                    row.notes || none
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </CellGrid>
    </div>
  )
}

const meta = {
  title: 'Patterns/Projects capture',
  component: ProjectsCapture,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The quick capture pattern at a real screen’s shape rather than a convenient one: twelve of a consuming application’s twenty-one columns, five person pickers, and most cells empty. Three things carry the density. The client column is pinned, because a table this wide is unreadable once the identifier scrolls away. Resting cells are quiet, with the outline appearing on approach, because sixty visible boxes would read as noise rather than as fields. The person columns are searchable pickers whose lists stay shut until asked for, so Tab crosses a row without opening five listboxes on the way.',
      },
    },
  },
} satisfies Meta<typeof ProjectsCapture>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    const client = c.getByRole('columnheader', { name: /Client/ })
    await expect(getComputedStyle(client).position).toBe('sticky')

    // Scroll it, rather than trusting position: sticky. Without an inset value sticky does nothing,
    // and the class carried none until this story caught the identifier scrolling away at 700px.
    const identifier = c.getByText('Albek').closest('th') as HTMLElement
    const region = client.closest('.cui-table-scroll') as HTMLElement
    const before = identifier.getBoundingClientRect().left
    region.scrollLeft = 700
    await new Promise((resolve) => setTimeout(resolve, 100))
    await expect(Math.abs(identifier.getBoundingClientRect().left - before)).toBeLessThan(2)
    region.scrollLeft = 0

    // Tab must cross a row without any picker opening a list on the way past.
    const ba = c.getByLabelText('BA for Albek')
    ba.focus()
    await expect(ba).toHaveAttribute('aria-expanded', 'false')

    // A status colour must survive into a cell. A native select cannot carry one, so health uses
    // the branded listbox and the icon has to reach both the option and the chosen trigger.
    const health = c.getByLabelText('Health for Albek')
    await expect(health.tagName).toBe('BUTTON')

    // Assert the dot's colour, not merely that an svg exists: the trigger also holds a chevron, so
    // "has an svg" passes even when the status icon is missing entirely.
    const withHealth = c.getByLabelText('Health for Bulldogs')
    await expect(withHealth).toHaveTextContent('At watch')
    const statusIcon = withHealth.querySelector('.cui-warning')
    await expect(statusIcon).not.toBeNull()
    // Resolve the token through a probe so the comparison is computed-to-computed: the token is
    // authored as a hex and the browser reports rgb(), which are the same colour written differently.
    const probe = canvasElement.ownerDocument.createElement('span')
    probe.style.color = 'var(--cui-text-warning)'
    withHealth.appendChild(probe)
    const expected = getComputedStyle(probe).color
    await expect(getComputedStyle(statusIcon as Element).color).toBe(expected)
    probe.remove()

    // A wide grid is exactly where a box that changes on focus would be most obvious.
    const resting = ba.getBoundingClientRect()
    await expect(Math.round(ba.getBoundingClientRect().height)).toBe(Math.round(resting.height))
  },
}
