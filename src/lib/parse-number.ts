/** Parse a complete locale-formatted decimal. Invalid text never becomes a different amount. */
export function parseLocaleNumber(raw: string, locale: string): number | undefined {
  const text = raw.trim().replace(/[\u061c\u200e\u200f]/g, '')
  if (!text) return undefined
  const formatter = new Intl.NumberFormat(locale)
  const parts = formatter.formatToParts(-1234567890123.5)
  const decimal = parts.find((part) => part.type === 'decimal')?.value ?? '.'
  const group = parts.find((part) => part.type === 'group')?.value
  const minus = parts.find((part) => part.type === 'minusSign')?.value ?? '-'
  let normal = text
  for (let digit = 0; digit <= 9; digit++) {
    const local = new Intl.NumberFormat(locale, { useGrouping: false }).format(digit)
    normal = normal.split(local).join(String(digit))
  }
  normal = normal.replace(minus, '-')
  const sign = /^[+-]/.test(normal) ? normal[0] : ''
  if (sign) normal = normal.slice(1)
  const pieces = normal.split(decimal)
  if (pieces.length > 2) return undefined
  let integer = pieces[0] ?? ''
  const fraction = pieces[1]
  if (group && integer.includes(group)) {
    const groups = integer.split(group)
    const sizes = parts.filter((part) => part.type === 'integer').map((part) => part.value.length)
    const lastSize = sizes.at(-1) ?? 3
    const middleSize = sizes.at(-2) ?? lastSize
    if (
      groups.some(
        (part, index) =>
          !/^\d+$/.test(part) ||
          (index === groups.length - 1
            ? part.length !== lastSize
            : index === 0
              ? part.length < 1 || part.length > middleSize
              : part.length !== middleSize),
      )
    )
      return undefined
    integer = groups.join('')
  }
  if (!/^\d*$/.test(integer) || (fraction !== undefined && !/^\d*$/.test(fraction))) return undefined
  if (!integer && !fraction) return undefined
  const value = Number(`${sign}${integer || '0'}${fraction === undefined ? '' : `.${fraction}`}`)
  return Number.isFinite(value) ? value : undefined
}
