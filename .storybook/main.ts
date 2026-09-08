import { existsSync } from 'node:fs'
import type { StorybookConfig } from '@storybook/react-vite'
const config: StorybookConfig = {
  stories: ['../docs/**/*.mdx', '../docs/**/*.stories.tsx', '../src/**/*.stories.tsx'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-vitest'],
  framework: '@storybook/react-vite',
  // CUI_PUBLIC_BUILD forces licensed local fonts out of the build regardless of what's present on
  // the machine building it. This must stay a hard override, not just "skip if absent" — a public
  // deploy running on a machine that happens to have local-fonts/ checked out (any contributor's
  // laptop) would otherwise silently bundle real licensed font binaries into public output.
  staticDirs: [
    { from: '../assets/brand', to: '/brand-assets' },
    ...(process.env.CUI_PUBLIC_BUILD !== 'true' && existsSync('local-fonts')
      ? [{ from: '../local-fonts', to: '/local-fonts' }]
      : []),
  ],
  core: { disableTelemetry: true },
  viteFinal: async (config) => ({
    ...config,
    optimizeDeps: {
      ...config.optimizeDeps,
      include: [...(config.optimizeDeps?.include || []), 'recharts', '@tanstack/react-table'],
    },
  }),
}
export default config
