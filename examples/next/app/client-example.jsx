'use client'
import { useState } from 'react'
import { SignInForm, Alert, DataTable } from '@convert/product-ui'
import { DataChart } from '@convert/product-ui/charts'
export default function ClientExample() {
  const [submitted, setSubmitted] = useState(false)
  return (
    <>
      <DataChart
        title="Weekly completion"
        summary="Completed items increased from 3 to 8."
        kind="bar"
        data={[
          { week: 'Week 1', count: 3 },
          { week: 'Week 2', count: 8 },
        ]}
        xKey="week"
        series={[{ key: 'count', label: 'Completed items' }]}
      />
      <DataTable
        caption="Project estimates"
        data={[
          { name: 'Workspace guide', hours: 12 },
          { name: 'Resource library', hours: 24 },
        ]}
        columns={[
          { accessorKey: 'name', header: 'Project' },
          { accessorKey: 'hours', header: 'Hours' },
        ]}
      />
      <SignInForm onSubmit={() => setSubmitted(true)} />
      {submitted && <Alert title="Demo submitted">No account was accessed.</Alert>}
    </>
  )
}
