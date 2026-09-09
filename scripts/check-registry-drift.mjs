// The shadcn registry ships its own copy of the token source, the generator and the responsive
// template, so a registry consumer can regenerate CSS without installing the npm package. Copies
// drift. When this script was first written the registry was already six tokens behind canonical
// (colour.warning, text.warning, surface.warning, dropdown.hover, dropdown.selected, size.rail) and
// carried a stale surface.selected description, because nothing compared them. A registry consumer
// would have installed tokens that silently disagreed with the package.
//
// Mirrors api:check and css:check: fail on any difference, and offer one command to accept it.
import { readFileSync, copyFileSync } from 'node:fs'

const pairs = [
  ['tokens/tokens.json', 'registry/tokens/tokens.json'],
  ['scripts/generate-tokens.mjs', 'registry/tokens/generate-tokens.mjs'],
  ['src/styles/responsive.template.css', 'registry/tokens/responsive.template.css'],
]
const root = new URL('../', import.meta.url)
const sync = process.argv.includes('--sync')
const read = (rel) => readFileSync(new URL(rel, root), 'utf8')

/** Flattens the token tree to comparable leaf paths so a diff names tokens, not byte offsets. */
function leaves(node, prefix = '') {
  return Object.entries(node).flatMap(([key, value]) =>
    value && typeof value === 'object' && !('value' in value)
      ? leaves(value, `${prefix}${key}.`)
      : [[`${prefix}${key}`, JSON.stringify(value)]],
  )
}

let drifted = false
for (const [canonical, copy] of pairs) {
  if (read(canonical) === read(copy)) continue
  drifted = true
  if (sync) {
    copyFileSync(new URL(canonical, root), new URL(copy, root))
    console.log(`Synced ${copy} from ${canonical}.`)
    continue
  }
  console.error(`\n${copy} has drifted from ${canonical}.`)
  if (canonical.endsWith('.json')) {
    const a = new Map(leaves(JSON.parse(read(canonical))))
    const b = new Map(leaves(JSON.parse(read(copy))))
    const missing = [...a.keys()].filter((k) => !b.has(k))
    const extra = [...b.keys()].filter((k) => !a.has(k))
    const changed = [...a.keys()].filter((k) => b.has(k) && b.get(k) !== a.get(k))
    if (missing.length) console.error(`  missing from the registry: ${missing.join(', ')}`)
    if (extra.length) console.error(`  present only in the registry: ${extra.join(', ')}`)
    if (changed.length) console.error(`  different value or description: ${changed.join(', ')}`)
  }
}

if (!drifted) {
  console.log(`Registry token source matches canonical across ${pairs.length} files.`)
  process.exit(0)
}
if (sync) {
  console.log('Rebuild the registry (pnpm registry:build) and commit the synced files.')
  process.exit(0)
}
console.error('\nRun pnpm registry:sync to copy the canonical files across, then commit them.')
process.exit(1)
