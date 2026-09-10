# Component guide

Use this guide to select components from the 0.10.0-rc.1 source candidate. Candidate additions are not in the released 0.9.0 archive. Use the component's Storybook documentation for props and live states. Components use the same generated tokens as the foundations reference.

## Choose the right component

| Need                       | Use                                                                       |
| -------------------------- | ------------------------------------------------------------------------- |
| Content surface            | Card, or SummaryCard for a named summary composition                      |
| Statistic or KPI           | Metric inside existing content; MetricCard for a complete card            |
| Label/value details        | KeyValueList or DetailsCard                                               |
| Completion                 | Progress or ProgressCard, with a visible label and optional target        |
| Parts of a total           | AllocationBar, with exact values and units                                |
| Explicit next action       | ActionCard with a Button or TextLink                                      |
| Navigation                 | TextLink; external icons do not force a new tab                           |
| Action                     | Button; quiet buttons still behave as buttons                             |
| Category, status or count  | Badge with meaningful text and a restrained tone                          |
| Text entry                 | Input, PasswordInput or Textarea                                          |
| Supporting field structure | Field for a custom control, with associated label, hint and error         |
| Selection                  | Select, Checkbox, RadioGroup or Switch                                    |
| Related views              | Tabs; arrow keys move between enabled tabs                                |
| Supporting detail          | Disclosure, using native details/summary semantics                        |
| Feedback                   | Alert, EmptyState, Spinner or Skeleton                                    |
| Confirmation               | ConfirmationDialog, with focus containment, cancellation and focus return |
| Supporting content         | Avatar, ResourceList or ActivityList                                      |
| Static comparison          | Table with a caption and row/column headers                               |
| Interactive data           | DataTable with typed columns, search, sorting and pagination              |
| Data visualisation         | DataChart and Sparkline from the optional charts entry                    |
| Roadmap                    | RoadmapBoard and RoadmapCard with application-owned item state            |
| Sign-in screen             | SignInForm, connected to the application's authentication handler         |
| Application frame          | DashboardShell and DashboardSidebar                                       |

## Forms and sign-in

Import the stylesheet once at the application root. The following component belongs in a client module when used with Next.js:

```tsx
'use client'
import { Input, Checkbox, Button } from '@convert/product-ui'

export function SettingsForm() {
  return (
    <form>
      <Input label="Workspace name" name="workspace" required hint="Use a name your team will recognise." />
      <Checkbox label="Send review reminders" name="reminders" />
      <Button type="submit">Save settings</Button>
    </form>
  )
}
```

Supply your own submit handler, validation and saving behaviour. Inputs accept native attributes and controlled or uncontrolled values. Keep visible labels; placeholders do not replace them. Field associates its child control through a render function, including supporting text IDs. PasswordInput preserves autocomplete and paste, and its reveal control does not submit a form.

SignInForm requires onSubmit and prevents the default browser submission. It does not contact an authentication service. The handler receives the form event; the host can read FormData and pass credentials directly to its chosen authentication service. Never log credentials, store them in library state or test with real credentials in Storybook. Supply loading and error props to reflect the host's request state. Recovery links and any SSO action are supplied by the host.

## Metrics and progress

Values and comparison text are supplied by the application. An upward trend is not automatically positive: set direction and sentiment independently. Supply the comparison period and units explicitly. The library does not calculate business metrics.

Progress displays overrun above max; omit value for indeterminate work. Target markers include a text description. AllocationBar shows shares of a total and keeps exact values in a visible legend. Negative or non-finite allocation values are treated as zero; validate business data before rendering.

## Tables

Table provides styling and semantic structure. Supply caption, thead/tbody and scoped headers. Use cui-numeric for numeric cells. Wide tables scroll within a labelled, keyboard-focusable region.

DataTable uses the pinned TanStack Table v8 implementation. Supply data and `ColumnDef<T>[]` definitions. The first sort is ascending, numeric values sort numerically, and searching resets pagination. Provide stable row IDs when possible. Custom cells can contain Badge, TextLink or Button. The application owns row actions and remote fetching.

DataTable supports controlled state, server pagination, selection and host-supplied expandable rows in 0.10.0. Follow [the table guide](data-table.md). It does not provide virtualisation or spreadsheet editing.

## Charts

The core entry does not import Recharts. Install the optional chart peers only in applications using charts:

```sh
pnpm add --save-exact recharts@3.10.1 react-is@19.2.8
# or: npm install --save-exact recharts@3.10.1 react-is@19.2.8
```

Match react-is to the application's React version. These pins match this release's tested React 19.2.8 setup.

```tsx
'use client'
import { DataChart } from '@convert/product-ui/charts'

export function ActivityChart() {
  return (
    <DataChart
      heading="Weekly completion"
      summary="Completed items increased from 3 to 8."
      kind="bar"
      data={[
        { week: 'Week 1', count: 3 },
        { week: 'Week 2', count: 8 },
      ]}
      xKey="week"
      series={[{ key: 'count', label: 'Completed items' }]}
    />
  )
}
```

DataChart supports line, area, bar, stacked-bar and donut recipes. Use one non-negative series for a donut. All-zero donut data shows an empty state. Missing observations remain gaps and display as Not available in the exact-values table. Charts use linear segments, disable animation and support keyboard tooltips. A textual summary and expandable data table accompany every recipe.

The approved chart palette supplies three series roles from existing Convert colours. Prefer up to three series, with clear labels and line styles. For more categories, use a bar chart or a table rather than repeating similar greens across a dense donut. Grid lines are supporting structure; they do not carry data on their own.

