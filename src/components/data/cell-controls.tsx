'use client'
import { useRef, type ComponentProps, type KeyboardEvent, type ReactNode } from 'react'
import { cn } from '../../lib/classes.js'
import type { ChoiceOption } from '../primitives/option.js'

/**
 * Controls sized to live inside a table cell.
 *
 * The library's other form controls are deliberately wrapped in `Field`, which renders a visible
 * `<label>`. That is right for a form and wrong for a grid, where the column header is already the
 * label and repeating it on every row would be noise. These take the same `label` and put it on
 * `aria-label` instead, so a screen reader still announces the field while the eye reads the header.
 *
 * They are built for a capture mode where every cell is editable at once, so they never change size
 * between resting, hover and focus: the border is always present and only changes colour. A control
 * that grows when you click it makes the row jump and the neighbouring columns shift, which is the
 * single most common complaint about hand-rolled editable tables.
 */
export interface CellControlProps {
  /** Accessible name, usually the column header. Never rendered visibly. */
  label: string
  /** Marks the cell as failing validation. Pair it with a message elsewhere: colour is not a signal on its own. */
  invalid?: boolean
}

const cellClass = (invalid: boolean | undefined, className: string | undefined) =>
  cn('cui-cell-control', invalid && 'cui-cell-control-invalid', className)

export interface CellInputProps extends Omit<ComponentProps<'input'>, 'type' | 'size'>, CellControlProps {
  type?: 'text' | 'number' | 'date' | 'time' | 'url' | 'tel'
}
export function CellInput({ label, invalid, className, type = 'text', ...props }: CellInputProps) {
  return (
    <input
      {...props}
      type={type}
      aria-label={label}
      aria-invalid={invalid || undefined}
      className={cellClass(invalid, className)}
    />
  )
}

export interface CellSelectProps extends Omit<ComponentProps<'select'>, 'children' | 'size'>, CellControlProps {
  options: readonly ChoiceOption[]
  /** Label for the empty choice. Keep it explicit: an empty option with no text reads as a blank row. */
  placeholder?: string
}
export function CellSelect({ label, invalid, options, placeholder = 'None', className, ...props }: CellSelectProps) {
  return (
    <select
      {...props}
      aria-label={label}
      aria-invalid={invalid || undefined}
      className={cn(cellClass(invalid, className), 'cui-cell-select')}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value} disabled={option.disabled}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

export interface CellTextareaProps extends Omit<ComponentProps<'textarea'>, 'rows'>, CellControlProps {}
/** One row tall by default so it matches the other cell controls, and it does not grow as you type:
 *  a cell that expands mid-entry pushes every row below it down. */
export function CellTextarea({ label, invalid, className, ...props }: CellTextareaProps) {
  return (
    <textarea
      {...props}
      rows={1}
      aria-label={label}
      aria-invalid={invalid || undefined}
      className={cn(cellClass(invalid, className), 'cui-cell-textarea')}
    />
  )
}

const FOCUSABLE = 'input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled])'

export interface CellGridProps extends ComponentProps<'div'> {
  children: ReactNode
}
/**
 * Adds column-wise keyboard movement to a table of always-editable cells.
 *
 * Tab already moves across a row and on to the next, because the controls are real form controls in
 * the document order. What repetitive entry actually needs is the other axis: filling one column
 * down a list. Enter moves to the same column in the next row, Shift+Enter moves back up, and
 * Escape releases focus from the grid.
 *
 * Arrow keys are deliberately left alone. In a grid where every cell holds a live control, arrows
 * belong to the control: they move the caret in a text field and change the value in a select.
 * Stealing them for navigation is the usual reason hand-rolled grids feel hostile to type in.
 */
export function CellGrid({ children, className, onKeyDown, ...props }: CellGridProps) {
  const host = useRef<HTMLDivElement>(null)

  function move(from: HTMLElement, rows: number) {
    const cell = from.closest('td, th')
    const row = cell?.parentElement
    if (!cell || !row) return false
    const column = Array.prototype.indexOf.call(row.children, cell)
    let target = row as Element | null
    for (let step = 0; step < Math.abs(rows); step += 1) {
      target = rows > 0 ? target?.nextElementSibling || null : target?.previousElementSibling || null
      if (!target) return false
    }
    const next = target?.children[column]?.querySelector<HTMLElement>(FOCUSABLE)
    if (!next) return false
    next.focus()
    if (next instanceof HTMLInputElement || next instanceof HTMLTextAreaElement) next.select()
    return true
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions -- this element is a delegate, not a control: it takes no focus and carries no role, and the handler only observes events bubbling from the real form controls inside it
    <div
      {...props}
      ref={host}
      className={cn('cui-cell-grid', className)}
      onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event)
        if (event.defaultPrevented) return
        const target = event.target as HTMLElement
        if (!host.current?.contains(target)) return
        // A textarea owns Enter for line breaks, so only the modified form navigates out of one.
        const isTextarea = target instanceof HTMLTextAreaElement
        if (event.key === 'Escape') {
          target.blur()
          return
        }
        if (event.key !== 'Enter') return
        if (isTextarea && !event.metaKey && !event.ctrlKey) return
        if (move(target, event.shiftKey ? -1 : 1)) event.preventDefault()
      }}
    >
      {children}
    </div>
  )
}
