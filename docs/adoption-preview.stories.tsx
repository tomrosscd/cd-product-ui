import type { Meta, StoryObj } from '@storybook/react-vite'
import { useMemo, useState, type ReactNode } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import {
  Badge,
  Button,
  Card,
  Combobox,
  DashboardShell,
  DataTable,
  FilterToolbar,
  Grid,
  Icon,
  MetricCard,
  PageHeader,
  Progress,
  SegmentedControl,
  Stack,
  StyledSelect,
  type ColumnDef,
  type SidebarEntry,
} from '../src/index.js'

const navigation: readonly SidebarEntry[] = [
  { id: 'dashboard', label: 'Dashboard', href: '#dashboard', icon: <Icon name="overview" /> },
  {
    id: 'projects',
    label: 'Projects',
    icon: <Icon name="projects" />,
    items: [
      { id: 'projects-all', label: 'All Projects', href: '#projects' },
      { id: 'projects-timeline', label: 'Timeline', href: '#timeline' },
      { id: 'projects-import', label: 'Import', href: '#import' },
    ],
  },
  { id: 'clients', label: 'Clients', href: '#clients', icon: <Icon name="team" /> },
  {
    id: 'allocation',
    label: 'Allocation',
    icon: <Icon name="users" />,
    items: [
      { id: 'allocation-overview', label: 'Overview', href: '#allocation' },
      { id: 'allocation-capacity', label: 'Capacity', href: '#capacity' },
    ],
  },
  { id: 'forecasting', label: 'Forecasting', href: '#forecasting', icon: <Icon name="activity" /> },
  { id: 'invoicing', label: 'Invoicing', href: '#invoicing', icon: <Icon name="status" /> },
  { id: 'settings', label: 'Settings', href: '#settings', icon: <Icon name="settings" /> },
]

function PreviewShell({ activeId, children }: { activeId: string; children: ReactNode }) {
  return (
    <div className="cui-adoption-preview">
      <style>{`
        .cui-adoption-preview .cui-dashboard-main {
          padding: 26px 30px 42px;
        }
        .cui-adoption-preview .cui-page {
          max-width: none;
          gap: 18px;
        }
        .cui-adoption-preview .cui-layout-header-copy {
          gap: 4px;
        }
        .cui-adoption-preview .cui-filter-toolbar,
        .cui-adoption-preview .cui-data-table {
          gap: 8px;
        }
        .cui-adoption-preview .cui-band {
          border-radius: 8px;
        }
      `}</style>
      <DashboardShell
        items={navigation}
        activeId={activeId}
        workspace="Project Studio"
        workspaceDescription="Local visual preview"
        brand={<strong style={{ fontSize: '1.125rem' }}>Project Studio</strong>}
        brandMark={<strong>PS</strong>}
        footer={
          <Stack gap={4}>
            <strong>Preview account</strong>
            <span className="cui-caption cui-secondary">Placeholder data only</span>
          </Stack>
        }
      >
        <div className="cui-page">{children}</div>
      </DashboardShell>
    </div>
  )
}

function HeaderActions({ label }: { label: string }) {
  return (
    <div className="cui-row">
      <Button variant="quiet" size="icon" aria-label="Notifications">
        <Icon name="notifications" />
      </Button>
      <a href="#new" className="cui-button cui-button-primary">
        {label}
      </a>
    </div>
  )
}

interface ProjectRow {
  id: string
  key: string
  project: string
  manager: string
  rag: 'Green' | 'Amber' | 'Red'
  phase: string
  probability: number
  lead: string
  backendLead: string
  platform: string
  start: string
  launch: string
  days: number
}

