import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useState } from 'react'
import {
  Input,
  PasswordInput,
  Checkbox,
  Progress,
  Metric,
  TextLink,
  SignInForm,
  RoadmapBoard,
  DataTable,
} from '../src/index.js'
describe('expanded component contracts', () => {
  it('associates explicit IDs, multiple descriptions and validation on inputs', () => {
    render(
      <>
        <p id="external">External description</p>
        <Input
          id="email"
          label="Work email"
          hint="Use your work account."
          error="Enter an email address."
          aria-describedby="external"
          required
        />
      </>,
    )
    const field = screen.getByLabelText('Work email (required)')
    expect(field.id).toBe('email')
    expect(field.getAttribute('aria-describedby')).toBe('external email-hint email-error')
    expect(field.getAttribute('aria-invalid')).toBe('true')
  })
  it('preserves form values and does not submit when revealing a password', () => {
    const submit = vi.fn((e) => e.preventDefault())
    render(
      <form aria-label="Account" onSubmit={submit}>
        <Input name="email" label="Email" defaultValue="demo@example.com" />
        <PasswordInput name="password" label="Password" defaultValue="Example only" />
        <Checkbox name="notify" label="Notify me" defaultChecked />
      </form>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Show password' }))
    expect(submit).not.toHaveBeenCalled()
    const data = new FormData(screen.getByRole('form') as HTMLFormElement)
    expect(data.get('email')).toBe('demo@example.com')
    expect(data.get('password')).toBe('Example only')
    expect(data.get('notify')).toBe('on')
  })
  it('reports progress past the maximum honestly and omits the current value for unknown progress', () => {
    // This asserted clamping to 100 until 0.8.0. Capping meant 150 of 100 and 100 of 100 produced
    // an identical reading, which is a false number rather than a display quirk.
    const { rerender } = render(<Progress label="Review" value={150} max={100} />)
    const over = screen.getByRole('progressbar')
    expect(over.getAttribute('aria-valuenow')).toBe('150')
    // valuemax widens with the value so valuenow stays inside the range ARIA requires.
    expect(over.getAttribute('aria-valuemax')).toBe('150')
    expect(over.getAttribute('aria-valuetext')).toBe('150% of 100')
    expect(screen.getByText('150%')).toBeTruthy()
    expect(over.parentElement?.className).toContain('cui-progress-over')

    // At or below the maximum nothing moved: same valuenow, same valuemax, no overflow marker.
    rerender(<Progress label="Review" value={65} max={100} />)
    const within = screen.getByRole('progressbar')
    expect(within.getAttribute('aria-valuenow')).toBe('65')
    expect(within.getAttribute('aria-valuemax')).toBe('100')
    expect(within.hasAttribute('aria-valuetext')).toBe(false)
    expect(within.parentElement?.className).not.toContain('cui-progress-over')

    rerender(<Progress label="Review" />)
    expect(screen.getByRole('progressbar').hasAttribute('aria-valuenow')).toBe(false)
  })
  it('keeps increased values independent of positive sentiment', () => {
    render(<Metric value="18" comparison={{ label: '3 more minutes', direction: 'up', sentiment: 'negative' }} />)
    expect(screen.getByText('3 more minutes').className).toContain('cui-negative')
    expect(screen.getByText('Increased:')).toBeTruthy()
  })
  it('announces new-tab links and preserves supplied rel tokens', () => {
    render(
      <TextLink href="https://example.com" target="_blank" rel="nofollow">
        Source
      </TextLink>,
    )
    const link = screen.getByRole('link')
    expect(link.textContent).toContain('opens in a new tab')
    expect(link.getAttribute('rel')).toBe('nofollow noopener noreferrer')
  })
  it('prevents a loading sign-in from calling the host handler', () => {
    const submit = vi.fn()
    render(<SignInForm loading onSubmit={submit} />)
    fireEvent.submit(screen.getByRole('form'))
    expect(submit).not.toHaveBeenCalled()
  })
  it('keeps an unknown roadmap stage visible rather than losing its item', () => {
    render(
      <RoadmapBoard
        heading="Roadmap"
        columns={[{ id: 'ideas', label: 'Ideas' }]}
        items={[{ id: '1', title: 'Review the guide', stage: 'missing' }]}
      />,
    )
    expect(screen.getByRole('region', { name: 'Unassigned: missing' })).toBeTruthy()
    expect(screen.getByText('Review the guide')).toBeTruthy()
  })
  it('returns focus to the board filter when a moved item leaves that view', () => {
    function Board() {
      const [items, setItems] = useState([{ id: '1', title: 'Review the guide', stage: 'ideas' }])
      return (
        <RoadmapBoard
          heading="Roadmap"
          columns={[
            { id: 'ideas', label: 'Ideas' },
            { id: 'ready', label: 'Ready' },
          ]}
          items={items}
          onStageChange={(id, stage) => setItems([{ id, title: 'Review the guide', stage }])}
        />
      )
    }
    render(<Board />)
    fireEvent.change(screen.getByRole('combobox', { name: 'Show stage' }), { target: { value: 'ideas' } })
    fireEvent.change(screen.getByRole('combobox', { name: 'Stage for Review the guide' }), {
      target: { value: 'ready' },
    })
    expect(document.activeElement).toBe(screen.getByRole('combobox', { name: 'Show stage' }))
    expect(screen.queryByText('Review the guide')).toBeNull()
  })
  it('sorts numbers numerically and renders the selected page', () => {
    render(
      <DataTable
        caption="Estimates"
        data={[{ hours: 40 }, { hours: 8 }, { hours: 12 }]}
        columns={[{ accessorKey: 'hours', header: 'Hours' }]}
        pageSize={2}
        searchable={false}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: /Hours/ }))
    expect(screen.getAllByRole('cell').map((cell) => cell.textContent)).toEqual(['8', '12'])
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getAllByRole('cell').map((cell) => cell.textContent)).toEqual(['40'])
  })
})
