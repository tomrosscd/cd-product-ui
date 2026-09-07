'use client'
import * as Primitive from '@radix-ui/react-alert-dialog'
import type { ReactNode } from 'react'
import { Button } from './button.js'
export interface ConfirmationDialogProps {
  trigger: ReactNode
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}
/** Confirmation only. The application owns the resulting operation and its feedback. */
export function ConfirmationDialog({
  trigger,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  open,
  onOpenChange,
}: ConfirmationDialogProps) {
  return (
    <Primitive.Root open={open} onOpenChange={onOpenChange}>
      <Primitive.Trigger asChild>{trigger}</Primitive.Trigger>
      <Primitive.Portal>
        <Primitive.Overlay className="cui-sidebar-overlay" />
        <Primitive.Content className="cui-root cui-dialog">
          <Primitive.Title className="cui-card-heading">{title}</Primitive.Title>
          <Primitive.Description className="cui-secondary">{description}</Primitive.Description>
          <div className="cui-row cui-dialog-actions">
            <Primitive.Cancel asChild>
              <Button>{cancelLabel}</Button>
            </Primitive.Cancel>
            <Primitive.Action asChild>
              <Button variant="primary" onClick={onConfirm}>
                {confirmLabel}
              </Button>
            </Primitive.Action>
          </div>
        </Primitive.Content>
      </Primitive.Portal>
    </Primitive.Root>
  )
}
