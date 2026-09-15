import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import {
  ActionMenu,
  Badge,
  Button,
  Checkbox,
  Combobox,
  DataTable,
  FilterToolbar,
  Icon,
  PageHeader,
  SegmentedControl,
  Stack,
  StyledSelect,
  TextLink,
  type ColumnDef,
} from '../src/index.js'

const meta = {
  title: 'Patterns/List pages',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Canonical list-page composition for 0.11.1. Read docs/list-pages.md. Synthetic data; permissions, URLs, calculations and persistence belong to the application.',
      },
    },
  },
} satisfies Meta
export default meta
type Story = StoryObj<typeof meta>
type Kind = 'Projects' | 'Retainers' | 'Clients'
type Row = { id: string; name: string; status: string; owner: string; hours: number }
const rows: Row[] = Array.from({ length: 18 }, (_, i) => ({
  id: `EX${i + 1}`,
  name: i === 0 ? 'Example workspace with a longer descriptive name' : `Example workspace ${i + 1}`,
  status: i % 3 ? 'Active' : 'Review',
  owner: i % 2 ? 'Alex Morgan' : 'Sam Rivera',
  hours: 20 + i,
}))

function ListPage({ kind }: { kind: Kind }) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [inactive, setInactive] = useState(false)
  const [view, setView] = useState('list')
  const [pipeline, setPipeline] = useState('list')
  const [notice, setNotice] = useState('')
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({})
  const filtered = rows.filter(
    (row) => row.name.toLowerCase().includes(search.toLowerCase()) && (status === 'all' || row.status === status),
  )
  const columns: ColumnDef<Row>[] = [
    {
      accessorKey: 'id',
      header: 'Key',
      size: 100,
      cell: ({ row }) => <TextLink href={`#${row.original.id}`}>{row.original.id}</TextLink>,
    },
    { accessorKey: 'name', header: 'Name', size: 320 },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge tone={row.original.status === 'Active' ? 'positive' : 'warning'}>{row.original.status}</Badge>
      ),
    },
    { accessorKey: 'owner', header: 'Owner' },
    ...(kind === 'Retainers'
      ? [{ accessorKey: 'hours', header: 'Hours available', meta: { numeric: true } } as ColumnDef<Row>]
      : []),
    {
      id: 'actions',
      header: 'Actions',
      enableSorting: false,
      cell: () => (
        <ActionMenu
          label="Actions"
          items={[
            { id: 'detail', label: 'View details', onSelect: () => setNotice('Details requested') },
            ...(kind === 'Projects'
              ? [{ id: 'warranty', label: 'Close warranty', onSelect: () => setNotice('Warranty review requested') }]
              : []),
          ]}
        />
      ),
    },
  ]
  return (
    <div style={{ padding: 24 }}>
      <Stack gap={24}>
        <PageHeader
          heading={kind}
          description={`All ${kind.toLowerCase()}`}
          actions={
            <>
              {kind === 'Projects' && (
                <SegmentedControl
                  label="Project view"
                  value={view}
                  onValueChange={setView}
                  options={[
                    { value: 'list', label: 'List' },
                    { value: 'quick', label: 'Quick capture' },
                  ]}
                />
              )}
              <div className="cui-row">
                <Button
                  size="sm"
                  onClick={() => setNotice('Reminder requested')}
                  leadingIcon={<Icon name="notifications" />}
                >
                  Remind stale
                </Button>
              </div>
              <a href="#import" className="cui-button cui-button-sm">
                <Icon name="download" />
                Import records
              </a>
              <a href="#new" className="cui-button cui-button-primary cui-button-sm">
                <Icon name="plus" />
                New record
              </a>
            </>
          }
        />
        {notice && <p role="status">{notice}</p>}
        <FilterToolbar
          searchLabel={`Search ${kind.toLowerCase()}`}
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search name or key…"
          resultCount={filtered.length}
          actions={
            <>
              <Button size="sm" onClick={() => setNotice('Views requested')}>
                Views
              </Button>
              <Button size="sm" onClick={() => setNotice('Column configuration requested')}>
                Configure columns
              </Button>
            </>
          }
          filters={
            kind === 'Projects' ? (
              <>
                {['RAG', 'Phase', 'FE Lead', 'PM', 'BE Lead', 'Platform'].map((label) => (
                  <Combobox
                    key={label}
                    label={label}
                    multiple
                    value={selectedFilters[label] ?? []}
                    onValueChange={(value) => setSelectedFilters((previous) => ({ ...previous, [label]: value }))}
                    options={[{ value: 'example', label: 'Example option' }]}
                  />
                ))}
                <SegmentedControl
                  label="Pipeline"
                  value={pipeline}
                  onValueChange={setPipeline}
                  options={[
                    { value: 'list', label: 'Pipeline on' },
                    { value: 'only', label: 'Only' },
                    { value: 'off', label: 'Off' },
                  ]}
                />
              </>
            ) : (
              <>
                <StyledSelect
                  label="Status"
                  value={status}
                  onValueChange={setStatus}
                  options={[
                    { value: 'all', label: 'All statuses' },
                    { value: 'Active', label: 'Active' },
                    { value: 'Review', label: 'Review' },
                  ]}
                />
                <Checkbox
                  label="Show inactive"
                  checked={inactive}
                  onChange={(event) => setInactive(event.target.checked)}
                />
              </>
            )
          }
        />
        <DataTable
          caption={kind}
          data={filtered}
          columns={columns}
          getRowId={(row) => row.id}
          searchable={false}
          density="compact"
          pagination="full"
          pageSize={15}
          tableLayout="scroll"
          tableMinWidth={kind === 'Retainers' ? 1000 : 900}
        />
      </Stack>
    </div>
  )
}

