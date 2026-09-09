import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { Button, ContentList, ContentListItem, Grid, PageHeader, RoadmapBoard, Stack } from '../src/index.js'

const columns = [{ id: 'ready', label: 'Ready' }]
const items = [{ id: 'guide', title: 'Workspace guide', stage: 'ready' }]

describe('dashboard composition contracts', () => {
  it('hides editing controls explicitly without changing legacy disabled controls', () => {
    const change = vi.fn()
    const { rerender } = render(<RoadmapBoard heading="Work" columns={columns} items={items} />)
    expect((screen.getByRole('combobox', { name: 'Stage for Workspace guide' }) as HTMLSelectElement).disabled).toBe(
      true,
    )
    rerender(<RoadmapBoard heading="Work" columns={columns} items={items} readOnly onStageChange={change} />)
    expect(screen.queryByRole('combobox', { name: 'Stage for Workspace guide' })).toBeNull()
    expect(screen.queryByRole('checkbox')).toBeNull()
    expect(screen.getByRole('combobox', { name: 'Show stage' })).toBeTruthy()
    expect(screen.getByText('Workspace guide')).toBeTruthy()
    expect(change).not.toHaveBeenCalled()
  })

  it('keeps row links and action controls separate with a named semantic list', () => {
    const review = vi.fn()
    render(
      <ContentList aria-label="Work">
        <ContentListItem
          title={<a href="/project/guide">Workspace guide</a>}
          leading="WG"
          description="Ready for review"
          meta="Week 38"
          actions={<Button onClick={review}>Review guide</Button>}
        />
      </ContentList>,
    )
    const list = screen.getByRole('list', { name: 'Work' })
    expect(within(list).getAllByRole('listitem')).toHaveLength(1)
    expect(within(list).getByRole('link').querySelector('button')).toBeNull()
    fireEvent.click(within(list).getByRole('button', { name: 'Review guide' }))
    expect(review).toHaveBeenCalledOnce()
  })

  it('can render static layouts and headers on the server without browser globals', () => {
    const html = renderToString(
      <Stack gap={0}>
        <PageHeader heading="Embedded workspace" headingLevel={2} />
        <Grid columns={1} minItemWidth={Number.NaN}>
          <ContentList>
            <ContentListItem title="Guide" />
          </ContentList>
        </Grid>
      </Stack>,
    )
    expect(html).toContain('<h2')
    expect(html).not.toContain('<h1')
    expect(html).toContain('Embedded workspace')
    expect(html).toContain('--cui-grid-min:240px')
    expect(html).toContain('--cui-layout-gap:var(--cui-space-0)')
  })
})
