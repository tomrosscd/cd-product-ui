'use client'
import * as Primitive from '@radix-ui/react-tabs'
import type { ComponentProps, ReactNode } from 'react'
export interface TabItem {
  value: string
  label: string
  content: ReactNode
  disabled?: boolean
}
export interface TabsProps extends Omit<ComponentProps<typeof Primitive.Root>, 'children'> {
  label: string
  items: readonly TabItem[]
}
export function Tabs({ label, items, ...props }: TabsProps) {
  return (
    <Primitive.Root {...props} className={`cui-root cui-tabs ${props.className || ''}`}>
      <Primitive.List className="cui-tab-list" aria-label={label}>
        {items.map((item) => (
          <Primitive.Trigger key={item.value} value={item.value} disabled={item.disabled} className="cui-tab">
            {item.label}
          </Primitive.Trigger>
        ))}
      </Primitive.List>
      {items.map((item) => (
        <Primitive.Content key={item.value} value={item.value} className="cui-tab-panel">
          {item.content}
        </Primitive.Content>
      ))}
    </Primitive.Root>
  )
}
