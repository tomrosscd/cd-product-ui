import { useProductTheme } from '../src/components/primitives/theme.js'
import { useState } from 'react'
import { tokenReference } from '../src/tokens.js'
export function TokenReference() {
  const theme = useProductTheme()
  const reference = tokenReference.map((token) => ({
    ...token,
    resolved: theme === 'dark' ? token.darkResolved : token.resolved,
  }))
  const [query, setQuery] = useState('')
  const filtered = reference.filter((token) =>
    `${token.group} ${token.name} ${token.description} ${token.resolved}`.toLowerCase().includes(query.toLowerCase()),
  )
  const groups = [...new Set(filtered.map((token) => token.group))]
  return (
    <div className="cui-root cui-token-reference">
      <div className="cui-field">
        <label htmlFor="token-search" className="cui-label">
          Find a token
        </label>
        <input
          id="token-search"
          className="cui-select"
          type="search"
          placeholder="Try surface, spacing or focus"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <span className="cui-caption cui-secondary" role="status">
          {filtered.length} of {tokenReference.length} tokens
        </span>
      </div>
      {groups.length === 0 && <p>No tokens match your search.</p>}
      {groups.map((group) => (
        <section key={group} className="cui-token-group">
          <h2>{group}</h2>
          <div className="cui-token-grid">
            {filtered
              .filter((token) => token.group === group)
              .map((token) => (
                <article key={token.key} className="cui-token-cell">
                  {['colour', 'surface', 'text', 'accent'].includes(group) && (
                    <div className="cui-token-swatch" style={{ background: token.resolved }} />
                  )}
                  {group === 'space' && <div className="cui-token-space" style={{ width: token.resolved }} />}
                  <code>{token.css}</code>
                  <strong>{token.resolved}</strong>
                  <p>{token.description}</p>
                  {token.value.startsWith('{') && (
                    <span className="cui-caption cui-secondary">Maps to {token.value.slice(1, -1)}</span>
                  )}
                </article>
              ))}
          </div>
        </section>
      ))}
    </div>
  )
}
