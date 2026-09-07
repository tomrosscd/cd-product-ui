# Building with Product UI

When using this library in an application, record the installed Product UI version in that project's context. Import the package and styles instead of copying its implementation into the application.

## Context for coding tools

Product UI serves people using dashboards and internal tools. They need to compare information, understand progress and complete frequent tasks with little friction. The visual language is restrained, clear and compact: off-white pages, neutral section bands, white cards and small green accents. Use Roobert with Geist fallback. The audience and tone differ from the Convert marketing website.

Use the catalogue and component types to discover available props. Use Card for coherent content, Select for a short single-choice list, DashboardSidebar for application navigation and DashboardShell to compose navigation with main content. Supply application data and route handlers through props. Use explicit links or buttons inside cards.

## Decision order

1. Use an existing component with its documented variant.
2. Compose existing components with semantic tokens and approved spacing.
3. If there is a recurring gap, propose a shared component or variant with states and tests.
4. Document any temporary application exception and its owner. Do not silently redefine shared tokens.

## Impeccable review standard

Apply Impeccable's context-first review approach within the approved Convert system. Review information hierarchy, density, typography, alignment, surfaces, long content, narrow screens, keyboard paths and clarity of actions. The review should identify concrete issues and resolve them using existing decisions before proposing new tokens.

This repository does not bundle or install an Impeccable executable skill. Its guidance was reviewed against the official documentation on 7 September 2026. If the team adopts a local Impeccable skill, pin its release or commit, record it here, and verify compatibility before upgrades. Do not treat an unpinned latest install as an enforcement mechanism.

A release review should record what was inspected, any changes, and remaining limitations. Visual judgement is combined with typed APIs, token generation, automated interaction and contrast checks, and manual browser inspection.

[Impeccable documentation](https://impeccable.style/docs/) and [design context](https://impeccable.style/docs/context/).

## Expanded component selection

Read component-catalogue.md for the 0.2.0 candidate. Prefer MetricCard, ProgressCard, DetailsCard and ActionCard for repeated compositions; use Badge, TextLink and native form controls for their actual semantics. Keep charts in the optional charts entry. Supply truthful chart summaries and labelled exact values, and preserve gaps in missing data. Keep metric direction and sentiment separate.

Use controlled RoadmapBoard data and callbacks. Column names, permissions and saving belong in the application. SignInForm supplies presentation only; do not add authentication logic or credential logging to library examples.
