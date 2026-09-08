import type { Meta, StoryObj } from '@storybook/react-vite'
import { useMemo, useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { FilterToolbar } from './filter-toolbar.js'
import { SegmentedControl } from '../components/primitives/segmented-control.js'
const projects = ['Workspace refresh', 'Reporting improvements', 'Team onboarding guide', 'Resource library']
const meta = {
  title: 'Patterns/Filter toolbar',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          "Composes existing controls into a search/filter bar rather than defining its own filter types — pass a StyledSelect, Combobox or SegmentedControl into `filters`. Keeps the application's filtering logic outside the library.",
      },
    },
  },
} satisfies Meta
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {
  render: function Demo() {
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState('all')
    const results = useMemo(
      () =>
        projects.filter(
          (project) =>
            project.toLocaleLowerCase().includes(search.toLocaleLowerCase()) &&
            (status === 'all' || status === 'active'),
        ),
      [search, status],
    )
    const active = [
      ...(search ? [{ key: 'search', label: `Search: ${search}`, onRemove: () => setSearch('') }] : []),
      ...(status !== 'all' ? [{ key: 'status', label: 'Active only', onRemove: () => setStatus('all') }] : []),
    ]
    return (
      <FilterToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search projects…"
        resultCount={results.length}
        activeFilters={active}
        onClearAll={
          active.length
            ? () => {
                setSearch('')
                setStatus('all')
              }
            : undefined
        }
        filters={
          <SegmentedControl
            label="Status"
            value={status}
            onValueChange={setStatus}
            options={[
              { value: 'all', label: 'All' },
              { value: 'active', label: 'Active' },
            ]}
          />
        }
      />
    )
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    await expect(c.getByRole('status')).toHaveTextContent('4 results')
    await userEvent.type(c.getByRole('searchbox', { name: 'Search' }), 'Reporting')
    await expect(c.getByRole('status')).toHaveTextContent('1 result')
    await expect(c.getByRole('button', { name: 'Remove Search: Reporting' })).toBeVisible()
    await userEvent.click(c.getByRole('button', { name: 'Clear all' }))
    await expect(c.getByRole('status')).toHaveTextContent('4 results')
  },
}
export const NoActiveFilters: Story = {
  render: function Demo() {
    const [search, setSearch] = useState('')
    return <FilterToolbar searchValue={search} onSearchChange={setSearch} resultCount={projects.length} />
  },
}
