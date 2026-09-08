import { defineConfig } from 'vitest/config'
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin'
import { playwright } from '@vitest/browser-playwright'
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/*.stories.tsx', 'src/tokens.ts'],
      // A regression floor, not a target: a few points below the actual baseline (~96/86/93/96 as
      // of 0.5.0) so a real drop in coverage fails CI without blocking routine work at the current
      // level. Branches sits furthest below the others because most components render fully in a
      // story even without exercising every conditional branch — see ROADMAP.md section 5.
      thresholds: { statements: 90, branches: 80, functions: 85, lines: 90 },
    },
    projects: [
      {
        test: {
          name: 'unit',
          include: ['tests/**/*.test.{ts,tsx}'],
          environment: 'jsdom',
          setupFiles: ['tests/setup.ts'],
        },
      },
      {
        plugins: [storybookTest({ configDir: '.storybook' })],
        optimizeDeps: { include: ['recharts', '@tanstack/react-table'] },
        test: {
          name: 'storybook',
          browser: { enabled: true, headless: true, provider: playwright(), instances: [{ browser: 'chromium' }] },
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
      },
    ],
  },
})
