# AGENTS.md — Dissect v2

## Mission
Build Dissect as a fast, trustworthy, UK-first surgical education and reference platform. The product must work both as a quick clinical-learning reference and as an interactive case/rehearsal environment.

## Non-negotiable product principles
- Clinical topics/procedures are the centre of the information architecture.
- Anatomy, imaging, operative rehearsal, complications, consent, questions and evidence are contextual views of a topic, not disconnected silos.
- Preserve the visual identity of the existing Dissect3 prototype; rebuild the architecture cleanly.
- Mobile is first-class.
- Important clinical claims and numerical risks require references.
- Do not invent clinical facts, guideline recommendations, citations, statistics, testimonials, user data or case-log data.
- If clinical content is missing, create a clearly marked content placeholder/TODO rather than guessing.
- Training level changes depth, not factual truth.

## Technology
- Next.js 16 Active LTS on the latest patched stable release available at implementation time.
- App Router.
- React + TypeScript strict mode.
- Server Components by default; use Client Components only when interaction requires them.
- Tailwind CSS backed by named Dissect design tokens.
- Zod for structured content validation.
- Vitest + React Testing Library.
- Playwright for critical flows.
- Keep dependencies minimal.

## Visual direction
The existing `ShadowCloud012/Dissect3` repository is the visual reference.

Preserve:
- restrained green/off-white/charcoal palette
- DM Sans / DM Mono character where licensing/availability permits
- thin borders
- restrained shadows
- compact tags
- generous whitespace
- editorial/clinical feel
- clear red/amber/green semantic states
- information-dense but calm layouts

Avoid:
- gradients
- glassmorphism
- generic blue healthcare SaaS styling
- excessive rounded cards
- giant icons
- cartoon medical imagery
- excessive animation
- gamification aesthetics
- decorative fake dashboards

Do not “modernise” the visual design merely for novelty.

## Architecture rules
- Never implement navigation with a single screen-name `useState` switch.
- Every meaningful page/view needs a real URL.
- Do not create a monolithic `surgicalData.ts`.
- Content belongs in structured, validated content modules separate from presentation components.
- Generic components must not contain appendicitis-specific copy.
- Do not use `dangerouslySetInnerHTML` for ordinary authored clinical content.
- Avoid inline styles except when values are truly dynamic.
- Prefer composition over giant conditional components.
- Prefer server-rendered/static educational content over client-side rendering.
- Do not add a global state library without a demonstrated need.

## Content rules
- Use stable IDs/slugs.
- Every content block may specify a minimum training level.
- Clinical claims may reference one or more stable reference IDs.
- Numerical incidence/risk claims require references.
- Guideline-dependent management recommendations require references.
- Mark recommendations that can vary by local policy.
- Every topic includes a last-clinically-reviewed date.
- Do not hide advanced content irretrievably; users can reveal it.

## UX rules
- Common reference answers should be reachable in <=3 interactions from navigation/search.
- Desktop topic pages may use left navigation + content + right contextual rail.
- On mobile, relocate contextual information rather than hiding it.
- Use loading/skeleton states only where loading actually exists.
- Empty/future features should generally not appear in primary navigation.
- Do not ship buttons that pretend to sign in, save remotely or perform actions that do not exist.

## Accessibility
Target WCAG 2.2 AA where practical.
- semantic HTML first
- keyboard navigable
- visible focus states
- sufficient contrast
- no colour-only meaning
- reduced-motion support
- accessible tabs/accordions/dialogs
- useful alt text

## Testing and completion
Before declaring a task complete, run and pass:
- lint
- typecheck
- unit/component tests relevant to the change
- production build
- relevant Playwright smoke tests for user-facing flows

If a command fails, fix it rather than documenting the failure as acceptable.

## Working style
- Work in small, reviewable commits.
- Do not rewrite unrelated files.
- Before a large architectural change, inspect existing patterns and explain the intended change in the task/PR summary.
- Prefer the simplest implementation that supports the documented product architecture.
- Do not add speculative abstractions for hypothetical future specialties.
- Build for appendicitis first, but ensure reusable components do not hard-code appendicitis.

## Current scope
Primary vertical slice:
- General Surgery
- Acute appendicitis
- Laparoscopic appendicectomy
- reference content
- training-level depth
- citations/references
- Hot Seat
- operative rehearsal
- one initial-assessment simulation
- one post-op deterioration scenario
- search

Explicitly out of scope unless requested:
- authentication
- database
- payments
- CMS
- social features
- AI tutor/chatbot
- leaderboards/streaks
- production case log
