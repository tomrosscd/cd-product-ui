const UNSAFE_HREF_SCHEME = /^\s*(javascript|vbscript|data):/i
/** Blocks script-executing URI schemes; relative paths, https, mailto, tel and app schemes pass through unchanged. */
export function safeHref<T extends string | undefined>(href: T): T | undefined {
  if (!href) return href
  return UNSAFE_HREF_SCHEME.test(href) ? undefined : href
}
