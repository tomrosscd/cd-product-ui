import type { Meta, StoryObj } from '@storybook/react-vite'
import { useMemo, useState } from 'react'
import { brandAssets } from '../src/brand-assets.js'
import { ConvertLogo } from '../src/components/primitives/convert-logo.js'
import { Input } from '../src/components/primitives/fields.js'
import { Tabs } from '../src/components/primitives/tabs.js'
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
type Asset = (typeof brandAssets)[number]
const COLOUR_NAMES = {
  'dark-green': 'Dark green',
  'light-green': 'Light green',
  black: 'Black',
  white: 'White',
} as const
function colourFromFile(file: string): string {
  const match = /(dark-green|light-green|black|white)/.exec(file)
  return match ? COLOUR_NAMES[match[1] as keyof typeof COLOUR_NAMES] : 'Other'
}
function isClearSpace(file: string) {
  return file.includes('clear-space')
}
function groupByColour(items: readonly Asset[]) {
  const map = new Map<string, Asset[]>()
  for (const asset of items) {
    const colour = colourFromFile(asset.file)
    map.set(colour, [...(map.get(colour) ?? []), asset])
  }
  return [...map.entries()].map(([colour, assets]) => ({ colour, assets }))
}
function SwatchGrid({ items }: { items: readonly Asset[] }) {
  const swatches = groupByColour(items)
  return (
    <div className="cui-brand-gallery">
      {swatches.map(({ colour, assets }) => {
        const preview = assets.find((a) => a.format === 'svg') ?? assets.find((a) => a.format === 'png') ?? assets[0]!
        return (
          <article className="cui-stack" key={colour}>
            <div className={`cui-brand-preview ${colour === 'White' ? 'cui-brand-preview-inverse' : ''}`}>
              <img src={`brand-assets/${preview.file}`} alt="" loading="lazy" />
            </div>
            <p>{colour}</p>
            <div className="cui-row">
              {assets.map((asset) => (
                <a key={asset.file} className="cui-text-link" href={`brand-assets/${asset.file}`} download>
                  {asset.format.toUpperCase()}
                </a>
              ))}
            </div>
          </article>
        )
      })}
    </div>
  )
}
function CategoryPanel({ category }: { category: 'Icon' | 'Logo' | 'Straight' }) {
  const items = brandAssets.filter((asset) => asset.category === category)
  const standard = items.filter((asset) => !isClearSpace(asset.file))
  const clearSpace = items.filter((asset) => isClearSpace(asset.file))
  return (
    <div className="cui-stack">
      <div>
        <h3 className="cui-card-heading">Standard</h3>
        <SwatchGrid items={standard} />
      </div>
      <div>
        <h3 className="cui-card-heading">Clear space</h3>
        <p className="cui-secondary">Use these where the built-in margin around the mark is required.</p>
        <SwatchGrid items={clearSpace} />
      </div>
    </div>
  )
}
function ProfileIconsPanel() {
  const items = brandAssets.filter((asset) => asset.category === 'Profile Icons')
  return (
    <div className="cui-brand-gallery">
      {items.map((asset) => (
        <article className="cui-stack" key={asset.file}>
          <div className="cui-brand-preview">
            <img src={`brand-assets/${asset.file}`} alt="" loading="lazy" />
          </div>
          <a className="cui-text-link" href={`brand-assets/${asset.file}`} download>
            {asset.label.replace('Profile Icons/', '')} ({asset.format.toUpperCase()})
          </a>
        </article>
      ))}
    </div>
  )
}
export const Downloads: Story = {
  render: function Gallery() {
    const [query, setQuery] = useState('')
    const results = useMemo(
      () =>
        query
          ? brandAssets.filter((asset) => `${asset.label} ${asset.format}`.toLowerCase().includes(query.toLowerCase()))
          : [],
      [query],
    )
    return (
      <div className="cui-stack">
        <Input
          label="Find a logo or profile icon"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          hint="Search across every category, or browse Icon, Logo, Straight and Profile icons below."
        />
        {query ? (
          <>
            <p role="status">{results.length} files</p>
            <div className="cui-brand-gallery">
              {results.map((asset) => (
                <article className="cui-stack" key={asset.file}>
                  <div
                    className={`cui-brand-preview ${asset.file.includes('white') ? 'cui-brand-preview-inverse' : ''}`}
                  >
                    <img src={`brand-assets/${asset.file}`} alt="" loading="lazy" />
                  </div>
                  <a className="cui-text-link" href={`brand-assets/${asset.file}`} download>
                    {asset.label} ({asset.format.toUpperCase()})
                  </a>
                </article>
              ))}
            </div>
          </>
        ) : (
          <Tabs
            label="Brand asset category"
            defaultValue="icon"
            items={[
              { value: 'icon', label: 'Icon', content: <CategoryPanel category="Icon" /> },
              { value: 'logo', label: 'Logo', content: <CategoryPanel category="Logo" /> },
              { value: 'straight', label: 'Straight', content: <CategoryPanel category="Straight" /> },
              { value: 'profile', label: 'Profile icons', content: <ProfileIconsPanel /> },
            ]}
          />
        )}
      </div>
    )
  },
}
