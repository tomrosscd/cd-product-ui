import { describe, expect, it, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button, Card, DashboardSidebar, Select } from '../src/index.js'
const options = [
  { value: 'all', label: 'All projects' },
  { value: 'active', label: 'Active projects' },
]
describe('Select contracts', () => {
  it('keeps caller IDs, labels, descriptions and error semantics connected', () => {
    render(
      <>
        <p id="outside">Additional context</p>
        <Select
          id="project-view"
          label="Project view"
          options={options}
          hint="Choose a view"
          error="Choose an available view"
          aria-describedby="outside"
        />
      </>,
    )
    const select = screen.getByLabelText('Project view')
    expect(select.id).toBe('project-view')
    expect(select.getAttribute('aria-describedby')).toBe('outside project-view-hint project-view-error')
    expect(select.getAttribute('aria-invalid')).toBe('true')
    expect(document.getElementById('project-view-error')?.textContent).toBe('Choose an available view')
  })
  it('reflects controlled values from the consumer and reports changes', async () => {
    const onChange = vi.fn()
    const view = render(<Select label="Project view" options={options} value="all" onChange={onChange} />)
    await userEvent.selectOptions(screen.getByRole('combobox'), 'active')
    expect(onChange).toHaveBeenCalledOnce()
    expect((screen.getByRole('combobox') as HTMLSelectElement).value).toBe('all')
    view.rerender(<Select label="Project view" options={options} value="active" onChange={onChange} />)
    expect((screen.getByRole('combobox') as HTMLSelectElement).value).toBe('active')
  })
  it('supports native form submission and disabled options', async () => {
    render(
      <form aria-label="Filters">
        <Select
          name="view"
          label="Project view"
          options={[...options, { value: 'archived', label: 'Archived', disabled: true }]}
          defaultValue="all"
        />
      </form>,
    )
    await userEvent.selectOptions(screen.getByRole('combobox'), 'active')
    expect(new FormData(screen.getByRole('form') as HTMLFormElement).get('view')).toBe('active')
    await userEvent.selectOptions(screen.getByRole('combobox'), 'archived')
    expect((screen.getByRole('combobox') as HTMLSelectElement).value).toBe('active')
  })
  it('does not offer an unusable control when loading or empty', () => {
    const view = render(<Select label="Project view" options={options} loading />)
    expect((screen.getByRole('combobox') as HTMLSelectElement).disabled).toBe(true)
    expect(screen.getByRole('combobox').getAttribute('aria-busy')).toBe('true')
    view.rerender(<Select label="Project view" options={[]} />)
    expect((screen.getByRole('combobox') as HTMLSelectElement).disabled).toBe(true)
    expect(screen.getByRole('option').textContent).toBe('No options available')
  })
})
describe('Card and action semantics', () => {
  it('keeps the heading level and hides stale content during loading', () => {
    render(
      <Card heading="Projects" headingLevel={3} state="loading">
        Outdated result
      </Card>,
    )
    expect(screen.getByRole('heading', { level: 3 }).textContent).toBe('Projects')
    expect(screen.getByRole('article').getAttribute('aria-busy')).toBe('true')
    expect(screen.queryByText('Outdated result')).toBeNull()
  })
  it('loading actions retain their accessible name and prevent repeat activation', async () => {
    const click = vi.fn()
    render(
      <Button loading onClick={click}>
        Save changes
      </Button>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Save changes' }))
    expect(click).not.toHaveBeenCalled()
    expect(screen.getByRole('button').getAttribute('aria-busy')).toBe('true')
  })
})
describe('Sidebar interactions', () => {
  const items = [
    { id: 'overview', label: 'Overview', href: '#overview' },
    { id: 'projects', label: 'Projects', href: '#projects' },
    { id: 'settings', label: 'Settings', href: '#settings', disabled: true },
  ]
  it('marks the current route and keeps unavailable destinations out of the tab sequence', () => {
    render(<DashboardSidebar items={items} activeId="projects" />)
    expect(screen.getByRole('link', { name: 'Projects' }).getAttribute('aria-current')).toBe('page')
    expect(screen.queryByRole('link', { name: 'Settings' })).toBeNull()
  })
  it('opens a labelled dialog, closes with Escape and returns focus to its trigger', async () => {
    render(<DashboardSidebar items={items} activeId="overview" />)
    const trigger = screen.getByRole('button', { name: 'Open navigation' })
    await userEvent.click(trigger)
    expect(screen.getByRole('dialog', { name: 'Workspace navigation' })).toBeTruthy()
    await userEvent.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(document.activeElement).toBe(trigger)
  })
  it('supports router integration and closes after a destination is selected', async () => {
    const navigate = vi.fn((_item, event) => event.preventDefault())
    render(<DashboardSidebar items={items} activeId="overview" onNavigate={navigate} />)
    await userEvent.click(screen.getByRole('button', { name: 'Open navigation' }))
    await userEvent.click(within(screen.getByRole('dialog')).getByRole('link', { name: 'Projects' }))
    expect(navigate).toHaveBeenCalledOnce()
    expect(navigate.mock.calls[0]?.[0].id).toBe('projects')
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})
