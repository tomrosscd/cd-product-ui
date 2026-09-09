# Composing dashboards in an existing application

This guide describes additive components on the dashboard-composition branch. They are not in the 0.7.0 release. Install a reviewed archive containing this change before importing them.

A card owns its internal padding. Its parent owns the gap between cards and sections. Installing styles does not automatically arrange an application's existing markup.

## Choose the right layer

| Need                                           | Use                                 | Behaviour                                                                |
| ---------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------ |
| Vertical section rhythm                        | `Stack gap={24}`                    | One token-spaced column, with no external margin                         |
| Metrics or repeated panels                     | `Grid columns={4}`                  | At most four equal columns, collapsing to fit the parent                 |
| Wide summary and supporting panel              | `SplitLayout`                       | Two-to-one columns, then primary followed by secondary on narrow parents |
| Page title and actions                         | `PageHeader`                        | Sans-serif heading, context, description and wrapping actions            |
| People, projects or launch summaries           | `ContentList` and `ContentListItem` | Leading content, title, description, metadata and separate actions       |
| A read-only roadmap                            | `RoadmapBoard readOnly`             | Stage filter retained, editing controls hidden                           |
| Comparing dates, money or hours across records | `Table` or `DataTable`              | Preserve columns and use local horizontal scrolling where needed         |

Do not wrap an existing sidebar in a second `DashboardShell`. Put these content components inside the application's existing main area. That parent should have `min-width: 0` when it is a grid or flex child. The host owns page padding and background; use the existing spacing and surface tokens.

## Minimal composition

```tsx
import { Card, Grid, MetricCard, PageHeader, SplitLayout, Stack } from '@convert/product-ui'
import '@convert/product-ui/styles.css'

// Render inside the host application's main element.
export function DashboardContent() {
  return (
    <Stack gap={24}>
      <PageHeader heading="Delivery overview" description="Current work and capacity." />
      <Grid columns={4} minItemWidth={220}>
        <MetricCard heading="Active projects" value={12} />
        <MetricCard heading="Launching soon" value={4} />
        <MetricCard heading="Utilisation" value={68} unit="%" />
        <MetricCard heading="Needs attention" value={2} />
      </Grid>
      <SplitLayout
        primary={<Card heading="Delivery pipeline">Project summary</Card>}
        secondary={<Card heading="Needs attention">Review the next delivery date.</Card>}
      />
      <Card heading="Team capacity">Capacity content</Card>
      <Grid columns={2} minItemWidth={360} gap={24}>
        <Card heading="Allocation review">People to review</Card>
        <Card heading="Upcoming launches">Launch summary</Card>
      </Grid>
    </Stack>
  )
}
```

The full live example is **Patterns / Dashboard composition** in Storybook. Its source is `docs/dashboard-composition-example.tsx`. It includes four metrics, a wide three-column pipeline, supporting information, nine capacity entries and long list titles. It supplies local feedback for demo actions, not production routing or business logic.

`columns` is a maximum, not a forced count. `minItemWidth` is a preferred width in pixels: the grid can still shrink to one column below that size. Breaks respond to available parent width, not only the viewport. Grid starts items at the top rather than stretching a short supporting card to the height of a long list. `SplitLayout` wraps below 720px plus its gap; it preserves primary-then-secondary reading order. Direct children should be layout items, not fragments containing several ungrouped siblings.

## Lists and read-only boards

```tsx
<ContentList aria-label="Allocation review" density="compact">
  <ContentListItem
    leading={<Avatar name="Amelia Chen" />}
    title="Amelia Chen"
    description="Week 38 · 2 projects"
    meta={<Badge tone="negative">120% allocated</Badge>}
    actions={<Button aria-label="Review allocation for Amelia Chen">Review</Button>}
  />
</ContentList>
```

Give lists an accessible name or connect them to a visible heading using `aria-labelledby`. Pass a `TextLink` as the title for navigation. Give repeated action buttons distinct accessible names. Metadata and actions wrap when space is limited; long titles stay readable. Do not make an entire row a button containing another link or button. Use an explicit paragraph/empty state outside an empty list when there are no results.

`RoadmapBoard readOnly` hides stage and priority controls, even when callbacks are supplied. `RoadmapCard` also accepts `readOnly`. The default is `false` to preserve existing consumers: without callbacks, legacy cards still show disabled editing controls. This is presentation, not an authorisation boundary. Applications must enforce permissions themselves.

## Adoption checks

- Inspect the installed package version and actual component use before attributing a screenshot defect to the library.
- Keep a single parent Stack around all dashboard sections. Check there is a visible gap above and below each row.
- Test at 320, 390, 768, 1024 and 1440px, and inside narrower containers on a wide screen.
- Verify long titles, many entries, empty states, missing values, keyboard focus, both themes and zoom. Dense tables can scroll locally; the dashboard itself should not overflow.
- Use neutral badges for categories and semantic status labels for risk. Avoid treating colour alone as information.
- Progress clamps to its maximum. For over-allocation, show the actual percentage in text or a badge rather than pretending a clamped bar shows the full value.
- Keep project calculations, navigation, filters and saved data in the consuming application.

The coworker screenshot revealed touching rows and ad-hoc list composition. The app's source was not available, so this recipe must still be tested against its real imports and CSS. A blank action label or mixed typography cannot be diagnosed reliably from the screenshot alone.
