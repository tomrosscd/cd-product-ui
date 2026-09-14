# Upgrade to 0.11.0

`0.11.0` adds optional sidebar typography density and fixes layout and presentation defects found during a full application adoption. Released 14 September 2026.

## Install the release

1. Read the visible changes below.
2. Install the immutable archive:

   ```sh
   pnpm add --save-exact https://github.com/tomrosscd/cd-product-ui/releases/download/v0.11.0/convert-product-ui-0.11.0.tgz
   ```

   Use `npm install --save-exact` instead when npm owns the application's lockfile. For vendored installs, download the archive and `SHA256SUMS` from the same release, verify the checksum, and commit the archive with the manifest and lockfile.

3. Run the application's frozen install, build and tests. Review its navigation, filter-heavy pages, link-style actions and sortable tables before merging the upgrade.

## Navigation density

`DashboardSidebar` and `DashboardShell` now accept `density="compact" | "comfortable"`.

- `compact` is the default and preserves the existing top-level navigation typography.
- `comfortable` uses the existing 16px semibold type roles without changing icons or the collapsed rail.
- Nested section labels and their destinations share the same smaller type and row treatment, so a third-level destination does not appear larger than its parent group.
- The selected density also applies inside the mobile drawer.

Adopt comfortable typography through the component prop. Do not override `.cui-nav-item` or global typography tokens.

## Adoption fixes

- `FilterToolbar` keeps a measurable flexible width beside sibling page actions. Wide pages keep their filters horizontal, while constrained containers still wrap and select the compact layout.
- Anchor elements carrying Product UI button classes retain the requested button colours and do not receive ordinary link underlines.
- Sortable `DataTable` headers use an inline flex row with 4px between the label and direction icon.

No prop changes are required for these fixes. Review layouts that previously added local workarounds; remove the workaround only after confirming the 0.11.0 output in the application.

## Compatibility

This release removes no exports, props, tokens or CSS classes. Compact sidebar density remains the default. Application routing, data, authentication, filters and persistence remain application-owned.

The hosted Storybook follows current `main`; the release archive is the supported installation source. Application owners remain responsible for authenticated and data-backed verification.
