import { useId } from 'react'
export interface ProgressProps {
  label: string
  value?: number
  max?: number
  target?: number
  valueLabel?: string
  hint?: string
}
export function Progress({ label, value, max = 100, target, valueLabel, hint }: ProgressProps) {
  const id = useId()
  const safeMax = Number.isFinite(max) && max > 0 ? max : 100
  const current = value === undefined || !Number.isFinite(value) ? undefined : Math.max(0, Math.min(value, safeMax))
  const targetPosition =
    target !== undefined && Number.isFinite(target) ? Math.max(0, Math.min((target / safeMax) * 100, 100)) : undefined
  return (
    <div className="cui-root cui-progress">
      <div className="cui-row cui-progress-heading">
        <span id={id} className="cui-label">
          {label}
        </span>
        <span className="cui-secondary">
          {valueLabel || (current === undefined ? 'In progress' : `${Math.round((current / safeMax) * 100)}%`)}
        </span>
      </div>
      <div
        className="cui-progress-track"
        role="progressbar"
        aria-labelledby={id}
        aria-valuemin={0}
        aria-valuemax={safeMax}
        aria-valuenow={current}
        aria-valuetext={valueLabel}
        aria-describedby={hint || targetPosition !== undefined ? `${id}-hint` : undefined}
      >
        <span
          className={current === undefined ? 'cui-progress-fill cui-progress-indeterminate' : 'cui-progress-fill'}
          style={{ width: current === undefined ? '40%' : `${(current / safeMax) * 100}%` }}
        />
        {targetPosition !== undefined && (
          <span className="cui-progress-target" style={{ left: `${targetPosition}%` }} />
        )}
      </div>
      {(hint || targetPosition !== undefined) && (
        <p className="cui-caption cui-secondary" id={`${id}-hint`}>
          {hint}
          {hint && targetPosition !== undefined ? ' ' : ''}
          {targetPosition !== undefined && `Target: ${target} of ${safeMax}.`}
        </p>
      )}
    </div>
  )
}
export interface AllocationSegment {
  label: string
  value: number
}
/** A part-to-whole display. Values must be finite and non-negative. */
export function AllocationBar({
  label,
  segments,
  unit = '',
}: {
  label: string
  segments: readonly AllocationSegment[]
  unit?: string
}) {
  const id = useId()
  const values = segments.map((segment) => ({
    ...segment,
    value: Number.isFinite(segment.value) ? Math.max(0, segment.value) : 0,
  }))
  const total = values.reduce((sum, segment) => sum + segment.value, 0)
  return (
    <figure className="cui-root cui-allocation">
      <figcaption id={id} className="cui-label">
        {label}
      </figcaption>
      <div className="cui-allocation-track" aria-hidden="true">
        {values.map((segment, i) => (
          <span
            key={i}
            className={`cui-series-${i % 3}`}
            style={{ width: `${total ? (segment.value / total) * 100 : 0}%` }}
          />
        ))}
      </div>
      <ul className="cui-allocation-legend" aria-labelledby={id}>
        {values.map((segment, i) => (
          <li key={i}>
            <span className={`cui-series-key cui-series-${i % 3}`} aria-hidden="true" />
            {segment.label}
            <strong>
              {segment.value} {unit}
            </strong>
          </li>
        ))}
      </ul>
      {total === 0 && <p className="cui-secondary">No allocation recorded.</p>}
    </figure>
  )
}
