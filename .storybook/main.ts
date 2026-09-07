import { existsSync } from 'node:fs'
import type { StorybookConfig } from '@storybook/react-vite'
const config: StorybookConfig = {
  stories: ['../docs/**/*.mdx', '../docs/**/*.stories.tsx', '../src/**/*.stories.tsx'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-vitest'],
  framework: '@storybook/react-vite',
  staticDirs: existsSync('local-fonts') ? [{ from: '../local-fonts', to: '/local-fonts' }] : [],
  core: { disableTelemetry: true },
}
export default config
