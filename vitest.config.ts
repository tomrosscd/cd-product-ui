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
