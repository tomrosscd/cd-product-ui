import { useId } from 'react'
export type ProgressTone = 'neutral' | 'positive' | 'warning' | 'negative'
export interface ProgressProps {
  label: string
  /** Colours the filled portion. Pair it with `valueLabel` or `hint`, since colour alone is not an accessible signal. */
  tone?: ProgressTone
  value?: number
  max?: number
  target?: number
  valueLabel?: string
  hint?: string
}
export function Progress({ label, value, max = 100, target, valueLabel, hint, tone = 'neutral' }: ProgressProps) {
  const id = useId()
  const safeMax = Number.isFinite(max) && max > 0 ? max : 100
  // Deliberately not clamped to safeMax. A capacity bar that caps at its maximum reports 142% of a
  // team's time and 100% of it as the same reading, which is not a display quirk but a false
  // number. Values above the maximum instead rescale the track and mark where the maximum sits, so
  // the overrun is visible and measurable. Values at or below the maximum are unaffected: scale
  // stays safeMax, so width, label and ARIA values are byte-for-byte what they were before.
  const current = value === undefined || !Number.isFinite(value) ? undefined : Math.max(0, value)
  const over = current !== undefined && current > safeMax
  const scale = over && current !== undefined ? current : safeMax
  const limitPosition = over ? (safeMax / scale) * 100 : undefined
  const targetPosition =
    target !== undefined && Number.isFinite(target) ? Math.max(0, Math.min((target / scale) * 100, 100)) : undefined
  return (
    <div
      className={[
        'cui-root',
        'cui-progress',
        tone === 'neutral' ? undefined : `cui-progress-${tone}`,
        over ? 'cui-progress-over' : undefined,
      ]
        .filter(Boolean)
        .join(' ')}
    >
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
        aria-valuemax={scale}
        aria-valuenow={current}
        aria-valuetext={valueLabel || (over ? `${Math.round((current / safeMax) * 100)}% of ${safeMax}` : undefined)}
        aria-describedby={hint || targetPosition !== undefined || over ? `${id}-hint` : undefined}
      >
        <span
          className={current === undefined ? 'cui-progress-fill cui-progress-indeterminate' : 'cui-progress-fill'}
          style={{ width: current === undefined ? '40%' : `${(current / scale) * 100}%` }}
        />
        {limitPosition !== undefined && (
          <span className="cui-progress-limit" style={{ left: `${limitPosition}%` }} aria-hidden="true" />
        )}
        {targetPosition !== undefined && (
          <span className="cui-progress-target" style={{ left: `${targetPosition}%` }} />
        )}
      </div>
      {(hint || targetPosition !== undefined || over) && (
        <p className="cui-caption cui-secondary" id={`${id}-hint`}>
          {hint}
          {hint && targetPosition !== undefined ? ' ' : ''}
          {targetPosition !== undefined && `Target: ${target} of ${safeMax}.`}
          {over && `${hint || targetPosition !== undefined ? ' ' : ''}Over the maximum of ${safeMax}.`}
        </p>
      )}
    </div>
  )
}
export interface AllocationSegment {
  label: string
  value: number
}
/** A part-to-whole display. Non-finite or negative segment values are treated as zero rather than rejected. */
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
