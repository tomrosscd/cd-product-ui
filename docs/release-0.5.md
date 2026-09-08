# 0.5.0 candidate: readable tables and branded pickers

Pass 1 of the approved roadmap. Pending review; v0.4.0 remains the latest approved release. No existing exports, props or defaults are removed.

## Readable tables

Use `Table layout="scroll" minWidth={640}` or `DataTable tableLayout="scroll" tableMinWidth={640}`. The width is an application choice appropriate to the columns; wide content scrolls inside the labelled table region. Short statuses and numeric cells remain intact. Legacy layout remains the default for existing applications. Priority-column and stacked-record views are planned separately.

Use `DataTable pagination="full"` to adopt the new responsive Pagination. Existing pagination remains default. The dashboard example opts into both improvements. Pagination sits outside the table scroll region, and uses container width to hide numbered jumps in compact layouts.

## Pagination

`Pagination` accepts one-based page, pageSize, total and onPageChange. Optional onPageSizeChange/pageSizes enable the branded page-size selector. Changing size requests page 1. The host owns fetching and controlled state. Invalid numeric values are normalised for display. Single-page results show the result summary without unnecessary previous/next controls. For unknown remote totals, wait for the later server-table feature rather than inventing a total.

## Branded selection

`StyledSelect` is an additive, Radix-backed single-value listbox with label, options, optional groups, value/defaultValue, onValueChange, name, required, hint/error, disabled and loading states. Option values must be unique non-empty strings; empty is reserved for clearing/placeholder state by Radix. It supports keyboard navigation, typeahead, focus return, scrolling and theme-aware portals. Existing native Select keeps its event/form contract. Use StyledSelect for a consistent branded popup; ActionMenu remains for commands, not choosing a form value.

## Date-picker family

- `DatePicker`: one field opening a calendar panel; mode single or range. The range has one combined field, not two persistent start/end controls.
- `DatePicker presets`: optional labelled application-supplied date ranges. The library does not decide fiscal periods or calculate business dates.
- `Calendar`: inline single/range selection, controlled by the host.
- `MonthPicker`: branded month/year selection with explicit year bounds.

Dates use ISO YYYY-MM-DD strings, representing calendar dates rather than timestamps. DatePicker keeps a draft while open: Apply commits, Cancel/Escape discards, Clear empties the draft until Apply. Typed entry uses YYYY-MM-DD, or YYYY-MM-DD / YYYY-MM-DD for a range. Invalid dates, reversed/incomplete ranges and values beyond min/max disable Apply. Name adds hidden committed form values. Calendar shows two months for ranges on wide screens and one on mobile. MonthPicker emits YYYY-MM. Its year range is capped at 300 options; keep supplied value and bounds consistent.

The visual language follows the approved Convert tokens: restrained surface, label, selected and focus states. React DayPicker supplies calendar keyboard/date-selection mechanics; Radix supplies popup and selection mechanics. No Material runtime, branding, fonts or animation library is added. Existing DateRange remains available with its native-input contract.

## Verification and adoption

Review Components / Pass 1 controls, then the dashboard in both themes. Every release must pass API snapshots, browser tests, formatting, lint/types, package and Next.js consumer checks, and CI. Keep the existing v0.4.0 install instructions until the candidate is reviewed and tagged. Current application defaults are deliberately unchanged; adopting the new variants is an explicit application edit.
