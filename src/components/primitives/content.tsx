'use client'
import { useState, type ReactNode } from 'react'
import { TextLink } from './text-link.js'
export interface KeyValueItem {
  label: string
  value: ReactNode
}
export function KeyValueList({ items }: { items: readonly KeyValueItem[] }) {
  return (
    <dl className="cui-root cui-key-values">
      {items.map((item, i) => (
        <div key={i}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
export function Avatar({ name, src, size = 'medium' }: { name: string; src?: string; size?: 'small' | 'medium' }) {
  const [failedSource, setFailedSource] = useState<string>()
  const initials =
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase() || '?'
  return (
    <span className={`cui-avatar cui-avatar-${size}`} role="img" aria-label={name}>
      {src && failedSource !== src ? <img src={src} alt="" onError={() => setFailedSource(src)} /> : initials}
    </span>
  )
}
export interface ResourceItem {
  title: string
  description?: string
  href: string
  external?: boolean
}
export function ResourceList({ items, label = 'Resources' }: { items: readonly ResourceItem[]; label?: string }) {
  return (
    <ul className="cui-root cui-resource-list" aria-label={label}>
      {items.map((item, i) => (
        <li key={i}>
          <TextLink href={item.href} external={item.external} variant="standalone">
            {item.title}
          </TextLink>
          {item.description && <p className="cui-secondary">{item.description}</p>}
        </li>
      ))}
    </ul>
  )
}
export interface ActivityItem {
  id: string
  title: string
  description?: string
  dateTime: string
  dateLabel: string
  leading?: ReactNode
}
export function ActivityList({ items, label = 'Activity' }: { items: readonly ActivityItem[]; label?: string }) {
  return (
    <ol className="cui-root cui-activity-list" aria-label={label}>
      {items.map((item) => (
        <li key={item.id}>
          {item.leading}
          <div className="cui-stack">
            <strong>{item.title}</strong>
            {item.description && <p className="cui-secondary">{item.description}</p>}
            <time dateTime={item.dateTime} className="cui-caption cui-secondary">
              {item.dateLabel}
            </time>
          </div>
        </li>
      ))}
    </ol>
  )
}
