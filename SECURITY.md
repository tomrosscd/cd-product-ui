# Security policy

This is private, internal Convert Digital source (see [LICENSE](LICENSE)), not a public open-source project, so there is no public bug bounty or CVE process.

## Reporting a vulnerability

If you find a security issue in this library or its release scripts, report it directly to the repository maintainer rather than opening a public GitHub issue. Include the affected version, a reproduction, and the potential impact.

## Supported versions

Only the latest tagged release receives fixes. There is no long-term support branch for older 0.x versions; consuming projects should upgrade to the latest tag to receive a fix. See [the release process](docs/release-process.md) and [CHANGELOG.md](CHANGELOG.md) for what changed between versions.

## Scope

This library ships no backend, no authentication, and no data storage (see [docs/architecture.md](docs/architecture.md)) — most security-sensitive decisions (session handling, credential storage, remote data validation) belong to the consuming application, not this package. Issues in scope here are things like: an XSS vector reachable through a component's own rendering, a supply-chain concern in a pinned dependency, or a script in this repository that behaves unsafely.
