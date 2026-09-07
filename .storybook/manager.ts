import { addons } from 'storybook/manager-api'
import { create } from 'storybook/theming'
import { tokens } from '../src/tokens.js'
addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Convert Product UI',
    colorPrimary: tokens['accent.primary'],
    colorSecondary: tokens['accent.primary'],
    appBg: tokens['surface.page'],
    appContentBg: tokens['surface.card'],
    appBorderColor: tokens['border.subtle'],
    textColor: tokens['text.primary'],
    fontBase: tokens['font.sans'],
  }),
})
