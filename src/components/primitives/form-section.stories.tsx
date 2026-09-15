import type { Meta, StoryObj } from '@storybook/react-vite'
import { FormSection } from './form-section.js'
import { Grid, Stack } from './layout.js'
import { Input, Textarea } from './fields.js'
import { Select } from './select.js'
import { Chip } from './chip.js'
const meta = {
  title: 'Components/FormSection',
  component: FormSection,
  tags: ['autodocs'],
  args: { heading: 'Identity', children: 'Compose Grid or Stack here for the field arrangement.' },
  parameters: {
    docs: {
      description: {
        component:
          'Labels a group of fields or read-only values inside a longer form or record-review layout. FormSection only supplies the heading and the rule beneath it — compose Grid or Stack inside for the actual field arrangement, and stack multiple FormSections with Stack for the gap between them.',
      },
    },
  },
} satisfies Meta<typeof FormSection>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {
  render: (args) => (
    <FormSection {...args}>
      <Grid columns={2} gap={16}>
        <Input label="Project name" placeholder="e.g. Broncos Shopify" />
        <Input label="Project key" placeholder="e.g. BRO0001" />
      </Grid>
    </FormSection>
  ),
}
/** A stepped form typically has several sections in sequence. Wrap them in a Stack for the gap
 *  between sections; FormSection itself only manages the heading and the space directly below it. */
export const MultipleSections: Story = {
  render: () => (
    <Stack gap={32}>
      <FormSection heading="Identity">
        <Grid columns={2} gap={16}>
          <Input label="Project name" placeholder="e.g. Broncos Shopify" />
          <Input label="Project key" placeholder="e.g. BRO0001" />
          <Select label="Platform" options={[{ value: 'shopify', label: 'Shopify' }]} />
          <Select label="Phase" required options={[{ value: 'discovery', label: 'Discovery' }]} />
        </Grid>
      </FormSection>
      <FormSection heading="Team">
        <Grid columns={2} gap={16}>
          <Select label="PM" options={[{ value: 'none', label: 'None' }]} />
          <Select label="FE lead" options={[{ value: 'none', label: 'None' }]} />
          <Select label="BE lead" options={[{ value: 'none', label: 'None' }]} />
          <Select label="Solution" options={[{ value: 'none', label: 'None' }]} />
        </Grid>
      </FormSection>
      <FormSection heading="Skills needed">
        <div className="cui-row">
          {['CommerceTools', 'Headless', 'Integration', 'Liquid', 'Shopify'].map((skill) => (
            <Chip key={skill} label={skill} />
          ))}
        </div>
      </FormSection>
    </Stack>
  ),
}
/** Read-only values work the same way as fields — FormSection groups a record's fields for
 *  review, for example a change request's before/after summary, without implying an editable form. */
export const ReadOnlyValues: Story = {
  render: () => (
    <FormSection heading="Change request" description="Submitted 15 September 2026">
      <Grid columns={2} gap={16}>
        <Stack gap={4}>
          <span className="cui-caption cui-secondary">Project</span>
          <span>Broncos Shopify</span>
        </Stack>
        <Stack gap={4}>
          <span className="cui-caption cui-secondary">Requested by</span>
          <span>tom@convertdigital.com.au</span>
        </Stack>
      </Grid>
      <Textarea label="Reason" readOnly defaultValue="Client moved the launch date by two weeks." />
    </FormSection>
  ),
}
