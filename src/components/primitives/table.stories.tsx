import type { Meta, StoryObj } from '@storybook/react-vite'
import { Table } from './table.js'
const meta = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
  args: {
    caption: 'Monthly comparison',
    children: (
      <>
        <thead>
          <tr>
            <th scope="col">Metric</th>
            <th scope="col" className="cui-numeric">
              Current
            </th>
            <th scope="col" className="cui-numeric">
              Previous
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Completed items</th>
            <td className="cui-numeric">24</td>
            <td className="cui-numeric">20</td>
          </tr>
          <tr>
            <th scope="row">Open requests</th>
            <td className="cui-numeric">8</td>
            <td className="cui-numeric">12</td>
          </tr>
        </tbody>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        component:
          'Use Table for static data and comparisons. Provide a caption, column/row headers and numeric alignment. Wide tables scroll inside a labelled, keyboard-focusable region. Use DataTable when sorting, filtering or pagination is needed.',
      },
    },
  },
} satisfies Meta<typeof Table>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const Compact: Story = { args: { density: 'compact' } }