ChartContainer, ChartTooltipContent and ChartLegend are exported for specialised compositions with Recharts. Their API follows shadcn's compositional approach but their styling uses Convert tokens. Custom compositions must supply equivalent summaries, exact data access, labels and keyboard behaviour. Supply an explicit height; the container reserves space and provides initial dimensions for server rendering. Sparkline requires a text label explaining its trend and should accompany an exact metric or detailed chart.

## Roadmaps

Supply unique item IDs, unique column IDs and a controlled items array. The board never saves changes. onStageChange and onPriorityChange are requests to the application, which updates the array when appropriate. Omit either callback to disable that control. Unknown stage values remain visible in an Unassigned column.

Stage selection provides an accessible move action. Focus follows the moved item, or returns to the stage filter when the item leaves the filtered view. Columns scroll inside the board on small screens, and the stage filter offers another way to reach a column. Drag-and-drop is not included in this release.

The Storybook example includes an add-idea form using neutral data held only in example state. It demonstrates composition, not a shared persistence or permission system.

## Scope and updates

All these components retain the restrained Koko product appearance. Client categories, roadmap workflows, authentication, permissions, calculations and integrations remain in consuming applications. Charts are React-specific; tokens and compiled CSS remain usable in other frameworks.

Review keyboard, mobile, long-content, loading, empty and error states when upgrading. Follow the README for pinned archive installation and the release process for migration and rollback.

## 0.3.0 additions

ThemeProvider, ConvertLogo, ActionMenu, SearchSelect, DateRange, Tooltip, ToastRegion and Breadcrumbs extend the existing catalogue. Read [the usage and migration guide](./release-0.3.md) for contracts and limits. Storybook exposes Brand assets, Themes and Workspace controls with live examples.

## 0.4.0 changes

Breaking: Alert, EmptyState, Disclosure, ConfirmationDialog, DataChart, RoadmapBoard and SignInForm renamed their `title` prop to `heading`, matching Card. SignInForm's `pending` renamed to `loading`. No new components. Read [the migration guide](./release-0.4.md) for the full rename table and what was deliberately left unchanged.

## 0.5.0 additions

Pagination, StyledSelect, Calendar, DatePicker and MonthPicker plus opt-in table scrolling/full pagination are documented in [release-0.5.md](release-0.5.md). Existing native Select and DateRange contracts remain supported.

## 0.6.0 additions

Chip/ChipGroup, SegmentedControl/SegmentedMultiControl, Combobox, CurrencyInput/PercentageInput/HoursInput, PeriodNavigator and the FilterToolbar pattern are documented in [release-0.6.md](release-0.6.md).

## Dashboard composition additions (0.8.0)

- `Stack`, `Grid`, `SplitLayout`, `PageHeader`: parent-owned spacing and responsive content layout.
- `ContentList`, `ContentListItem`: flexible leading content, title, description, metadata and separate actions, with comfortable and compact density.
- `RoadmapBoard` / `RoadmapCard` `readOnly`: hide editing controls explicitly while preserving legacy defaults.
- Storybook **Patterns / Dashboard composition** is the complete adoption example. See [composition guidance](./dashboard-composition.md).

## Editing and workflow components

- `InlineEdit`: recoverable field editing with supplied controls and asynchronous saving.
- `Drawer`: record details with controlled dismissal and focus return.
- `ColumnConfigPanel`: controlled column selection, ordering and reset.
- `Stepper`: sequential progress display. `Wizard` composes validated steps and host-owned navigation.
- `FileUpload`: native file selection and controlled transfer states.
- `NotificationCentre`: supplied notifications with accessible unread state.
- `ErrorBoundary`: render-error fallback and host-owned recovery. It does not catch asynchronous event failures.

Follow [the form workflow guide](form-workflows.md) for ownership and integration requirements.

## Public export checklist

This checklist includes runtime helpers and compositions that share implementation files. `pnpm docs:check` compares it with the public exports.

| Area                  | Exports                                                                                                                                                                     |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Foundations           | Icon, ConvertMark, ConvertLogo, ThemeProvider, useProductTheme, brandAssets                                                                                                 |
| Layout                | Stack, Grid, SplitLayout, PageHeader, DashboardShell, DashboardSidebar                                                                                                      |
| Forms                 | Field, Input, PasswordInput, Textarea, Checkbox, Switch, RadioGroup, Select, StyledSelect, SearchSelect, Combobox                                                           |
| Dates and values      | Calendar, DatePicker, MonthPicker, DateRange, PeriodNavigator, CurrencyInput, PercentageInput, HoursInput                                                                   |
| Actions and choices   | Button, TextLink, Chip, ChipGroup, SegmentedControl, SegmentedMultiControl, FilterToolbar                                                                                   |
| Content               | Card, SummaryCard, DetailsCard, ProgressCard, ActionCard, KeyValueList, Avatar, ResourceList, ActivityList, ContentList, ContentListItem                                    |
| Metrics and tables    | Metric, MetricCard, Progress, AllocationBar, Table, DataTable, Pagination, ColumnConfigPanel                                                                                |
| Feedback and overlays | Badge, Alert, EmptyState, Spinner, Skeleton, ErrorBoundary, Tabs, Disclosure, ConfirmationDialog, Drawer, ActionMenu, Tooltip, ToastRegion, NotificationCentre, Breadcrumbs |
| Workflows             | RoadmapCard, RoadmapBoard, SignInForm, InlineEdit, Stepper, Wizard, FileUpload                                                                                              |
| Optional charts       | ChartContainer, ChartTooltipContent, ChartLegend, DataChart, Sparkline                                                                                                      |
