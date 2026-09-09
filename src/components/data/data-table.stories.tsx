import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { DataTable, type ColumnDef } from './data-table.js'
import { projectRows, projectColumns, type ProjectRow } from '../../../docs/workspace-data.js'
const meta = {
  title: 'Components/Data table',
  component: DataTable<ProjectRow>,
  tags: ['autodocs'],
  args: {
    caption: 'Workspace projects',
    data: projectRows,
    columns: projectColumns,
    pageSize: 3,
    getRowId: (row) => row.id,
  },
  parameters: {
    docs: {
      description: {
        component:
          'TanStack Table v8 powers client-side sorting, search and pagination. Supply typed column definitions and data. Filtering resets to page one. The host owns remote fetching and business rules. This is for moderate datasets; virtualisation and server pagination are not provided.',
      },
    },
  },
} satisfies Meta<typeof DataTable<ProjectRow>>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const SortSearchAndPaginate: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    await userEvent.click(c.getByRole('button', { name: 'Next' }))
    await expect(c.getByRole('status')).toHaveTextContent('Page 2')
    await userEvent.type(c.getByRole('searchbox'), 'Workspace')
    await expect(c.getByRole('status')).toHaveTextContent('1 row · Page 1')
    await expect(c.getByText('Workspace refresh')).toBeVisible()
    await userEvent.clear(c.getByRole('searchbox'))
    await userEvent.click(c.getByRole('button', { name: /Estimate/ }))
    await expect(c.getByRole('columnheader', { name: /Estimate/ })).toHaveAttribute('aria-sort', 'ascending')
  },
}
export const NoResults: Story = {
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    await userEvent.type(c.getByRole('searchbox'), 'No matching project')
    await expect(c.getByText('No matching results')).toBeVisible()
  },
}
export const Empty: Story = { args: { data: [] } }
export const Loading: Story = { args: { state: 'loading' } }
export const Error: Story = { args: { state: 'error' } }
export const ReadableLayout: Story = {
  decorators: [(Story) => <div style={{ maxWidth: 340 }}>{Story()}</div>],
  args: { tableLayout: 'scroll', pagination: 'full', pageSize: 2 },
  parameters: {
    docs: {
      description: {
        story:
          'Opt in with `tableLayout="scroll"` and `pagination="full"` for a container that stays readable at narrow widths instead of squeezing every column. The table scrolls within its own box; the page does not.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    const table = c.getByRole('table')
    await expect(table.getBoundingClientRect().width).toBeGreaterThanOrEqual(640)
    await userEvent.click(c.getByRole('button', { name: 'Next' }))
    await expect(c.getByRole('status')).toHaveTextContent('3–4 of 5')
  },
}

interface RetainerRow {
  client: string
  hours: number
  budget: number
  variance: number | null
}
const retainerRows: RetainerRow[] = [
  { client: 'Vets Love Pets', hours: 128.5, budget: 24000, variance: -1850.4 },
  { client: 'Porsche Singapore', hours: 96, budget: 180000, variance: 12400 },
  { client: 'Forever New AU', hours: 7.25, budget: 9600, variance: 0 },
  { client: 'Beacon Lighting', hours: 240, budget: 132500, variance: null },
]
const money = new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' })
const hours = new Intl.NumberFormat('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const retainerColumns: ColumnDef<RetainerRow>[] = [
  { accessorKey: 'client', header: 'Client', size: 220 },
  {
    accessorKey: 'hours',
    header: 'Hours',
    size: 110,
    meta: { numeric: true },
    cell: (c) => hours.format(c.getValue<number>()),
  },
  {
    accessorKey: 'budget',
    header: 'Budget',
    size: 140,
    meta: { numeric: true },
    cell: (c) => money.format(c.getValue<number>()),
  },
  {
    accessorKey: 'variance',
    header: 'Variance',
    size: 140,
    meta: { numeric: true },
    // Missing is not zero. The library never decides that for you: this renders it explicitly.
    cell: (c) => {
      const value = c.getValue<number | null>()
      if (value === null) return <span className="cui-secondary">Not recorded</span>
      return <span className={value < 0 ? 'cui-negative' : undefined}>{money.format(value)}</span>
    },
  },
]

/**
 * A dense financial table. Columns declare a `size`, which is now applied to the rendered header,
 * and `meta: { numeric: true }` aligns the column to the end with tabular figures so digits line up
 * down the column. Formatting stays with the application: currency, hours and what "missing" looks
 * like are its decisions, and a missing value is rendered as such rather than as zero.
 */
export const NumericColumns: Story = {
  args: {
    caption: 'Retainer usage',
    data: retainerRows as never,
    columns: retainerColumns as never,
    searchable: false,
    pageSize: 10,
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    const budget = c.getByRole('columnheader', { name: /Budget/ })
    // The declared size reaches the DOM. Under fixed layout a table that fills its container
    // distributes the surplus proportionally, so the rendered width is the declared one scaled by a
    // constant, not the literal pixel value. Asserting the ratio is what actually proves the sizes
    // are respected; asserting 140px would only pass at one container width.
    await expect(budget.style.width).toBe('140px')
    const table = budget.closest('table') as HTMLElement
    await expect(getComputedStyle(table).tableLayout).toBe('fixed')
    const headers = [...table.querySelectorAll('th')].filter((h) => h.style.width)
    const scales = headers.map((h) => h.getBoundingClientRect().width / parseFloat(h.style.width))
    await expect(Math.max(...scales) - Math.min(...scales)).toBeLessThan(0.01)

    await expect(budget.className).toContain('cui-cell-numeric')
    await expect(getComputedStyle(budget).fontVariantNumeric).toContain('tabular-nums')
    // Missing stays missing.
    await expect(c.getByText('Not recorded')).toBeVisible()
  },
}

const totalHours = retainerRows.reduce((sum, row) => sum + row.hours, 0)
const totalBudget = retainerRows.reduce((sum, row) => sum + row.budget, 0)
// Rows with no variance recorded are excluded from the total rather than counted as zero, and the
// footer says so, because a total that quietly swallows missing data is a wrong number.
const recorded = retainerRows.filter((row) => row.variance !== null)
const totalVariance = recorded.reduce((sum, row) => sum + (row.variance ?? 0), 0)

const wideColumns: ColumnDef<RetainerRow>[] = [
  {
    accessorKey: 'client',
    header: 'Client',
    size: 220,
    meta: { sticky: true },
    footer: () => 'Total',
  },
  {
    accessorKey: 'hours',
    header: 'Hours',
    size: 160,
    meta: { numeric: true },
    cell: (c) => hours.format(c.getValue<number>()),
    footer: () => hours.format(totalHours),
  },
  {
    accessorKey: 'budget',
    header: 'Budget',
    size: 200,
    meta: { numeric: true },
    cell: (c) => money.format(c.getValue<number>()),
    footer: () => money.format(totalBudget),
  },
  {
    accessorKey: 'variance',
    header: 'Variance',
    size: 200,
    meta: { numeric: true },
    cell: (c) => {
      const value = c.getValue<number | null>()
      if (value === null) return <span className="cui-secondary">Not recorded</span>
      return <span className={value < 0 ? 'cui-negative' : undefined}>{money.format(value)}</span>
    },
    footer: () => (
      <span title={`${recorded.length} of ${retainerRows.length} rows have a variance recorded`}>
        {money.format(totalVariance)}
      </span>
    ),
  },
]

/**
 * A wide financial table. The client column is pinned with `meta: { sticky: true }`, so the row's
 * identifier stays readable while the figures scroll. Totals come from each column's own `footer`,
 * which is TanStack's existing field rather than a second API. Scroll the table sideways to see the
 * pinned column hold.
 */
export const StickyColumnAndTotals: Story = {
  args: {
    caption: 'Retainer usage by client',
    data: retainerRows as never,
    columns: wideColumns as never,
    searchable: false,
    pageSize: 10,
    tableLayout: 'scroll',
    tableMinWidth: 900,
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    const client = c.getByRole('columnheader', { name: /Client/ })
    await expect(getComputedStyle(client).position).toBe('sticky')

    // A pinned cell needs an opaque background, or the scrolled figures show through it.
    const firstCell = c.getByText('Vets Love Pets').closest('td') as HTMLElement
    await expect(getComputedStyle(firstCell).position).toBe('sticky')
    await expect(getComputedStyle(firstCell).backgroundColor).not.toBe('rgba(0, 0, 0, 0)')

    // The pin holds its place when the region scrolls sideways.
    const region = client.closest('.cui-table-scroll') as HTMLElement
    const before = firstCell.getBoundingClientRect().left
    region.scrollLeft = 300
    await new Promise((resolve) => requestAnimationFrame(resolve))
    await expect(Math.abs(firstCell.getBoundingClientRect().left - before)).toBeLessThan(2)

    // Totals exclude the row with no variance recorded rather than counting it as zero.
    await expect(c.getByText('Total')).toBeVisible()
    await expect(c.getByText(money.format(totalVariance))).toBeVisible()
  },
}
