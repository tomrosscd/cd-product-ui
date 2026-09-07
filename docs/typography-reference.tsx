import { tokens } from '../src/tokens.js'
const roles = ['display', 'display-mobile', 'section', 'body', 'compact', 'caption', 'data'] as const
export function TypographyReference() {
  return (
    <div className="cui-root cui-stack">
      {roles.map((role) => (
        <div className="cui-type-specimen" key={role}>
          <div className="cui-row">
            <strong>{role.replace('-', ' ')}</strong>
            <code>
              {tokens[`type.${role}`]} / {tokens[`type.${role}-leading`]}
            </code>
          </div>
          <div
            style={{
              fontFamily: tokens['font.sans'],
              fontSize: tokens[`type.${role}`],
              lineHeight: tokens[`type.${role}-leading`],
              fontWeight: role === 'body' || role === 'caption' ? tokens['font.regular'] : tokens['font.semibold'],
            }}
          >
            {role === 'data' ? '1,248.00' : 'A clear view of your work.'}
          </div>
        </div>
      ))}
    </div>
  )
}
