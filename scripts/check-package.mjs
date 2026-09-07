import { execFileSync } from 'node:child_process'
import { mkdtemp, readFile, writeFile, copyFile, mkdir } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import assert from 'node:assert/strict'
const pkg = JSON.parse(await readFile('package.json', 'utf8'))
execFileSync('pnpm', ['pack', '--pack-destination', 'artifacts'], { stdio: 'inherit' })
const filename = `convert-product-ui-${pkg.version}.tgz`
const archive = resolve('artifacts', filename)
const entries = execFileSync('tar', ['-tzf', archive], { encoding: 'utf8' }).trim().split('\n')
assert(
  entries.every((name) => !/local-fonts|node_modules|\.(woff2?|ttf)|reference-baseline|\.stories\./.test(name)),
  'Package includes private fonts or development material',
)
for (const required of ['dist/index.js', 'dist/index.d.ts', 'dist/styles.css', 'dist/tokens.css', 'dist/tokens.js'])
  assert(entries.includes(`package/${required}`), `Missing ${required}`)
assert(
  (await readFile('dist/components/primitives/select.js', 'utf8')).includes("'use client'"),
  'Select client boundary was lost',
)
const consumer = await mkdtemp(join(tmpdir(), 'convert-product-ui-consumer-'))
await copyFile(archive, join(consumer, filename))
await writeFile(
  join(consumer, 'package.json'),
  JSON.stringify({
    name: 'convert-product-ui-consumer-check',
    private: true,
    type: 'module',
    dependencies: {
      '@convert/product-ui': `file:./${filename}`,
      react: pkg.devDependencies.react,
      'react-dom': pkg.devDependencies['react-dom'],
    },
    devDependencies: {
      vite: pkg.devDependencies.vite,
      '@vitejs/plugin-react': pkg.devDependencies['@vitejs/plugin-react'],
    },
  }),
)
execFileSync('pnpm', ['install', '--ignore-scripts', '--store-dir', '/private/tmp/convert-product-ui-pnpm-store'], {
  cwd: consumer,
  stdio: 'inherit',
})
await writeFile(
  join(consumer, 'verify.mjs'),
  `import assert from 'node:assert/strict';import{createElement}from'react';import{renderToString}from'react-dom/server';import{Card,Select}from'@convert/product-ui';import{tokens}from'@convert/product-ui/tokens';import{readFileSync}from'node:fs';const html=renderToString(createElement(Card,{heading:'Installed package'},createElement(Select,{label:'Project view',options:[{value:'all',label:'All projects'}]})));assert(html.includes('Installed package'));assert(html.includes('<select'));assert.equal(tokens['surface.page'],'#faf9f7');const css=readFileSync(new URL(import.meta.resolve('@convert/product-ui/styles.css')),'utf8');assert(css.includes('.cui-card'));console.log('Packed consumer: React render, token export and compiled CSS passed.');`,
)
execFileSync(process.execPath, ['verify.mjs'], { cwd: consumer, stdio: 'inherit' })
for (const file of ['index.html', 'main.tsx', 'vite.config.ts'])
  await copyFile(`examples/react/${file}`, join(consumer, file))
execFileSync('pnpm', ['exec', 'vite', 'build'], { cwd: consumer, stdio: 'inherit' })
await mkdir('artifacts', { recursive: true })
await writeFile(
  'artifacts/package-check.json',
  JSON.stringify({ version: pkg.version, archive, entries: entries.length, consumer, result: 'passed' }, null, 2),
)
console.log(`Verified ${entries.length} package files. Consumer fixture: ${consumer}`)
