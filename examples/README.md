# Run the package examples

Build the release archive before installing either example. Both examples target `0.10.0` and import the packed distribution.

1. In the library root, run `pnpm pack --pack-destination artifacts`.
2. In `examples/react` or `examples/next`, run `pnpm install`.
3. Run `pnpm build`.
4. Run `pnpm dev` to inspect the example.

The React example uses Vite with strict TypeScript. The Next example uses App Router, a server-rendered card and client-side forms and charts.

For repeatable validation in disposable directories, run `pnpm package:check` followed by `pnpm next:check`. These commands type-check against the archive's declarations.

The [plain HTML example](html/index.html) demonstrates token and CSS use without React. CSS does not supply interactive behaviour.

Keep example data synthetic. Do not copy application credentials or client records into these examples.
