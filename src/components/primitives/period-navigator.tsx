import { Button } from './button.js'
import { Icon } from './icon.js'
export interface PeriodPreset {
  label: string
  onSelect: () => void
}
export interface PeriodNavigatorProps {
  /** The current period, already formatted by the application, e.g. "1 – 7 September 2026" or "September 2026". */
  label: string
  onPrevious: () => void
  onNext: () => void
  previousLabel?: string
  nextLabel?: string
  disabledPrevious?: boolean
  disabledNext?: boolean
  /** Present to show a shortcut back to the current period. */
  onToday?: () => void
  todayLabel?: string
  /** Reporting presets, e.g. "This week", "This month", "Last quarter". */
  presets?: readonly PeriodPreset[]
}
/** Previous/next navigation for an application-defined period. Does not calculate dates or period boundaries itself. */
export function PeriodNavigator({
  label,
  onPrevious,
  onNext,
  previousLabel = 'Previous period',
  nextLabel = 'Next period',
  disabledPrevious,
  disabledNext,
  onToday,
  todayLabel = 'Today',
  presets = [],
}: PeriodNavigatorProps) {
  return (
    <div className="cui-period-nav">
      <div className="cui-row">
        <Button aria-label={previousLabel} disabled={disabledPrevious} onClick={onPrevious}>
          <Icon name="arrow" className="cui-period-nav-previous" />
        </Button>
        <strong className="cui-period-nav-label" aria-live="polite">
          {label}
        </strong>
        <Button aria-label={nextLabel} disabled={disabledNext} onClick={onNext}>
          <Icon name="arrow" />
        </Button>
        {onToday && <Button onClick={onToday}>{todayLabel}</Button>}
      </div>
      {presets.length > 0 && (
        <div className="cui-row">
          {presets.map((preset) => (
            <Button key={preset.label} onClick={preset.onSelect}>
              {preset.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
