import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { DataTable } from './data-table.js'
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
