'use client'
import * as Primitive from '@radix-ui/react-toggle-group'
import type { ChoiceOption } from './option.js'
export interface SegmentedControlProps {
  label: string
  options: readonly ChoiceOption[]
  value: string
  onValueChange: (value: string) => void
  disabled?: boolean
}
/** Single-selection toggle group, e.g. Weeks/Months. Always keeps exactly one option selected. */
export function SegmentedControl({ label, options, value, onValueChange, disabled }: SegmentedControlProps) {
  return (
    <Primitive.Root
      type="single"
      className="cui-segmented"
      aria-label={label}
      value={value}
      onValueChange={(next) => {
        if (next) onValueChange(next)
      }}
      disabled={disabled}
    >
      {options.map((option) => (
        <Primitive.Item
          key={option.value}
          value={option.value}
          disabled={option.disabled}
          className="cui-segmented-item"
        >
          {option.label}
        </Primitive.Item>
      ))}
    </Primitive.Root>
  )
}
export interface SegmentedMultiControlProps {
  label: string
  options: readonly ChoiceOption[]
  value: readonly string[]
  onValueChange: (value: string[]) => void
  disabled?: boolean
}
/** Multi-selection toggle group. Options can all be off; unlike SegmentedControl, no option is required. */
export function SegmentedMultiControl({ label, options, value, onValueChange, disabled }: SegmentedMultiControlProps) {
  return (
    <Primitive.Root
      type="multiple"
      className="cui-segmented"
      aria-label={label}
      value={[...value]}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      {options.map((option) => (
        <Primitive.Item
          key={option.value}
          value={option.value}
          disabled={option.disabled}
          className="cui-segmented-item"
        >
          {option.label}
        </Primitive.Item>
      ))}
    </Primitive.Root>
  )
}
