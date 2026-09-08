import { useState } from 'react'
import {
  Button,
  Card,
  DashboardShell,
  Icon,
  Select,
  MetricCard,
  DataTable,
  Progress,
  type SidebarItem,
} from '../src/index.js'
import { DataChart } from '../src/charts/index.js'
import { projectRows, projectColumns } from './workspace-data.js'
export const demoNavigation: SidebarItem[] = [
  { id: 'overview', label: 'Overview', href: '#overview', icon: <Icon name="overview" /> },
  { id: 'projects', label: 'Projects', href: '#projects', icon: <Icon name="projects" /> },
  { id: 'activity', label: 'Activity', href: '#activity', icon: <Icon name="activity" /> },
  { id: 'team', label: 'Team', href: '#team', icon: <Icon name="team" /> },
]
const projects = [
  { name: 'Workspace refresh', team: 'Design', status: 'In progress', group: 'active' },
  { name: 'Reporting improvements', team: 'Development', status: 'In review', group: 'active' },
  { name: 'Team onboarding guide', team: 'Operations', status: 'Complete', group: 'completed' },
  { name: 'Resource library', team: 'Operations', status: 'Planned', group: 'planned' },
]
const titles = {
  overview: 'Workspace overview',
  projects: 'Your projects',
  activity: 'Recent activity',
  team: 'Your team',
}
export function DashboardExample() {
  const [active, setActive] = useState<keyof typeof titles>('overview')
  const [filter, setFilter] = useState('all')
  const [reviewed, setReviewed] = useState(false)
  const filtered = projects.filter((project) => filter === 'all' || project.group === filter)
  return (
    <DashboardShell
      items={demoNavigation}
      activeId={active}
      workspace="Studio workspace"
      workspaceDescription="Internal tools · Demo"
      onNavigate={(item, event) => {
        event.preventDefault()
        setActive(item.id as keyof typeof titles)
      }}
      footer={
        <>
          <span className="cui-caption">Convert Product UI</span>
          <strong>Built for everyday work.</strong>
          <span className="cui-caption">Local demonstration</span>
        </>
      }
    >
      <div className="cui-page">
        <header className="cui-page-head">
          <div>
            <p className="cui-eyebrow">WORKSPACE / {active.toUpperCase()}</p>
            <h1 className="cui-page-heading">{titles[active]}</h1>
            <p className="cui-page-description">A shared view of progress, priorities and what comes next.</p>
          </div>
          <Select
            label="Project view"
            options={[
              { value: 'all', label: 'All projects' },
              { value: 'active', label: 'Active projects' },
              { value: 'completed', label: 'Completed projects' },
              { value: 'planned', label: 'Planned projects' },
            ]}
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          />
        </header>
        {active === 'overview' && (
          <section className="cui-band" aria-labelledby="summary-heading">
            <div className="cui-band-head">
              <h2 id="summary-heading">At a glance</h2>
              <span className="cui-caption cui-secondary">Illustrative data</span>
            </div>
            <div className="cui-metric-grid">
              <MetricCard
                heading="Projects in this view"
                headingLevel={3}
                value={filtered.length.toString().padStart(2, '0')}
                description="Across the demonstration workspace"
              />
              <MetricCard
                heading="Ready for review"
                headingLevel={3}
                value={reviewed ? '00' : '01'}
                description={reviewed ? 'Review complete in this demo' : 'One item needs a second look'}
              />
              <MetricCard
                heading="Completed this month"
                headingLevel={3}
                value="08"
                comparison={{ direction: 'up', sentiment: 'positive', label: '2 more than last month' }}
              />
            </div>
          </section>
        )}
        <div className="cui-demo-grid">
          <section className="cui-band" aria-labelledby="work-heading">
            <div className="cui-band-head">
              <h2 id="work-heading">
                {active === 'team' ? 'Working together' : active === 'activity' ? 'Work in motion' : 'Project snapshot'}
              </h2>
              <span className="cui-caption cui-secondary" role="status">
                {filtered.length} projects shown
              </span>
            </div>
            <Card
              heading={active === 'team' ? 'Teams and responsibilities' : 'Current work'}
              description="A small, shared view of the work."
              headingLevel={3}
            >
              <DataTable
                caption="Project details"
                data={projectRows.filter((row) => filtered.some((project) => project.name === row.name))}
                columns={projectColumns}
                pageSize={5}
                searchLabel="Search projects"
                getRowId={(row) => row.id}
              />
            </Card>
          </section>
          <div className="cui-stack">
            <Card heading="Next up" description="Keep the next action visible." elevation="flat">
              <h3 className="cui-card-heading">Review the workspace guide</h3>
              <p className="cui-secondary">Check the introduction and confirm the team can find what they need.</p>
              <Button
                variant="primary"
                disabled={reviewed}
                leadingIcon={<Icon name="check" />}
                onClick={() => setReviewed(true)}
              >
                {reviewed ? 'Reviewed' : 'Mark as reviewed'}
              </Button>
              <Progress
                label="Review checklist"
                value={reviewed ? 100 : 75}
                hint={reviewed ? 'All four checks complete.' : 'Three of four checks complete.'}
              />
              <p className="cui-caption cui-secondary" role="status">
                {reviewed ? 'Marked as reviewed in this demo.' : 'This action only changes the local example.'}
              </p>
            </Card>
            <Card heading="Weekly activity" description="Completed items · Illustrative data" elevation="flat">
              <DataChart
                heading="Completed items by week"
                summary="Completed items rose from 3 to 8 across four weeks."
                kind="bar"
                data={[
                  { week: 'W1', count: 3 },
                  { week: 'W2', count: 5 },
                  { week: 'W3', count: 4 },
                  { week: 'W4', count: 8 },
                ]}
                xKey="week"
                series={[{ key: 'count', label: 'Completed items' }]}
                height={220}
              />
            </Card>
          </div>
        </div>
        <footer className="cui-demo-foot">
          <span>Neutral demonstration content. No connected systems.</span>
          <span>Convert Product UI · 0.4.0</span>
        </footer>
      </div>
    </DashboardShell>
  )
}
