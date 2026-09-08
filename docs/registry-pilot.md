# Convert UI shadcn registry — pilot

Step 2 of the shadcn registry plan (see `docs/shadcn-registry-audit.md` for step 1's audit). This documents the pilot scope: `tokens`, `cn`, `button` (upstream-compatible), `chip` (Convert pattern), `task-filter-example` (composition), and `agents` (guidance). Not a production registry yet — this proves the distribution model before any wider rollout.

## Namespace and setup

Add the namespace to your project's `components.json`:

```json
{
  "registries": {
    "@convert": "https://<wherever this ends up hosted>/r/{name}.json"
  }
}
```

During the pilot, this was tested against a locally-served `public/r/` directory (`pnpm exec shadcn build`, then any static file server) — no public hosting has been stood up yet, deliberately, since that's a later decision once the pilot itself is approved.

**Your project needs Tailwind and a `@/*` path alias already set up** — same prerequisite as using the default shadcn registry for anything. Nothing here works without it.

## Install

```sh
npx shadcn add @convert/tokens @convert/button @convert/chip @convert/task-filter-example @convert/agents
```

Or install just what you need — `tokens` and `cn` are pulled in automatically as dependencies of `button`/`chip`.

## Two integration requirements found during testing, not obvious from the schema

1. **Import `tokens.css` and `shadcn-bridge.css` via a CSS `@import`, from the same file that has `@import "tailwindcss"` — not as a separate top-level `import '...css'` in a `.tsx` file.** Tailwind v4's `@theme` processing only registers custom properties into real utility classes (`bg-primary`, etc.) within the same import graph as the Tailwind entry point. A separate JS-level import loads the file as an independent stylesheet that Tailwind never sees, so every colour utility silently resolves to transparent — the CSS variable itself looks completely correct in devtools, which makes this a confusing failure to debug from the rendered page alone. Correct:

   ```css
   /* src/index.css */
   @import 'tailwindcss';
   @import './styles/convert-ui/tokens.css';
   @import './styles/convert-ui/shadcn-bridge.css';
   ```

   `chip.css` (and anything else with plain CSS, no `@theme`) doesn't have this requirement — a normal JS-level import works fine for it.

2. **If your project splits `tsconfig.json` into a root "solution" file plus `tsconfig.app.json` (current Vite scaffolding does this by default), the `@/*` path alias needs to be visible from the root `tsconfig.json` directly, not only `tsconfig.app.json`.** The shadcn CLI's own project-structure detection reads the root file; without a `paths` entry there too, it silently writes files into a literal `./@/` directory instead of resolving the alias to `src/`, with no error — the CLI's own success summary looks completely normal even when this happens. Verified fix: duplicate `baseUrl`/`paths` (or just `paths`, if your TypeScript version has deprecated `baseUrl`) into the root `tsconfig.json`, alongside the `references` array.

Both were caught by actually installing into a clean scaffolded project and checking the real output, not by reading the schema — which is exactly why step 3 of the plan (a real clean-project install, not a paper exercise) mattered.

## What "compatible" means for `button` specifically

`button` is pinned to `shadcn-ui/ui` commit `3ba91b1cc83e1bbe4ab35a422ff2a694849c5048` (`new-york-v4` style) — same variant names (`default`/`destructive`/`outline`/`secondary`/`ghost`/`link`), same size names, same `asChild` support, same `data-slot`/`data-variant`/`data-size` attributes. `loading` and `leadingIcon` (present on this package's own npm-published `Button`) are deliberately not part of this registry item — see the file's own comment for why.

Verified directly, not assumed:

- Installed into a clean scaffolded Vite + React + Tailwind v4 project via the real `shadcn` CLI against a locally-served build of this registry.
- Built and ran that project (`pnpm build`, `pnpm preview`) with the registry server stopped entirely — confirmed copy-in independence, not just reasoned about it.
- Ran `npx shadcn add button` (default registry, no `@convert/` prefix) with `--overwrite` on the same project. The vanilla file landed at the identical path with the identical import specifier — zero edits needed to `App.tsx` or the composition file. Rendered output was visually identical (Convert's palette still applied, since the vanilla file uses the same Tailwind utility class _names_ our bridge maps colours onto).
- Confirmed via a direct DOM test that an unmodified-`type` button (what both the Convert and vanilla builds render) correctly triggers form submission on click inside a `<form>`.
- Confirmed Tab reaches the button correctly in the real keyboard focus order.
- **Not fully verified:** synthetic Enter/Space key-press activation through this session's browser-automation tooling didn't register a click on a focused button in either build — traced to the automation tool's synthetic keyboard-event dispatch not triggering the browser's native default action for a focused `<button>`, not a defect in either build (neither adds any custom keydown handling, and native `<button>` Enter/Space activation is guaranteed by every browser engine for real keyboard input). Worth a manual real-keyboard check before treating this as fully closed.

## Updating and version selection

Registry items are copied at install time, not fetched again automatically. Re-running `npx shadcn add @convert/<name>` fetches whatever is _currently_ being served and will skip files that are byte-identical, or offer to overwrite ones that differ — it does not silently clobber by default. Before accepting an overwrite on something you've customised, diff what's being offered against what's in your project.

## The registry-unavailable clarification

Once installed, this project has **no runtime dependency on the Convert registry being reachable** — the code is already copied in. It still has entirely ordinary dependencies on the npm packages each component imports (React, `class-variance-authority`, `radix-ui`, `clsx`, `tailwind-merge`, etc.) — those must stay installed exactly like any other package your project depends on. Losing access to the registry and losing access to npm are two different failure modes; only the first one is what "copy-in, zero runtime coupling" is a claim about.
