# Consumer examples

First run pnpm pack --pack-destination artifacts in the repository root.

React: from examples/react, run pnpm install, then pnpm dev. This application imports the package archive, not library source. Update the archive version when testing a later release.

HTML: after pnpm build, open examples/html/index.html in a browser. The relative stylesheet references dist/styles.css. When adopting in another project, use your installed package stylesheet location. The small example's change listener belongs to the application; it does not implement the React mobile drawer.
