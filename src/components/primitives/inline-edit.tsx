'use client'
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'

export interface InlineEditRenderProps {
  /** Call with the new value once the editor is ready to save. Skips onSave and closes immediately if unchanged. */
  commit: (value: string | null) => Promise<void>
  /** Close the editor without saving. */
  cancel: () => void
  saving: boolean
}
export interface InlineEditProps {
  value: string | null
  /** Shown instead of `value` while not editing, e.g. a resolved name for a stored id. Falls back to `value`. */
  displayValue?: string
  placeholder?: string
  disabled?: boolean
  /** Accessible name for the field, e.g. "PM" — announced as "Edit PM". */
  label: string
  onSave: (value: string | null) => Promise<void>
  /** Renders the actual control (a select, textarea, date input, ...) once editing starts. */
  children: (props: InlineEditRenderProps) => ReactNode
}
/**
 * A click-to-edit field for a table cell or detail row: the application supplies the actual
 * control (a native select, textarea, date input, ...) since that varies per field, and this only
 * owns the shared shell — the trigger, focusing the control on open, Escape to cancel, and
 * disabling it while `onSave` is pending. Saving, validation and persistence stay the application's.
 */
export function InlineEdit({
  value,
  displayValue,
  placeholder = '—',
  disabled = false,
  label,
  onSave,
  children,
}: InlineEditProps) {
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editing) {
      containerRef.current?.querySelector<HTMLElement>('input, textarea, select')?.focus()
    }
  }, [editing])

  const display = displayValue ?? value ?? placeholder

  if (disabled) {
    return <span className="cui-inline-edit-display">{display}</span>
  }

  if (editing) {
    async function commit(next: string | null) {
      if (next === value) {
        setEditing(false)
        return
      }
      setSaving(true)
      await onSave(next)
      setSaving(false)
      setEditing(false)
    }
    function cancel() {
      setEditing(false)
    }
    function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
      if (event.key === 'Escape') {
        event.preventDefault()
        cancel()
      }
    }
    return (
      // This div is never itself a tab stop; it only catches Escape bubbling up from the actual
      // control the application renders as `children`, which owns its own interactivity.
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions
      <div ref={containerRef} className="cui-inline-edit-editor" onKeyDown={onKeyDown}>
        {children({ commit, cancel, saving })}
      </div>
    )
  }

  return (
    <button
      type="button"
      className="cui-inline-edit-trigger"
      onClick={() => setEditing(true)}
      title={`Edit ${label}`}
      aria-label={`Edit ${label}: ${display}`}
    >
      {display}
    </button>
  )
}
