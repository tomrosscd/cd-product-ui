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

**Recorded vanilla-source provenance, for reproducibility.** `npx shadcn add button` doesn't itself print what it installed from, so a commit reference alone isn't enough to reproduce the claim — the live default registry (`ui.shadcn.com`) could in principle be serving something other than that exact commit. Verified directly instead of assumed: the file actually installed into the test project by the real CLI, and the file fetched straight from `raw.githubusercontent.com/shadcn-ui/ui/3ba91b1cc83e1bbe4ab35a422ff2a694849c5048/apps/v4/registry/new-york-v4/ui/button.tsx`, both hash to the identical SHA-256:

```
79dd6f75f8136394442202d6b8b922fb269eaad0a5dba579397c9d5b41f893bb
```

That confirms `ui.shadcn.com`'s live default registry was serving exactly that commit's content at test time (9 September 2026). If this is re-verified later and the hash differs, that means upstream has moved — re-diff against the new content before assuming `button` is still compatible, rather than trusting the commit reference alone.

Verified directly, not assumed:

- Installed into a clean scaffolded Vite + React + Tailwind v4 project via the real `shadcn` CLI against a locally-served build of this registry.
- Built and ran that project (`pnpm build`, `pnpm preview`) with the registry server stopped entirely — confirmed copy-in independence, not just reasoned about it.
- Ran `npx shadcn add button` (default registry, no `@convert/` prefix) with `--overwrite` on the same project. The vanilla file landed at the identical path with the identical import specifier — zero edits needed to `App.tsx` or the composition file. Rendered output was visually identical (Convert's palette still applied, since the vanilla file uses the same Tailwind utility class _names_ our bridge maps colours onto).
- **Click activation, disabled state, and form submission, checked on both builds individually** (not just once): a plain click fires on both; a `disabled` button (verified by clearing the composition's filter, which disables its Apply button) does not fire a click on either, matching native `<button disabled>` semantics that neither file overrides; and a direct DOM `<form>` test confirms an unmodified-`type` button (what both builds render) triggers real form submission on click, on both builds.
- Confirmed Tab reaches the button correctly in the real keyboard focus order, on both builds.
- **Enter/Space keyboard activation: verified by a human, 9 September 2026.** Automated attempts from this session's browser tool could not exercise this path (the tool's synthetic `KeyboardEvent` construction was measurably malformed — e.g. a requested Space press produced `e.key === ""` instead of `" "`, and a requested Enter press produced `e.code === ""` and `e.which === 0` — evidence the tool itself, not either button, was the obstacle). A standalone test page was built with the actual `registry/ui/button.tsx`, the actual pinned vanilla `button.tsx` (re-fetched and re-hashed at test time — SHA-256 `79dd6f75f8136394442202d6b8b922fb269eaad0a5dba579397c9d5b41f893bb`, unchanged from the earlier check), and a plain native `<button>` control, each with a visible activation counter and a form-submit counter. Tabbing to each of the three, then pressing Enter and separately Space, incremented both counters identically on all three — confirmed by the user directly, not inferred from automation. The disabled fourth example was correctly skipped by Tab and never incremented. This closes the item; Enter/Space activation on the Convert and vanilla builds matches native `<button>` semantics.

## Updating and version selection

To regenerate CSS after editing a token, from your project root:

```sh
node src/convert-ui/generate-tokens.mjs \
  --tokens=src/convert-ui/tokens.json \
  --responsive-template=src/convert-ui/responsive.template.css \
  --out-css=src/styles/convert-ui/tokens.css \
  --out-ts=src/convert-ui/tokens.ts \
  --out-responsive=src/styles/convert-ui/responsive.css
```

(Adjust the paths if your project's `components.json` aliases don't match the defaults above.) Verified end to end, not just that the flags parse: changed `colour.forest`'s hex value in an installed `tokens.json`, ran the exact command above, and confirmed both that `tokens.css` picked up the new value and that a running dev server's rendered buttons changed colour accordingly — editing the source and regenerating is a real, working path, not just an accepted CLI flag.

Registry items themselves are copied at install time, not fetched again automatically. Re-running `npx shadcn add @convert/<name>` fetches whatever is _currently_ being served and will skip files that are byte-identical, or offer to overwrite ones that differ — it does not silently clobber by default. Before accepting an overwrite on something you've customised, diff what's being offered against what's in your project.

## The registry-unavailable clarification

Once installed, this project has **no runtime dependency on the Convert registry being reachable** — the code is already copied in. It still has entirely ordinary dependencies on the npm packages each component imports (React, `class-variance-authority`, `radix-ui`, `clsx`, `tailwind-merge`, etc.) — those must stay installed exactly like any other package your project depends on. Losing access to the registry and losing access to npm are two different failure modes; only the first one is what "copy-in, zero runtime coupling" is a claim about.

## Installing from the registry

Registry items are **copied into your project**, not installed as a dependency. You own the copy and can edit it. Nothing fetches it again unless you ask.

Use the registry when you want a component you will modify. Use the npm package (`@convert/product-ui`) when you want a component that improves as the library does. Most consumers want the package.

### Point at a pinned version

Add the namespace to your `components.json`, using an **immutable versioned path**:

```json
{
  "registries": {
    "@convert": "https://tomrosscd.github.io/cd-product-ui/r/v0.8.0/{name}.json"
  }
}
```

Then add an item:

```sh
pnpm dlx shadcn@latest add @convert/button
```

A `/r/latest/` path is also published. **Do not pin to it.** It moves with every release, so an install is not reproducible: two colleagues running the same command a week apart can get different files. It exists for trying things out.

### Updating

Change the version in the path, then re-run `add` for the items you want to move. The CLI skips files that are byte-identical and offers to overwrite ones that differ. It does not clobber silently.

Before accepting an overwrite on a file you have customised, diff what is offered against what you have. That is the cost of owning the copy.

### Regenerating tokens after an edit

The registry ships the token source and the generator, so you can change a token and rebuild the CSS without the npm package:

```sh
node src/convert-ui/generate-tokens.mjs \
  --tokens=src/convert-ui/tokens.json \
  --responsive-template=src/convert-ui/responsive.template.css \
  --out-css=src/styles/convert-ui/tokens.css \
  --out-ts=src/convert-ui/tokens.ts \
  --out-responsive=src/styles/convert-ui/responsive.css
```

Adjust the paths to match your `components.json` aliases.

### How the registry stays honest

The registry carries its own copy of the token source, which is exactly the kind of thing that drifts. `pnpm registry:check` compares that copy against the canonical `tokens/tokens.json`, generator and responsive template, and fails CI on any difference. `pnpm registry:sync` copies the canonical files across when a change is intentional.

This was added after the copy had already fallen six tokens behind, which nothing had noticed. The publish workflow runs the same check and refuses to publish a drifted registry.

## When to put something here instead of the package

Three homes, one question each:

- **Would a second Convert product want this?** Put it in the npm package.
- **Is it specific to one product's domain or composition?** Put it in that product's own repository.
- **Probably reusable, not yet proven?** Put it here. A consumer copies it in and owns it, and it can be promoted into the package later once a second product wants it, without having bloated the package in the meantime.
