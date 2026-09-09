# Known consumers

This is the checklist referenced by [docs/release-process.md](docs/release-process.md#backward-compatibility). Before shipping a breaking change, check this list and tell anyone on it what's changing before the release goes out, not after. After they upgrade, update their row.

Add a row whenever someone installs this package into a new project — the whole point of this file is that it can only protect people it knows about.

Record the consuming stack, not just the version. Tailwind's major version, the framework and how the package is installed are exactly the details that turn a routine change into someone else's broken build: the first consumer's Next.js build hard-failed on Tailwind-v4-only CSS while their application was still on v3.

| Project                                                                 | Contact         | Installed version | Last confirmed | Notes                                                                                                                                                                                                                                                                                         |
| ----------------------------------------------------------------------- | --------------- | ----------------- | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [cd_capacity](https://github.com/SebastianKlett/cd_capacity) (Planwerk) | Sebastian Klett | 0.6.0             | 2026-09-09     | Next.js 15 App Router, React 19, Tailwind v4, Supabase auth. Installs the archive from `vendor/`. 0.9.0 verified to build against this app on 9 September 2026: clean build, 104 app tests passing, no API changes needed. Three visible defaults change on upgrade, see docs/release-0.9.md. |

## Why this file exists

Nothing else in this repository can answer "will this breaking change affect anyone?" — there's no telemetry, no registry with download counts, and no CI running against other repositories. This file is the entire mechanism. If it's out of date, the backward-compatibility process in docs/release-process.md degrades back into "hope nobody's using it," which is exactly the failure mode it exists to prevent.
