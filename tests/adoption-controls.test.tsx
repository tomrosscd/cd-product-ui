import { useState } from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { InlineEdit } from '../src/components/primitives/inline-edit'
import { CurrencyInput } from '../src/components/primitives/formatted-input'
import { Combobox } from '../src/components/primitives/combobox'
import { ColumnConfigPanel } from '../src/components/primitives/column-config-panel'
import { DataTable, type DataTableState } from '../src/components/data/data-table'
import { parseLocaleNumber } from '../src/lib/parse-number'

describe('locale decimal parsing', () => {
  it.each([
    ['de-DE', '1.234,56', 1234.56],
    ['en-AU', '-1,234.56', -1234.56],
    ['fr-FR', '1\u202f234,56', 1234.56],
    ['en-IN', '12,34,567.89', 1234567.89],
    ['ar-EG', '١٬٢٣٤٫٥٦', 1234.56],
    ['de-DE', '0', 0],
    ['en-AU', '.5', 0.5],
    ['en-AU', '0.000000000001', 0.000000000001],
    ['en-AU', '123456789.1234567', 123456789.1234567],
  ])('%s parses %s without changing its meaning', (locale, raw, expected) => {
    expect(parseLocaleNumber(raw, locale)).toBe(expected)
  })
  it.each(['abc123', '1e3', '12,34.56', '1.2.3', '--1', 'Infinity', '-', '', '12%'])('rejects %s', (raw) => {
    expect(parseLocaleNumber(raw, 'en-AU')).toBeUndefined()
  })
  it('retains invalid drafts without emitting a replacement amount', () => {
    const change = vi.fn()
    render(<CurrencyInput label="Amount" value={12} onValueChange={change} locale="de-DE" />)
    const input = screen.getByLabelText('Amount') as HTMLInputElement
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'word12' } })
    fireEvent.blur(input)
    expect(change).not.toHaveBeenCalled()
    expect(input.value).toBe('word12')
    expect(input.checkValidity()).toBe(false)
    fireEvent.change(input, { target: { value: '1.234,56' } })
    expect(change).toHaveBeenCalledWith(1234.56)
    expect(input.checkValidity()).toBe(true)
  })
})

it('keeps the draft after rejection, prevents duplicate saves and supports retry', async () => {
  let reject!: (reason: Error) => void
  const save = vi
    .fn()
    .mockImplementationOnce(
      () =>
        new Promise((_, no) => {
          reject = no
        }),
    )
    .mockResolvedValue(undefined)
  render(
    <InlineEdit label="Notes" value="Original" onSave={save}>
      {({ commit, cancel, saving }) => (
        <>
          <input aria-label="Draft" defaultValue="Revised" disabled={saving} />
          <button
            onClick={() => {
              void commit('Revised')
              void commit('Revised')
            }}
          >
            Save
          </button>
          <button onClick={cancel}>Cancel</button>
        </>
      )}
    </InlineEdit>,
  )
  fireEvent.click(screen.getByRole('button', { name: 'Edit Notes: Original' }))
  fireEvent.click(screen.getByText('Save'))
  fireEvent.click(screen.getByText('Cancel'))
  expect(save).toHaveBeenCalledTimes(1)
  expect(screen.getByLabelText('Draft')).toBeTruthy()
  await act(async () => reject(new Error('Synthetic rejection')))
  expect((screen.getByLabelText('Draft') as HTMLInputElement).disabled).toBe(false)
  expect(screen.getByRole('alert').textContent).toContain('could not be saved')
  fireEvent.click(screen.getByText('Save'))
  await waitFor(() => expect(screen.queryByLabelText('Draft')).toBeNull())
  expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Edit Notes: Original' }))
})

it('cancels or commits an unchanged inline value without persistence and restores focus', async () => {
  const save = vi.fn()
  render(
    <InlineEdit label="Title" value="Original" onSave={save}>
      {({ commit }) => <input aria-label="Draft" onBlur={() => void commit('Original')} />}
    </InlineEdit>,
  )
  fireEvent.click(screen.getByRole('button'))
  fireEvent.keyDown(screen.getByLabelText('Draft'), { key: 'Escape' })
  expect(document.activeElement).toBe(screen.getByRole('button'))
  fireEvent.click(screen.getByRole('button'))
  fireEvent.blur(screen.getByLabelText('Draft'))
  await waitFor(() => expect(screen.queryByLabelText('Draft')).toBeNull())
  expect(save).not.toHaveBeenCalled()
})

it.each([{ loading: true }, { error: 'Unavailable' }])('does not commit hidden results in %o state', (status) => {
  const change = vi.fn()
  render(<Combobox label="Choice" options={[{ value: 'old', label: 'Old' }]} onValueChange={change} {...status} />)
  const input = screen.getByRole('combobox')
  fireEvent.focus(input)
  fireEvent.keyDown(input, { key: 'Enter' })
  expect(change).not.toHaveBeenCalled()
  expect(input.getAttribute('aria-activedescendant')).toBeNull()
})

