// Independent, synthetic framework fixtures. Never execute this in a consumer checkout.
import { execFileSync, spawn } from 'node:child_process'
import { mkdtemp, readFile, writeFile, copyFile, cp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { createRequire } from 'node:module'
import { createServer } from 'node:net'
import assert from 'node:assert/strict'
import { chromium } from 'playwright'
import { checkedArchive } from './checked-archive.mjs'
const pkg = JSON.parse(await readFile('package.json', 'utf8'))
const root = await mkdtemp(join(tmpdir(), 'cui-compatibility-'))
const example = JSON.parse(await readFile('examples/next/package.json', 'utf8'))
await cp('examples/next', root, {
  recursive: true,
  filter: (path) => !path.split('/').some((part) => ['node_modules', '.next'].includes(part)),
})
const archiveName = `convert-product-ui-${pkg.version}.tgz`
await copyFile(await checkedArchive(pkg.version), join(root, archiveName))
example.dependencies['@convert/product-ui'] = `file:./${archiveName}`
example.dependencies.next = '15.5.25'
example.devDependencies = {
  ...example.devDependencies,
  tailwindcss: '4.3.3',
  '@tailwindcss/postcss': '4.3.3',
  postcss: '8.5.28',
  tailwind3: 'npm:tailwindcss@3.4.19',
}
example.scripts.build = 'next build'
await writeFile(join(root, 'package.json'), JSON.stringify(example, null, 2))
await writeFile(join(root, 'postcss.config.mjs'), "export default { plugins: { '@tailwindcss/postcss': {} } }\n")
await writeFile(
  join(root, 'app/globals.css'),
  '@import "tailwindcss";\n.host-control { border: 7px solid blue; padding: 8px; }\n',
)
const layoutPath = join(root, 'app/layout.tsx')
await writeFile(layoutPath, "import './globals.css'\n" + (await readFile(layoutPath, 'utf8')))
const pagePath = join(root, 'app/page.tsx')
await writeFile(
  pagePath,
  (await readFile(pagePath, 'utf8')).replace(
    '<ClientExample />',
    '<button className="host-control">Host control</button><ClientExample />',
  ),
)
const run = (args) =>
  execFileSync('npm', args, { cwd: root, stdio: 'inherit', env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' } })
run(['install', '--ignore-scripts', '--no-audit', '--no-fund'])
run(['ci', '--ignore-scripts', '--no-audit', '--no-fund'])
run(['run', 'build'])
const require = createRequire(join(root, 'package.json'))
const css = await readFile(require.resolve('@convert/product-ui/styles.css'), 'utf8')
await require('postcss')([
  require('tailwind3')({ content: [{ raw: '<div class="cui-card"></div>', extension: 'html' }] }),
]).process(css, { from: undefined })
const probe = createServer()
await new Promise((done) => probe.listen(0, '127.0.0.1', done))
const port = probe.address().port
await new Promise((done) => probe.close(done))
const server = spawn(
  process.execPath,
  ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', String(port)],
  { cwd: root, stdio: 'ignore', env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' } },
)
let browser
try {
  let ready = false
  for (let attempt = 0; attempt < 80; attempt++) {
    try {
      if ((await fetch(`http://127.0.0.1:${port}`)).ok) {
        ready = true
        break
      }
    } catch {
      /* Wait for startup. */
    }
    await new Promise((done) => setTimeout(done, 250))
  }
  assert(ready, 'Synthetic production server did not start')
  browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto(`http://127.0.0.1:${port}`, { waitUntil: 'networkidle' })
  assert(await page.getByRole('heading', { name: 'Server-rendered content' }).isVisible())
  assert(await page.getByText('Weekly completion', { exact: true }).isVisible())
  const border = await page
    .getByRole('button', { name: 'Host control' })
    .evaluate((element) => getComputedStyle(element).borderWidth)
  assert.equal(border, '7px')
  await page.setViewportSize({ width: 320, height: 700 })
  await page.waitForFunction(() => document.documentElement.scrollWidth <= window.innerWidth, undefined, {
    timeout: 5000,
  })
  assert.deepEqual(errors, [])
  await writeFile(
    'artifacts/compatibility-check.json',
    JSON.stringify(
      {
        version: pkg.version,
        root,
        next: example.dependencies.next,
        react: example.dependencies.react,
        tailwind: '4.3.3',
        cssPipeline: 'Tailwind 3.4.19 also passed',
        packageManager: 'npm',
        frozenInstall: 'passed',
        productionBrowser: 'passed',
        hostBorder: border,
        narrowWidth: 320,
      },
      null,
      2,
    ),
  )
} finally {
  await browser?.close()
  server.kill('SIGTERM')
}
console.log(`Independent npm/Next15/Tailwind4 build, runtime and Tailwind3 CSS check passed: ${root}`)
