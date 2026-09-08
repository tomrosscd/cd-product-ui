import { describe, expect, it } from 'vitest'
import { tokenReference, tokens, darkTokens } from '../src/tokens.js'
function luminance(hex: string) {
  const values = hex
    .replace('#', '')
    .match(/../g)!
    .map((part) => parseInt(part, 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  return values[0]! * 0.2126 + values[1]! * 0.7152 + values[2]! * 0.0722
}
function contrast(a: string, b: string) {
  const x = luminance(a),
    y = luminance(b)
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)
}
describe('approved foundations', () => {
  it('keeps normal text readable on supported surfaces', () => {
    for (const surface of ['surface.page', 'surface.band', 'surface.card'] as const)
      for (const text of ['text.primary', 'text.secondary', 'text.positive', 'text.negative'] as const)
        expect(contrast(tokens[text], tokens[surface]), `${text} on ${surface}`).toBeGreaterThanOrEqual(4.5)
    expect(contrast(tokens['text.inverse'], tokens['accent.primary'])).toBeGreaterThanOrEqual(4.5)
    expect(contrast(tokens['text.accent'], tokens['surface.selected'])).toBeGreaterThanOrEqual(4.5)
  })
  it('provides sufficiently contrasting control boundaries and focus rings', () => {
    expect(contrast(tokens['border.control'], tokens['surface.card'])).toBeGreaterThanOrEqual(3)
    expect(contrast(tokens['focus.colour'], tokens['surface.page'])).toBeGreaterThanOrEqual(3)
  })
  it('keeps chart series distinct from their card background', () => {
    for (const key of ['chart.series-primary', 'chart.series-secondary', 'chart.series-tertiary'] as const)
      expect(contrast(tokens[key], tokens['surface.card'])).toBeGreaterThanOrEqual(3)
  })
  it('resolves aliases and keeps names unique', () => {
    expect(new Set(tokenReference.map((t) => t.css)).size).toBe(tokenReference.length)
    expect(tokenReference.every((t) => !t.resolved.includes('{'))).toBe(true)
    expect(tokens['surface.page']).toBe('#faf9f7')
  })
})

describe('dark foundations', () => {
  it('keeps text, actions, selected states and graphics readable', () => {
    for (const surface of ['surface.page', 'surface.band', 'surface.card'] as const) {
      for (const text of ['text.primary', 'text.secondary', 'text.positive', 'text.negative', 'text.accent'] as const)
        expect(contrast(darkTokens[text], darkTokens[surface]), `${text} on ${surface}`).toBeGreaterThanOrEqual(4.5)
      expect(contrast(darkTokens['border.control'], darkTokens[surface])).toBeGreaterThanOrEqual(3)
      expect(contrast(darkTokens['focus.colour'], darkTokens[surface])).toBeGreaterThanOrEqual(3)
    }
    expect(contrast(darkTokens['text.inverse'], darkTokens['accent.primary'])).toBeGreaterThanOrEqual(4.5)
    expect(contrast(darkTokens['text.accent'], darkTokens['surface.selected'])).toBeGreaterThanOrEqual(4.5)
    for (const key of ['chart.series-primary', 'chart.series-secondary', 'chart.series-tertiary'] as const)
      expect(contrast(darkTokens[key], darkTokens['surface.card'])).toBeGreaterThanOrEqual(3)
  })
})
