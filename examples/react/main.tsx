import { createRoot } from 'react-dom/client'
import { useState } from 'react'
import { Card, Select } from '@convert/product-ui'
import '@convert/product-ui/styles.css'
function App() {
  const [value, setValue] = useState('all')
  return (
    <main className="cui-root" style={{ padding: 'var(--cui-space-24)', background: 'var(--cui-surface-page)' }}>
      <h1 className="cui-page-heading">Installed package example</h1>
      <Card heading="Projects">
        <Select
          label="Project view"
          options={[
            { value: 'all', label: 'All projects' },
            { value: 'active', label: 'Active projects' },
          ]}
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <p role="status">Showing: {value}</p>
      </Card>
    </main>
  )
}
createRoot(document.getElementById('root')!).render(<App />)
