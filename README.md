# Convert Product UI

A shared design system for Convert dashboards and internal tools. Install it in your project to reuse consistent colours, spacing, typography and interactive components. Each project stays on its chosen version until its developers decide to upgrade.

**Current version: 0.4.0.** React components, framework-neutral tokens and compiled CSS are available now. Storybook runs locally; a hosted catalogue and package registry are not yet configured.

[Browse Storybook](#browse-the-components-locally) · [Install](#install-in-your-project) · [React](#use-with-react) · [Tokens and CSS](#use-tokens-and-css-in-other-frameworks) · [Updates](#update-an-existing-project) · [Contribute](CONTRIBUTING.md) · [Changelog](CHANGELOG.md)

## What is included?

| Area               | Included                                                                                                               |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| Foundations        | 92 documented tokens for colours, surfaces, spacing, typography, borders, focus, motion and responsive layout          |
| Components         | Forms, badges, links, feedback, metrics, progress, tables and supporting content, alongside the original components    |
| Layout             | DashboardShell, roadmap board, sign-in form and reusable card compositions                                             |
| Storybook          | Searchable token reference, five chart recipes, interactive states and neutral dashboard, roadmap and sign-in examples |
| Developer guidance | Typed APIs, consumption examples, release checks and instructions for AI coding tools                                  |

Koko Monthly Review V4 defines the product visual language. The new Convert website informs technical conventions. This library is independent of both references and contains no client data or business logic.

## Version history

| Version                                     | Date             | Highlights                                                                                                                                                                  |
| ------------------------------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [0.4.0](CHANGELOG.md#040--8-september-2026) | 8 September 2026 | **Breaking** — see [migration guide](docs/release-0.4.md). Renames `title` to `heading` on 7 components; adds an enforced public API surface check.                         |
| [0.3.1](CHANGELOG.md#031--8-september-2026) | 8 September 2026 | Patch: bug fixes from a full codebase audit, CI/Dependabot, and a backward-compatibility policy. No public API changes.                                                     |
| [0.3.0](CHANGELOG.md#030--8-september-2026) | 8 September 2026 | Dark theme, official Convert brand assets and logos, ActionMenu, Tooltip, ToastRegion, Breadcrumbs, SearchSelect, DateRange                                                 |
| [0.2.0](CHANGELOG.md#020--8-september-2026) | 8 September 2026 | Forms, Badge, TextLink, Tabs, Disclosure, ConfirmationDialog, feedback components, Metric/Progress, DataTable, optional charts, RoadmapBoard, SignInForm, card compositions |
| [0.1.0](CHANGELOG.md#010--7-september-2026) | 7 September 2026 | Initial delivery: tokens/foundations, Card, Select, DashboardShell/DashboardSidebar                                                                                         |

Full per-version detail, including every component added and any migration notes, lives in [CHANGELOG.md](CHANGELOG.md).

## Browse the components locally

Anyone on the team can browse every component, its states, props and code, without installing the package into a project or having a GitHub Pages/Vercel account. This runs Storybook on your own computer.

Prerequisites: Node **22.22.2** and pnpm **10.33.0** (this repository pins the exact version; run `corepack enable` once if `pnpm` isn't already available).

```sh
git clone https://github.com/tomrosscd/cd-product-ui.git convert-product-ui
cd convert-product-ui
pnpm install --frozen-lockfile
pnpm storybook
```

Open [http://127.0.0.1:6006](http://127.0.0.1:6006/?path=/docs/start-here-welcome--docs) in a browser once the terminal shows it's ready. Storybook watches the source, so it updates live if you pull later changes. Stop it with Ctrl+C when you're done.

Start with **Start here → Welcome**, then **Start here → Component guide** for what to use and when, and **Patterns → Dashboard** to see components working together in a realistic screen. No fonts, build step or account are required; without licensed Roobert files installed locally, headings and body text fall back to Geist and Arial, which is expected.

This clone is read-only browsing. To use components in your own project instead, install the packaged release below.

## Install in your project

You do not need to fork the repository to use the library. Build an archive from a fixed version, then install that archive as a dependency in your application. There is no npm registry package to install by name yet.

### 1. Build the selected library version

Use Node **22.22.2** and pnpm **10.33.0**, recorded in this repository. In a terminal, outside your application's folder:

```sh
git clone --branch v0.4.0 --depth 1 https://github.com/tomrosscd/cd-product-ui.git convert-product-ui
cd convert-product-ui
pnpm install --frozen-lockfile
pnpm pack --pack-destination artifacts
```

The version tag selects a fixed source revision. Packing builds the library and creates `artifacts/convert-product-ui-0.4.0.tgz`. One team member can build this archive and share it with other authorised projects.

### 2. Install the archive in your application

Copy the archive into a `vendor` folder in your application. From **your application's folder**, choose its package manager:

```sh
# pnpm
pnpm add --save-exact ./vendor/convert-product-ui-0.4.0.tgz

# or npm
npm install --save-exact ./vendor/convert-product-ui-0.4.0.tgz
```

Commit the archive, `package.json` and your lockfile in the consuming project so colleagues and CI install the same package. If that project ignores `*.tgz`, add an exception for this vendor archive. Use a short relative path as shown.

Do not install directly from the GitHub branch: the repository contains source, and the archive supplies the compiled files applications need. The package name in imports is **`@convert/product-ui`**, even though the repository is called **`cd-product-ui`**.

See the [component guide](docs/component-catalogue.md) for the full API, examples and boundaries.

### Optional charts

Only applications using `@convert/product-ui/charts` need the chart peers:

```sh
pnpm add --save-exact recharts@3.10.1 react-is@19.2.8
# or: npm install --save-exact recharts@3.10.1 react-is@19.2.8
```

Match react-is to your application's React version. These pins match the tested React 19.2.8 setup. Import `DataChart`, `Sparkline`, `ChartContainer`, `ChartTooltipContent` or `ChartLegend` from `@convert/product-ui/charts`. The core component entry does not import Recharts.

## Use with React

The complete component implementation supports **React 19.2**. Your application supplies React and React DOM. Import the compiled stylesheet once at the application root:

```tsx
import '@convert/product-ui/styles.css'
import { Card, Select } from '@convert/product-ui'

export function Projects() {
  return (
    <div className="cui-root">
      <Card heading="Projects" description="A clear view of current work.">
        <Select
          label="Project view"
          defaultValue="all"
          options={[
            { value: 'all', label: 'All projects' },
            { value: 'active', label: 'Active projects' },
          ]}
        />
      </Card>
    </div>
  )
}
```

The example supplies a styled native select. Connect its value and change handler to your application's filtering logic. The library does not fetch or store project data.

Use `DashboardShell` for the responsive page frame. It already applies `cui-root`. Storybook shows the sidebar, layout and component states; [the separate React example](examples/react) demonstrates package imports.

In Next.js, import CSS in the root layout and add `'use client'` to consuming components that use state or event handlers. Interactive library modules retain their client directives. Card and static primitives support server rendering. The expanded package has been built in a Next.js 16.3.4 App Router application with React 19.2.8, including server-rendered cards and client charts/forms.

Your application does **not** need Tailwind or Storybook to use this package.

## Use tokens and CSS in other frameworks

Plain HTML, Vue and other frameworks can use the same foundations. Import the token stylesheet in your application's stylesheet entry:

```css
@import '@convert/product-ui/tokens.css';

.project-panel {
  background: var(--cui-surface-card);
  color: var(--cui-text-primary);
  font-family: var(--cui-font-sans);
  padding: var(--cui-space-24);
  border: var(--cui-border-width) solid var(--cui-border-subtle);
  border-radius: var(--cui-radius-card);
}
```

Alternatively, import `@convert/product-ui/styles.css` for the tokens and ready-made component classes. See [the plain HTML example](examples/html/index.html). Typed token data is available from `@convert/product-ui/tokens`.

React components require React. Importing CSS alone does not supply drawer behaviour, focus management or framework bindings. Other frameworks provide their own interactions. This first release keeps one package and version for foundations and React; it does not yet offer separate Vue or Web Component implementations.

## Styling and fonts

Use semantic tokens rather than copying colour values. The system uses a warm neutral page, muted section bands and white cards, with restrained forest and sage accents. Keep client branding and business-specific styling in the consuming application.

Component classes and CSS variables use the `cui` prefix. Wrap custom product content in `cui-root` to apply the scoped base styles. There is no global reset. The library's Tailwind authoring utilities use a separate `cdu` prefix.

The font stack is **Roobert, Geist, Arial, sans-serif**. Applications load their own licensed Roobert and Geist fonts. Font files are excluded from Git and the installable package; without them, the browser uses the next available fallback.

## Update an existing project

Library improvements do not automatically change installed applications. Upgrade each project deliberately:

1. Read the [changelog](CHANGELOG.md) and migration notes for the selected version. Review any changed tokens, component APIs or appearance.
2. Build an archive from that version's Git tag using the installation steps above. Keep the previous archive available for rollback.
3. Copy the new archive into the application's `vendor` folder and install its exact filename.
4. Run the application's checks and review important screens, including keyboard navigation, errors, long content and mobile layout.
5. Commit the new archive, dependency and lockfile changes in an application pull request. Merge after review.

For example, to move a project from 0.3.1 to 0.4.0:

```sh
pnpm add --save-exact ./vendor/convert-product-ui-0.4.0.tgz
# or: npm install --save-exact ./vendor/convert-product-ui-0.4.0.tgz
```

To roll back, revert the application's upgrade commit and reinstall from its restored lockfile. Never replace an existing version's archive with different contents.

During 0.x, a minor version can include breaking changes, so read its migration notes. A future registry can simplify installation, while keeping the same deliberate upgrade process. Maintainers follow the [release process](docs/release-process.md).

## Suggest features, report bugs or contribute

- **Feature or improvement idea:** [open a feature request](https://github.com/tomrosscd/cd-product-ui/issues/new?template=feature-request.yml). Describe the internal-tool use case and where the existing system falls short. Code is not required.
- **Something broken:** [report a bug](https://github.com/tomrosscd/cd-product-ui/issues/new?template=bug-report.yml) with the library version, reproduction steps and expected behaviour.
- **Code or documentation change:** follow [CONTRIBUTING.md](CONTRIBUTING.md). Team members with write access use a branch; contributors without write access can fork and submit a pull request back to this repository.

Search [existing issues](https://github.com/tomrosscd/cd-product-ui/issues) first. Discuss new components or breaking changes before building them. Use neutral examples and remove client information from screenshots and reports. Maintainers review contributions before they enter a release; accepted code reaches applications when those projects upgrade.

## Develop the library and run release checks

Building or changing components needs the same clone as [browsing Storybook](#browse-the-components-locally), plus the checks below before proposing a change. See [CONTRIBUTING.md](CONTRIBUTING.md) for the full workflow.

For licensed local preview fonts, place these files in the ignored `local-fonts/` folder:

- `Roobert-Regular.woff2`, `Roobert-Medium.woff2`, `Roobert-SemiBold.woff2`
- Geist regular, medium and semibold named `font-0.ttf`, `font-1.ttf`, `font-2.ttf`

Storybook also runs without these files. A static Storybook build includes preview fonts when present; confirm distribution rights before hosting that build.

Install Chromium once for browser tests, then run the release checks:

```sh
pnpm exec playwright install chromium
pnpm check
pnpm format:check
pnpm package:check
pnpm next:check
pnpm api:check
```

`check` verifies generated tokens, types, lint, unit contracts, browser stories, automated accessibility, the library build and static Storybook. `package:check` installs the actual archive into an isolated consumer and verifies exports, server rendering and a Vite production build. It needs registry access if dependencies are not cached. `next:check` then builds the packed archive in a separate Next.js application. `api:check` diffs the compiled public API against `etc/*.api.md` and fails if it changed unexpectedly; run `pnpm api:update` and commit the result when a change is intentional (see [the backward-compatibility policy](docs/release-process.md#backward-compatibility)).

Edit `tokens/tokens.json` and run `pnpm tokens` to update generated CSS, responsive breakpoints and typed data. Storybook's live token reference uses that same generated source. Commit generated changes with the source change.

## Further guidance

- [0.4.0 migration guide](docs/release-0.4.md) — read this before upgrading, it has a breaking rename
- [0.3.0 usage and migration](docs/release-0.3.md)
- [Expanded component guide](docs/component-catalogue.md)
- [Architecture and boundaries](docs/architecture.md)
- [AI coding guidance and Impeccable review standard](docs/ai-guidance.md), plus [repository rules](AGENTS.md)
- [Consumer examples](examples/README.md)
- [Review and release process](docs/release-process.md), including the backward-compatibility policy for breaking changes
- [Known consumers](CONSUMERS.md) — check before shipping a breaking change
- [Validation and current limitations](docs/validation.md)
- [Roadmap: known gaps and planned work](ROADMAP.md)

This repository contains proprietary Convert Digital code; see [LICENSE](LICENSE). Repository visibility does not grant an open-source licence. `private: true` in the package prevents accidental registry publication and does not prevent the archive installation described above.
