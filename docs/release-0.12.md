# Upgrade to 0.12.0

Released 15 September 2026. Adds a new component and a new layout option, and fixes a sidebar sizing bug. No exports, props, tokens or CSS classes are removed or renamed.

## Install the release

1. Read the visible changes below.
2. Install the immutable archive:

   ```sh
   pnpm add --save-exact https://github.com/tomrosscd/cd-product-ui/releases/download/v0.12.0/convert-product-ui-0.12.0.tgz
   ```

   Use `npm install --save-exact` instead when npm owns the application's lockfile. For vendored installs, download the archive and `SHA256SUMS` from the same release, verify the checksum, and commit the archive with the manifest and lockfile.

3. Run the application's frozen install, build and tests before merging the upgrade.

## FormSection

A new component: an eyebrow heading with a rule beneath it, for grouping fields or read-only values inside a longer form or record-review layout.

```tsx
import { FormSection, Grid, Input, Select } from '@convert/product-ui'

export function ProjectIdentitySection() {
  return (
    <FormSection heading="Identity">
      <Grid columns={2} gap={16}>
        <Input label="Project name" />
        <Select label="Platform" options={platformOptions} />
      </Grid>
    </FormSection>
  )
}
```

`FormSection` only supplies the heading and the spacing around it; compose `Grid` or `Stack` inside for the field arrangement, and `Stack` around several sections for the gap between them. Adopt it where an application has been hand-rolling an uppercase label and a rule for this purpose — see [the component catalogue](component-catalogue.md).

## Grid `align`

`Grid` accepts a new `align` prop: `'start'` (default, unchanged) or `'stretch'`. Default `'start'` sizes each item to its own content, which is correct for a grid of unrelated cards. `align="stretch"` is for a row of comparable cards, such as a KPI/metric row, that should share one height per row even when one item's content wraps onto an extra line — previously every `Grid` hardcoded `align-items: start`, so a wrapped line on one card visibly mismatched its siblings' height.

```tsx
<Grid columns={4} align="stretch">
  <MetricCard heading="Active projects" value={52} />
  <MetricCard
    heading="Launching in 4 weeks"
    value={9}
    comparison={{ label: 'next: Porsche Singapore Integration, W38' }}
  />
  ...
</Grid>
```

## DashboardSidebar fix

A plain destination sitting beside a nested section in the same list — for example "Solution Architects" beside "FE"/"BE" inside an "Allocation" section — now shrinks to the same size as its nested siblings. Previously the shrink rule only ever matched a nested section's own trigger and its children, so a plain leaf at the identical indent kept the outer level's full size, and two rows in the same list read at different sizes purely because one happened to have children. No application change is required; this resolves on upgrade.

## Compatibility

This release removes no exports, props, tokens or CSS classes. Application routing, data, authentication, filters and persistence remain application-owned.
