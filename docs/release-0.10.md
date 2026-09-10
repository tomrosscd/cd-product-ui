# Upgrade to 0.10.0

`0.10.0` adds controlled table state, file uploads and form steps, and fixes editing, numeric entry, selection and pagination. Released 11 September 2026.

## Install the release

1. Read the changed behaviour below, including intermediate release notes if upgrading from before 0.9.0.
2. In your application, run `pnpm add --save-exact https://github.com/tomrosscd/cd-product-ui/releases/download/v0.10.0/convert-product-ui-0.10.0.tgz`.
3. Run your application checks and review the affected screens.
4. Commit the manifest and lockfile together after review.

For npm projects, use `npm install --save-exact` for step 2 and `npm ci` in CI. Keep the application's existing package manager. For vendored installs, download the archive and `SHA256SUMS` from the same release, verify the checksum, and commit the archive with the manifest and lockfile.

## Review changed behaviour

| Area                | Required review                                                                                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Focus and sizing    | Post-0.9.0 token work changes the focus stroke from 2px to 1px and adds control sizes. Inspect focused controls in both themes.                                     |
| `InlineEdit`        | Reject `onSave` to keep the editor open with its draft and error. Do not catch a failed save and resolve it as success.                                             |
| `ColumnConfigPanel` | Treat `visibleKeys` as controlled state. Apply accepted changes in `onChange`.                                                                                      |
| Numeric inputs      | Enter decimal text using the selected locale. Invalid text remains visible and fails native validation. Arbitrary text, symbols and exponent notation are rejected. |
| `Combobox`          | Empty required selection fails validation. Disabled controls do not submit values. Loading or unavailable options cannot commit.                                    |
| `Drawer`            | Triggerless drawers restore opening focus. Supply `returnFocusRef` when the opener is removed or the drawer opens programmatically.                                 |
| `DataTable`         | Review multiple pinned columns after resizing, hiding or reordering columns. Use stable row IDs for selection.                                                      |

Pagination now uses an inline page-size label and 32px controls; navigation wraps onto a separate row in narrow containers. Styled select menus use one rounded focus indicator with a trailing checkmark. Review these defaults in any custom table footer or menu styling.

Existing component exports remain available. No application service or storage dependency is added.

## Use the additions

- For remote data, saved views and selection, follow [the table guide](data-table.md).
- For validated steps, attachments and editable records, follow [the form workflow guide](form-workflows.md).
- For component selection, use [the catalogue](component-catalogue.md).

## Validate and roll back

Run your application's frozen install, types, tests and production build. Review forms, tables and overlays with keyboard input, narrow layouts and the themes you support.

To roll back, revert the upgrade commit and reinstall from the restored lockfile. A passing library fixture does not establish that your application has been upgraded.

## Upgrading from 0.6.0

Review the [0.7](release-0.7.md), [0.8](release-0.8.md) and [0.9](release-0.9.md) notes alongside this release. Check host CSS, the existing application shell, forms and tables before adopting additional components. Reconcile any manifest and lockfile mismatch in the application before installing. Independent fixtures do not replace the application owner’s build and visual review.