it('validates the selected value and omits disabled form values', () => {
  const { rerender } = render(
    <form aria-label="Form">
      <Combobox label="Choice" required name="choice" options={[]} onValueChange={() => {}} />
    </form>,
  )
  const form = screen.getByRole('form') as HTMLFormElement
  expect(form.checkValidity()).toBe(false)
  expect(screen.getByRole('combobox').getAttribute('aria-required')).toBe('true')
  rerender(
    <form aria-label="Form">
      <Combobox
        label="Choice"
        required
        name="choice"
        disabled
        value="one"
        options={[{ value: 'one', label: 'One' }]}
        onValueChange={() => {}}
      />
    </form>,
  )
  expect(form.checkValidity()).toBe(true)
  expect(new FormData(form).has('choice')).toBe(false)
})

it('reflects saved views and host rejection in column configuration', () => {
  const columns = [
    { key: 'a', label: 'Alpha' },
    { key: 'b', label: 'Beta' },
    { key: 'locked', label: 'Record', locked: true },
  ]
  const change = vi.fn()
  const { rerender } = render(<ColumnConfigPanel columns={columns} visibleKeys={['a']} onChange={change} open />)
  expect((screen.getByLabelText('Alpha') as HTMLInputElement).checked).toBe(true)
  rerender(<ColumnConfigPanel columns={columns} visibleKeys={['b', 'removed']} onChange={change} open />)
  expect((screen.getByLabelText('Alpha') as HTMLInputElement).checked).toBe(false)
  expect((screen.getByLabelText('Beta') as HTMLInputElement).checked).toBe(true)
  fireEvent.click(screen.getByLabelText('Alpha'))
  expect(change).toHaveBeenCalledWith(['locked', 'b', 'a'])
  expect((screen.getByLabelText('Alpha') as HTMLInputElement).checked).toBe(false)
})

it('uses server totals and emits controlled pagination without slicing the supplied page', () => {
  function Demo() {
    const [state, setState] = useState<Partial<DataTableState>>({ pagination: { pageIndex: 2, pageSize: 10 } })
    return (
      <DataTable
        caption="Records"
        data={[{ id: '21', name: 'Record 21' }]}
        columns={[{ accessorKey: 'name', header: 'Name' }]}
        manualPagination
        rowCount={53}
        tableState={state}
        onTableStateChange={setState}
      />
    )
  }
  render(<Demo />)
  expect(screen.getByText('Record 21')).toBeTruthy()
  expect(screen.getByRole('status').textContent).toContain('53 rows · Page 3 of 6')
  fireEvent.click(screen.getByRole('button', { name: 'Next' }))
  expect(screen.getByRole('status').textContent).toContain('Page 4 of 6')
})

it('reflects external column visibility, order and expanded host-supplied groups', () => {
  const columns = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'value', header: 'Value' },
  ]
  type Item = { name: string; value: number; children?: Item[] }
  const data: Item[] = [{ name: 'Group', value: 7, children: [{ name: 'Child', value: 7 }] }]
  const { rerender } = render(
    <DataTable
      caption="Grouped records"
      data={data}
      columns={columns}
      getSubRows={(row) => row.children}
      getRowLabel={(row) => row.name}
    />,
  )
  expect(screen.queryByText('Child')).toBeNull()
  fireEvent.click(screen.getByRole('button', { name: 'Expand Group' }))
  expect(screen.getByText('Child')).toBeTruthy()
  rerender(
    <DataTable
      caption="Grouped records"
      data={data}
      columns={columns}
      tableState={{ columnVisibility: { value: false } }}
    />,
  )
  expect(screen.queryByRole('button', { name: 'Value' })).toBeNull()
})

it('retains stable selected IDs when the server page changes', () => {
  function Demo() {
    const [state, setState] = useState<Partial<DataTableState>>({ pagination: { pageIndex: 0, pageSize: 1 } })
    const index = state.pagination?.pageIndex ?? 0
    return (
      <DataTable
        caption="Server records"
        data={[{ id: `record-${index}`, name: `Record ${index}` }]}
        columns={[{ accessorKey: 'name', header: 'Name' }]}
        manualPagination
        rowCount={3}
        enableRowSelection
        getRowId={(row) => row.id}
        getRowLabel={(row) => row.name}
        tableState={state}
        onTableStateChange={setState}
        selectionActions={(ids) => <output aria-label="Selected IDs">{ids.join(',')}</output>}
      />
    )
  }
  render(<Demo />)
  fireEvent.click(screen.getByRole('checkbox', { name: 'Select Record 0' }))
  fireEvent.click(screen.getByRole('button', { name: 'Next' }))
  expect((screen.getByRole('checkbox', { name: 'Select Record 1' }) as HTMLInputElement).checked).toBe(false)
  expect(screen.getByLabelText('Selected IDs').textContent).toBe('record-0')
  fireEvent.click(screen.getByRole('checkbox', { name: 'Select Record 1' }))
  expect(screen.getByLabelText('Selected IDs').textContent).toBe('record-0,record-1')
})

it('does not update an editor after it unmounts during a save', async () => {
  let resolve!: () => void
  const { unmount } = render(
    <InlineEdit
      label="Notes"
      value="Before"
      onSave={() =>
        new Promise<void>((done) => {
          resolve = done
        })
      }
    >
      {({ commit }) => <button onClick={() => void commit('After')}>Save</button>}
    </InlineEdit>,
  )
  fireEvent.click(screen.getByRole('button', { name: 'Edit Notes: Before' }))
  fireEvent.click(screen.getByText('Save'))
  unmount()
  await act(async () => resolve())
  expect(screen.queryByRole('alert')).toBeNull()
})
