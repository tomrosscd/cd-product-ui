import ts from 'typescript'
import { readFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
const config = ts.readConfigFile('tsconfig.json', ts.sys.readFile)
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, '.')
const program = ts.createProgram(['src/index.ts', 'src/charts/index.tsx'], parsed.options)
const checker = program.getTypeChecker()
const catalogue = await readFile('docs/component-catalogue.md', 'utf8')
for (const path of ['src/index.ts', 'src/charts/index.tsx']) {
  const source = program.getSourceFile(path)
  assert(source, `Missing ${path}`)
  const module = checker.getSymbolAtLocation(source)
  const names = checker
    .getExportsOfModule(module)
    .filter((symbol) => {
      const resolved = symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol
      return resolved.flags & ts.SymbolFlags.Value
    })
    .map((symbol) => symbol.name)
  const missing = names.filter((name) => !new RegExp(`\\b${name}\\b`).test(catalogue))
  assert.equal(missing.length, 0, `Catalogue is missing public exports: ${missing.join(', ')}`)
  console.log(`${path}: ${names.length} runtime exports have catalogue entries.`)
}
