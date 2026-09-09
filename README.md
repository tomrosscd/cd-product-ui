# Convert Product UI

A shared design system for Convert dashboards and internal tools. It gives you consistent colours, spacing, typography and interactive components, as React components and as framework-neutral CSS.

Each project stays on the version it installed until you decide to upgrade.

Version 0.8.0. See the [changelog](CHANGELOG.md) for what changed in each version.

[Install](#install-the-library) · [Use with React](#use-the-components-with-react) · [Use the tokens](#use-the-tokens-without-react) · [Upgrade](#upgrade-a-project) · [Browse components](#browse-the-components-locally) · [Contribute](CONTRIBUTING.md)

## What you get

| Area       | What it covers                                                                                         |
| ---------- | ------------------------------------------------------------------------------------------------------ |
| Tokens     | 94 tokens for colour, surface, spacing, typography, borders, focus, motion and breakpoints             |
| Components | Forms, selects, tables, tabs, chips, dialogs, feedback, metrics, progress, navigation and date pickers |
| Patterns   | `DashboardShell`, roadmap board, sign-in form, filter toolbar and card compositions                    |
| Charts     | Five Recharts recipes behind an optional entry point                                                   |
| Storybook  | Every component with its states, props and source, plus token and icon references                      |

The library holds no client data, API calls, authentication or business logic. Your application owns all of that.

## Before you start

You need Node 22.22.2 and pnpm 10.33.0. To install pnpm, run `corepack enable` once.

Your application supplies React 19.2. The package name in imports is `@convert/product-ui`, although the repository is called `cd-product-ui`.

## Install the library

Each release attaches a built archive. Install it by URL from your application's folder:

```sh
pnpm add --save-exact https://github.com/tomrosscd/cd-product-ui/releases/download/v0.8.0/convert-product-ui-0.8.0.tgz
```

Using npm instead:

```sh
npm install --save-exact https://github.com/tomrosscd/cd-product-ui/releases/download/v0.8.0/convert-product-ui-0.8.0.tgz
```

The URL pins one immutable release, so every colleague and CI run installs identical files. Commit your `package.json` and lockfile.

There is no npm registry package to install by name, and installing from a GitHub branch does not work: the repository holds source, and only the archive contains the compiled files your application needs.

To install a different version, change both version numbers in the URL. Releases are listed on the [releases page](https://github.com/tomrosscd/cd-product-ui/releases).

### Build the archive yourself

Only needed to install a revision that has no release, such as an unreleased branch. Run these outside your application's folder:

```sh
git clone --branch v0.8.0 --depth 1 https://github.com/tomrosscd/cd-product-ui.git convert-product-ui
cd convert-product-ui
pnpm install --frozen-lockfile
pnpm pack --pack-destination artifacts
```

Copy the resulting `artifacts/convert-product-ui-0.8.0.tgz` into a `vendor` folder in your application and install it from there:

```sh
pnpm add --save-exact ./vendor/convert-product-ui-0.8.0.tgz
```

Commit the archive alongside your lockfile. If your project ignores `*.tgz`, add an exception for it.

### Optional: charts

Install the chart peers only if you import from `@convert/product-ui/charts`:

```sh
pnpm add --save-exact recharts@3.10.1 react-is@19.2.8
```

Match `react-is` to your application's React version. The main entry point never imports Recharts, so applications that skip charts do not pay for them.

## Use the components with React

Import the stylesheet once at your application root, then import components by name:

```tsx
import '@convert/product-ui/styles.css'
import { Card, StyledSelect } from '@convert/product-ui'

export function Projects() {
  return (
    <div className="cui-root">
      <Card heading="Projects" description="A clear view of current work.">
        <StyledSelect
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

Wrap product content in `cui-root` to apply the scoped base styles. `DashboardShell` applies it for you.

Connect each component's value and change handler to your application's own logic.

For the full API of every component, see the [component guide](docs/component-catalogue.md).

### Next.js

Import the CSS in your root layout. Add `'use client'` to your own components that use state or event handlers. Library modules that need it already carry their own client directives, and `Card` and the static primitives render on the server.

The packed archive builds in a Next.js 16.3.4 App Router application on React 19.2.8, including server-rendered cards and client-side charts and forms.

Your application does not need Tailwind or Storybook to use this package.

## Use the tokens without React

Plain HTML, Vue and other frameworks can use the same foundations. Import the token stylesheet in your stylesheet entry:

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

To get the ready-made component classes as well, import `@convert/product-ui/styles.css` instead. For typed token data in JavaScript, import from `@convert/product-ui/tokens`. See the [plain HTML example](examples/html/index.html).

Importing CSS gives you appearance only. Drawer behaviour, focus management and keyboard handling come from the React components.

### Class and token naming

Component classes and CSS variables use the `cui` prefix. The library's internal Tailwind authoring utilities use a separate `cdu` prefix, which you can ignore.

The library ships no global reset. It styles only what sits inside `cui-root`.

Use the semantic tokens rather than copying colour values, so a theme change reaches your application on upgrade. Keep client branding in your own application.

### Fonts

The font stack is Roobert, Geist, Arial, sans-serif. Your application loads its own licensed Roobert and Geist files. Font files are excluded from Git and from the package, so without them the browser uses the next fallback. That fallback is expected, not a fault.

## Upgrade a project

Upgrading is deliberate. A new library version does not reach your application until you install it.

1. Read the [changelog](CHANGELOG.md) and the release notes for the version you are moving to. Check for changed tokens, component APIs and appearance.
2. Install that version's release URL, changing both version numbers. Your lockfile records the previous one, so a revert rolls you back.
3. Run your application's checks. Review your main screens, including keyboard navigation, error states, long content and mobile layout.
4. Commit the archive, dependency and lockfile changes in one pull request.

To roll back, revert the upgrade commit and reinstall from the restored lockfile.

Never replace an existing archive with different contents under the same filename.

During 0.x, a minor version can contain a breaking change, so read its release notes before upgrading. Every breaking change is listed in the [backward-compatibility policy](docs/release-process.md#backward-compatibility) and coordinated with the projects in [CONSUMERS.md](CONSUMERS.md) first.

## Browse the components locally

To see every component, its states and its source without installing anything, run Storybook from a clone:

```sh
git clone https://github.com/tomrosscd/cd-product-ui.git convert-product-ui
cd convert-product-ui
pnpm install --frozen-lockfile
pnpm storybook
```

Open <http://127.0.0.1:6006> when the terminal says it is ready. Storybook reloads as you pull changes. Press Ctrl+C to stop it.

Start at **Start here > Welcome**, then **Start here > Component guide** for what to use and when. **Patterns > Dashboard** shows the components working together in a realistic screen.

## Report a bug or suggest a component

- To report something broken, [open a bug report](https://github.com/tomrosscd/cd-product-ui/issues/new?template=bug-report.yml) with the library version, reproduction steps and what you expected.
- To suggest a component or improvement, [open a feature request](https://github.com/tomrosscd/cd-product-ui/issues/new?template=feature-request.yml). Describe the internal-tool problem you are solving. You do not need to write code.
- To contribute a change, follow [CONTRIBUTING.md](CONTRIBUTING.md).

Search [existing issues](https://github.com/tomrosscd/cd-product-ui/issues) first. Discuss new components and breaking changes before building them. Keep client information out of examples, screenshots and reports.

## Develop the library

To change the library rather than use it, see [CONTRIBUTING.md](CONTRIBUTING.md) for the full workflow, and [docs/release-process.md](docs/release-process.md) for how a version ships.

Install Chromium once, then run the checks CI runs:

```sh
pnpm exec playwright install chromium
pnpm check && pnpm format:check && pnpm api:check && pnpm css:check && pnpm test:dark && pnpm package:check && pnpm next:check
```

To edit a token, change `tokens/tokens.json` and run `pnpm tokens`. Commit the generated files with your source change.

For licensed preview fonts, put `Roobert-Regular.woff2`, `Roobert-Medium.woff2` and `Roobert-SemiBold.woff2` in the ignored `local-fonts/` folder, along with Geist regular, medium and semibold named `font-0.ttf`, `font-1.ttf` and `font-2.ttf`. Storybook runs without them. Confirm distribution rights before hosting a static Storybook build that includes them.

## Reference

- [Component guide](docs/component-catalogue.md): every component, its API and its boundaries
- [Adoption brief](docs/adopting-in-an-app.md): which component to use for what, and how to upgrade safely
- [Changelog](CHANGELOG.md) and [release notes](docs/release-0.8.md)
- [Architecture and boundaries](docs/architecture.md)
- [Review and release process](docs/release-process.md)
- [Known consumers](CONSUMERS.md): check before shipping a breaking change
- [Validation and limitations](docs/validation.md)
- [Roadmap](ROADMAP.md)
- [AI coding guidance](docs/ai-guidance.md) and [repository rules](AGENTS.md)
- [Consumer examples](examples/README.md)

Koko Monthly Review V4 defines the product visual language. The Convert website informs technical conventions. This library is independent of both.

This repository contains proprietary Convert Digital code. See [LICENSE](LICENSE). Repository visibility does not grant an open-source licence. The `private: true` field prevents accidental publication to a registry and does not affect the archive install described above.

### Dashboard composition (unreleased)

For token-spaced layout components, flexible list rows, read-only roadmaps and nested navigation, see [the dashboard composition guide](./docs/dashboard-composition.md), [the adoption brief](./docs/adopting-in-an-app.md) and Storybook **Patterns / Dashboard composition**. These ship in 0.8.0.
