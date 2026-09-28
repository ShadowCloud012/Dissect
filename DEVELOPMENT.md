# Dissect development

Task 03A audits claim-to-source scope without changing the content engine or
review state. See [TASK_03A_REPORT.md](TASK_03A_REPORT.md) for corrections and
validation. Reference `evidenceType` values describe source type, not evidence
certainty or proof that a linked claim is supported. Each claim still needs
editorial assessment against the actual source and named clinical review.

Task 03 adds the first clinical draft, Acute appendicitis, to the Task 02 content
engine. It remains explicitly awaiting clinical review. See
[TASK_03_REPORT.md](TASK_03_REPORT.md) for the verified source list, architecture,
schema changes, file inventory, validation results, inspected screenshots and
required clinical review. Earlier task notes below are implementation history.

## Task 01 foundation

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

## Task 02 content engine

The new route is `/learn/demo/how-dissect-content-works`, linked from Learn.
`/learn/[specialty]/[topic]` resolves metadata and content from explicit registry
imports. Registered topics are statically generated; unregistered paths call
`notFound()`. Importing the registry validates every topic during development and
production builds without network access. Registry errors include the source
module and Zod field path. Duplicate IDs and dangling references are rejected.

`src/lib/training-level.ts` is the single source for training IDs, labels and ranks.
Schemas, fixture, selector and filtering consume it. The localStorage adapter is
isolated from its React subscription hook. `useSyncExternalStore` supplies the
Medical Student server snapshot, then reads the browser value after hydration.
Selectors stay in sync across the shell, topic rail and browser tabs. Missing or
invalid storage defaults to Medical Student; denied storage falls back to memory.
There is no account, remote persistence or global state library.

The route, layout, block renderer and reference components remain Server
Components. Client boundaries are limited to training state, depth gates,
advanced reveal and hash-based section navigation. Server-rendered block children
are composed into the gates. Both the containing block and each claim's minimum
level apply. Reveal overrides both; it does not change the persisted level and
resets on reload. Content remains intact in the registry.

Desktop uses section navigation, content and a contextual source rail. Mobile
places section navigation above content and the context/reference rail below it;
the header selector and source jump links remain available. Native anchor links
provide deep links and keyboard access. Active navigation tracks the current
anchor, not viewport scrolling. Source links target stable reference IDs.

### Authoring boundaries

- `src/schemas/`: strict Reference, ClinicalClaim, TopicMetadata, TopicSection,
  Topic and nine discriminated content block schemas. Unknown fields fail.
- `src/content/`: explicitly registered topic modules. No filesystem discovery.
- `src/lib/`: shared training model, persistence adapter and registry construction.
- `src/components/content/`, `topic/`, `references/`: generic presentation.

To add a future approved topic, create a content module using the schema input
type and register it in `src/content/registry.ts`. Use stable kebab-case IDs,
ordered sections, real calendar dates, supported training levels and HTTP(S)
source links. Every claim requires at least one reference; blocks may also link
sources. Reference IDs resolve within that topic. Blocks and claims have unique
IDs within their respective topic-wide namespaces. Table row widths are checked.

The sole fixture is explicitly NON-CLINICAL and exercises all nine block types.
Its two references are the real project blueprint and Task 02 specification.
Evidence-type values are labelled schema demonstrations, not clinical evidence.
`contentKind` distinguishes a demo review date from an actual clinical review.
No clinical assertions, examples, risks or treatment guidance have been authored.

### Before Task 03

Agree the clinical author/reviewer and review-date/sign-off process, the initial
approved UK source set, and how local-policy variation will be reviewed. Decide
whether draft/unreviewed content needs an explicit publication state before any
clinical topic is registered. Structural validation cannot verify factual truth
or that a reference supports a statement; those need editorial review. Keep the
demo separate from clinical evidence and agree when to remove it from Learn.

### Task 02 validation record

Validated on 28 September 2026:

| Command                | Final result                                                                                                                                                                                          |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run lint`         | Passed, zero warnings.                                                                                                                                                                                |
| `npm run typecheck`    | Passed, including generated route types.                                                                                                                                                              |
| `npm test`             | Passed: 15 tests in 7 files.                                                                                                                                                                          |
| `npm run build`        | Passed; the demo topic is statically generated and registry validation runs at build time.                                                                                                            |
| `npm run test:e2e`     | Passed: 6 desktop/mobile tests, including persistence, depth reveal, direct load/reload, section/source anchors, 404s and 320px overflow. Final run: 17.0 seconds. No browser errors on valid routes. |
| `npm run format`       | Passed.                                                                                                                                                                                               |
| `npm run format:check` | Passed.                                                                                                                                                                                               |
| `git diff --check`     | Passed.                                                                                                                                                                                               |

An intermediate 320px browser assertion exposed narrow navigation overflow; reduced
mobile link spacing fixed it. The first route configuration returned 404 correctly
but logged a Next internal fallback error. Static generation with normal registry
lookup and `notFound()` removed that error. Final checks passed without either issue.

Inspected desktop and mobile `topic-student.png` and `topic-registrar.png`, plus
mobile `topic-depth-detail.png` and `topic-sources-detail.png`. Full-page captures
verify layout; detail captures verify readable tables, sources and controls.
Generated images remain under the ignored Playwright `test-results/` directory.

No scope deviations or new dependencies. The header's narrow spacing adjustment
is required by the no-overflow acceptance criterion; Task 01 tokens and visual
language remain intact. The demo-only `contentKind` field prevents a fictitious
clinical-review label. Advanced reveal is page-local; only training level persists.

### Task 02 file inventory

- Schemas added: `src/schemas/shared.ts`, `reference.ts`, `clinical-claim.ts`,
  `content-block.ts`, `topic.ts`, `topic.test.ts`.
- Models and registry added: `src/lib/training-level.ts`, `training-level.test.ts`,
  `training-level-storage.ts`, `training-level-storage.test.ts`,
  `topic-registry.ts`, `topic-registry.test.ts`.
- Content added: `src/content/registry.ts` and
  `src/content/demo/how-dissect-content-works.ts`.
- Topic routes added: `src/app/learn/[specialty]/[topic]/page.tsx` and
  `not-found.tsx`. Learn listing updated: `src/app/learn/page.tsx`.
- Components added: `src/components/content/content-renderer.tsx`,
  `src/components/references/source-badge.tsx`, `reference-list.tsx`,
  `src/components/topic/section-nav.tsx`, `topic-depth.tsx`, `topic-layout.tsx`,
  `topic-layout.test.tsx`, and `src/components/navigation/use-training-level.ts`.
- Navigation updated: `primary-navigation.tsx`, `training-level-selector.tsx`
  and `training-level-selector.test.tsx` under `src/components/navigation/`.
- Browser tests: added `tests/e2e/topic.spec.ts`; updated `tests/e2e/shell.spec.ts`.
- Documentation/configuration: updated this file, `.prettierignore`, and the
  boundary READMEs in `src/components/`, `src/content/`, `src/lib/`, `src/schemas/`.
