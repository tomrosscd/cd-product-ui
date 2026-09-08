# Review and release process

Keep tokens, components and guidance on one version initially. A release is an immutable package and matching Git tag. The Storybook build describes that same source revision.

1. Create a branch and explain the concrete change. Update stories, relevant tests, docs and CHANGELOG.md.
2. Run pnpm test:dark, pnpm check, pnpm format:check and pnpm package:check and pnpm next:check locally before pushing. `.github/workflows/ci.yml` runs the same commands on every push and pull request — a red CI check means the branch is not ready, regardless of what ran locally. Inspect desktop, 390px mobile and long-content states. Check keyboard focus, mobile Escape/focus return, error recovery and reduced motion. Use the Convert rules and Impeccable review guidance.
3. Open a pull request in [cd-product-ui](https://github.com/tomrosscd/cd-product-ui) and have another developer review API, visual and accessibility changes. Follow CONTRIBUTING.md and the pull request template. Token changes must show affected components, not only a colour swatch. Merge only once CI is green.
4. Choose a version. Patches are compatible fixes; minors are compatible additions; majors are breaking API/token changes. Read "Backward compatibility" below before choosing a breaking change during 0.x — it is not automatically fine just because semver technically allows it.
5. Change package.json, refresh the lockfile, update displayed version labels and the changelog, then rerun the release checks. Inspect package contents for fonts, credentials and client material.
6. Commit the release and tag the approved commit, for example v0.1.0. Push the approved commit and its tag to GitHub. Do not move or overwrite release tags or packages. The README's versioned clone command must match an available tag.
7. Build the archive from that tagged revision using pnpm install --frozen-lockfile and pnpm pack --pack-destination artifacts. Share the archive with authorised consumers or let them build it from the same tag. A package registry, hosted Storybook and release-asset uploads are separate setup decisions. Only remove private:true when registry publication is deliberately configured.

## Backward compatibility

This library has real consumers outside its own demos (see [CONSUMERS.md](../CONSUMERS.md) for who). A breaking change that isn't coordinated with them is a production incident in someone else's project, not a version-bump technicality. Before shipping any change that removes or renames an existing export, prop, or CSS class, or changes an existing component's default visual behaviour:

1. **Check [CONSUMERS.md](../CONSUMERS.md) first.** If anyone is listed against the version you're about to obsolete, tell them what's changing and roughly when, before the release, not after.
2. **Prefer additive changes.** A new prop with a better name, alongside the old one, costs little and breaks nothing. Only remove the old one in a later release once nothing depends on it, or when a consumer has explicitly confirmed they're not.
3. **When a breaking rename is genuinely the right call** (e.g. cleaning up inconsistent naming across components), do it as a dedicated minor version with nothing else bundled into it, so a consumer's upgrade diff shows exactly one kind of change. Document every renamed/removed prop as an explicit table in that version's release notes (see docs/release-0.3.md for the format), not just prose.
4. **Give a deprecation window where practical.** If a prop can keep working with a `console.warn` pointing at the replacement for one release before removal, do that instead of a silent hard break — a warning a consumer can ignore for now is much cheaper for them than a broken build.
5. **Update [CONSUMERS.md](../CONSUMERS.md)** with the new version once a consumer confirms they've upgraded, so the list stays accurate for the next breaking change.

This applies to component APIs and to generated tokens/CSS class names equally — a renamed `--cui-*` variable or `.cui-*` class is exactly as breaking as a renamed prop.

### Mechanical enforcement

The steps above rely on someone remembering to follow them, which is not a real safeguard on its own. `pnpm api:check` (wired into `.github/workflows/ci.yml`) diffs the actual compiled public API — every exported component, prop and type across all three entry points (`.`, `./tokens`, `./charts`) — against the accepted snapshots in `etc/*.api.md`. Any change to that surface fails CI with a readable diff, whether or not the person making it thought to check CONSUMERS.md first.

This does not replace the human judgment above — it only guarantees a breaking change can't land silently. When a change is intentional, run `pnpm api:update` to regenerate and accept the new snapshot, and commit the updated `etc/*.api.md` files alongside it so the PR diff shows reviewers exactly what changed.

## Consumer updates

Install an exact package version and commit the vendor archive, dependency and lockfile changes. Read migration notes and review important screens before merging. Avoid ranges or moving latest links where deterministic application builds are required. Roll back by reverting the application's upgrade commit and reinstalling from its restored lockfile. The README provides consumer commands for pnpm and npm.

## Repository and future distribution

GitHub is the source repository and the place for bug reports, feature requests and pull requests. Git tags identify fixed versions; the default branch contains ongoing work. `.github/workflows/ci.yml` runs the full check suite on every push and pull request; `.github/dependabot.yml` opens weekly PRs for outdated pinned dependencies (review each one against this process rather than auto-merging). A package registry, hosted Storybook and cross-repository automation remain separate, not-yet-made setup decisions. Keep deployment credentials outside Git and resolve font hosting rights before distributing a font-containing catalogue.
