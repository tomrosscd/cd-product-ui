# Convert Product UI: reference review

Reviewed 7 September 2026 before implementation. This is the historical reference assessment. The user subsequently approved the shared-foundation, React-first direction; the current implementation and support boundaries are documented in README.md.

## Decision in plain English

Build the product library in React and TypeScript to align with the new website's component technology. Use Koko Monthly Review V4 for all visual decisions. Adopt the website's separation of tokens, semantic styles and components, together with its development conventions. Keep the library independent of the website application, its CMS and its deployment services.

This allows future React and Next.js dashboards to install a specific library version. Plain HTML projects can use the exported tokens and CSS, but cannot directly run React components. Existing Koko files will not be converted as part of this work.

## Review coverage and preservation

Reviewed the archive inventories, application entry points, linked dependencies, token and typography definitions, component conventions, relevant interaction implementations, Storybook configuration and story coverage, dependency manifest and lockfile, formatting and lint rules, test configuration and release/package structure. Website CMS, routing and deployment code were inspected for architectural boundaries, not audited as production business logic or security infrastructure.

- `Koko Black - Monthly Review v4.zip`: 84 files, excluding archive metadata. All 82 files with existing counterparts are byte-identical to the live Client Hub reference. The two additions are `READ ME.txt` and `START HERE.html`.
- `convert-convert-digital-2025-2eb5c485d3dc.zip`: 259 files, excluding archive metadata. This is the new website source, not the Koko product hub.
- Both archives were extracted into temporary review copies. No original reference files or website files were edited.
- Both handoff documents are identical.
- Original V8 SHA256: `9b52234ab3ade4f1f5b6682f971b3dc1ef6970b99fee6129771bbe0115a1207a`.

Browser checks on the extracted Koko copy confirmed the desktop overview, the report selector switching to August, the mobile overview at a 390px viewport, navigation to Delivery & impact, and the Ready for review empty state. No console warnings or errors were captured during these checks. The observed mobile overview had no page-level horizontal overflow; its navigation scrolls horizontally within its own container. This was a targeted reference inspection, not a complete accessibility certification.

The website findings are based on source inspection. Its Storybook and production builds were not run, and no CMS, Cloudflare or other external services were accessed. The presence of test tooling is not evidence that the website passes those tests.

## Koko: the visual and behavioural reference

V4 is a static browser application using HTML, CSS and ordinary JavaScript. It has no React, Next.js, Tailwind or Storybook dependency and no package build step.

Its actual load order is:

1. `monthly-review-v2.tokens.css`
2. `monthly-review-v2.css`
3. `monthly-review-v3.css`
4. `monthly-review-v4.css`
5. `source-data.js`
6. `dashboard-v3.js`
7. `monthly-base-v3.js`
8. `demo-reports-v3.js`
9. `monthly-base-v4.js`
10. `monthly-review-v4.js`

Every linked local dependency exists in the archive. Fonts and the Convert mark are local assets. The JavaScript layers share global state, replace rendering functions and add document-level event handlers. Some visual containment is inserted after rendering. These are prototype implementation details to replace with explicit React composition, not a library architecture to distribute.

Preserve these design decisions:

| Foundation  | Product UI value or rule                                                                                   |
| ----------- | ---------------------------------------------------------------------------------------------------------- |
| Font        | Roobert 400, 500 and 600; Geist fallback; then system sans                                                 |
| Surfaces    | Page `#faf9f7`, section band `#eef0ec`, card `#ffffff`                                                     |
| Text        | Primary `#171717`, secondary `#5e665f`                                                                     |
| Borders     | Subtle `#dce2db`, control `#829080`                                                                        |
| Accents     | Primary `#27382f`, soft `#c9deb6`, chart `#499e6b`                                                         |
| Status text | Positive `#2f6b45`, negative `#a13d32`                                                                     |
| Spacing     | 0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px                                                                  |
| Typography  | Display 40/48, mobile display 32/40, section 20/28, body 16/24, compact 14/20, caption 12/16, data 24/32px |
| Shape       | Band 16px, card 12px, control 8px radii; 1px borders                                                       |
| Elevation   | Card shadow `0 4px 12px rgba(23,23,23,.06)` in the actual source                                           |
| Interaction | 2px focus ring with 4px offset; 40px desktop and 48px touch control minimums                               |
| Density     | 44px reference row minimum; content can grow                                                               |
| Motion      | 160ms transitions and reduced-motion support                                                               |

