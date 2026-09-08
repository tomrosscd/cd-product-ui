// Builds Storybook for public deployment. Two safeguards, both required:
// 1. CUI_PUBLIC_BUILD=true forces .storybook/main.ts to exclude local-fonts regardless of what's
//    present on the machine running this — see the comment there for why "skip if absent" isn't
//    enough on its own.
// 2. The output directory is deleted first, so a stale local build (made without this flag, on a
//    machine that had local-fonts/ present) can never be reused or merged into a "public" build.
import { rmSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

const outDir = 'storybook-static'
rmSync(outDir, { recursive: true, force: true })

const result = spawnSync('pnpm', ['exec', 'storybook', 'build', '--disable-telemetry'], {
  stdio: 'inherit',
  env: { ...process.env, CUI_PUBLIC_BUILD: 'true' },
  shell: process.platform === 'win32',
})
process.exit(result.status ?? 1)
