# Task 01 foundation

Use Node.js 22 or newer and npm. Run `npm ci`, then `npm run dev`.
The lockfile pins dependencies; Next.js 16.3.6 was verified against npm on
28 September 2026. DM Sans and DM Mono are self-hosted through Fontsource.
ESLint is pinned to 9.39.5 because the React plugin bundled with Next.js 16.3.6
fails under ESLint 10 (`contextOrFilename.getFilename is not a function`).

## Architecture

Five static App Router pages share a server-rendered header, footer and main
landmark. Only active navigation and the native training-level selector need
client components. Selector state lasts for the mounted shell, survives client
navigation and resets on reload. There is no persistence or content filtering.

Mobile uses the same navigation in a second row, keeping all destinations visible.
The search link opens an honest placeholder; no search form or index is simulated.
Shared primitives and named Tailwind v4 tokens are separate from route content.
The content, schemas and library boundaries are documented in `src/`.

Visual reference: `ShadowCloud012/Dissect3`, commit
`8f957112c1811b938333e26ab84f9a70f79b698c`, specifically the design tokens,
navigation and landing styles. Its architecture and clinical content were not
ported. Green, off-white, charcoal, typefaces, radii and restrained borders are
retained. Darker green is used for small text and filled buttons for contrast.

## Validation

```sh
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
npm run format:check
```

Playwright starts the production build on port 3000, which must be free. The same
smoke flow runs at desktop and mobile sizes, checking all direct routes and
refreshes, navigation, selector state, keyboard skip link, overflow and browser
errors. Screenshots are written to the ignored `test-results/` directory.

No clinical content, authentication, persistence, search indexing or simulation
engine is included. Domain folders are documented and deferred until populated,
avoiding empty tracked placeholders.

## Task 01 validation record

Validated on 28 September 2026:

| Command                           | Result                                                                                                                                                                                                                                                                        |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run lint`                    | Passed with zero warnings after pinning compatible ESLint and naming the PostCSS export. Initial ESLint 10 run crashed; the first ESLint 9 run found that export warning.                                                                                                     |
| `npm run typecheck`               | Passed twice; Next route generation and strict TypeScript checks.                                                                                                                                                                                                             |
| `npm test`                        | Passed twice; two component tests.                                                                                                                                                                                                                                            |
| `npm run build`                   | Passed twice; all five requested routes statically rendered.                                                                                                                                                                                                                  |
| `npx playwright install chromium` | Passed; installed the required browser.                                                                                                                                                                                                                                       |
| `npm run test:e2e`                | Final run passed both desktop and mobile cases in 7.2 seconds, with zero browser errors. The first sandboxed run passed assertions but required cleanup of its own server process; an intervening retry found that occupied port. The final unrestricted run exited normally. |
| `npm run format`                  | Passed.                                                                                                                                                                                                                                                                       |
| `npm run format:check`            | Passed.                                                                                                                                                                                                                                                                       |
| `git diff --check`                | Passed.                                                                                                                                                                                                                                                                       |

Desktop and mobile screenshots were also inspected. Scope remains Task 01 only.
The only structural interpretation is documenting future domain directories until
their first implementation, rather than adding empty tracked files. Mobile uses
always-visible navigation instead of a collapsed menu; the task does not require
a menu. ESLint 9 is a compatibility pin, not a relaxation of lint checks.
