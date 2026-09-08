# 0.6.0: everyday controls

Pass 2 of the user's re-prioritised roadmap (see ROADMAP.md). Shipped in v0.6.0 (merged and tagged 9 September 2026, alongside Pass 1 — see [release-0.5.md](release-0.5.md)). No existing exports, props or defaults were removed.

## Chip / ChipGroup

`Chip` is an interactive tag: pass `onSelect` for a toggleable filter chip (renders a real `<button aria-pressed>`), `onRemove` for a removable one, or both together. Use `Badge` instead for a non-interactive status label. `ChipGroup` renders a set of chips sharing one multi-select `value`.

## SegmentedControl / SegmentedMultiControl

Built on the new `@radix-ui/react-toggle-group` dependency. `SegmentedControl` is single-selection and always keeps exactly one option on (e.g. Weeks/Months); `SegmentedMultiControl` allows any number on or off. Options use the existing `ChoiceOption` shape.

## Combobox

Searchable single (`multiple?: false`) or multi-select (`multiple: true`), discriminated by the `multiple` prop with a matching `value`/`onValueChange` type. Filters `options` locally by label by default; supply `onSearchChange` to own filtering remotely instead (called on every keystroke), with `loading`/`error` reflecting the request state. Multi-select renders selections as removable `Chip`s above the search field. No Radix combobox primitive exists, so this is a hand-rolled ARIA combobox listbox pattern (`role="combobox"` + `aria-activedescendant`) on top of `@radix-ui/react-popover`.

## CurrencyInput / PercentageInput / HoursInput

Formatted numeric inputs (`value: number | undefined`, `onValueChange`). Show the raw editable value while focused and a locale-formatted display (with the currency symbol or `%`/`hrs` suffix) otherwise. The application keeps calculations, totals and rounding rules. `PercentageInput` shows a plain number (`42` for 42%), not a 0–1 fraction. `locale` defaults to `en-AU`; `CurrencyInput`'s `currency` defaults to `AUD`.

## PeriodNavigator

Previous/next chrome for an application-defined period: pass the current period already formatted as `label`, and `onPrevious`/`onNext` callbacks. Does not calculate period boundaries — a week, a month, a quarter are all the application's decision. Optional `onToday` shortcut and `presets` for reporting periods.

## FilterToolbar (pattern)

Composes existing controls into a search/filter bar rather than defining its own filter types: a search `Input`, an application-supplied `filters` slot (pass a `StyledSelect`, `Combobox` or `SegmentedControl`), a result count, and removable active-filter `Chip`s with a "Clear all" action. Reflows to a stacked layout under roughly 480px of container width.

## Fixed along the way

- `Icon` silently dropped its own base class when a caller passed `className`, since it spread the caller's props after a hardcoded `className` attribute instead of merging them. Every existing usage happened not to pass one, so this was invisible until `PeriodNavigator`'s flipped arrow icon needed it.
- A Radix Popover race in `Combobox`: the same click that focuses and opens the input was read as an "outside" interaction and immediately closed the panel it had just opened (fixed with `onInteractOutside`), and a follow-on bug where committing a single selection's programmatic refocus re-triggered `onFocus` and reopened the panel, blanking the displayed value (fixed with a suppress-next-focus ref).

## Verification and adoption

Review the new components under their own Components sections (Chip, Segmented control, Combobox, Formatted inputs, Period navigator) and Patterns/Filter toolbar, in both themes and at mobile widths. Every release passed API snapshots, browser tests, formatting, lint/types, package and Next.js consumer checks, and CI before merging. Current application defaults are unaffected — every addition here is a new, opt-in component.
