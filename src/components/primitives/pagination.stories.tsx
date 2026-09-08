import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, within } from 'storybook/test'
import { Pagination } from './pagination.js'
const meta = {
  title: 'Components/Pagination',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A standalone, controlled pagination control. The host owns the current page, page size and fetching; this component only renders navigation and reports intent. Collapses to compact page-count text under roughly 560px of container width. See Components/Data table for the equivalent built into DataTable via `pagination="full"`.',
      },
    },
  },
} satisfies Meta
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {
  render: function Demo() {
    const [page, setPage] = useState(1),
      [size, setSize] = useState(25)
    return <Pagination page={page} pageSize={size} total={248} onPageChange={setPage} onPageSizeChange={setSize} />
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    await userEvent.click(c.getByRole('button', { name: 'Next' }))
    await expect(c.getByRole('status')).toHaveTextContent('26–50 of 248')
    await userEvent.click(c.getByRole('button', { name: 'Page 10' }))
    await expect(c.getByRole('status')).toHaveTextContent('226–248')
    await expect(c.getByRole('button', { name: 'Next' })).toBeDisabled()
  },
}
export const OnePage: Story = {
  render: () => <Pagination page={1} pageSize={25} total={4} onPageChange={() => {}} />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('button', { name: 'Next' })).not.toBeInTheDocument()
  },
}
export const Empty: Story = {
  render: () => <Pagination page={1} pageSize={25} total={0} onPageChange={() => {}} />,
}
