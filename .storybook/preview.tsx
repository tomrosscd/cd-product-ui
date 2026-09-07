import type { Preview } from '@storybook/react-vite'
import '../src/styles/index.css'
import './preview.css'
const preview: Preview = {
  parameters: {
    layout: 'padded',
    a11y: { test: 'error' },
    controls: { expanded: true },
    options: {
      storySort: {
        order: [
          'Start here',
          ['Welcome', 'Using the library'],
          'Foundations',
          ['Tokens', 'Design rules'],
          'Components',
          ['Card', 'Select', 'Dashboard sidebar', 'Button'],
          'Patterns',
          'Contributing',
        ],
      },
    },
    viewport: {
      options: {
        mobile: { name: 'Mobile · 390px', styles: { width: '390px', height: '844px' }, type: 'mobile' },
        tablet: { name: 'Tablet · 768px', styles: { width: '768px', height: '1024px' }, type: 'tablet' },
        desktop: { name: 'Desktop · 1440px', styles: { width: '1440px', height: '1000px' }, type: 'desktop' },
      },
    },
  },
  decorators: [
    (Story, context) => (
      <div className={`cui-root ${context.parameters.layout === 'fullscreen' ? '' : 'cui-story-frame'}`}>
        <Story />
      </div>
    ),
  ],
}
export default preview
