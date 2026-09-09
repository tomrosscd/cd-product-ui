import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { NotificationCentre, type NotificationItem } from './notification-centre.js'
import { Icon } from './icon.js'
import { TextLink } from './text-link.js'

const seedItems: NotificationItem[] = [
  {
    id: '1',
    title: 'Solution Architects over-allocated',
    description: '128% booked for week of 15 Sep',
    timestamp: '2 hours ago',
    read: false,
    href: '#allocations/solution-architect',
    icon: <Icon name="status" />,
  },
  {
    id: '2',
    title: 'Vets Love Pets - Lyppard launching soon',
    description: 'Launch held at 2026-W31',
    timestamp: '5 hours ago',
    read: false,
    href: '#projects/pw-118',
    icon: <Icon name="clock" />,
  },
  {
    id: '3',
    title: 'Invoice overdue',
    description: '$4,200 — Beacon Lighting',
    timestamp: 'Yesterday',
    read: true,
    href: '#invoicing',
    icon: <Icon name="status" />,
  },
]

const meta = {
  title: 'Components/Notification centre',
  component: NotificationCentre,
  tags: ['autodocs'],
  args: { items: seedItems },
  parameters: {
    docs: {
      description: {
        component:
          "Presentation only, like every other component here: fetching notifications, marking them read and any realtime subscription stay with the consuming application. The unread badge on the trigger is derived from items[].read rather than a separate count prop, so it can never disagree with the list. Per-item icon and pre-formatted timestamp are supplied by the application — the notification-type taxonomy and relative-time formatting are both real dependency/business decisions, not this library's to make.",
      },
    },
  },
} satisfies Meta<typeof NotificationCentre>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: function Demo() {
    const [items, setItems] = useState(seedItems)
    return (
      <NotificationCentre
        items={items}
        onItemClick={(item) => setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, read: true } : i)))}
        onMarkAllRead={() => setItems((prev) => prev.map((i) => ({ ...i, read: true })))}
        footer={
          <TextLink href="#settings/notifications" variant="standalone">
            Notification preferences
          </TextLink>
        }
      />
    )
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    const trigger = c.getByRole('button', { name: 'Notifications (2 unread)' })
    await userEvent.click(trigger)
    const panel = await waitFor(() => within(canvasElement.ownerDocument.body).getByRole('dialog'))
    const item = within(panel).getByText('Solution Architects over-allocated')
    await expect(item).toBeVisible()

    // Clicking a link item marks it read (via onItemClick) and closes the panel — matches the
    // real consumer's own behaviour, which this component's design is drawn directly from. The
    // item is a real <a href>, so drop the href just before clicking: a real browser (unlike
    // jsdom) actually follows it, tearing down this very test's page mid-run. Using
    // preventDefault instead would stop that navigation but also stop Radix's own Popover.Close
    // handler, which composes onClick handlers and skips its close logic when defaultPrevented
    // is already set.
    item.closest('a')?.removeAttribute('href')
    await userEvent.click(item)
    await waitFor(() => {
      if (canvasElement.ownerDocument.body.querySelector('[role="dialog"]')) throw new Error('did not close')
    })
    await expect(c.getByRole('button', { name: 'Notifications (1 unread)' })).toBeInTheDocument()
  },
}

export const AllRead: Story = {
  args: { items: seedItems.map((item) => ({ ...item, read: true })) },
}

export const Empty: Story = {
  args: { items: [] },
}

export const MarkAllRead: Story = {
  render: function Demo() {
    const [items, setItems] = useState(seedItems)
    return (
      <NotificationCentre
        items={items}
        onMarkAllRead={() => setItems((prev) => prev.map((i) => ({ ...i, read: true })))}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const c = within(canvasElement)
    await userEvent.click(c.getByRole('button', { name: 'Notifications (2 unread)' }))
    const panel = await waitFor(() => within(canvasElement.ownerDocument.body).getByRole('dialog'))
    await userEvent.click(within(panel).getByText('Mark all read'))
    await waitFor(async () => {
      await expect(c.getByRole('button', { name: 'Notifications' })).toBeInTheDocument()
    })
  },
}
