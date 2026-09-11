# Contributing to Convert Product UI

Use this repository to propose improvements to the shared library. Applications install a versioned package; contributors improve the source here.

## Ideas and bug reports

Search [existing issues](https://github.com/tomrosscd/cd-product-ui/issues), then use the [issue templates](https://github.com/tomrosscd/cd-product-ui/issues/new/choose).

Feature requests should explain a real dashboard or internal-tool need, what the existing components cannot do, and the proposed behaviour. You do not need to write code. Discuss new components, framework adapters and breaking changes before starting a large implementation.

Bug reports should include the installed library version, reproduction steps, expected and actual behaviour, and the browser/framework involved. Use neutral sample data. Do not include credentials, client data or private screenshots.

## Make a change

1. With repository write access, clone this repository and create a branch. Without write access, fork it on GitHub, clone your fork, and create a branch there. Follow the repository's licence and your team's access rules.
2. Follow the README to install the pinned tooling and run Storybook. Read [AGENTS.md](AGENTS.md), [architecture](docs/architecture.md) and [AI guidance](docs/ai-guidance.md).
3. Make a focused change. Keep components generic, typed and reusable. Client data, authentication, routing ownership and business logic belong in applications.
4. Update relevant stories, guidance and tests. For tokens, edit `tokens/tokens.json`, run `pnpm tokens`, and include the generated changes.
5. Describe the change under the relevant version heading in [CHANGELOG.md](CHANGELOG.md). Include migration steps for breaking changes. Maintainers assign the release version.
6. Run the checks below, inspect the affected Storybook states, and commit the result.
7. Push your branch and open a pull request against `tomrosscd/cd-product-ui`'s `main` branch. For a fork, select your fork's branch as the source. Link the relevant issue and complete the pull request template.

```sh
git switch -c improve-select-guidance
pnpm exec playwright install chromium
pnpm check
pnpm format:check
pnpm package:check
```

The branch name is an example. For documentation-only changes, check formatting and links, and rebuild Storybook when catalogue documentation changes. Explain checks run and anything not verified in the pull request.

## Review expectations

- Preserve the approved Convert product palette, surface hierarchy, spacing and Roobert/Geist typography. Impeccable guides review within that system.
- Show affected components when changing a shared token. A swatch alone does not demonstrate its effect on a dashboard.
- Verify relevant default, hover, focus, disabled, loading, empty and error states. Check keyboard operation, visible labels, focus return and mobile behaviour.
- Review long content and narrow screens. Respect reduced motion. Automated accessibility checks supplement manual review.
- Use Australian English and no em dashes in interface copy.
- Keep fonts, client references, secrets and generated build output out of Git. Do not edit the original reference projects.
- Test the packed library when changing exports, dependencies, styles or component behaviour. A working Storybook alone does not prove an application can install the package.

A maintainer reviews API, visual and accessibility effects before merging. Contributors should not publish packages or create release tags from their own branches. Merging a pull request does not automatically update consuming applications.

## Releases and adoption

Maintainers group approved changes, update the version and changelog, run the release checks, and create an immutable version tag. See [the release process](docs/release-process.md).

Application teams then choose when to install that release, review their own screens and merge their dependency update. Keep the previous version available for rollback.
