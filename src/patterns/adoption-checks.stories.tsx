import type { Meta, StoryObj } from '@storybook/react-vite'
import { useRef, useState } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { Button } from '../components/primitives/button'
import { InlineEdit } from '../components/primitives/inline-edit'
import { DatePicker } from '../components/primitives/date-picker'
import { Drawer } from '../components/primitives/drawer'
import { ColumnConfigPanel } from '../components/primitives/column-config-panel'
import { CurrencyInput } from '../components/primitives/formatted-input'
import { DataTable, type DataTableState } from '../components/data/data-table'
import { NotificationCentre } from '../components/primitives/notification-centre'
import { Combobox } from '../components/primitives/combobox'

const meta = { title: 'Patterns/Adoption checks', tags: ['autodocs'] } satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

export const RecoverableEditing: Story = {
  render: function Demo() {
    const attempts = useRef(0)
    const [value, setValue] = useState<string | null>('Draft')
    return (
      <InlineEdit
        label="Record name"
        value={value}
        onSave={async (next) => {
          if (attempts.current++ === 0) throw new Error('Synthetic failure')
          setValue(next)
        }}
      >
        {({ commit, cancel, saving }) => (
          <>
            <input aria-label="Record name" defaultValue={value ?? ''} disabled={saving} />
            <Button
              disabled={saving}
              onClick={(event) => void commit(event.currentTarget.parentElement!.querySelector('input')!.value)}
            >
              Save
            </Button>
            <Button disabled={saving} onClick={cancel}>
              Cancel
            </Button>
          </>
        )}
      </InlineEdit>
    )
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    await userEvent.click(c.getByRole('button', { name: 'Edit Record name: Draft' }))
    await userEvent.clear(c.getByRole('textbox'))
    await userEvent.type(c.getByRole('textbox'), 'Reviewed')
    await userEvent.click(c.getByRole('button', { name: 'Save' }))
    await expect(c.getByRole('alert')).toBeVisible()
    await expect(c.getByRole('textbox')).toHaveValue('Reviewed')
    await userEvent.click(c.getByRole('button', { name: 'Save' }))
    await waitFor(() => expect(c.getByRole('button', { name: 'Edit Record name: Reviewed' })).toHaveFocus())
  },
}

export const ControlledDrawer: Story = {
  render: function Demo() {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Inspect record</Button>
        <Drawer heading="Record details" open={open} onOpenChange={setOpen}>
          <p>Application-owned content.</p>
        </Drawer>
      </>
    )
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement),
      body = within(canvasElement.ownerDocument.body)
    const trigger = c.getByRole('button', { name: 'Inspect record' })
    await userEvent.click(trigger)
    await expect(body.getByRole('dialog')).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}

export const SavedColumns: Story = {
  render: function Demo() {
    const [keys, setKeys] = useState<readonly string[]>(['name', 'owner'])
    return (
      <>
        <Button onClick={() => setKeys(['name', 'status'])}>Load status view</Button>
        <ColumnConfigPanel
          trigger={<Button>Columns</Button>}
          visibleKeys={keys}
          onChange={setKeys}
          columns={[
            { key: 'name', label: 'Name', locked: true },
            { key: 'owner', label: 'Owner' },
            { key: 'status', label: 'Status' },
            { key: 'date', label: 'Date' },
          ]}
        />
      </>
    )
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement),
      body = within(canvasElement.ownerDocument.body)
    await userEvent.click(c.getByRole('button', { name: 'Load status view' }))
    await userEvent.click(c.getByRole('button', { name: 'Columns' }))
    await expect(body.getByLabelText('Status')).toBeChecked()
    await expect(body.getByLabelText('Owner')).not.toBeChecked()
    await userEvent.click(body.getByLabelText('Owner'))
    await expect(body.getByLabelText('Owner')).toBeChecked()
    const bounds = body.getByRole('button', { name: 'Move Owner up' }).getBoundingClientRect()
    await expect(bounds.width).toBeGreaterThanOrEqual(24)
    await expect(bounds.height).toBeGreaterThanOrEqual(24)
  },
}

