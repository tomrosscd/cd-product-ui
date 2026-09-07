import type { ColumnDef } from '../src/components/data/data-table.js'
import { Badge } from '../src/components/primitives/badge.js'
export interface ProjectRow {
  id: string
  name: string
  team: string
  status: string
  estimate: number
}
export const projectRows: ProjectRow[] = [
  { id: '1', name: 'Workspace refresh', team: 'Design', status: 'In progress', estimate: 24 },
  { id: '2', name: 'Reporting improvements', team: 'Development', status: 'In review', estimate: 40 },
  { id: '3', name: 'Team onboarding guide', team: 'Operations', status: 'Complete', estimate: 12 },
  { id: '4', name: 'Resource library', team: 'Operations', status: 'Planned', estimate: 16 },
  { id: '5', name: 'Review checklist', team: 'Design', status: 'Planned', estimate: 8 },
]
export const projectColumns: ColumnDef<ProjectRow>[] = [
  { accessorKey: 'name', header: 'Project' },
  { accessorKey: 'team', header: 'Team' },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge tone={row.original.status === 'Complete' ? 'positive' : 'neutral'}>{row.original.status}</Badge>
    ),
  },
  {
    accessorKey: 'estimate',
    header: 'Estimate (hours)',
    cell: ({ row }) => <span className="cui-numeric">{row.original.estimate}</span>,
  },
]
