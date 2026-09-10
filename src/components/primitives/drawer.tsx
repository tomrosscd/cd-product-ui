'use client'
import * as Dialog from '@radix-ui/react-dialog'
import type { ReactNode } from 'react'
import { useProductTheme } from './theme.js'
import { Button } from './button.js'
import { Icon } from './icon.js'

export interface DrawerProps {
  /** Optional trigger to render inline. Omit when the application drives `open` itself, e.g. from a row click. */
  trigger?: ReactNode
  heading: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  closeLabel?: string
}
/**
 * A side panel for inspecting or editing a record without leaving the page. Content, loading,
 * saving and validation states are the application's — this only owns the open/close chrome.
 */
export function Drawer({
  trigger,
  heading,
  description,
  children,
  footer,
  open,
  onOpenChange,
  closeLabel = 'Close',
}: DrawerProps) {
  const theme = useProductTheme()
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
      <Dialog.Portal>
        <Dialog.Overlay className="cui-sidebar-overlay" />
        <Dialog.Content data-cui-theme={theme} className="cui-root cui-drawer-panel">
          <div className="cui-drawer-header">
            <Dialog.Title className="cui-drawer-title">{heading}</Dialog.Title>
            <Dialog.Close asChild>
              <Button variant="quiet" size="icon" aria-label={closeLabel}>
                <Icon name="close" />
              </Button>
            </Dialog.Close>
          </div>
          {description ? (
            <Dialog.Description className="cui-drawer-description">{description}</Dialog.Description>
          ) : (
            <Dialog.Description className="cui-sr-only">{heading}</Dialog.Description>
          )}
          <div className="cui-drawer-body">{children}</div>
          {footer && <div className="cui-drawer-footer">{footer}</div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
