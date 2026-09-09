import { useState } from 'react'
import {
  Avatar,
  Badge,
  Button,
  Card,
  ContentList,
  ContentListItem,
  Grid,
  MetricCard,
  PageHeader,
  Progress,
  SplitLayout,
  Stack,
  TextLink,
} from '../src/index.js'

const work = ['Workspace accessibility review', 'Shared reporting improvements', 'Team onboarding guide']
const pools = [
  'Design',
  'Engineering',
  'Operations',
  'Quality assurance',
  'Delivery',
  'Research',
  'Support',
  'Strategy',
  'Content',
]
/** Illustrative data only. Host applications supply all counts, dates and permissions. */
export function DashboardCompositionExample() {
  const [notice, setNotice] = useState('Illustrative data. Actions show an in-page confirmation.')
  return (
    <Stack gap={24} data-testid="dashboard-sections">
      <PageHeader
        heading="Delivery overview"
        context="Workspace · 9 September 2026"
        description="Projects, team capacity and upcoming work."
        actions={<Button onClick={() => setNotice('Review opened for this example.')}>Review workspace</Button>}
      />
      <p role="status" className="cui-caption cui-secondary">
        {notice}
      </p>
      <Grid columns={4} minItemWidth={220} data-testid="metric-grid">
        <MetricCard heading="Active projects" value={12} description="8 on track · 2 at watch · 2 at risk" />
        <MetricCard heading="Launching soon" value={4} description="In the next four weeks" />
        <MetricCard heading="Team utilisation" value={68} unit="%" description="Across nine teams" />
        <MetricCard heading="Needs attention" value={2} description="Review allocation and delivery dates" />
      </Grid>
      <SplitLayout
        data-testid="pipeline-split"
        primary={
          <Card heading="Delivery pipeline" description="A read-only summary of current work.">
            <Grid columns={3} minItemWidth={200} gap={24}>
              {(['On track', 'At watch', 'At risk'] as const).map((status, i) => (
                <Stack gap={8} key={status}>
                  <h3 className="cui-card-heading">
                    <Badge tone={i === 0 ? 'positive' : i === 1 ? 'warning' : 'negative'}>{status}</Badge>
                  </h3>
                  <ContentList aria-label={`${status} projects`} density="compact">
                    {work.slice(0, i === 0 ? 3 : 2).map((title, j) => (
                      <ContentListItem
                        key={title}
                        title={
                          <TextLink
                            href="#work-details"
                            onClick={() => setNotice(`${title}: project details selected.`)}
                          >
                            {title}
                          </TextLink>
                        }
                        description={['Amelia Chen', 'Ben Osei', 'Carla Diaz'][j]}
                        meta={<span>Week {38 + j}</span>}
                      />
                    ))}
                  </ContentList>
                  <TextLink
                    href="#work-details"
                    variant="standalone"
                    onClick={() => setNotice(`Showing all ${status.toLowerCase()} projects.`)}
                  >
                    View {status.toLowerCase()} projects
                  </TextLink>
                </Stack>
              ))}
            </Grid>
          </Card>
        }
        secondary={
          <Card
            heading="Needs attention"
            description="Workspace accessibility review"
            footer={
              <TextLink href="#work-details" variant="standalone" onClick={() => setNotice('Attention item selected.')}>
                Open project
              </TextLink>
            }
          >
            <p>Confirm the next review date and available delivery capacity.</p>
            <div>
              <Badge tone="negative">Review this week</Badge>
            </div>
          </Card>
        }
      />
      <Card heading="Team capacity" description="Allocated hours as a share of available time. Week 38.">
        <Grid columns={4} minItemWidth={200} gap={24}>
          {pools.map((pool, i) => (
            <Progress key={pool} label={pool} value={[50, 58, 0, 14, 38, 72, 0, 90, 24][i]} hint={`${i + 2} people`} />
          ))}
        </Grid>
      </Card>
      <Grid columns={2} minItemWidth={360} gap={24}>
        <Card heading="Allocation review" description="People with more work than available time.">
          <ContentList aria-label="Allocation review" density="compact">
            {['Amelia Chen', 'Ben Osei', 'Carla Diaz', 'Devon Ellis'].map((name, i) => (
              <ContentListItem
                key={name}
                leading={<Avatar name={name} size="small" />}
                title={name}
                description={`Week ${38 + i} · 2 projects`}
                meta={<Badge tone="negative">{120 + i * 10}% allocated</Badge>}
                actions={
                  <Button
                    variant="quiet"
                    aria-label={`Review allocation for ${name}`}
                    onClick={() => setNotice(`Allocation review opened for ${name}.`)}
                  >
                    Review
                  </Button>
                }
              />
            ))}
          </ContentList>
        </Card>
        <Card heading="Upcoming launches" description="Next eight weeks">
          <ContentList aria-label="Upcoming launches" density="compact">
            {[
              ...work,
              'Resource library',
              'Cross-team knowledge sharing and documentation improvements',
              'Scheduling guide',
            ].map((title, i) => (
              <ContentListItem
                key={title}
                leading={<Badge tone={i === 1 ? 'warning' : 'neutral'}>{i === 1 ? 'At watch' : 'Planned'}</Badge>}
                title={
                  <TextLink href="#work-details" onClick={() => setNotice(`${title}: launch selected.`)}>
                    {title}
                  </TextLink>
                }
                meta={
                  <>
                    <span>Week {38 + i}</span>
                    <span>{5 + i * 7} days</span>
                  </>
                }
              />
            ))}
          </ContentList>
        </Card>
      </Grid>
      <div id="work-details" className="cui-caption cui-secondary">
        Example actions update the status above. Your application supplies routes, drawers and saved state.
      </div>
    </Stack>
  )
}