export const LocaleAndFormSemantics: Story = {
  render: function Demo() {
    const [amount, setAmount] = useState<number>()
    const [choice, setChoice] = useState('')
    return (
      <form aria-label="Record form">
        <CurrencyInput label="Amount" locale="de-DE" currency="EUR" value={amount} onValueChange={setAmount} />
        <output aria-label="Numeric value">{amount}</output>
        <Combobox
          label="Loading choice"
          name="choice"
          value={choice}
          required
          loading
          options={[{ value: 'old', label: 'Old result' }]}
          onValueChange={setChoice}
        />
        <Combobox
          label="Disabled choice"
          name="disabled"
          disabled
          value="one"
          options={[{ value: 'one', label: 'One' }]}
          onValueChange={() => {}}
        />
      </form>
    )
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    const input = c.getByLabelText('Amount')
    await userEvent.click(input)
    await userEvent.type(input, '1.234,56')
    await userEvent.tab()
    await expect(input).toHaveValue('1.234,56')
    await expect(c.getByLabelText('Numeric value')).toHaveTextContent('1234.56')
    const choice = c.getByRole('combobox', { name: 'Loading choice (required)' })
    await userEvent.click(choice)
    await userEvent.keyboard('{Enter}')
    await expect(choice).not.toHaveAttribute('aria-activedescendant')
    const form = c.getByRole('form') as HTMLFormElement
    await expect(form.checkValidity()).toBe(false)
    await expect(new FormData(form).has('disabled')).toBe(false)
  },
}

export const InventoryTable: Story = {
  render: function Demo() {
    const [state, setState] = useState<Partial<DataTableState>>({ columnPinning: { left: ['code', 'name'] } })
    return (
      <div style={{ maxWidth: 700 }}>
        <ColumnConfigPanel
          trigger={<Button>Inventory columns</Button>}
          columns={[
            { key: 'code', label: 'Code', locked: true },
            { key: 'name', label: 'Name' },
            { key: 'quantity', label: 'Quantity' },
          ]}
          visibleKeys={state.columnOrder ?? ['code', 'name', 'quantity']}
          onChange={(keys) =>
            setState((previous) => ({
              ...previous,
              columnOrder: [...keys],
              columnVisibility: Object.fromEntries(['code', 'name', 'quantity'].map((id) => [id, keys.includes(id)])),
            }))
          }
        />
        <DataTable
          caption="Inventory"
          data={Array.from({ length: 24 }, (_, index) => ({
            id: String(index),
            code: `SKU ${index}`,
            name: `Item ${index}`,
            quantity: index,
          }))}
          columns={[
            { accessorKey: 'code', header: 'Code', size: 120 },
            { accessorKey: 'name', header: 'Name', size: 120 },
            { accessorKey: 'quantity', header: 'Quantity', size: 120, meta: { numeric: true } },
          ]}
          tableLayout="scroll"
          tableMinWidth={1000}
          pagination="full"
          tableState={state}
          onTableStateChange={setState}
          getRowId={(row) => row.id}
          getRowLabel={(row) => row.name}
          enableRowSelection
          selectionActions={(ids) => <span>{ids.length} records ready for a host action</span>}
        />
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    const region = c.getByRole('region', { name: 'Inventory' })
    region.scrollLeft = 80
    await waitFor(() => {
      const first = c.getByRole('columnheader', { name: 'Code' }).getBoundingClientRect()
      const second = c.getByRole('columnheader', { name: 'Name' }).getBoundingClientRect()
      expect(second.left).toBeGreaterThanOrEqual(first.right - 1)
    })
    await userEvent.click(c.getByRole('checkbox', { name: 'Select Item 0' }))
    await expect(c.getByText('1 records ready for a host action')).toBeVisible()
    await userEvent.click(c.getByRole('button', { name: 'Clear selection' }))
    await expect(c.getByRole('checkbox', { name: 'Select Item 0' })).not.toBeChecked()
  },
}

export const UnreadNames: Story = {
  render: () => <NotificationCentre items={[{ id: '1', title: 'Review ready', href: '#review', read: false }]} />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement),
      body = within(canvasElement.ownerDocument.body)
    await userEvent.click(c.getByRole('button', { name: 'Notifications (1 unread)' }))
    await expect(body.getByRole('link', { name: /Review ready\s*, unread/ })).toBeVisible()
  },
}

export const DateActionsReachable: Story = {
  render: function Demo() {
    const [value, setValue] = useState<{ start: string; end?: string }>()
    return (
      <div style={{ paddingBlock: '35vh' }}>
        <DatePicker label="Review date" value={value} onValueChange={setValue} />
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement),
      body = within(canvasElement.ownerDocument.body)
    const trigger = c.getByRole('button', { name: 'Review date' })
    await userEvent.click(trigger)
    const input = body.getByRole('textbox', { name: 'Enter date' })
    await userEvent.clear(input)
    await userEvent.type(input, '2026-10-04')
    await waitFor(() => {
      const panel = body.getByRole('dialog', { name: 'Review date' }).getBoundingClientRect()
      expect(panel.top).toBeGreaterThanOrEqual(0)
      expect(panel.bottom).toBeLessThanOrEqual(canvasElement.ownerDocument.defaultView!.innerHeight + 1)
    })
    await userEvent.click(body.getByRole('button', { name: 'Apply' }))
    await expect(trigger).toHaveTextContent('4 Oct')
    await expect(body.queryByRole('dialog', { name: 'Review date' })).not.toBeInTheDocument()
  },
}
