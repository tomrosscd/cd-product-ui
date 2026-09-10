'use client'
import { useState, type ReactNode } from 'react'
import { Drawer } from './drawer.js'
import { Button } from './button.js'
import { Checkbox } from './fields.js'
import { Icon } from './icon.js'

export interface ColumnConfigColumn {
  key: string
  label: string
  /** Always shown, cannot be reordered or hidden. */
  locked?: boolean
  adminOnly?: boolean
}
export interface ColumnConfigPanelProps {
  trigger?: ReactNode
  columns: readonly ColumnConfigColumn[]
  /** Current selection, in display order. Locked columns may be included or omitted — they're always shown first regardless. */
  visibleKeys: readonly string[]
  /** Falls back to every non-locked column's own order in `columns`. */
  defaultKeys?: readonly string[]
  onChange: (next: readonly string[]) => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  heading?: string
}

/**
 * Show/hide, reorder and reset a table's optional columns. Locked columns are implicit — always
 * shown first, never listed as movable. Persisting the chosen set as a saved view belongs to the
 * application; this only produces the ordered key list.
 */
export function ColumnConfigPanel({
  trigger,
  columns,
  visibleKeys,
  defaultKeys,
  onChange,
  open,
  onOpenChange,
  heading = 'Configure columns',
}: ColumnConfigPanelProps) {
  const lockedKeys = columns.filter((c) => c.locked).map((c) => c.key)
  const movable = columns.filter((c) => !c.locked)
  const movableDefaults = defaultKeys ?? movable.map((c) => c.key)

  const initialOrder = (): string[] => {
    const ordered = visibleKeys.filter((k) => !lockedKeys.includes(k))
    const rest = movable.map((c) => c.key).filter((k) => !ordered.includes(k))
    return [...ordered, ...rest]
  }
  const [order, setOrder] = useState<string[]>(initialOrder)
  const [visible, setVisible] = useState<Set<string>>(() => new Set(visibleKeys.filter((k) => !lockedKeys.includes(k))))

  function commit(nextOrder: string[], nextVisible: Set<string>) {
    setOrder(nextOrder)
    setVisible(nextVisible)
    onChange([...lockedKeys, ...nextOrder.filter((k) => nextVisible.has(k))])
  }

  function toggle(key: string) {
    const next = new Set(visible)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    commit(order, next)
  }

  function move(index: number, delta: -1 | 1) {
    const target = index + delta
    if (target < 0 || target >= order.length) return
    const next = [...order]
    ;[next[index], next[target]] = [next[target] as string, next[index] as string]
    commit(next, visible)
  }

  // Every movable column stays reachable after a reset — only which ones are checked resets to
  // the defaults. Dropping a manually-added column out of the list entirely (rather than just
  // unchecking it) would make it impossible to bring back without a page refresh.
  function reset() {
    const defaults = movableDefaults.filter((k) => !lockedKeys.includes(k))
    const rest = movable.map((c) => c.key).filter((k) => !defaults.includes(k))
    commit([...defaults, ...rest], new Set(defaults))
  }

  const byKey = Object.fromEntries(columns.map((c) => [c.key, c]))

  return (
    <Drawer
      trigger={trigger}
      heading={heading}
      open={open}
      onOpenChange={onOpenChange}
      footer={
        <Button variant="link" onClick={reset}>
          Reset to defaults
        </Button>
      }
    >
      {lockedKeys.length > 0 && (
        <div className="cui-column-config-group">
          <p className="cui-column-config-label">Always shown</p>
          {lockedKeys.map((key) => (
            <div key={key} className="cui-column-config-locked-row">
              <Icon name="lock" className="cui-icon-inline" />
              <span>{byKey[key]?.label ?? key}</span>
            </div>
          ))}
        </div>
      )}
      <div className="cui-column-config-group">
        <p className="cui-column-config-label">Optional columns</p>
        {order.map((key, index) => {
          const def = byKey[key]
          if (!def) return null
          const isVisible = visible.has(key)
          return (
            <div key={key} className="cui-column-config-row" data-cui-visible={isVisible}>
              <div className="cui-column-config-reorder">
                <button
                  type="button"
                  className="cui-column-config-reorder-button"
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  aria-label={`Move ${def.label} up`}
                >
                  <Icon name="arrow-up" />
                </button>
                <button
                  type="button"
                  className="cui-column-config-reorder-button"
                  onClick={() => move(index, 1)}
                  disabled={index === order.length - 1}
                  aria-label={`Move ${def.label} down`}
                >
                  <Icon name="arrow-down" />
                </button>
              </div>
              <Checkbox
                label={def.adminOnly ? `${def.label} (admin)` : def.label}
                checked={isVisible}
                onChange={() => toggle(key)}
              />
            </div>
          )
        })}
      </div>
    </Drawer>
  )
}
