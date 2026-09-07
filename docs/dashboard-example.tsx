import { useState } from 'react'
import { Button, Card, DashboardShell, Icon, Select, type SidebarItem } from '../src/index.js'
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
              <Card heading="Projects in this view" headingLevel={3}>
                <strong className="cui-metric">{filtered.length.toString().padStart(2, '0')}</strong>
                <span className="cui-caption cui-secondary">Across the demonstration workspace</span>
              </Card>
              <Card heading="Ready for review" headingLevel={3}>
                <strong className="cui-metric">{reviewed ? '00' : '01'}</strong>
                <span className="cui-caption cui-secondary">
                  {reviewed ? 'Review complete in this demo' : 'One item needs a second look'}
                </span>
              </Card>
              <Card heading="Completed this month" headingLevel={3}>
                <strong className="cui-metric">08</strong>
                <span className="cui-caption cui-positive">↑ 2 more than last month</span>
              </Card>
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
              <ul className="cui-project-list">
                {filtered.map((project) => (
                  <li key={project.name}>
                    <div>
                      <h3>{project.name}</h3>
                      <p>{project.team}</p>
                    </div>
                    <span className={`cui-badge ${project.group === 'completed' ? 'cui-badge-positive' : ''}`}>
                      {project.status}
                    </span>
                  </li>
                ))}
              </ul>
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
              <p className="cui-caption cui-secondary" role="status">
                {reviewed ? 'Marked as reviewed in this demo.' : 'This action only changes the local example.'}
              </p>
            </Card>
            <Card heading="Weekly activity" description="Completed items · Illustrative data" elevation="flat">
              <figure className="cui-chart">
                <figcaption className="cui-sr-only">
                  Completed items by week: Week 1, 3; Week 2, 5; Week 3, 4; Week 4, 8.
                </figcaption>
                <div className="cui-chart-bars" aria-hidden="true">
                  {[3, 5, 4, 8].map((value, index) => (
                    <div className="cui-chart-column" key={index}>
                      <span>{value}</span>
                      <div className="cui-chart-track">
                        <span className="cui-chart-bar" style={{ height: `${(value / 8) * 100}%` }} />
                      </div>
                      <span className="cui-secondary">W{index + 1}</span>
                    </div>
                  ))}
                </div>
              </figure>
            </Card>
          </div>
        </div>
        <footer className="cui-demo-foot">
          <span>Neutral demonstration content. No connected systems.</span>
          <span>Convert Product UI · 0.1.0</span>
        </footer>
      </div>
    </DashboardShell>
  )
}
