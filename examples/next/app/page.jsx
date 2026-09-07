import { Card, MetricCard, ProgressCard } from '@convert/product-ui'
import ClientExample from './client-example'
export default function Page() {
  return (
    <main className="cui-stack" style={{ padding: 'var(--cui-space-24)' }}>
      <h1>Installed Product UI in Next.js</h1>
      <Card heading="Server-rendered content">This card comes from the installed package.</Card>
      <MetricCard heading="Completed items" value="24" />
      <ProgressCard heading="Review" progress={{ label: 'Checklist', value: 60 }} />
      <ClientExample />
    </main>
  )
}
