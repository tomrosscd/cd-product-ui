# Initial delivery validation

Validated locally on 7 September 2026. Package version: 0.1.0.

## Automated checks

- 12 unit and token tests passed: label and ID associations, hints/errors, controlled values, native form submission, disabled options, empty/loading controls, card loading, action repeat prevention, route semantics, drawer Escape/focus return and navigation callbacks.
- 31 Storybook examples passed in Chromium with accessibility checks configured as errors. Interactive stories cover selection, state updates, recovery and dashboard actions.
- Normal text contrast was checked on page, band and card surfaces. Inverse/selected text, control boundaries and focus contrast were also checked.
- Type checking, ESLint, token generation, component compilation and static Storybook compilation passed during implementation. The final release commands are recorded in README.md.
- The packed archive was checked for fonts and development files, installed into a separate temporary consumer, rendered through React's server renderer, and built as a Vite application using only package imports. React 19.2.8 and its compiled styles/token exports worked.

## Browser and design review

The live catalogue and dashboard were reviewed against the approved Koko hierarchy and Convert rules, using the Impeccable review guidance recorded in this repository.

- Roobert was confirmed as the computed primary family in the local dashboard.
- Desktop at 1280px: sidebar, main content, neutral section bands, card hierarchy and density reviewed.
- Mobile at 390px: single-column layout and labelled drawer reviewed. Shift+Tab stayed in the open drawer, Escape closed it and focus returned to Open navigation.
- Narrow mobile at 320px: content wrapped without page-level horizontal overflow; select and menu controls measured 48px tall.
- Search for “focus” in the token reference returned the three focus tokens.
- The welcome page's dashboard link navigated the catalogue correctly.
- The user-supplied archives and all existing Koko reference files were checked against preservation baselines. V8 retains its recorded SHA256.

## Limitations

This is the first local library release. No client services, real data, authentication or production integrations are included. Other frameworks receive tokens and CSS, not the React interaction implementation. A full Next.js application build, Safari/Firefox coverage, screen-reader sessions, forced-colour visual review and a broader assistive-technology audit remain future checks; do not describe automated results as full accessibility certification.

Reduced-motion and forced-colour styles are implemented. Native select menus follow the operating system. Licensed fonts are excluded from Git and the installable package; local Storybook builds may contain ignored preview fonts and need rights review before hosting.

GitHub is the source and contribution destination. Local validation covers the package and catalogue; hosted Storybook, registry distribution and CI services are not configured.