The desktop sidebar is 208px wide. Below 900px, the prototype replaces it with a horizontal navigation strip. At 650px, content becomes predominantly one column, controls grow, and padding tightens. The new library should document its responsive behaviour explicitly and test long navigation labels and small screens.

The report filters are native select controls with a styled chevron. Cards are content containers with ordinary links or buttons inside them. Do not make every card implicitly clickable. Keep client calculations, report editions, local saved HTML, contacts, source links and business workflows outside the shared library.

## Website: technical reference only

The archive declares React 19.2.0 and Next.js 16.3.0. Its lockfile resolves TypeScript 5.9.3, Tailwind CSS 4.1.17 and Storybook 10.1.2. It specifies pnpm 10.14.0 and Node 22.14.0 in `.nvmrc`; the package engine and README also contain a broader Node >=18 statement. Resolve runtime requirements consistently when creating the new project, rather than repeating both.

The website uses:

- Next.js App Router for application routes.
- Tailwind v4 with `theme.css`, `mapped.css` and `typography.css`.
- React primitives under `components/primitives`, larger website/CMS components in separate folders, and stories beside components.
- Radix primitives and shadcn-style composition for controls, dialogs and popovers.
- `class-variance-authority` for named variants; `clsx` and `tailwind-merge` through a `cn` helper.
- Phosphor icons and custom Convert icons.
- Strict TypeScript, including `noUncheckedIndexedAccess`.
- Kebab-case filenames, named component exports, single quotes, no semicolons, Prettier and ESLint.
- Storybook's Next.js Vite integration, documentation, accessibility and Vitest addons, and Playwright browser test configuration.
- Payload CMS and Cloudflare D1/R2/Workers, which belong to the website application.

The website contains 42 `.stories.tsx` files with examples and controls. No explicit story `play` functions or standalone `.test`/`.spec` files were found. Story rendering can still be exercised by the configured Vitest integration.

## What to align, and what to keep separate

| Area                    | Product UI direction                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------------------ |
| Component technology    | React and TypeScript, usable in Next.js applications                                                   |
| File conventions        | Kebab-case files, named exports, colocated stories, clear primitive/pattern boundaries                 |
| Token architecture      | Base values, semantic roles, component consumption; generated documentation from the same source       |
| Styling workflow        | Tailwind v4 during library development, constrained to approved tokens; distribute compiled CSS        |
| CSS isolation           | Prefix Product UI variables and classes, including generated utilities, to prevent collisions          |
| Variants                | Explicit typed variants; avoid uncontrolled local restyling                                            |
| Interactive foundations | Native elements for simple controls; Radix where richer behaviour is justified                         |
| Storybook               | Standalone React Vite setup, documentation and enforced interaction/accessibility checks               |
| Website appearance      | Keep out: display typography, large campaign layouts, pill controls, animation style and dark sections |
| CMS and hosting         | Keep out: Payload, database migrations, Cloudflare configuration and production credentials            |

Several brand values already match: website `brand-900` equals Koko's primary accent, `brand-500` equals its chart accent, `brand-300` equals its soft accent, and `brand-200` equals its page surface. These can be documented as a future alignment map.

Semantic names do not always mean equal values. Website `text-primary` is `#27382f`; Product UI primary text is `#171717`. Website secondary text is `#405349`; Product UI uses `#5e665f`. Sharing unprefixed variables or importing the website stylesheet would change the product appearance. Use an explicit mapping, not implicit equivalence.

## Issues to avoid carrying into the library

These are source-level observations about this archive, not a verdict on the live website.