const projectRows: ProjectRow[] = [
  {
    id: 'harbour',
    key: 'HAR0001',
    project: 'Harbour website refresh',
    manager: 'Mina Patel',
    rag: 'Green',
    phase: 'Build',
    probability: 90,
    lead: 'Jordan Lee',
    backendLead: 'Casey Park',
    platform: 'Commerce',
    start: '16 Sep 2026',
    launch: '30 Oct 2026',
    days: 46,
  },
  {
    id: 'atlas',
    key: 'ATL0002',
    project: 'Atlas reporting workspace',
    manager: 'Alex Morgan',
    rag: 'Amber',
    phase: 'Design',
    probability: 70,
    lead: 'Riley Chen',
    backendLead: 'Taylor Kim',
    platform: 'Web app',
    start: '21 Sep 2026',
    launch: '18 Nov 2026',
    days: 65,
  },
  {
    id: 'garden',
    key: 'GAR0003',
    project: 'Garden member portal',
    manager: 'Mina Patel',
    rag: 'Red',
    phase: 'Discovery',
    probability: 40,
    lead: 'Jordan Lee',
    backendLead: 'Taylor Kim',
    platform: 'Portal',
    start: '12 Oct 2026',
    launch: '15 Dec 2026',
    days: 92,
  },
  {
    id: 'studio',
    key: 'STU0004',
    project: 'Studio onboarding flow',
    manager: 'Sam Rivera',
    rag: 'Green',
    phase: 'Build',
    probability: 80,
    lead: 'Riley Chen',
    backendLead: 'Casey Park',
    platform: 'Web app',
    start: '28 Sep 2026',
    launch: '20 Nov 2026',
    days: 67,
  },
]

const projectColumns: ColumnDef<ProjectRow>[] = [
  {
    accessorKey: 'project',
    header: 'Project',
    size: 250,
    meta: { sticky: true },
    cell: ({ row }) => (
      <div className="cui-row" style={{ flexWrap: 'nowrap' }}>
        <span
          aria-hidden="true"
          style={{
            width: 10,
            height: 10,
            flex: '0 0 10px',
            borderRadius: '50%',
            background:
              row.original.rag === 'Green'
                ? 'var(--cui-text-positive)'
                : row.original.rag === 'Amber'
                  ? 'var(--cui-text-warning)'
                  : 'var(--cui-text-negative)',
          }}
        />
        <span className="cui-sr-only">{row.original.rag} status</span>
        <span style={{ minWidth: 0 }}>
          <a href={`#${row.original.id}`} className="cui-text-link cui-text-link-inline">
            {row.original.project}
          </a>
          <span className="cui-caption cui-secondary" style={{ display: 'block' }}>
            {row.original.key}
          </span>
        </span>
      </div>
    ),
  },
  { accessorKey: 'manager', header: 'PM', size: 150 },
  {
    accessorKey: 'phase',
    header: 'Phase',
    size: 120,
    cell: ({ row }) => <Badge tone="accent">{row.original.phase}</Badge>,
  },
  {
    accessorKey: 'probability',
    header: 'Probability',
    size: 130,
    meta: { numeric: true },
    cell: ({ row }) => `${row.original.probability}%`,
  },
  { accessorKey: 'lead', header: 'FE Lead', size: 150 },
  { accessorKey: 'start', header: 'Dev start', size: 130 },
  { accessorKey: 'launch', header: 'Launch date', size: 140 },
  {
    accessorKey: 'days',
    header: 'Days',
    size: 90,
    meta: { numeric: true },
    cell: ({ row }) => <Badge tone={row.original.days < 50 ? 'warning' : 'neutral'}>{row.original.days}d</Badge>,
  },
  {
    id: 'actions',
    header: 'Actions',
    size: 110,
    enableSorting: false,
    cell: () => (
      <Button size="sm" variant="secondary">
        Actions
      </Button>
    ),
  },
]

function FilterWidth({ children }: { children: ReactNode }) {
  return <div style={{ width: 156 }}>{children}</div>
}

