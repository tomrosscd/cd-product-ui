# Review and release process

Keep tokens, components and guidance on one version initially. A release is an immutable package and matching Git tag. The Storybook build describes that same source revision.

1. Create a branch and explain the concrete change. Update stories, relevant tests, docs and CHANGELOG.md.
2. Run pnpm check, pnpm format:check and pnpm package:check. Inspect desktop, 390px mobile and long-content states. Check keyboard focus, mobile Escape/focus return, error recovery and reduced motion. Use the Convert rules and Impeccable review guidance.
3. Open a pull request in [cd-product-ui](https://github.com/tomrosscd/cd-product-ui) and have another developer review API, visual and accessibility changes. Follow CONTRIBUTING.md and the pull request template. Token changes must show affected components, not only a colour swatch.
4. Choose a version. Patches are compatible fixes; minors are compatible additions; majors are breaking API/token changes. During 0.x, use a minor for a breaking change and provide migration instructions.
5. Change package.json, refresh the lockfile, update displayed version labels and the changelog, then rerun the release checks. Inspect package contents for fonts, credentials and client material.
6. Commit the release and tag the approved commit, for example v0.1.0. Push the approved commit and its tag to GitHub. Do not move or overwrite release tags or packages. The README's versioned clone command must match an available tag.
7. Build the archive from that tagged revision using pnpm install --frozen-lockfile and pnpm pack --pack-destination artifacts. Share the archive with authorised consumers or let them build it from the same tag. A package registry, hosted Storybook and release-asset uploads are separate setup decisions. Only remove private:true when registry publication is deliberately configured.

## Consumer updates

Install an exact package version and commit the vendor archive, dependency and lockfile changes. Read migration notes and review important screens before merging. Avoid ranges or moving latest links where deterministic application builds are required. Roll back by reverting the application's upgrade commit and reinstalling from its restored lockfile. The README provides consumer commands for pnpm and npm.

## Repository and future distribution

GitHub is the source repository and the place for bug reports, feature requests and pull requests. Git tags identify fixed versions; the default branch contains ongoing work. No CI service, registry, Storybook hosting or cross-repository automation is configured. The local scripts provide the checks a future CI pipeline should run. Keep deployment credentials outside Git and resolve font hosting rights before distributing a font-containing catalogue.
