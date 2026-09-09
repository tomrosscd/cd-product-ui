import { createRoot } from 'react-dom/client'
import { useState, type ChangeEvent } from 'react'
import { Card, Select, Stack, Grid, SplitLayout, PageHeader, ContentList, ContentListItem } from '@convert/product-ui'
import '@convert/product-ui/styles.css'
function App() {
  const [value, setValue] = useState('all')
  return (
    <main className="cui-root" style={{ padding: 'var(--cui-space-24)', background: 'var(--cui-surface-page)' }}>
      <Stack gap={24}>
        <PageHeader heading="Installed package example" />
        <Grid columns={2}>
          <Card heading="Summary">Twelve projects</Card>
          <Card heading="Capacity">68% allocated</Card>
        </Grid>
        <SplitLayout
          primary={
            <Card heading="Work">
              <ContentList aria-label="Projects">
                <ContentListItem title="Workspace guide" meta="Week 38" />
              </ContentList>
            </Card>
          }
          secondary={<Card heading="Review">Upcoming delivery</Card>}
        />
        <Card heading="Projects">
          <Select
            label="Project view"
            options={[
              { value: 'all', label: 'All projects' },
              { value: 'active', label: 'Active projects' },
            ]}
            value={value}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => setValue(event.target.value)}
          />
          <p role="status">Showing: {value}</p>
        </Card>
      </Stack>
    </main>
  )
}
createRoot(document.getElementById('root')!).render(<App />)
