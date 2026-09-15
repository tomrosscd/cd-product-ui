# Consistent list pages

Use this composition for Projects, Retainers, Clients and comparable record lists from **0.11.1**. Installing the package does not migrate a hand-built table or rearrange application-owned controls.

The executable reference is [Patterns / List pages](https://tomrosscd.github.io/cd-product-ui/?path=/story/patterns-list-pages--projects), with Projects, Retainers, Clients and Narrow examples. [The source](https://github.com/tomrosscd/cd-product-ui/blob/v0.11.1/docs/list-page.stories.tsx) uses synthetic records. Its callbacks illustrate presentation; keep real filtering, permissions, routes and persistence in the application.

## One composition

Use one application-owned wrapper for this structure across list routes. Pass page-specific data, filters and actions into it. Do not copy the wrapper separately into each route.

1. `Stack gap={24}` owns spacing between the header, toolbar and table.
2. `PageHeader` owns the title, description and page actions. Put New, Import and reminder actions here. Use `Button size="sm"` for commands. For Next.js navigation, use `Link` with `cui-button cui-button-sm`, plus `cui-button-primary` for the primary action. These are 32px single-line desktop controls; mobile and coarse-pointer controls retain the shared 48px touch targets; widths follow their labels. Keep the sidebar compact.
3. `FilterToolbar` owns search, results, table options and filters. Pass Views and Configure columns through `actions`, using small buttons. Do not put a separate sibling action group beside the whole toolbar.
4. `DataTable` owns the caption, headers, rows and pagination. Use `searchable={false}` when the toolbar already searches. Start with `density="compact"`, `pagination="full"` and `pageSize={15}` on all three routes. Use `tableLayout="scroll"` and a deliberate `tableMinWidth` for wide columns. Choose column sizes for their content. Avoid wrapping a captioned table in another titled card or band.

The toolbar caps desktop search at 320px, places table actions on the same row, and puts filters below. At container widths of 480px or less, search fills the available width and actions wrap below it. Keep filter labels visible. A long filter group must wrap within its container without widening the page.

```tsx
<Stack gap={24}>
  <PageHeader
    heading="Clients"
    description="All client accounts"
    actions={
      <Link href="/clients/new" className="cui-button cui-button-primary cui-button-sm">
        New client
      </Link>
    }
  />
  <FilterToolbar
    searchLabel="Search clients"
    searchValue={search}
    onSearchChange={setSearch}
    resultCount={filtered.length}
    actions={tableActions}
    filters={filters}
  />
  <DataTable
    caption="Clients"
    data={filtered}
    columns={columns}
    getRowId={(row) => row.id}
    searchable={false}
    density="compact"
    pagination="full"
    pageSize={15}
    tableLayout="scroll"
    tableMinWidth={900}
  />
</Stack>
```

This is a composition excerpt: import Product UI components from `@convert/product-ui` and `Link` from `next/link`; supply the application's state, columns, permission-gated actions and filtering callbacks. `900` is an example width, not a required width for every table.

## Controls and cells

- Use shared Input, StyledSelect, Combobox and Checkbox controls. Avoid local equivalents styled with copied colour and spacing rules.
- For StyledSelect's All option, use a non-empty value such as `all`. Radix Select reserves the empty string for clearing; `value=""` displays the placeholder. Translate `all` to the application's existing empty URL/query value when needed. Do not change filtering semantics to accommodate presentation.
- Use Badge for state/category labels and TextLink for record navigation. Do not change business labels or category meanings during migration.
- Use ActionMenu for row commands. Its trigger is a labelled button in this version; do not invent unsupported trigger or size props. Place conditional Close warranty inside the row menu so it cannot enlarge a narrow Days cell. Preserve its existing confirmation and permission checks.
- Keep related cell content on one line where practical. `.cui-row` wraps by default; a project marker and name may need an application-owned non-wrapping wrapper with `min-width: 0` on the text. Permit descriptive text to wrap without moving the status marker onto a separate line.
- Use `meta: { numeric: true }` for numeric columns. Retainer hours, rounding, missing values, thresholds and totals remain application-owned.
- Do not style a primary navigation action with only a background and a `text-white` utility. Inside `cui-root`, ordinary link styles can override that utility. Use the supported button classes, including the primary variant.

## Verify the whole migration

Before changing code, inventory each target route's table, filters, actions, local CSS and installed archive. Mark each as shared, local or mixed. After the migration, repeat the inventory and identify any remaining exception with a reason and owner.

Review all three pages together at 1440px and 390px, including a sidebar-expanded layout, long names, no matches, populated data, an open menu, a selected filter and the last pagination page. Verify:

- The three small header controls have equal 32px desktop heights (48px on mobile/coarse pointers) and aligned edges when on one line, including a wrapped reminder button beside direct links and a segmented control.
- Desktop search is at most 320px. Views and Configure share its row when there is room. Narrow layouts wrap without overlap or document overflow.
- Create/import actions appear in the header on every page. Table options appear in the toolbar. The same typography, captions, row-density setting and pagination variant apply throughout.
- Keyboard focus is visible, menus open and dismiss correctly, and controls retain accessible names.
- Filters, query parameters, saved views, inactive records, permissions, calculations, sorting and row commands still behave as before. Verify real app behaviour; the library's synthetic fixtures cannot establish it.

Record the tested commit, installed version/checksum, routes, viewport sizes, screenshots and check results. A successful build or a package version bump alone is not visual verification. If authenticated browser access is unavailable, state that application verification is pending and name the exact screens/states that still need checking. Do not report those pages as verified.
