import * as a11y from '@storybook/addon-a11y/preview'
import { setProjectAnnotations } from '@storybook/react-vite'
import * as project from './preview'
setProjectAnnotations([a11y, project])
