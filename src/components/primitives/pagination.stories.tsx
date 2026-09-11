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
    const select = c.getByRole('combobox', { name: 'Results per page' })
    const label = c.getByText('Results per page')
    const selectBox = select.getBoundingClientRect()
    const labelBox = label.getBoundingClientRect()
    await expect(Math.abs(labelBox.y + labelBox.height / 2 - selectBox.y - selectBox.height / 2)).toBeLessThan(1)
    await expect(selectBox.height).toBe(c.getByRole('button', { name: 'Next' }).getBoundingClientRect().height)
    await userEvent.click(c.getByRole('button', { name: 'Next' }))
    await expect(c.getByRole('status')).toHaveTextContent('26–50 of 248')
    await userEvent.click(c.getByRole('button', { name: 'Page 10' }))
    await expect(c.getByRole('status')).toHaveTextContent('226–248')
    await expect(c.getByRole('button', { name: 'Next' })).toBeDisabled()
  },
}
export const OnePage: Story = {
  render: () => <Pagination page={1} pageSize={25} total={4} onPageChange={() => {}} onPageSizeChange={() => {}} />,
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    await expect(c.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument()
    const status = c.getByRole('status').getBoundingClientRect()
    const select = c.getByRole('combobox').getBoundingClientRect()
    await expect(Math.abs(status.y + status.height / 2 - select.y - select.height / 2)).toBeLessThan(1)
  },
}
export const Narrow: Story = {
  render: function Demo() {
    const [page, setPage] = useState(2)
    const [size, setSize] = useState(10)
    return (
      <div style={{ width: 320, maxWidth: '100%' }}>
        <Pagination page={page} pageSize={size} total={248} onPageChange={setPage} onPageSizeChange={setSize} />
      </div>
    )
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    const nav = c.getByRole('navigation')
    await expect(nav.scrollWidth).toBeLessThanOrEqual(nav.clientWidth)
    await expect(c.getByText('Page 2 of 25')).toBeVisible()
    await userEvent.click(c.getByRole('combobox', { name: 'Results per page' }))
    await userEvent.click(within(canvasElement.ownerDocument.body).getByRole('option', { name: '25' }))
    await expect(c.getByRole('status')).toHaveTextContent('1–25 of 248')
    await expect(c.getByText('Page 1 of 10')).toBeVisible()
  },
}
export const Empty: Story = {
  render: () => <Pagination page={1} pageSize={25} total={0} onPageChange={() => {}} />,
}
