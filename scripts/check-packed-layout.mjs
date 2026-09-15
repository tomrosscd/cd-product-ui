import assert from 'node:assert/strict'
import { readFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'
import { chromium } from 'playwright'

const consumer = process.argv[2]
assert(consumer, 'Pass the isolated installed consumer path')
const browser = await chromium.launch({ headless: true })
try {
  const page = await browser.newPage()
  const html = await readFile(join(consumer, 'packed-list.html'), 'utf8')
  await mkdir('artifacts/list-pages', { recursive: true })
  for (const theme of ['light', 'dark']) {
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 1000 })
      await page.setContent(html.replace('<html>', `<html data-cui-theme="${theme}">`))
      const bounds = await page.evaluate(() => {
        const rect = (selector) => document.querySelector(selector).getBoundingClientRect().toJSON()
        return {
          buttons: ['#remind', '#import', '#new'].map((selector) => {
            const style = getComputedStyle(document.querySelector(selector))
            const luminance = (colour) => {
              const values = colour
                .match(/[\d.]+/g)
                .slice(0, 3)
                .map(Number)
                .map((value) => {
                  const channel = value / 255
                  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
                })
              return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722
            }
            const foreground = luminance(style.color),
              background = luminance(style.backgroundColor)
            return {
              ...rect(selector),
              contrast: (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05),
            }
          }),
          search: rect('input[type=search]'),
          actions: rect('.cui-filter-toolbar-actions'),
          filters: rect('.cui-filter-toolbar-filters'),
          headerAlignment: getComputedStyle(document.querySelector('th[data-cui-column=actions]')).verticalAlign,
          documentWidth: document.documentElement.scrollWidth,
        }
      })
      assert(
        bounds.buttons.every((button) => button.height === (width === 1440 ? 32 : 48)),
        `Unequal small control heights at ${width}`,
      )
      assert(
        bounds.buttons.every((button) => button.contrast >= 4.5),
        `Button contrast failed in ${theme}`,
      )
      assert.equal(bounds.headerAlignment, 'middle', 'Plain headers must align with sortable headers')
      assert(bounds.documentWidth <= width, `Document overflow at ${width}`)
      assert(bounds.filters.top > bounds.search.bottom, 'Filters must be below search')
      if (width === 1440) {
        assert(bounds.search.width <= 320, 'Search exceeds desktop maximum')
        assert(
          bounds.buttons.every((button) => button.top === bounds.buttons[0].top),
          'Header controls not aligned',
        )
        assert(Math.round(bounds.actions.bottom) === Math.round(bounds.search.bottom), 'Table actions not aligned')
      } else {
        assert(bounds.actions.top > bounds.search.bottom, 'Narrow actions must wrap below search')
        assert(bounds.search.width === width - 48, 'Narrow search must fill available content width')
      }
      await page.screenshot({ path: `artifacts/list-pages/packed-${theme}-${width}.png`, fullPage: true })
    }
  }
  console.log(
    'Packed layout: equal 32px desktop/48px mobile actions, bounded search, responsive filters and no document overflow passed in light/dark at 1440/390px.',
  )
} finally {
  await browser.close()
}