1. **Keyboard focus in the dropdown.** `components/primitives/dropdown/dropdown.tsx:62` blurs its input on focus, and line 68 suppresses popover autofocus. Options are ordinary buttons, without a complete select/listbox keyboard model. Use a native select for the first Product UI dropdown, matching Koko, with associated label, hint, error and disabled states. If a custom popup is needed later, use a purpose-built accessible select primitive.
2. **Input error semantics.** `components/primitives/input/input.tsx` renders an error paragraph without automatically connecting it through `aria-describedby` or setting `aria-invalid`. A caller-supplied input ID can also override the generated ID without changing the label. The new controls should handle those relationships centrally.
3. **Advisory accessibility checks.** `.storybook/preview.tsx:17` sets `a11y.test` to `todo`. Use failing checks for violations in the new library and supplement automated checks with keyboard and mobile review.
4. **Mixed Storybook package generations.** `package.json` includes Essentials and Interactions 8.6.14 alongside Storybook 10.1.2. Those two old addons are not listed in the active Storybook configuration. Use one compatible, pinned package set in the new project.
5. **Unresolved style names.** Components refer to `body-large`, `heading-9`, `button-core` and shadcn-style colour utilities such as `bg-popover` and `text-muted-foreground`, while matching definitions are absent from the inspected styles. Do not carry those references into Product UI. Verify generated CSS against the component examples.
6. **Global theme side effects.** The theme provider writes to the document root. Product UI should scope its variables and portal styling so that embedding it does not change an entire host application. Start with the approved light theme.
7. **Application rather than distributable library.** The website is marked private and has no package exports, peer dependencies or distributable file list. No release workflow or CI configuration was present in the archive. Product UI needs these packaging and release conventions established separately.

## Proposed initial implementation

Use a small single-package repository named `convert-product-ui`. Keep one version for tokens and components initially, with separate package entry points for tokens, styles and React exports.

- One structured token source generates CSS variables, a typed token export and the viewable Storybook reference. Preserve Koko values while making semantic naming explicit.
- React/TypeScript components: Card, Select and DashboardSidebar. A dashboard example combines them using neutral demonstration content.
- Card examples cover normal, compact, long-content, loading, empty and error compositions. Select examples cover enabled, disabled, required, error, long labels and controlled changes. Sidebar examples cover current item, keyboard focus, long labels and mobile navigation.
- Proposed mobile sidebar: a labelled menu button opening an accessible drawer, retaining Koko's visual treatment. Test focus containment, Escape, focus return, route selection and resizing. This improves navigation for a growing internal-tool menu; it is an intentional behaviour change from Koko's horizontal strip.
- Use Storybook's React Vite framework so the catalogue is independent of Next.js routing and CMS services. Document a Next.js consumption example and preserve client boundaries where interactive components require them.
- Compile library CSS so consuming projects do not have to discover library classes through their own Tailwind build. Scope any reset to Product UI rather than applying a global website reset.
- Keep React as a peer dependency and verify the built package in a small consuming project before release. Do not claim support for framework versions that have not been tested.
- Include installation of an exact local package version, changelog, migration notes and a release checklist covering tests, visual review, package contents and Git tags. Remote hosting and registry selection can follow later.
- Keep local preview fonts separate from the distributed package until redistribution rights are confirmed. Use Roobert with Geist fallback and document how applications supply licensed fonts.
- Version AI-readable usage rules. Impeccable should review hierarchy, density, typography, interactions and craft against the approved Convert decisions. It must not introduce a new visual language.

Proposed structure:

```text
convert-product-ui/
  .storybook/
  tokens/
  scripts/
  src/
    components/primitives/
    components/navigation/
    patterns/
    styles/
  docs/
  tests/
  README.md
  AGENTS.md
  CHANGELOG.md
  package.json
  pnpm-lock.yaml
```

## Framework decision recorded before implementation

The user approved React and TypeScript as the first complete component implementation, with tokens and CSS usable in other frameworks. This follows the website's component technology while retaining Koko's product appearance.

## Supporting official documentation

- [Storybook for React with Vite](https://storybook.js.org/docs/get-started/frameworks/react-vite): isolated React component development and testing without a Next.js application.
- [Storybook accessibility tests](https://storybook.js.org/docs/writing-tests/accessibility-testing): accessibility test configuration and enforcement.
- [Tailwind theme variables](https://tailwindcss.com/docs/theme): relationship between theme variables and generated utilities.
- [Radix Select](https://www.radix-ui.com/primitives/docs/components/select): accessible custom select behaviour if a later requirement warrants it.
