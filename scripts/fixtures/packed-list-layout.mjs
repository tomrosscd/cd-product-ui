import { createElement as h } from 'react'
import { renderToString } from 'react-dom/server'
import { writeFileSync, readFileSync } from 'node:fs'
import {
  Stack,
  PageHeader,
  Button,
  Icon,
  SegmentedControl,
  FilterToolbar,
  Combobox,
  DataTable,
} from '@convert/product-ui'
const noop = () => {}
const icon = (name) => h(Icon, { name })
const markup = renderToString(
  h(
    'main',
    { className: 'cui-root', style: { padding: 24 } },
    h(
      Stack,
      { gap: 24 },
      h(PageHeader, {
        heading: 'Projects',
        description: 'Synthetic packed-package verification',
        actions: [
          h(SegmentedControl, {
            key: 'view',
            label: 'Project view',
            value: 'list',
            onValueChange: noop,
            options: [
              { value: 'list', label: 'List' },
              { value: 'quick', label: 'Quick capture' },
            ],
          }),
          h(
            'div',
            { key: 'reminder', className: 'cui-row' },
            h(Button, { size: 'sm', id: 'remind', leadingIcon: icon('notifications') }, 'Remind stale'),
          ),
          h(
            'a',
            { key: 'import', id: 'import', href: '#import', className: 'cui-button cui-button-sm' },
            icon('download'),
            'Import records',
          ),
          h(
            'a',
            { key: 'new', id: 'new', href: '#new', className: 'cui-button cui-button-sm cui-button-primary' },
            icon('plus'),
            'New record',
          ),
        ],
      }),
      h(FilterToolbar, {
        searchLabel: 'Search projects',
        searchValue: '',
        onSearchChange: noop,
        resultCount: 1,
        actions: [
          h(Button, { key: 'views', size: 'sm' }, 'Views'),
          h(Button, { key: 'columns', size: 'sm' }, 'Configure columns'),
        ],
        filters: ['RAG', 'Phase', 'FE Lead', 'PM', 'BE Lead', 'Platform'].map((label) =>
          h(Combobox, {
            key: label,
            label,
            multiple: true,
            value: [],
            onValueChange: noop,
            options: [{ value: 'sample', label: 'Example option' }],
          }),
        ),
      }),
      h(DataTable, {
        caption: 'Projects',
        data: [
          {
            id: 'EX1',
            name: 'Example workspace with a longer descriptive name',
            owner: 'Alex Morgan',
            status: 'Active',
          },
        ],
        columns: [
          { accessorKey: 'name', header: 'Name', size: 320 },
          { accessorKey: 'owner', header: 'Owner' },
          { accessorKey: 'status', header: 'Status' },
          { id: 'actions', header: 'Actions', enableSorting: false, cell: () => h(Button, null, 'Actions') },
        ],
        getRowId: (row) => row.id,
        searchable: false,
        density: 'compact',
        pagination: 'full',
        pageSize: 15,
        tableLayout: 'scroll',
        tableMinWidth: 900,
      }),
    ),
  ),
)
const css = readFileSync(new URL(import.meta.resolve('@convert/product-ui/styles.css')), 'utf8')
writeFileSync(
  'packed-list.html',
  `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;background:var(--cui-surface-page)}${css}</style></head><body>${markup}</body></html>`,
)
