# 0.7.0: interaction quality

A consistency release rather than a feature one. No new components. It makes focus, dropdown interaction states and iconography behave the same way everywhere, and adds two Storybook reference pages so those states can be reviewed in one place instead of component by component.

Nothing was removed or renamed. Every export, prop, CSS class and icon name from 0.6.0 still exists and still means the same thing, so upgrading from 0.6.0 needs no code changes. Several components do look different in specific states, listed under "Visible changes" below, which is the part worth reviewing before you upgrade a live screen.

## Focus

- Formatted inputs (`CurrencyInput`/`PercentageInput`/`HoursInput`) drew two outlines when focused: the `.cui-affixed-input` wrapper's own perimeter, which correctly surrounds the prefix and suffix, plus a second redundant ring on the inner `<input>`. The inner one is now suppressed, so the field has one coherent focus perimeter.
- The primary button's focus ring was effectively invisible. `--cui-focus-colour` equals `--cui-accent-primary` in both themes, so a flush ring in the shared colour merged into the button's own border. The earlier fix for that recoloured the ring to `--cui-text-inverse`, which solved the merge but left a near-white ring on a near-white surface in light, and a near-black ring on a near-black surface in dark. Because `outline-offset` was `0`, the ring is drawn entirely outside the border box, so the contrast that matters is against the surface behind it, not against the button: 1.00:1 on a card in light, 1.04:1 on the page in dark, against the 3:1 WCAG 2.2 SC 1.4.11 asks of a focus indicator.

  It now keeps `--cui-focus-colour` and offsets the ring by its own width, so a band of the surrounding surface separates button from ring. That measures 11.79:1 and 12.40:1 in light, 12.01:1 and 9.34:1 in dark.

- The rest of the focusable surface was audited against the same rule and was already correct.

## Dropdown and menu states

- `Select`, `Combobox` and `ActionMenu` options previously borrowed `--cui-surface-selected`, the brand green that navigation uses for the current page and the calendar uses for range selection. A chosen option and the page you are on are different meanings, so options now have their own neutral tokens: **`--cui-dropdown-hover`** and **`--cui-dropdown-selected`** (added, nothing renamed). The checkmark carries "this is selected", not the row colour.
- `--cui-surface-selected` keeps its value and all its existing uses. Only its description narrowed, to say it is for current-navigation and calendar range selection rather than dropdown options.
- `Combobox`'s popup was unsized and inherited list indentation from the page, so its panel did not line up with its own trigger. Fixed, along with selection-column alignment and disabled-option behaviour.

## Icons

- `Icon` now resolves to a curated [Lucide](https://lucide.dev) set instead of hand-drawn paths. **Every existing name is preserved** (`overview`, `activity`, `projects`, `team`, `menu`, `close`, `arrow`, `chevron`, `check`, `help`), so no existing call site changes. Twenty-three names were added: `chevron-up`, `arrow-up`, `arrow-down`, `search`, `filter`, `sort`, `sort-up`, `sort-down`, `plus`, `minus`, `calendar`, `clock`, `edit`, `delete`, `upload`, `download`, `copy`, `external-link`, `settings`, `users`, `status`, `overflow`, `visibility`, `visibility-off`, `loading`.
- This adds **`lucide-react` as a runtime dependency**. Imports are explicit and named, never the dynamic catalogue, so bundlers tree-shake to only the icons actually used.
- Remaining literal Unicode symbols in the library are gone: `StyledSelect`'s scroll arrows, `Metric`'s trend arrows, `DataTable`'s sort indicators and `TextLink`'s external-link marker.
- `.cui-icon-spin` and `.cui-icon-inline` utilities were added, the latter for an icon sitting in running text rather than standing alone.

## Visible changes to review before upgrading

None of these are breaking API changes, but they do alter what an existing screen looks like:

| What                                                  | Before                                               | After                                                            |
| ----------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------- |
| Primary button, focused                               | Ring flush to the border, invisible against the page | Ring offset by 2px, clearly visible                              |
| Dropdown/menu option, hovered or selected             | Brand green, shared with navigation                  | Neutral `--cui-dropdown-*`                                       |
| Formatted input, focused                              | Two nested outlines                                  | One outline on the wrapper                                       |
| `PasswordInput` toggle                                | Literal "Show"/"Hide" text                           | `visibility`/`visibility-off` icons, same accessible name        |
| `Metric` trend, `DataTable` sort, `TextLink` external | Unicode characters                                   | Lucide icons                                                     |
| `DataTable` search                                    | No clear affordance beyond the browser's own         | Accessible clear button that resets to page 0 and restores focus |

## Storybook reference pages

- **Foundations/Dropdown states** — the five states a dropdown row can be in, rendered with the same classes and data attributes the real components use.
- **Foundations/Component states** — one page comparing rest, focus, selected, error, loading, read-only and disabled across buttons, inputs, search and password, formatted inputs, textarea, checkbox/switch/radio, selects, comboboxes, menus, date pickers, links, chips, tabs and navigation.
- **Foundations/Icons** — every icon name with usage guidance. The list is typed as `IconName[]`, so adding or removing an icon without updating the page fails type-check.

## Verification and adoption

Verified in light and dark, by keyboard and pointer, at 390px and at the 320px WCAG reflow width, with Storybook's accessibility addon reporting no violations. The focus ring fix was measured on genuinely keyboard-focused controls in Chromium, and a `Focus ring parity` story now pins the documentation's preview of the ring to the real rule, so it cannot drift.

Not covered by this release, and unchanged from 0.6.0: forced-colours mode, RTL (this library has no `[dir="rtl"]` support), and rendering with the licensed Roobert files, which are not present in the repository. Everything above was reviewed on the Geist fallback.

Upgrading is a version bump and a reinstall. Review any screen that leans on dropdown selection colour, since that is the change most likely to be noticed.
