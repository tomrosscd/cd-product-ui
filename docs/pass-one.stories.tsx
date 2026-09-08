import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import {
  Pagination,
  StyledSelect,
  DatePicker,
  Calendar,
  MonthPicker,
  DataTable,
  Badge,
  type DateSelection,
} from '../src/index.js'
const meta = { title: 'Components/Pass 1 controls', tags: ['autodocs'] } satisfies Meta
export default meta
type Story = StoryObj<typeof meta>
export const Pages: Story = {
  render: function Demo() {
    const [page, setPage] = useState(1),
      [size, setSize] = useState(25)
    return <Pagination page={page} pageSize={size} total={248} onPageChange={setPage} onPageSizeChange={setSize} />
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    await userEvent.click(c.getByRole('button', { name: 'Next' }))
    await expect(c.getByRole('status')).toHaveTextContent('26–50 of 248')
    await userEvent.click(c.getByRole('button', { name: 'Page 10' }))
    await expect(c.getByRole('status')).toHaveTextContent('226–248')
    await expect(c.getByRole('button', { name: 'Next' })).toBeDisabled()
  },
}
export const OnePage: Story = {
  render: () => <Pagination page={1} pageSize={25} total={4} onPageChange={() => {}} />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('button', { name: 'Next' })).not.toBeInTheDocument()
  },
}
export const EmptyPages: Story = {
  render: () => <Pagination page={1} pageSize={25} total={0} onPageChange={() => {}} />,
}
export const BrandedSelect: Story = {
  render: function Demo() {
    const [value, setValue] = useState('all')
    return (
      <StyledSelect
        label="Project view"
        value={value}
        onValueChange={setValue}
        options={[
          { value: 'all', label: 'All projects' },
          { value: 'active', label: 'Active projects' },
          { value: 'completed', label: 'Completed projects', disabled: true },
        ]}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    await userEvent.click(c.getByRole('combobox', { name: 'Project view' }))
    await userEvent.keyboard('{Home}{ArrowDown}{Enter}')
    await expect(c.getByRole('combobox')).toHaveTextContent('Active projects')
    await expect(c.getByRole('combobox')).toHaveFocus()
  },
}
export const SelectStates: Story = {
  render: () => (
    <div className="cui-stack">
      <StyledSelect label="Loading teams" loading options={[]} />
      <StyledSelect label="Unavailable teams" options={[]} />
      <StyledSelect
        label="Team"
        error="Choose a team."
        options={[
          { value: 'design', label: 'Design', group: 'Delivery' },
          { value: 'build', label: 'Development', group: 'Delivery' },
        ]}
      />
    </div>
  ),
}
function PickerDemo({ range = false }: { range?: boolean }) {
  const [value, setValue] = useState<DateSelection | undefined>({
    start: '2026-09-01',
    ...(range ? { end: '2026-09-30' } : {}),
  })
  return (
    <>
      <DatePicker
        label="Reporting period"
        mode={range ? 'range' : 'single'}
        value={value}
        onValueChange={setValue}
        presets={range ? [{ label: 'September', value: { start: '2026-09-01', end: '2026-09-30' } }] : []}
      />
      <p role="status">{JSON.stringify(value) || 'No dates selected'}</p>
    </>
  )
}
export const SingleDate: Story = { render: () => <PickerDemo /> }
export const CombinedRange: Story = {
  render: () => <PickerDemo range />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement),
      page = within(canvasElement.ownerDocument.body)
    await userEvent.click(c.getByRole('button', { name: 'Reporting period' }))
    const input = page.getByRole('textbox', { name: 'Enter date range' })
    await userEvent.clear(input)
    await userEvent.type(input, '2026-09-10 / 2026-09-15')
    await userEvent.click(page.getByRole('button', { name: 'Apply' }))
    await expect(c.getByRole('status')).toHaveTextContent('2026-09-10')
    await userEvent.click(c.getByRole('button', { name: 'Reporting period' }))
    await userEvent.click(page.getByRole('button', { name: 'Clear' }))
    await userEvent.click(page.getByRole('button', { name: 'Cancel' }))
    await expect(c.getByRole('status')).toHaveTextContent('2026-09-10')
    await expect(c.getByRole('button', { name: 'Reporting period' })).toHaveFocus()
  },
}
export const InlineCalendar: Story = {
  render: function Demo() {
    const [value, setValue] = useState<DateSelection | undefined>({ start: '2026-09-01' })
    return <Calendar value={value} onValueChange={setValue} min="2026-09-01" max="2026-12-31" />
  },
}
export const MonthAndYear: Story = {
  render: function Demo() {
    const [value, setValue] = useState('2026-09')
    return <MonthPicker label="Budget month" value={value} onValueChange={setValue} startYear={2024} endYear={2030} />
  },
}
export const NarrowTable: Story = {
  render: () => (
    <div style={{ maxWidth: 340 }}>
      <DataTable
        caption="Current work"
        tableLayout="scroll"
        pagination="full"
        pageSize={2}
        data={[
          { project: 'Workspace refresh', team: 'Design', status: 'In progress', hours: 24 },
          { project: 'Reporting improvements', team: 'Development', status: 'In review', hours: 40 },
          { project: 'Team onboarding guide', team: 'Operations', status: 'Complete', hours: 12 },
        ]}
        columns={[
          { accessorKey: 'project', header: 'Project' },
          { accessorKey: 'team', header: 'Team' },
          { accessorKey: 'status', header: 'Status', cell: (info) => <Badge>{String(info.getValue())}</Badge> },
          { accessorKey: 'hours', header: 'Estimate (hours)' },
        ]}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    const table = c.getByRole('table')
    await expect(table.getBoundingClientRect().width).toBeGreaterThanOrEqual(640)
    await userEvent.click(c.getByRole('button', { name: 'Next' }))
    await expect(c.getByRole('status')).toHaveTextContent('3–3 of 3')
  },
}

export const InvalidRange: Story = {
  render: () => <PickerDemo range />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement),
      page = within(canvasElement.ownerDocument.body)
    await userEvent.click(c.getByRole('button', { name: 'Reporting period' }))
    const input = page.getByRole('textbox', { name: 'Enter date range' })
    await userEvent.clear(input)
    await userEvent.type(input, '2026-02-30 / 2026-02-01')
    await expect(page.getByRole('button', { name: 'Apply' })).toBeDisabled()
    await userEvent.keyboard('{Escape}')
    await expect(c.getByRole('status')).toHaveTextContent('2026-09-01')
  },
}
export const CalendarKeyboard: Story = {
  render: function Demo() {
    const [value, setValue] = useState<DateSelection | undefined>({ start: '2026-09-10' })
    return (
      <>
        <Calendar value={value} onValueChange={setValue} />
        <p role="status" aria-label="Selected date">
          {value?.start}
        </p>
      </>
    )
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    const selected = c.getByRole('button', { name: /Thursday, September 10th, 2026/ })
    selected.focus()
    await userEvent.keyboard('{ArrowRight}{Enter}')
    await expect(c.getByRole('status', { name: 'Selected date' })).toHaveTextContent('2026-09-11')
  },
}
