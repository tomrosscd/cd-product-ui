import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { brandAssets } from '../src/brand-assets.js'
describe('official brand downloads', () => {
  it('preserves every original download and unique filename', () => {
    expect(brandAssets).toHaveLength(80)
    expect(new Set(brandAssets.map((asset) => asset.file)).size).toBe(80)
    for (const asset of brandAssets) {
      const bytes = readFileSync(`assets/brand/${asset.file}`)
      expect(createHash('sha256').update(bytes).digest('hex')).toBe(asset.sha256)
    }
  })
})
