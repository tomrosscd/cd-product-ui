import { execFileSync } from 'node:child_process'
import { mkdtemp, readFile, writeFile, copyFile, cp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
const pkg = JSON.parse(await readFile('package.json', 'utf8'))
const fixture = JSON.parse(await readFile('examples/next/package.json', 'utf8'))
const filename = `convert-product-ui-${pkg.version}.tgz`
const consumer = await mkdtemp(join(tmpdir(), 'convert-product-ui-next-'))
await cp('examples/next', consumer, {
  recursive: true,
  filter: (source) => !source.split('/').some((part) => part === 'node_modules' || part === '.next'),
})
await copyFile(resolve('artifacts', filename), join(consumer, filename))
fixture.dependencies['@convert/product-ui'] = `file:./${filename}`
await writeFile(join(consumer, 'package.json'), JSON.stringify(fixture, null, 2))
execFileSync(
  'pnpm',
  [
    'install',
    '--ignore-scripts',
    '--no-frozen-lockfile',
    '--store-dir',
    join(tmpdir(), 'convert-product-ui-pnpm-store'),
  ],
  {
    cwd: consumer,
    stdio: 'inherit',
  },
)
execFileSync('pnpm', ['build'], {
  cwd: consumer,
  stdio: 'inherit',
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
})
await writeFile(
  'artifacts/next-check.json',
  JSON.stringify({ version: pkg.version, next: fixture.dependencies.next, consumer, result: 'passed' }, null, 2),
)
console.log(`Next.js package build passed: ${consumer}`)
