import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
const pkg = JSON.parse(await readFile('package.json', 'utf8'))
const changelog = await readFile('CHANGELOG.md', 'utf8')
const heading = changelog
  .split('\n')
  .find((line) => line.startsWith(`## ${pkg.version} `) || line === `## ${pkg.version}`)
assert(heading, `Missing CHANGELOG entry for ${pkg.version}`)
const series = pkg.version.split('.').slice(0, 2).join('.')
const notes = await readFile(`docs/release-${series}.md`, 'utf8')
assert(notes.includes(pkg.version), 'Release notes do not identify the package version')
for (const name of ['react', 'next']) {
  const example = JSON.parse(await readFile(`examples/${name}/package.json`, 'utf8'))
  assert.equal(
    example.dependencies['@convert/product-ui'],
    `file:../../artifacts/convert-product-ui-${pkg.version}.tgz`,
  )
}
const tagIndex = process.argv.indexOf('--tag')
if (tagIndex !== -1) {
  assert.equal(process.argv[tagIndex + 1], `v${pkg.version}`, 'Tag and package version differ')
  assert(!/unreleased/i.test(heading), 'Mark this changelog entry released before tagging')
}
console.log(`Release metadata agrees on ${pkg.version}.`)
