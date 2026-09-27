# Codex Task 01 — Establish Dissect v2 foundation

Read `AGENTS.md` and `README.md` fully before making changes.

## Goal
Create the clean technical foundation for Dissect v2. Do not build clinical content yet. Do not redesign the product. The existing Dissect3 repository is the visual reference, while this repository is a clean architectural rewrite.

## Requirements
1. Scaffold/configure a production-quality Next.js 16 Active LTS App Router project using TypeScript strict mode and the latest patched stable release available.
2. Configure Tailwind CSS.
3. Configure ESLint and Prettier.
4. Configure Vitest + React Testing Library.
5. Configure Playwright with one basic smoke test.
6. Add scripts for `dev`, `build`, `lint`, `typecheck`, `test`, and `test:e2e`.
7. Establish the directory structure described in `README.md` without creating large numbers of empty placeholder files.
8. Implement the initial Dissect design tokens based on the old prototype:
   - green family centred around #1D9E75 and #085041
   - warm off-white #F7F6F3
   - near-black #1A1917
   - semantic red/amber/blue/purple accents
   - radius scale approximately 6/10/16/22px
   - restrained shadows/borders
9. Create reusable primitives only as needed for the initial shell: Button, Badge, Card and Alert.
10. Build a minimal app shell with:
    - Dissect wordmark
    - Learn, Practice and Theatre navigation
    - training-level selector
    - search affordance
    - responsive mobile navigation
11. Add real routes for `/`, `/learn`, `/practice`, `/theatre`, and `/search` with simple intentional placeholder content.
12. No fake sign-in, testimonials, user stats, case logs, or “coming soon” card grids.
13. Ensure keyboard navigation and visible focus states.
14. Keep the visual result very close in character to Dissect3 rather than inventing a new design language.

## Do not do yet
- appendicitis clinical content
- authentication
- database
- CMS
- search indexing implementation
- simulation engine
- anatomy imagery
- payments

## Acceptance criteria
- All required routes load directly and survive refresh.
- Desktop and mobile navigation work.
- Training-level selector is visually implemented with local UI state only; persistence comes later.
- No console errors.
- No TypeScript errors.
- Lint passes.
- Tests pass.
- Production build passes.
- Playwright smoke test passes.
- The shell looks recognisably like a cleaner evolution of Dissect3.

At completion, provide:
1. concise summary of architecture created;
2. files added/changed;
3. commands run and results;
4. any intentional deviations from this task and why.
