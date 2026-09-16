import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { CellGrid, CellInput, CellSelect, CellTextarea } from '../components/data/cell-controls.js'
import { Table } from '../components/primitives/table.js'
import { SegmentedControl } from '../components/primitives/segmented-control.js'
import { Badge } from '../components/primitives/badge.js'
import { PageHeader } from '../components/primitives/layout.js'

const people = [
  { value: 'ap', label: 'Alex Poole' },
  { value: 'jr', label: 'Jo Reid' },
  { value: 'jm', label: 'Justin Mendonca' },
]
const phases = [
  { value: 'discovery', label: 'Discovery' },
  { value: 'opportunity', label: 'Opportunity' },
  { value: 'design', label: 'Design' },
]
interface Row {
  id: string
  client: string
  code: string
  tier: string
  ba: string
  designer: string
  phase: string
  launch: string
  notes: string
}
const seed: Row[] = [
  {
    id: '1',
    client: 'Albek',
    code: 'ALB0001',
    tier: '',
    ba: '',
    designer: '',
    phase: 'opportunity',
    launch: '',
    notes: '',
  },
  {
    id: '2',
    client: 'Bon Maxie',
    code: 'BON0001',
    tier: 'T2',
    ba: '',
    designer: '',
    phase: 'opportunity',
    launch: '2026-09-21',
    notes: '',
  },
  {
    id: '3',
    client: 'Brotherhood Books',
    code: 'BSL',
    tier: '',
    ba: '',
    designer: '',
    phase: 'discovery',
    launch: '',
    notes: '',
  },
  {
    id: '4',
    client: 'Bstore',
    code: 'BS0007',
    tier: 'T1',
    ba: 'jr',
    designer: '',
    phase: 'design',
    launch: '2026-10-05',
    notes: '',
  },
]
const tiers = ['T1', 'T2', 'T3', 'T4'].map((t) => ({ value: t, label: t }))

function QuickCapture() {
  const [mode, setMode] = useState('capture')
  const [rows, setRows] = useState(seed)
  const set = (id: string, key: keyof Row, value: string) =>
    setRows((current) => current.map((row) => (row.id === id ? { ...row, [key]: value } : row)))
  const capture = mode === 'capture'
  const nameOf = (id: string) => people.find((p) => p.value === id)?.label

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
      <p className="cui-caption cui-secondary">
        {capture
          ? 'Every cell is editable. Tab moves across a row, Enter moves down a column, Escape leaves the grid.'
          : 'Read-only. Switch to Quick capture to edit.'}
      </p>
      <CellGrid>
        <Table caption="Projects awaiting assignment" density="compact" layout="scroll" minWidth={1010}>
          <thead>
            <tr>
              <th scope="col" style={{ width: 220 }}>
                Client
              </th>
              <th scope="col" style={{ width: 110 }}>
                Disco tier
              </th>
              <th scope="col" style={{ width: 170 }}>
                BA
              </th>
              <th scope="col" style={{ width: 170 }}>
                Designer
              </th>
              <th scope="col" style={{ width: 150 }}>
                Phase
              </th>
              <th scope="col" style={{ width: 150 }}>
                Launch
              </th>
              <th scope="col" style={{ width: 220 }}>
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <th scope="row">
                  <span>{row.client}</span>
                  <span className="cui-caption cui-secondary"> {row.code}</span>
                </th>
                <td>
                  {capture ? (
                    <CellSelect
                      label={`Discovery tier for ${row.client}`}
                      options={tiers}
                      value={row.tier}
                      onChange={(e) => set(row.id, 'tier', e.target.value)}
                    />
                  ) : (
                    row.tier || <span className="cui-secondary">Not set</span>
                  )}
                </td>
                <td>
                  {capture ? (
                    <CellSelect
                      label={`BA for ${row.client}`}
                      options={people}
                      value={row.ba}
                      onChange={(e) => set(row.id, 'ba', e.target.value)}
                    />
                  ) : (
                    nameOf(row.ba) || <span className="cui-secondary">Not set</span>
                  )}
                </td>
                <td>
                  {capture ? (
                    <CellSelect
                      label={`Designer for ${row.client}`}
                      options={people}
                      value={row.designer}
                      onChange={(e) => set(row.id, 'designer', e.target.value)}
                    />
                  ) : (
                    nameOf(row.designer) || <span className="cui-secondary">Not set</span>
                  )}
                </td>
                <td>
                  {capture ? (
                    <CellSelect
                      label={`Phase for ${row.client}`}
                      options={phases}
                      value={row.phase}
                      onChange={(e) => set(row.id, 'phase', e.target.value)}
                    />
                  ) : (
                    <Badge tone="neutral">{phases.find((p) => p.value === row.phase)?.label}</Badge>
                  )}
                </td>
                <td>
                  {capture ? (
                    <CellInput
                      label={`Launch date for ${row.client}`}
                      type="date"
                      value={row.launch}
                      onChange={(e) => set(row.id, 'launch', e.target.value)}
                    />
                  ) : (
                    row.launch || <span className="cui-secondary">Not set</span>
                  )}
                </td>
                <td>
                  {capture ? (
                    <CellTextarea
                      label={`Notes for ${row.client}`}
                      value={row.notes}
                      placeholder="Add a note"
                      onChange={(e) => set(row.id, 'notes', e.target.value)}
                    />
                  ) : (
                    row.notes || <span className="cui-secondary">Not set</span>
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
  title: 'Patterns/Quick capture',
  component: QuickCapture,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Filling many cells at once, as a deliberate mode rather than a click-to-edit table. Every cell holds a live control while the mode is on, so there is no click to enter editing and no swap between a resting shape and an editing shape: the cell box is identical resting, hovered and focused. A control that gains a border on focus is taller than it was a moment earlier, which shifts the row and everything below it, and that is the usual reason a hand-rolled editable table feels unstable. Tab crosses a row because the controls are real form controls in document order, CellGrid adds Enter and Shift+Enter to move down and up a column, and arrow keys are left to the controls themselves, where they move the caret and change a selection. Cell controls take a label for assistive technology and never render it: the column header is the visible label already. Saving is the application, not the pattern: debounce per cell, keep the value optimistic, and show failure next to the cell that failed.',
      },
    },
  },
} satisfies Meta<typeof QuickCapture>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    const tier = c.getByLabelText('Discovery tier for Albek')

    // The box must not move between resting and focused, or the row jumps as you work.
    const resting = tier.getBoundingClientRect()
    tier.focus()
    const focused = tier.getBoundingClientRect()
    await expect(Math.round(focused.height)).toBe(Math.round(resting.height))
    await expect(Math.round(focused.width)).toBe(Math.round(resting.width))

    // Enter fills down a column, which is the axis repetitive entry actually needs.
    await userEvent.keyboard('{Enter}')
    await expect(c.getByLabelText('Discovery tier for Bon Maxie')).toHaveFocus()
    await userEvent.keyboard('{Shift>}{Enter}{/Shift}')
    await expect(tier).toHaveFocus()

    // Tab crosses the row without any help from us.
    await userEvent.tab()
    await expect(c.getByLabelText('BA for Albek')).toHaveFocus()

    // The accessible name is present without a visible label repeated on every row.
    await expect(c.queryByText('Discovery tier for Albek')).toBeNull()
  },
}
