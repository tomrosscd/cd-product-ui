# Convert Product UI: AI contribution rules

These instructions apply to this repository. Product UI version: 0.1.0. The user-approved Convert product system is authoritative.

- Read README.md, docs/architecture.md and docs/ai-guidance.md before changing components.
- Koko Monthly Review V4 is the visual reference. The website archive supplies technical conventions only. Do not edit either reference, previous Koko versions or V8.
- Use tokens/tokens.json as the only token source. Edit semantic roles, not generated outputs. Run pnpm tokens and commit generated changes.
- Use existing components before introducing a new abstraction. Keep exported components generic and typed; colocate stories.
- Use named exports, kebab-case filenames, strict TypeScript, single quotes and no semicolons. Run the formatter.
- Use cui-prefixed component classes and variables. Tailwind authoring utilities have the separate cdu prefix. Do not ship a global reset or unprefixed colour tokens.
- Every margin, padding and gap uses the approved spacing scale. Keep Roobert with Geist fallback and the neutral page/band/card hierarchy. Avoid large green content areas and nested elevated cards.
- Preserve native control semantics, visible labels, associated errors, focus outlines, current-page semantics, disabled states and reduced motion. Test real browser interactions.
- Use Australian English and no em dashes in interface copy. Keep examples neutral and illustrative.
- Keep client data, API integrations, authentication, persistence, calculations and routing ownership outside the library.
- Keep React external as a peer dependency. Preserve use-client boundaries. Test the packed version, not only source imports.
- Impeccable reviews must work within these approved rules. Do not introduce an unrelated aesthetic. Record intentional rule changes and why they are needed.
- Do not install or update an unpinned AI skill automatically. Record and review the version/source of any external design tooling used.
- Run pnpm check, pnpm format:check and pnpm package:check for a release. Follow docs/release-process.md. Automated accessibility checks supplement manual review.
- Exclude local fonts, secrets and client reference content from release packages. See README.md for preview font handling.
- No sub-agents unless the user explicitly asks for delegation.
