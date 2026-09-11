import type { ReactNode } from 'react'
import '@convert/product-ui/styles.css'
export const metadata = { title: 'Convert Product UI consumption check' }
export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-AU">
      <body className="cui-root">{children}</body>
    </html>
  )
}