function ProjectsPreview() {
  const [search, setSearch] = useState('')
  const [rag, setRag] = useState('')
  const [phase, setPhase] = useState('')
  const [lead, setLead] = useState('')
  const [manager, setManager] = useState('')
  const [backendLead, setBackendLead] = useState('')
  const [platform, setPlatform] = useState('')
  const [pipeline, setPipeline] = useState('on')
  const [view, setView] = useState('list')
  const rows = useMemo(
    () =>
      projectRows.filter(
        (project) =>
          `${project.project} ${project.key}`.toLocaleLowerCase().includes(search.toLocaleLowerCase()) &&
          (!rag || project.rag === rag) &&
          (!phase || project.phase === phase) &&
          (!lead || project.lead === lead) &&
          (!manager || project.manager === manager) &&
          (!backendLead || project.backendLead === backendLead) &&
          (!platform || project.platform === platform),
      ),
    [backendLead, lead, manager, phase, platform, rag, search],
  )
  return (
    <PreviewShell activeId="projects-all">
      <PageHeader
        heading="Projects"
        description="Active projects and upcoming work"
        actions={
          <div className="cui-row">
            <Button variant="quiet" size="icon" aria-label="Notifications">
              <Icon name="notifications" />
            </Button>
            <SegmentedControl
              label="Project view"
              value={view}
              onValueChange={setView}
              options={[
                { value: 'list', label: 'List' },
                { value: 'quick', label: 'Quick capture' },
              ]}
            />
            <Button size="sm" variant="outline">
              Remind stale
            </Button>
            <Button size="sm" variant="outline">
              Import from Sheets
            </Button>
            <a href="#new" className="cui-button cui-button-primary">
              New project
            </a>
          </div>
        }
      />
      <div className="cui-row" style={{ alignItems: 'flex-end' }}>
        <FilterToolbarWithControls
          search={search}
          setSearch={setSearch}
          rag={rag}
          setRag={setRag}
          phase={phase}
          setPhase={setPhase}
          lead={lead}
          setLead={setLead}
          manager={manager}
          setManager={setManager}
          backendLead={backendLead}
          setBackendLead={setBackendLead}
          platform={platform}
          setPlatform={setPlatform}
          pipeline={pipeline}
          setPipeline={setPipeline}
          count={rows.length}
        />
        <div className="cui-row" aria-label="Table options">
          <Button size="sm" variant="quiet">
            Views
          </Button>
          <Button size="sm" variant="outline">
            Configure columns
          </Button>
        </div>
      </div>
      <section className="cui-band" aria-labelledby="projects-table-heading">
        <div className="cui-band-head">
          <h2 id="projects-table-heading">Projects</h2>
          <span className="cui-caption cui-secondary">Sort any column to inspect header spacing</span>
        </div>
        <DataTable
          caption="Placeholder project schedule"
          data={rows}
          columns={projectColumns}
          searchable={false}
          pageSize={10}
          tableLayout="scroll"
          tableMinWidth={1140}
          getRowId={(row) => row.id}
        />
      </section>
    </PreviewShell>
  )
}

interface FilterToolbarWithControlsProps {
  search: string
  setSearch: (value: string) => void
  rag: string
  setRag: (value: string) => void
  phase: string
  setPhase: (value: string) => void
  lead: string
  setLead: (value: string) => void
  manager: string
  setManager: (value: string) => void
  backendLead: string
  setBackendLead: (value: string) => void
  platform: string
  setPlatform: (value: string) => void
  pipeline: string
  setPipeline: (value: string) => void
  count: number
}

function FilterToolbarWithControls({
  search,
  setSearch,
  rag,
  setRag,
  phase,
  setPhase,
  lead,
  setLead,
  manager,
  setManager,
  backendLead,
  setBackendLead,
  platform,
  setPlatform,
  pipeline,
  setPipeline,
  count,
}: FilterToolbarWithControlsProps) {
  return (
    <FilterToolbar
      searchLabel="Search projects"
      searchValue={search}
      onSearchChange={setSearch}
      searchPlaceholder="Search by name or code…"
      resultCount={count}
      filters={
        <>
          <FilterWidth>
            <Combobox
              label="RAG"
              value={rag}
              onValueChange={setRag}
              options={[
                { value: 'Green', label: 'Green' },
                { value: 'Amber', label: 'Amber' },
                { value: 'Red', label: 'Red' },
              ]}
            />
          </FilterWidth>
          <FilterWidth>
            <Combobox
              label="Phase"
              value={phase}
              onValueChange={setPhase}
              options={[
                { value: 'Discovery', label: 'Discovery' },
                { value: 'Design', label: 'Design' },
                { value: 'Build', label: 'Build' },
              ]}
            />
          </FilterWidth>
          <FilterWidth>
            <Combobox
              label="FE Lead"
              value={lead}
              onValueChange={setLead}
              options={[
                { value: 'Jordan Lee', label: 'Jordan Lee' },
                { value: 'Riley Chen', label: 'Riley Chen' },
              ]}
            />
          </FilterWidth>
          <FilterWidth>
            <Combobox
              label="PM"
              value={manager}
              onValueChange={setManager}
              options={[
                { value: 'Mina Patel', label: 'Mina Patel' },
                { value: 'Alex Morgan', label: 'Alex Morgan' },
                { value: 'Sam Rivera', label: 'Sam Rivera' },
              ]}
            />
          </FilterWidth>
          <FilterWidth>
            <Combobox
              label="BE Lead"
              value={backendLead}
              onValueChange={setBackendLead}
              options={[
                { value: 'Casey Park', label: 'Casey Park' },
                { value: 'Taylor Kim', label: 'Taylor Kim' },
              ]}
            />
          </FilterWidth>
          <FilterWidth>
            <Combobox
              label="Platform"
              value={platform}
              onValueChange={setPlatform}
              options={[
                { value: 'Commerce', label: 'Commerce' },
                { value: 'Web app', label: 'Web app' },
                { value: 'Portal', label: 'Portal' },
              ]}
            />
          </FilterWidth>
          <SegmentedControl
            label="Pipeline"
            value={pipeline}
            onValueChange={setPipeline}
            options={[
              { value: 'on', label: 'Pipeline on' },
              { value: 'only', label: 'Only' },
              { value: 'off', label: 'Off' },
            ]}
          />
        </>
      }
    />
  )
}

