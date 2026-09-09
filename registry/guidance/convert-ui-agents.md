# Convert UI — guidance for coding agents

This file is installed at a project-specific path (not your root `AGENTS.md`) so it doesn't overwrite anything already there. If your project has its own `AGENTS.md`, add one line pointing at this file instead of merging the two:

```
See ./convert-ui-agents.md for guidance on the Convert UI components installed in this project.
```

## Reach for these first

Before hand-rolling a dropdown, select, chip, or button from scratch, check whether a Convert UI component already does the job. This project's UI was distributed via `npx shadcn add @convert/<name>` and lives directly in this repo — search for it before writing something new that duplicates it.

## What "compatible" actually means here

Some Convert UI components — currently only `button` — deliberately preserve the exact prop API of the equivalent component in the default shadcn registry (same variant/size names, same `asChild` support). These are marked in their own file comments as pinned to a specific upstream commit. For these, and only these, you can revert to the plain shadcn version with `npx shadcn add <name>` (no `@convert/` prefix) without changing any call site.

Everything else with a name that resembles a shadcn component (`Progress`, `Table`, `Card`, etc., once they're added to this registry) is a **Convert pattern**: it may look similar, but its props, composition style, or behaviour genuinely differ from any shadcn equivalent. Swapping one of these for the vanilla shadcn version **will** require changing call sites. Don't assume compatibility just because the name matches — check the component's own file comment first.

## If a colour utility (`bg-primary`, etc.) renders transparent after installing `tokens`

Check how `tokens.css` and `shadcn-bridge.css` are imported. They must be pulled in via a CSS `@import` from the same file that has `@import "tailwindcss"` (usually your main stylesheet) — not as a separate top-level `import '...css'` statement in a `.tsx` file. Tailwind v4 only turns the variables these files define into real utility classes within that same import graph; loaded any other way, the stylesheet still applies but Tailwind never sees it, so colour utilities silently resolve to transparent even though the CSS variable itself looks correct in devtools.

## Updating

Registry items are copied into this project at install time — they are not a live dependency. Reinstalling `npx shadcn add @convert/<name>` again will **overwrite local edits** to that file. Before re-running it on a component you've customised, diff the registry's current version against what's in this project and decide what to keep, the same way you'd review any other upstream change — don't blindly overwrite.

## What still needs installing normally

The Convert registry stops being reachable (network issue, the registry taken offline, no access from this network) has **no effect on this project once components are installed** — the code is already here, copied in, not fetched at runtime. But copied components still `import` from ordinary npm packages (React, `class-variance-authority`, `radix-ui`, etc., depending on the component) — those are real dependencies of _this_ project now and must stay installed exactly like any other package this project depends on. "The registry is offline" and "this project's dependencies are installed" are two independent things; losing the first does not excuse skipping the second.
