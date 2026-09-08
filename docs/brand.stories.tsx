import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { brandAssets } from '../src/brand-assets.js'
import { ConvertLogo } from '../src/components/primitives/convert-logo.js'
import { Input } from '../src/components/primitives/fields.js'
const meta = {
  title: 'Foundations/Brand assets',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Official artwork from the supplied Convert Logos 2024 archive. Download files are preserved byte for byte. Use the clear-space variants where built-in margins are required. Do not stretch, redraw or replace the wordmark with typed text. React logos inherit currentColor; use a readable approved colour. Fonts are not included. The Brand Hub will provide the wider marketing guide and stack creator.',
      },
    },
  },
} satisfies Meta
export default meta
type Story = StoryObj<typeof meta>
export const Logos: Story = {
  render: () => (
    <div className="cui-stack">
      {(['logo', 'straight', 'mark'] as const).map((variant) => (
        <div key={variant}>
          <p>{variant}</p>
          <ConvertLogo
            variant={variant}
            label={`Convert ${variant}`}
            style={{
              width: variant === 'mark' ? 48 : 240,
              maxWidth: '100%',
              height: 80,
              color: 'var(--cui-text-accent)',
            }}
          />
        </div>
      ))}
    </div>
  ),
}
export const Downloads: Story = {
  render: function Gallery() {
    const [query, setQuery] = useState('')
    const assets = brandAssets.filter((asset) =>
      `${asset.label} ${asset.format}`.toLowerCase().includes(query.toLowerCase()),
    )
    return (
      <div className="cui-stack">
        <Input
          label="Find a logo or profile icon"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          hint="Search by variant, colour or file format."
        />
        <p role="status">{assets.length} files</p>
        <div className="cui-brand-gallery">
          {assets.map((asset) => (
            <article className="cui-stack" key={asset.file}>
              <div className={`cui-brand-preview ${asset.file.includes('white') ? 'cui-brand-preview-inverse' : ''}`}>
                <img src={`brand-assets/${asset.file}`} alt="" loading="lazy" />
              </div>
              <a className="cui-text-link" href={`brand-assets/${asset.file}`} download>
                {asset.label} ({asset.format.toUpperCase()})
              </a>
            </article>
          ))}
        </div>
      </div>
    )
  },
}
