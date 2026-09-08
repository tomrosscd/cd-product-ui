# Known consumers

This is the checklist referenced by [docs/release-process.md](docs/release-process.md#backward-compatibility). Before shipping a breaking change, check this list and tell anyone on it what's changing before the release goes out, not after. After they upgrade, update their row.

Add a row whenever someone installs this package into a new project — the whole point of this file is that it can only protect people it knows about.

| Project                            | Contact                    | Installed version                 | Last confirmed  | Notes |
| ---------------------------------- | -------------------------- | --------------------------------- | --------------- | ----- |
| _fill in: coworker's project name_ | _fill in: coworker's name_ | _fill in: version they installed_ | _fill in: date_ |       |

## Why this file exists

Nothing else in this repository can answer "will this breaking change affect anyone?" — there's no telemetry, no registry with download counts, and no CI running against other repositories. This file is the entire mechanism. If it's out of date, the backward-compatibility process in docs/release-process.md degrades back into "hope nobody's using it," which is exactly the failure mode it exists to prevent.