const verify: NonNullable<Story['play']> = async ({ canvasElement }) => {
  const c = within(canvasElement)
  const controls = [
    c.getByRole('button', { name: 'Remind stale' }),
    c.getByRole('link', { name: 'Import records' }),
    c.getByRole('link', { name: 'New record' }),
  ]
  for (const control of controls) {
    await expect(control.getBoundingClientRect().height).toBe(32)
    await expect(getComputedStyle(control).textDecorationLine).toBe('none')
  }
  const plainHeader = c.getByRole('columnheader', { name: 'Actions' })
  await expect(getComputedStyle(plainHeader).verticalAlign).toBe('middle')
  const search = c.getByRole('searchbox')
  await expect(search.getBoundingClientRect().width).toBeLessThanOrEqual(320)
  const actions = c.getByRole('group', { name: 'Actions' })
  await expect(Math.round(actions.getBoundingClientRect().bottom)).toBe(
    Math.round(search.getBoundingClientRect().bottom),
  )
  const filters = canvasElement.querySelector('.cui-filter-toolbar-filters')!
  await expect(filters.getBoundingClientRect().top).toBeGreaterThan(search.getBoundingClientRect().bottom)
  await userEvent.type(search, 'zzzz')
  await expect(canvasElement.querySelector('.cui-filter-toolbar-count')).toHaveTextContent('0 results')
  await userEvent.clear(search)
  await expect(canvasElement.querySelector('.cui-filter-toolbar-count')).toHaveTextContent('18 results')
}
export const Projects: Story = { render: () => <ListPage kind="Projects" />, play: verify }
export const Retainers: Story = { render: () => <ListPage kind="Retainers" />, play: verify }
export const Clients: Story = { render: () => <ListPage kind="Clients" />, play: verify }
export const Narrow: Story = {
  render: () => (
    <div style={{ width: 358, maxWidth: '100%' }}>
      <ListPage kind="Projects" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    const toolbar = canvasElement.querySelector('.cui-filter-toolbar')!
    await expect(toolbar.scrollWidth).toBeLessThanOrEqual(Math.ceil(toolbar.getBoundingClientRect().width))
    await expect(c.getByRole('group', { name: 'Actions' }).getBoundingClientRect().top).toBeGreaterThan(
      c.getByRole('searchbox').getBoundingClientRect().bottom,
    )
    await userEvent.click(c.getByRole('button', { name: 'Views' }))
    await expect(c.getByText('Views requested')).toBeVisible()
  },
}
