# Consuming examples

Build the library archive first with `pnpm pack --pack-destination artifacts`. These examples target 0.2.0.

- `react/`: install with pnpm from that folder, then run `pnpm dev`. It consumes the package archive through normal package imports, without chart dependencies.
- `html/`: open index.html after the library build. It references compiled CSS and uses native controls without React.
- `next/`: install with pnpm from that folder, then run `pnpm dev`. It uses Next.js 16.3.4, React 19.2.8 and the optional chart peers. Static cards are rendered from a server page; charts, tables and sign-in interaction live in a client component. Demonstration submission does not authenticate anyone.

For automated isolated checks, run `pnpm package:check` from the repository root, followed by `pnpm next:check`. Dependencies may need registry access. Local example font files are not provided; consumers supply licensed fonts.
