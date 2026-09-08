'use client'
import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { Badge, type BadgeTone } from '../components/primitives/badge.js'
import { Select, type SelectOption } from '../components/primitives/select.js'
import { Checkbox } from '../components/primitives/fields.js'
import { EmptyState, Spinner, Alert } from '../components/primitives/feedback.js'
import { TextLink } from '../components/primitives/text-link.js'
import { Button } from '../components/primitives/button.js'
export interface RoadmapItem {
  id: string
  title: string
  stage: string
  category?: string
  categoryTone?: BadgeTone
  description?: string
  supportingText?: string
  estimate?: string
  priority?: boolean
  disabled?: boolean
  href?: string
}
export interface RoadmapColumn {
  id: string
  label: string
}
export interface RoadmapCardProps {
  item: RoadmapItem
  stages: readonly SelectOption[]
  selectId?: string
  onStageChange?: (stage: string) => void
  onPriorityChange?: (priority: boolean) => void
}
export function RoadmapCard({ item, stages, selectId, onStageChange, onPriorityChange }: RoadmapCardProps) {
  return (
    <article className="cui-root cui-roadmap-card">
      {item.category && (
        <div>
          <Badge tone={item.categoryTone}>{item.category}</Badge>
        </div>
      )}
      <h3 className="cui-roadmap-title">
        {item.href ? <TextLink href={item.href}>{item.title}</TextLink> : item.title}
      </h3>
      {item.description && <p className="cui-caption cui-secondary">{item.description}</p>}
      {item.supportingText && <p className="cui-caption cui-secondary">{item.supportingText}</p>}
      {item.estimate && <p>{item.estimate}</p>}
      <Select
        id={selectId}
        label="Stage"
        aria-label={`Stage for ${item.title}`}
        options={stages}
        value={item.stage}
        disabled={item.disabled || !onStageChange}
        onChange={(event) => onStageChange?.(event.target.value)}
      />
      <Checkbox
        label="Prioritise next"
        aria-label={`Prioritise next: ${item.title}`}
        checked={item.priority || false}
        disabled={item.disabled || !onPriorityChange}
        onChange={(event) => onPriorityChange?.(event.target.checked)}
      />
    </article>
  )
}
export interface RoadmapBoardProps {
  title: string
  columns: readonly RoadmapColumn[]
  items: readonly RoadmapItem[]
  actions?: ReactNode
  onStageChange?: (id: string, stage: string) => void
  onPriorityChange?: (id: string, priority: boolean) => void
  state?: 'ready' | 'loading' | 'error'
  onRetry?: () => void
}
/** Controlled board. Applications own saved state, workflow rules and permissions. */
export function RoadmapBoard({
  title,
  columns,
  items,
  actions,
  onStageChange,
  onPriorityChange,
  state = 'ready',
  onRetry,
}: RoadmapBoardProps) {
  const id = useId()
  const [filter, setFilter] = useState('')
  const [announcement, setAnnouncement] = useState('')
  const pendingFocus = useRef<string | null>(null)
  const container = useRef<HTMLDivElement>(null)
  const known = new Set(columns.map((column) => column.id))
  const extra = [...new Set(items.filter((item) => !known.has(item.stage)).map((item) => item.stage))].map((stage) => ({
    id: stage,
    label: `Unassigned: ${stage || 'no stage'}`,
  }))
  const allColumns = [...columns, ...extra]
  const visible = allColumns.filter((column) => !filter || filter === column.id)
  const options = allColumns.map((column) => ({ value: column.id, label: column.label }))
  useEffect(() => {
    if (pendingFocus.current) {
      const doc = container.current?.ownerDocument
      const target = doc?.getElementById(pendingFocus.current) || doc?.getElementById(`${id}-filter`)
      target?.focus()
      pendingFocus.current = null
    }
  }, [items, id])
  return (
    <div className="cui-root cui-roadmap cui-stack" ref={container}>
      <div className="cui-roadmap-toolbar">
        <h2 className="cui-card-heading">{title}</h2>
        <Select
          id={`${id}-filter`}
          label="Show stage"
          options={[{ value: '', label: 'All stages' }, ...options.filter((option) => option.value !== '')]}
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        />
        <div className="cui-row">{actions}</div>
      </div>
      <p className="cui-board-hint cui-caption cui-secondary">
        Choose a stage or scroll across to explore the roadmap.
      </p>
      <p role="status" className="cui-sr-only">
        {announcement}
      </p>
      {state === 'loading' ? (
        <Spinner label="Loading roadmap" />
      ) : state === 'error' ? (
        <Alert title="Roadmap could not be loaded" tone="error">
          {onRetry ? <Button onClick={onRetry}>Try again</Button> : 'Try again later.'}
        </Alert>
      ) : (
        <div
          className="cui-board-scroll"
          tabIndex={0}
          role="region"
          aria-label={`${title} columns, scroll horizontally to view more`}
        >
          <div className="cui-board-columns">
            {visible.map((column) => {
              const entries = items.filter((item) => item.stage === column.id)
              return (
                <section key={column.id} className="cui-board-column" aria-label={column.label}>
                  <header className="cui-board-column-head">
                    <h3>{column.label}</h3>
                    <span
                      className="cui-secondary"
                      aria-label={`${entries.length} ${entries.length === 1 ? 'item' : 'items'}`}
                    >
                      {entries.length}
                    </span>
                  </header>
                  {entries.length === 0 ? (
                    <EmptyState title="No items yet" />
                  ) : (
                    entries.map((item) => (
                      <RoadmapCard
                        key={item.id}
                        item={item}
                        stages={options}
                        selectId={`${id}-${item.id}-stage`}
                        onStageChange={
                          onStageChange
                            ? (stage) => {
                                pendingFocus.current = `${id}-${item.id}-stage`
                                onStageChange(item.id, stage)
                                setAnnouncement(
                                  `Stage change requested for ${item.title}: ${allColumns.find((c) => c.id === stage)?.label || stage}.`,
                                )
                              }
                            : undefined
                        }
                        onPriorityChange={
                          onPriorityChange ? (priority) => onPriorityChange(item.id, priority) : undefined
                        }
                      />
                    ))
                  )}
                </section>
              )
            })}
            {visible.length === 0 && <EmptyState title="No stages available" />}
          </div>
        </div>
      )}
    </div>
  )
}
