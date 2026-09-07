import { readFile, writeFile } from 'node:fs/promises'
const source = JSON.parse(await readFile(new URL('../tokens/tokens.json', import.meta.url), 'utf8'))
const flat = Object.entries(source).flatMap(([group, values]) =>
  Object.entries(values).map(([name, token]) => ({
    group,
    name,
    key: `${group}.${name}`,
    css: `--cui-${group}-${name}`,
    ...token,
  })),
)
const byKey = new Map(flat.map((token) => [token.key, token]))
function resolve(value, seen = new Set()) {
  return value.replace(/\{([^}]+)\}/g, (_, key) => {
    if (!byKey.has(key) || seen.has(key)) throw new Error(`Invalid or circular token reference: ${key}`)
    return resolve(byKey.get(key).value, new Set([...seen, key]))
  })
}
const resolved = flat.map((token) => ({ ...token, resolved: resolve(token.value) }))
const css = `/* Generated from tokens/tokens.json. Run pnpm tokens. */\n:root {\n${flat.map((t) => `  ${t.css}: ${t.value.replace(/\{([^}]+)\}/g, (_, key) => `var(${byKey.get(key).css})`)};`).join('\n')}\n}\n`
const ts = `// Generated from tokens/tokens.json. Run pnpm tokens.\nexport const tokenReference = ${JSON.stringify(resolved, null, 2)} as const\nexport const tokens = ${JSON.stringify(Object.fromEntries(resolved.map((t) => [t.key, t.resolved])), null, 2)} as const\nexport type TokenName = keyof typeof tokens\n`
const responsive = (await readFile(new URL('../src/styles/responsive.template.css', import.meta.url), 'utf8')).replace(
  /\{\{([^}]+)\}\}/g,
  (_, key) => resolve(byKey.get(key).value),
)
for (const [name, content] of [
  ['src/styles/tokens.css', css],
  ['src/tokens.ts', ts],
  ['src/styles/responsive.css', responsive],
]) {
  const path = new URL(`../${name}`, import.meta.url)
  if (process.argv.includes('--check')) {
    if ((await readFile(path, 'utf8').catch(() => '')) !== content)
      throw new Error(`${name} is stale. Run pnpm tokens.`)
  } else await writeFile(path, content)
}
console.log(`${resolved.length} tokens ${process.argv.includes('--check') ? 'verified' : 'generated'}`)
