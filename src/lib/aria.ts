/** Builds an aria-describedby value from a control's hint/error ids, plus any host-supplied id(s). */
export function describedByIds(controlId: string, hint?: string, error?: string, extra?: string): string | undefined {
  return (
    [extra, hint && `${controlId}-hint`, error && `${controlId}-error`].filter(Boolean).join(' ') || undefined
  )
}
