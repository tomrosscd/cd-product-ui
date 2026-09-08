# Architecture

The approved direction is shared foundations and CSS with React as the first complete interactive implementation. No framework conversion of Koko is in scope.

## Token flow

`tokens/tokens.json` → `scripts/generate-tokens.mjs` → `src/styles/tokens.css`, `src/styles/responsive.css` and `src/tokens.ts`.

Components use the generated CSS variables. The sidebar's resize behaviour imports the generated breakpoint. The Storybook reference reads the generated token data, including descriptions and resolved aliases. Token drift and supported text/control contrast pairs are checked automatically. CSS media queries are generated from a responsive template because CSS custom properties cannot directly supply media-query breakpoints.

## Component boundaries

`src/components/primitives` contains Card, Select, Button, Icon and ConvertMark. `src/components/navigation` contains DashboardSidebar. `src/patterns` contains DashboardShell. The neutral dashboard is a documentation example under `docs`, not an exported business component.

Card composes content and semantic states. It does not infer an action from clicking its whole surface. Select uses a native single-select element, supporting standard form submission and browser keyboard interaction. DashboardSidebar uses Radix Dialog for the mobile modal and owns only open/close state. Route destinations and navigation behaviour belong to its consumer. DashboardShell accepts a mainId when more than one shell needs to exist on a page.

The initial package exports React modules and separate tokens/styles entry points under one version. TypeScript emits ESM with declarations and preserves client directives. React remains a peer dependency. The compiled CSS is ready to import without downstream Tailwind scanning.

## Isolation

Semantic variables and component selectors use `cui`. Optional Tailwind utilities use `cdu`. The build omits Tailwind preflight and applies base rules only within Product UI scopes. Portalled drawer content has its own scope. Consumer resets and CSS can still affect native elements; validate important host screens when adopting the package.

The package contains no licensed fonts, client data or reference source files. The local catalogue may include ignored fonts for inspection. Font distribution rights must be resolved before hosting that font-containing build.

## Reference alignment

The website's React/TypeScript, colocated stories, semantic layering, variants and developer conventions inform this repository. Its typography, website components, Payload CMS, global theme state and Cloudflare services are not dependencies of this library. See reference-review.md for the pre-build findings; its recommendation status records the earlier review stage. The user subsequently approved the shared-foundation/React-first approach.

## 0.2.0 expansion

The core entry now includes form controls, badges/links, feedback, supporting content, metrics, progress, static tables, a TanStack v8 DataTable and roadmap/sign-in/card patterns. ChartContainer and chart recipes live under the separate charts entry, with Recharts and react-is as optional peers. Ordinary consumers can build without those chart packages.

Chart styling adds seven semantic tokens by aliasing existing Convert colours and establishing stroke/radius roles. No additional palette hues are introduced. The chart recipes provide keyboard interaction, reserved responsive dimensions, a summary and an exact-values table.

The Next.js consumption fixture tests server cards and client charts/forms from the packed archive. The roadmap uses controlled callbacks, with focus restoration after a move. Authentication, workflow rules, persistence and reporting calculations remain outside the library.

## 0.3.0 candidate

Theme overrides live on individual tokens in tokens/tokens.json. The generator resolves aliases separately for light/dark and emits complete scope declarations to avoid inherited alias drift in nested themes. React ThemeProvider carries the theme through portal context without global document mutation. Radix supplies menu, tooltip and toast behaviour; SearchSelect and DateRange retain native choice/date controls. Brand metadata and immutable raw assets are shipped alongside components; fonts remain excluded.
