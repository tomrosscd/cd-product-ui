# Track known consumers

Before releasing changed APIs or visual defaults, review this list and the [compatibility policy](docs/release-process.md#backward-compatibility). Record upgrades only after the application owner confirms them.

| Project                                                      | Contact         | Installed version                                   | Evidence date | Verified scope                                                                                                                                                                                                       |
| ------------------------------------------------------------ | --------------- | --------------------------------------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [cd_capacity](https://github.com/SebastianKlett/cd_capacity) | Sebastian Klett | 0.11.0, user-reported upgrade and vendored manifest | 2026-09-15    | Read-only source at `9b834654309645e6dc60f2a7e2bcd0f5bd8e7258`. Projects/Clients use shared tables; Retainers remains local. Authenticated application checks and installed archive checksum were not verified here. |

The historical 10 September revision's npm CI failed because its lockfile disagreed with the manifest. That historical finding is not a statement about the September 15 lockfile or CI.

No application build or upgrade was performed during this audit or implementation. Independent fixtures are compatibility evidence, not consumer upgrade confirmation. See [the audit](docs/audits/2026-09-10-adoption-audit.md).

## Add a consumer

Record the installed archive version, framework, React version, CSS pipeline, package manager and confirmation date. Keep client data and credentials out of this file.

The library has no telemetry or cross-repository automation. This list supports release coordination; it does not replace each application's checks.

## 15 September 2026 source check

The user reports cd_capacity upgraded to 0.11.0. Read-only inspection at `9b834654309645e6dc60f2a7e2bcd0f5bd8e7258` confirms a vendored 0.11.0 manifest, shared Projects/Clients tables and a local RetainerTable. The compact-sidebar correction is merged. The September 10 CI findings are historical and have not been rechecked. No consumer install, tests, build or source changes were performed here. The user authorised the 0.11.1 fixes and migration handoff; authenticated app verification remains with the application owner.
