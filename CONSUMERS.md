# Track known consumers

Before releasing changed APIs or visual defaults, review this list and the [compatibility policy](docs/release-process.md#backward-compatibility). Record upgrades only after the application owner confirms them.

| Project                                                      | Contact         | Installed version          | Evidence date | Verified scope                                                                                                                                                   |
| ------------------------------------------------------------ | --------------- | -------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [cd_capacity](https://github.com/SebastianKlett/cd_capacity) | Sebastian Klett | 0.6.0 archive in `vendor/` | 2026-09-10    | Read-only source inspection at `6e6691d5902032233154d0c1dfd4e1daf178f282`. Dashboard adoption is partial. Next.js 15, React 19 and intended Tailwind 4 pipeline. |

The inspected revision's npm CI fails because its lockfile disagrees with the manifest. The application owner must choose the package manager and reconcile the lockfile.

No application build or upgrade was performed during this audit or implementation. Independent fixtures are compatibility evidence, not consumer upgrade confirmation. See [the audit](docs/audits/2026-09-10-adoption-audit.md).

## Add a consumer

Record the installed archive version, framework, React version, CSS pipeline, package manager and confirmation date. Keep client data and credentials out of this file.

The library has no telemetry or cross-repository automation. This list supports release coordination; it does not replace each application's checks.
