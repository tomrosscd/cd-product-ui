import { readFile, writeFile } from 'node:fs/promises'
import { resolve as resolvePath } from 'node:path'

// Paths default to this repo's own layout (relative to the current working directory, which pnpm
// scripts always set to the package root) but can be overridden with --tokens=, --responsive-template=,
// --out-css=, --out-ts= and --out-responsive= so this script can run against a different project
// structure. This is what makes the token pipeline portable as a registry item, not just something
// that works inside this one repo.
function flag(name, fallback) {
  const prefix = `--${name}=`
  const match = process.argv.find((arg) => arg.startsWith(prefix))
  return match ? match.slice(prefix.length) : fallback
}
const tokensPath = resolvePath(flag('tokens', 'tokens/tokens.json'))
const responsiveTemplatePath = resolvePath(flag('responsive-template', 'src/styles/responsive.template.css'))
const outCssPath = resolvePath(flag('out-css', 'src/styles/tokens.css'))
const outTsPath = resolvePath(flag('out-ts', 'src/tokens.ts'))
const outResponsivePath = resolvePath(flag('out-responsive', 'src/styles/responsive.css'))

const source = JSON.parse(await readFile(tokensPath, 'utf8'))
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
function resolveValue(value, seen = new Set(), mode = 'light') {
  return value.replace(/\{([^}]+)\}/g, (_, key) => {
    if (!byKey.has(key) || seen.has(key)) throw new Error(`Invalid or circular token reference: ${key}`)
    return resolveValue(
      mode === 'dark' ? (byKey.get(key).dark ?? byKey.get(key).value) : byKey.get(key).value,
      new Set([...seen, key]),
      mode,
    )
  })
}
const resolved = flat.map((token) => ({
  ...token,
  resolved: resolveValue(token.value),
  darkResolved: resolveValue(token.dark ?? token.value, new Set(), 'dark'),
}))
function declarations(mode) {
  return flat
    .map(
      (t) =>
        `  ${t.css}: ${(mode === 'dark' ? (t.dark ?? t.value) : t.value).replace(/\{([^}]+)\}/g, (_, key) => `var(${byKey.get(key).css})`)};`,
    )
    .join('\n')
}
const generatedFrom = `Generated from ${tokensPath.replace(process.cwd() + '/', '')} by generate-tokens.mjs.`
const css = `/* ${generatedFrom} */\n:root, [data-cui-theme="light"] {\n${declarations('light')}\n}\n[data-cui-theme="dark"] {\n  color-scheme: dark;\n${declarations('dark')}\n}\n[data-cui-theme="light"] { color-scheme: light; }\n`
const ts = `// ${generatedFrom}\nexport const tokenReference = ${JSON.stringify(resolved, null, 2)} as const\nexport const tokens = ${JSON.stringify(Object.fromEntries(resolved.map((t) => [t.key, t.resolved])), null, 2)} as const\nexport const darkTokens = ${JSON.stringify(Object.fromEntries(resolved.map((t) => [t.key, t.darkResolved])), null, 2)} as const\nexport type TokenName = keyof typeof tokens\n`
const responsive = (await readFile(responsiveTemplatePath, 'utf8')).replace(/\{\{([^}]+)\}\}/g, (_, key) =>
  resolveValue(byKey.get(key).value),
)
for (const [path, content] of [
  [outCssPath, css],
  [outTsPath, ts],
  [outResponsivePath, responsive],
]) {
  if (process.argv.includes('--check')) {
    if ((await readFile(path, 'utf8').catch(() => '')) !== content)
      throw new Error(`${path} is stale. Run pnpm tokens.`)
  } else await writeFile(path, content)
}
console.log(`${resolved.length} tokens ${process.argv.includes('--check') ? 'verified' : 'generated'}`)
