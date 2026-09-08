# 0.3.0 candidate: brand, themes and workspace controls

0.2.0 remains the latest tagged release until this candidate is reviewed. This is a compatible addition; existing light-mode consumers keep their current theme. The official sidebar logo changes visually but no sidebar props change.

## Themes

```tsx
import { ThemeProvider, Card, ConvertLogo } from '@convert/product-ui'
import '@convert/product-ui/styles.css'

;<ThemeProvider theme="dark">
  <ConvertLogo variant="straight" label="Convert" style={{ width: 160 }} />
  <Card heading="Workspace">Ready for your team's work.</Card>
</ThemeProvider>
```

The host chooses light or dark, including any system preference and saved preference. The library does not write to document roots or browser storage. Use ThemeProvider for React applications so dialogs, menus and tooltips retain the theme when portalled. Nested providers are supported. CSS-only consumers can use `data-cui-theme="dark"` on a scope and must apply it to custom portal roots themselves. Both themes are generated from tokens/tokens.json; `tokens` retains light values and `darkTokens` provides resolved dark values. The Storybook toolbar changes live examples; the Themes stories also show explicit light, dark and nested scopes.

New dark semantic values extend the approved system to maintain readable text and distinct surfaces. Original brand colour tokens remain unchanged; marketing yellow, orange and serif fonts are not introduced into Product UI. Do not use raw palette tokens for theme-sensitive interface text or backgrounds.

## Brand assets

ConvertLogo supports logo, straight and mark variants using original source geometry and currentColor. Supply label when meaningful; omit it for decorative uses. Existing ConvertMark stays available. Preserve aspect ratio. Use approved foreground colours and sufficient contrast; avoid inventing lockups, shadows or effects.

The package includes assets/brand with 80 unchanged SVG, PNG and JPG files. `brandAssets` supplies filenames, descriptive labels, categories, formats and SHA256 hashes. Copy selected files into the consuming application's public assets folder and construct URLs from that application's base path. Package exports permit bundler asset imports through `@convert/product-ui/assets/brand/<filename>` where supported. Files are not automatically hosted by installing the package. The Illustrator master and licensed fonts are excluded. Storybook's Brand assets page offers working downloads, including profile icons and clear-space variants. A wider marketing guide and stack creator belong in the separate Brand Hub.

## New controls

| Component    | Contract                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ActionMenu   | Labelled trigger and items with stable IDs, labels, callbacks and optional disabled/destructive states. Supports arrows, typeahead, Escape and focus return. Use links for navigation.                                                                                                                                                                                                   |
| SearchSelect | Controlled string array value and onValueChange, options and visible label. Set multiple for checkboxes; otherwise native radios. Search narrows visible choices without clearing existing selections. Clear selection is explicit. This is a searchable disclosure, not an ARIA combobox or remote-search component. Name adds hidden form values. Disabled choices cannot be selected. |
| DateRange    | Controlled start/end ISO date strings, label, optional min/max, required and disabled props. Uses native date pickers, validates range order and passes values unchanged. Host owns date calculations, submission and timezone policy.                                                                                                                                                   |
| Tooltip      | One focusable React element plus supplemental text. Never hide required instructions here or use it as the element's only label.                                                                                                                                                                                                                                                         |
| ToastRegion  | Controlled message queue with stable IDs and onDismiss. Pauses expiry on hover/focus, supports F8 access and a visible dismiss action. Keep persistent errors in Alert or field errors. Mount one region per application scope.                                                                                                                                                          |
| Breadcrumbs  | Ordered labels with optional href; the final item is current page. Routing remains host-owned.                                                                                                                                                                                                                                                                                           |

See Components / Workspace controls for interactive examples. Keep queues bounded in the host application and avoid duplicate IDs. SearchSelect is intended for moderate local option sets, not thousands of server-backed items.

## Review and adoption

Run the existing release checks plus `pnpm test:dark`. Install the exact packed candidate into the consuming project and inspect desktop/mobile states, portalled interactions, charts and custom CSS. No application authentication, storage or backend is included. After review, tag the approved commit v0.3.0 and update stable installation examples together; never overwrite an existing tag.
