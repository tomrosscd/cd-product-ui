# Independent adoption fixture

Synthetic data only. This is an audit reproduction, not application code or a copy of `cd_capacity`. Never run these commands in a coworker checkout. Sources have `.template` suffixes so this archived fixture does not enter the library's own TypeScript, lint or Storybook builds.

Use Node 22.22.2, npm 10.9.7, or pnpm 10.33.0. The baseline pins Next 15.5.23, React 19.2.8, Tailwind/PostCSS plugin 4.3.3 and PostCSS 8.5.26. This combines the consumer's npm-locked Next version with its manifest's intended Tailwind 4 pipeline. The second tested configuration uses Next 15.5.25 and PostCSS 8.5.28, matching its pnpm lock. It is not a reconstruction of either complete application lockfile.

## Prepare outside the repository

```sh
python3 prepare.py /private/tmp/my-independent-cui-audit
```

In the Product UI library, check out the exact audited revision in an authorised library workspace, install its frozen dependencies and pack to a new output directory:

```sh
pnpm install --frozen-lockfile
pnpm pack --pack-destination /private/tmp/my-cui-package
```

The audited revision is `78dd64e16d2aa7ae7e106687e11cb18bcc46ea04`. Its package still identifies itself as `0.9.0`, despite being unreleased. Keep its archive separate from the real `v0.9.0` release. Copy that newly built library archive into the fixture's `vendor/` folder, then run inside the fixture:

```sh
npm install
NEXT_TELEMETRY_DISABLED=1 npm run build
npm run dev -- --port 3217
```

For the documented-release experiment, start with a separate freshly prepared fixture, remove the local Product UI dependency from its own manifest, then follow the documented command:

```sh
npm install --save-exact https://github.com/tomrosscd/cd-product-ui/releases/download/v0.9.0/convert-product-ui-0.9.0.tgz
```

Compare the old library archive only if it is independently available. The audit read the consumer's existing library archive and copied only that distribution into the audit workspace; no application code, data or credentials were copied. Use the same baseline screen and dependency pins for comparisons. The original comparison builds preceded the addition of the document title and reproduction route.

## Current-main reproductions

After baseline comparisons, copy `main-probes/page.tsx` into `app/probes/page.tsx` inside the generated fixture. This route requires the unreleased exports and cannot be used for a `0.6.0` or tagged `0.9.0` comparison. Open `/probes`.

- Load saved view B, then open Configure columns: parent state says B, but Alpha remains checked.
- Edit Notes and Save: a synthetic rejected promise is caught by the host; the editor stays disabled with `saving=true`.
- Enter `1.234,56` in Euro amount: the model becomes `1.23456`, displayed as `1,23` after blur.
- Open controlled drawer and press Escape: focus returns to the document body. Inline-edit cancellation has the same symptom.
- Scroll the two-column sticky table: rendered widths grow beyond the offsets calculated from declared sizes.
- Press Enter in Loading choice: a hidden stale option is selected. The form also demonstrates missing required-value validation and disabled-value submission.
- At 1280 × 700, centre the date trigger in the viewport, open it, type a valid date and try Apply. The panel ignores the smaller available popover height, leaving its actions below the viewport.
- Inspect the column panel's 24 × 16 reorder controls and the notification items' accessibility names.

Browser scripts use Playwright and axe already installed in the audited library; no browser libraries are copied into this fixture. Set `CUI_LIBRARY` to that absolute library directory, create `audit-results/`, start the fixture on port 3217, and run:

```sh
node browser-checks.mjs
node extra-browser-checks.mjs
node date-probe.mjs
```

The scripts record observations, including known failures; a successful script exit is not a component pass. `browser-checks.mjs` can time out on the known date-picker defect, records that failure and continues. `date-probe.mjs` records its exact geometry. Theme scans wait for CSS transitions; mobile focus checks wait for the dialog to close.

`tailwind3-check.mjs` is a separate CSS experiment. Install Tailwind 3.4.19 and PostCSS 8.5.28 in another empty directory, copy that script there and replace its two audit-temporary archive paths with your own equivalent archives. It processes the packed stylesheet without adding host Tailwind directives, reproducing the old failure and current fix.

No Supabase route, credentials, authentication, production API, remote font or chart is needed. The stylesheet comes only from the packed package. Host CSS contains synthetic tokens and a visibly separate blue-bordered host control. Clean installs and generated outputs belong in the disposable fixture, not this archived source folder. Retain your generated lockfiles locally if repeating the experiment; all audit build results and exact resolved stack pins are recorded in the report.
