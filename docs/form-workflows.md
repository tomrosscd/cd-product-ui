# Compose form workflows

Use these components for editing and uploads across application domains. Your application owns validation, authorisation, persistence and transfer cancellation.

## Edit a record

Use `InlineEdit` for one field. Render the editor through `children` and use its `commit`, `cancel`, `saving` and `error` values.

Reject `onSave` when persistence fails. The component retains the mounted editor and draft, displays `saveErrorLabel` and permits retry. Resolved saves close the editor.

Disable submitted controls while `saving` is true. Duplicate commits and cancellation are blocked until the promise settles. Escape closes an idle editor and restores trigger focus.

For quick entry, compose native form controls with explicit Save and Cancel buttons. Use native form validation before calling your save handler. Do not introduce spreadsheet navigation for ordinary forms.

## Edit in a drawer

Use a controlled `Drawer` for record details. Render loading, dirty, saving, saved and failed states from your application.

If closing would discard changes, reject the close request in `onOpenChange` and present a confirmation. Keep the draft until the application confirms dismissal.

Use `returnFocusRef` when the opening element disappears or a background action opens the drawer. Nested dialogs retain Radix focus management.

## Validate multiple steps

Use `Wizard` with `steps`, `activeId`, `onNext` and optional `onBack`. Place fields in `children`; do not nest another form.

Native required fields block submission. For asynchronous validation, set `loading` and leave `activeId` unchanged until validation succeeds. Supply `error` when it fails.

The host changes `activeId` and renders completion. Focus moves to the step heading after a change. Set `nextLabel` to describe the final action.

## Select attachments

Use `FileUpload` with controlled `attachments`. `onFilesSelected` receives files from a native picker. The component makes no network request.

Validate file type, size and content in your application and server. The native `accept` filter is a picker hint, not validation.

Update each attachment's `state`, `progress` and `error` during transfer. Implement `onRetry` and `onRemove`; cancel active requests before removing an uploading item.

The picker resets after selection so users can retry the same file. Use the controlled attachment list as the source of truth, not the native input value.