interface ClientRow {
  id: string
  key: string
  name: string
  status: 'Active' | 'On hold'
  owner: string
  active: string
}

const clientRows: ClientRow[] = [
  { id: 'northwind', key: 'NOR001', name: 'Northwind Studio', status: 'Active', owner: 'Mina Patel', active: 'Yes' },
  { id: 'evergreen', key: 'EVE002', name: 'Evergreen Labs', status: 'Active', owner: 'Sam Rivera', active: 'Yes' },
  { id: 'paperkite', key: 'PAP003', name: 'Paper Kite Co.', status: 'On hold', owner: 'Alex Morgan', active: 'No' },
]

const clientColumns: ColumnDef<ClientRow>[] = [
  { accessorKey: 'key', header: 'Client key' },
  { accessorKey: 'name', header: 'Name' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge tone={row.original.status === 'Active' ? 'positive' : 'warning'}>{row.original.status}</Badge>
    ),
  },
  { accessorKey: 'owner', header: 'Primary owner' },
  { accessorKey: 'active', header: 'Active' },
]

function ClientsPreview() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const rows = useMemo(
    () =>
      clientRows.filter(
        (client) =>
          `${client.key} ${client.name}`.toLocaleLowerCase().includes(search.toLocaleLowerCase()) &&
          (status === 'all' || client.status === status),
      ),
    [search, status],
  )
  return (
    <PreviewShell activeId="clients">
      <PageHeader
        heading="Clients"
        description="All client accounts"
        context="Local visual QA · placeholder data"
        actions={<HeaderActions label="New client" />}
      />
      <FilterToolbar
        searchLabel="Search clients"
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search name or key…"
        resultCount={rows.length}
        resultLabel={(count) => `${count} ${count === 1 ? 'client' : 'clients'}`}
        filters={
          <FilterWidth>
            <StyledSelect
              label="Status"
              value={status}
              onValueChange={setStatus}
              options={[
                { value: 'all', label: 'All statuses' },
                { value: 'Active', label: 'Active' },
                { value: 'On hold', label: 'On hold' },
              ]}
            />
          </FilterWidth>
        }
      />
      <section className="cui-band" aria-labelledby="clients-table-heading">
        <div className="cui-band-head">
          <h2 id="clients-table-heading">Client accounts</h2>
        </div>
        <DataTable
          caption="Placeholder client accounts"
          data={rows}
          columns={clientColumns}
          searchable={false}
          pageSize={10}
          getRowId={(row) => row.id}
        />
      </section>
    </PreviewShell>
  )
}

