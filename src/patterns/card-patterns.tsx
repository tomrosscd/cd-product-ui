import type { ReactNode } from 'react'
import { Card, type CardProps } from '../components/primitives/card.js'
import { KeyValueList, type KeyValueItem } from '../components/primitives/content.js'
import { Progress, type ProgressProps } from '../components/primitives/progress.js'
export function SummaryCard(props: CardProps) {
  return <Card {...props} />
}
export function DetailsCard({ items, ...props }: CardProps & { items: readonly KeyValueItem[] }) {
  return (
    <Card {...props}>
      <KeyValueList items={items} />
      {props.children}
    </Card>
  )
}
export function ProgressCard({ progress, ...props }: CardProps & { progress: ProgressProps }) {
  return (
    <Card {...props}>
      <Progress {...progress} />
      {props.children}
    </Card>
  )
}
export function ActionCard({ primaryAction, ...props }: CardProps & { primaryAction: ReactNode }) {
  return (
    <Card {...props} footer={props.footer || primaryAction}>
      {props.children}
    </Card>
  )
}
