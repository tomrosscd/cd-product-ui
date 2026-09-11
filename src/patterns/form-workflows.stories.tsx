import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'
import { Wizard } from './wizard'
import { FileUpload, type UploadAttachment } from '../components/primitives/file-upload'
import { Input } from '../components/primitives/fields'
const meta = { title: 'Patterns/Form workflows', tags: ['autodocs'] } satisfies Meta
export default meta
type Story = StoryObj<typeof meta>
export const RegistrationSteps: Story = {
  render: function Demo() {
    const [activeId, setActiveId] = useState('details')
    const [complete, setComplete] = useState(false)
    const [name, setName] = useState('')
    return complete ? (
      <p role="status">Example complete. No data was sent.</p>
    ) : (
      <Wizard
        steps={[
          { id: 'details', label: 'Details' },
          { id: 'review', label: 'Review' },
        ]}
        activeId={activeId}
        onNext={() => (activeId === 'details' ? setActiveId('review') : setComplete(true))}
        onBack={activeId === 'review' ? () => setActiveId('details') : undefined}
        nextLabel={activeId === 'review' ? 'Confirm' : 'Continue'}
      >
        {activeId === 'details' ? (
          <Input label="Name" value={name} onChange={(event) => setName(event.target.value)} required />
        ) : (
          <p>Confirm {name}.</p>
        )}
      </Wizard>
    )
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    await userEvent.click(c.getByRole('button', { name: 'Continue' }))
    await expect(c.getByRole('heading', { name: 'Details' })).toBeVisible()
    await userEvent.type(c.getByLabelText('Name (required)'), 'Sample record')
    await userEvent.click(c.getByRole('button', { name: 'Continue' }))
    await expect(c.getByRole('heading', { name: 'Review' })).toHaveFocus()
    await userEvent.click(c.getByRole('button', { name: 'Back' }))
    await expect(c.getByLabelText('Name (required)')).toHaveValue('Sample record')
    await userEvent.click(c.getByRole('button', { name: 'Continue' }))
    await userEvent.click(c.getByRole('button', { name: 'Confirm' }))
    await expect(c.getByRole('status')).toHaveTextContent('Example complete')
  },
}
export const UploadStates: Story = {
  render: function Demo() {
    const [items, setItems] = useState<UploadAttachment[]>([
      { id: 'a', name: 'Sample report.pdf', state: 'complete' },
      { id: 'b', name: 'Sample image.png', state: 'uploading', progress: 40 },
      { id: 'c', name: 'Sample notes.txt', state: 'error', error: 'Transfer interrupted.' },
    ])
    return (
      <FileUpload
        label="Attachments"
        hint="Synthetic examples. No files leave your browser."
        multiple
        attachments={items}
        onFilesSelected={(files) =>
          setItems((previous) => [
            ...previous,
            ...files.map((file, index) => ({
              id: `${previous.length}-${index}`,
              name: file.name,
              state: 'queued' as const,
            })),
          ])
        }
        onRetry={(id) =>
          setItems((previous) =>
            previous.map((item) => (item.id === id ? { ...item, state: 'queued', error: undefined } : item)),
          )
        }
        onRemove={(id) => setItems((previous) => previous.filter((item) => item.id !== id))}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    await userEvent.upload(
      c.getByLabelText('Attachments'),
      new File(['Synthetic text'], 'sample.txt', { type: 'text/plain' }),
    )
    await expect(c.getByText('sample.txt')).toBeVisible()
    await userEvent.click(c.getByRole('button', { name: 'Retry Sample notes.txt' }))
    await expect(c.queryByText('Transfer interrupted.')).not.toBeInTheDocument()
    await userEvent.click(c.getByRole('button', { name: 'Remove sample.txt' }))
    await expect(c.queryByText('sample.txt')).not.toBeInTheDocument()
  },
}
export const SavingStep: Story = {
  render: () => (
    <Wizard
      steps={[{ id: 'one', label: 'Save' }]}
      activeId="one"
      loading
      onNext={() => {}}
      onBack={() => {}}
      onCancel={() => {}}
    >
      <Input label="Name" defaultValue="Sample" />
    </Wizard>
  ),
}
export const FailedStep: Story = {
  render: () => (
    <Wizard
      steps={[{ id: 'one', label: 'Save' }]}
      activeId="one"
      error="Could not save. Try again."
      onNext={() => {}}
      onCancel={() => {}}
    >
      <Input label="Name" defaultValue="Sample" />
    </Wizard>
  ),
}