function DashboardPreview() {
  return (
    <PreviewShell activeId="dashboard">
      <PageHeader
        heading="Good morning"
        description="Delivery overview for the current week"
        context="Week 38 · Local visual QA · placeholder data"
        actions={<HeaderActions label="New project" />}
      />
      <div className="cui-row" aria-label="Dashboard sections">
        <Button variant="quiet" size="sm">
          Team capacity
        </Button>
        <Button variant="quiet" size="sm">
          Delivery pipeline
        </Button>
        <Button variant="quiet" size="sm">
          Upcoming launches
        </Button>
        <Button variant="quiet" size="sm">
          Unresourced projects
        </Button>
      </div>
      <Grid columns={4} minItemWidth={210}>
        <MetricCard
          heading="Active projects"
          headingLevel={2}
          value="24"
          description="18 on track · 4 watch · 2 risk"
        />
        <MetricCard heading="Launching soon" headingLevel={2} value="6" description="Next launch in 8 days" />
        <MetricCard
          heading="Average utilisation"
          headingLevel={2}
          value="74"
          unit="%"
          comparison={{ direction: 'up', sentiment: 'positive', label: '3% this week' }}
        />
        <MetricCard
          heading="Open risks"
          headingLevel={2}
          value="5"
          comparison={{ direction: 'down', sentiment: 'positive', label: '2 resolved' }}
        />
      </Grid>
      <Card heading="Team capacity" description="Week 38 · illustrative allocation" elevation="flat">
        <Grid columns={3} minItemWidth={230}>
          <Progress label="Design" value={72} hint="6 people" />
          <Progress label="Frontend" value={81} hint="8 people" />
          <Progress label="Backend" value={64} hint="7 people" />
          <Progress label="QA" value={58} hint="4 people" />
          <Progress label="Delivery" value={76} hint="5 people" />
          <Progress label="Analysis" value={43} hint="3 people" />
        </Grid>
      </Card>
    </PreviewShell>
  )
}

const meta = {
  title: 'Quality/Adoption preview',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Local, neutral page recreations for checking library adoption without a consumer environment or account. All names and figures are placeholders.',
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const Projects: Story = {
  render: () => <ProjectsPreview />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const toolbar = canvasElement.querySelector('.cui-filter-toolbar') as HTMLElement
    const filterRow = canvasElement.querySelector('.cui-filter-toolbar-row') as HTMLElement
    const sortButton = canvasElement.querySelector('.cui-table-sort') as HTMLElement
    const primaryLink = canvas.getByRole('link', { name: 'New project' })
    await expect(toolbar.getBoundingClientRect().width).toBeGreaterThan(480)
    await expect(getComputedStyle(filterRow).flexDirection).toBe('row')
    await expect(getComputedStyle(sortButton).gap).toBe('4px')
    await expect(getComputedStyle(primaryLink).color).not.toBe(getComputedStyle(primaryLink).backgroundColor)
    for (const label of ['RAG', 'Phase', 'FE Lead', 'PM', 'BE Lead', 'Platform']) {
      await expect(canvas.getByRole('combobox', { name: label })).toBeVisible()
    }
    await expect(canvas.getByRole('radiogroup', { name: 'Pipeline' })).toBeVisible()
    const search = canvas.getByRole('searchbox', { name: 'Search projects' })
    await userEvent.type(search, 'Harbour')
    await expect(canvas.getByText('1 result')).toBeVisible()
    await expect(canvas.getByText('Harbour website refresh')).toBeVisible()
    await expect(canvas.queryByText('Atlas reporting workspace')).not.toBeInTheDocument()
    await userEvent.clear(search)
    await expect(canvas.getByText('4 results')).toBeVisible()
  },
}

export const Clients: Story = {
  render: () => <ClientsPreview />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const primaryLink = canvas.getByRole('link', { name: 'New client' })
    await expect(getComputedStyle(primaryLink).color).not.toBe(getComputedStyle(primaryLink).backgroundColor)
    const search = canvas.getByRole('searchbox', { name: 'Search clients' })
    await userEvent.type(search, 'Evergreen')
    await expect(canvas.getByText('1 client')).toBeVisible()
    await expect(canvas.getByText('Evergreen Labs')).toBeVisible()
    await expect(canvas.queryByText('Northwind Studio')).not.toBeInTheDocument()
    await userEvent.clear(search)
    await expect(canvas.getByText('3 clients')).toBeVisible()
  },
}

export const Dashboard: Story = { render: () => <DashboardPreview /> }
