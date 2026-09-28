# Codex Task 04 — Dissect information architecture + flagship topic UX overhaul

Read `AGENTS.md`, `README.md`, `DEVELOPMENT.md`, `CODEX_TASK_02.md`, `CODEX_TASK_03.md`, `TASK_03_REPORT.md`, `CODEX_TASK_03A.md` if present locally, and this task fully before making changes.

## Goal

Transform Dissect from a technically sound content renderer into a polished surgical reference product.

This task should establish the scalable navigation and topic UX that future specialties and conditions will reuse.

The product should support two distinct but connected use cases:

1. **Quick reference in wards/theatre**
   - answer-first;
   - highly scannable;
   - one-handed mobile friendly;
   - fast access to assessment, management, operation, complications and escalation points.

2. **Deeper learning and revision**
   - structured explanations;
   - progressive training-level depth;
   - active recall;
   - evidence visibility;
   - anatomy/operative understanding;
   - revision questions.

Use Acute appendicitis as the only full flagship topic for this task.

Do not add large numbers of new clinical topics merely to populate the UI.

---

# PART A — INFORMATION ARCHITECTURE

## 1. Learn should begin with specialties

Redesign `/learn` so it is a specialty-selection experience rather than a flat topic list.

For now:
- General Surgery is the only populated specialty.
- Do not create fake content cards for specialties that do not exist yet.
- It is acceptable to show a restrained "more specialties will be added" note, but not a large grid of empty placeholders.

Create a reusable specialty metadata model.

At minimum support:
- id
- slug
- title
- short description
- topic count derived from registry
- optional category/group metadata

General Surgery should link to:

`/learn/general-surgery`

---

## 2. General Surgery landing page

Create a dedicated General Surgery landing page.

Route:

`/learn/general-surgery`

Desktop should support a left category/navigation rail and a topic browsing area.

Initial General Surgery taxonomy should support categories such as:
- All topics
- Emergency General Surgery
- Upper GI
- HPB
- Colorectal
- Breast
- Endocrine
- Abdominal Wall / Hernia

Only categories containing real registered topics need to dominate the UI.
Empty categories should not create visual clutter.

Acute appendicitis should currently appear under:
- Emergency General Surgery
- Colorectal

The architecture must support future topics belonging to multiple categories without duplicating content.

---

## 3. Multi-category taxonomy

A topic must have one canonical URL and be discoverable through multiple category views.

Do not encode taxonomy through duplicated files or duplicated pages.

Evolve metadata to support something like:

```ts
categories: [
  'emergency-general-surgery',
  'colorectal'
]
```

Keep a single canonical route:

`/learn/general-surgery/acute-appendicitis`

Filtering/category browsing should point to this one topic.

Provide reusable helpers for:
- list topics by specialty;
- list topics by category;
- derive counts;
- retrieve category metadata;
- handle multi-category topics.

---

## 4. Breadcrumbs

Add reusable breadcrumbs.

Examples:

`Learn / General Surgery / Acute appendicitis`

On category pages/filtered views, category context may appear in the UI, but do not generate multiple canonical topic URLs.

Breadcrumbs must:
- be semantic;
- keyboard accessible;
- work on mobile;
- not become visually noisy.

---

# PART B — TOPIC STRUCTURE

## 5. Replace the giant single-page topic with a hub + subpages

Acute appendicitis currently has too many major sections for one long page.

Create a hybrid topic architecture.

Canonical hub:

`/learn/general-surgery/acute-appendicitis`

Subpages:

`/learn/general-surgery/acute-appendicitis/assessment`
`/learn/general-surgery/acute-appendicitis/investigations`
`/learn/general-surgery/acute-appendicitis/management`
`/learn/general-surgery/acute-appendicitis/anatomy`
`/learn/general-surgery/acute-appendicitis/appendicectomy`
`/learn/general-surgery/acute-appendicitis/post-op`
`/learn/general-surgery/acute-appendicitis/complications`
`/learn/general-surgery/acute-appendicitis/consent`
`/learn/general-surgery/acute-appendicitis/hot-seat`
`/learn/general-surgery/acute-appendicitis/evidence`

Exact internal grouping can vary slightly if a better reusable model emerges, but do not create a route for every tiny heading.

Recommended grouping:

### Assessment
- Presentation
- Assessment
- Differential diagnoses

### Investigations
- Investigations
- Imaging
- Diagnosis and severity

### Management
- Management
- Special situations

### Anatomy
- Surgical anatomy

### Appendicectomy
- Laparoscopic appendicectomy

### Post-op
- Postoperative care

### Complications
- Complications

### Consent
- Consent

### Hot Seat
- Hot Seat

### Evidence
- Evidence and references

The hub should remain concise and useful on its own.

---

## 6. Topic hub

The Acute appendicitis hub should not simply duplicate every subpage.

It should be a fast-reference landing page with:

- concise condition definition;
- high-yield presentation;
- immediate red flags / deterioration;
- key investigation summary;
- broad management summary;
- operative pathway summary;
- common/important complications;
- consent essentials;
- clear links into deeper subpages.

This should answer:
"What do I need to know right now?"

Aim for a user to extract the core picture within roughly 30–60 seconds.

Do not introduce unsupported new clinical claims.
Use existing validated content wherever possible.

---

## 7. Contextual topic navigation

Inside Acute appendicitis, replace the current 16-item section navigation with grouped contextual navigation.

Desktop example:

```text
ACUTE APPENDICITIS

Overview

Clinical
  Assessment
  Investigations
  Management

Operative
  Anatomy
  Appendicectomy
  Post-op
  Complications
  Consent

Revision
  Hot Seat
  Evidence
```

Mobile:
- use a compact sticky topic navigation control;
- do not hide navigation completely;
- avoid a giant permanently open menu;
- maintain quick access to core pages.

The current page should be clearly indicated.

---

# PART C — QUICK REFERENCE VS DEEP LEARNING

## 8. Quick-reference layer

Establish a reusable "Quick Reference" presentation pattern.

This is not a separate duplicate content database.

Use the same structured source content but allow selected blocks/claims to be surfaced in a concise summary view.

Add schema support only if needed, for example:
- `quickReference: true`
- `priority: 'high'`
- `contextTags`

Do not over-engineer.

The appendicitis hub should surface quick-reference content for:
- typical presentation;
- red flags;
- investigations;
- initial management;
- when to escalate;
- operation summary;
- postoperative concerns;
- important complications;
- consent essentials.

---

## 9. Ward and theatre context

Lay foundations for context-driven views without building a second app.

Add two compact contextual panels to the flagship topic where useful:

### On the ward
Examples of what the UI may surface:
- what to reassess;
- deterioration/red flags;
- postoperative concerns;
- escalation points;
- discharge/safety-net principles.

### Going to theatre
Examples:
- key anatomy;
- positioning;
- access/ports principles;
- operative sequence;
- danger areas;
- consent points;
- questions to revise before the case.

These must be summaries linked to the relevant full subpages.

Do not create unsourced new clinical content.
Do not create a full theatre simulator.

---

# PART D — RICHER SURGICAL UI

## 10. Replace plain text repetition with purposeful visual patterns

The current renderer is technically correct but visually too uniform.

Create richer reusable presentation components while preserving structured content.

Potential components:

- QuickSummary
- DontMiss / Warning
- EscalationPoint
- ClinicalPearl
- AtAGlance
- KeyFactGrid
- ComparisonTable
- DecisionPathway
- OperativeStepList
- ComplicationCard
- ConsentPanel
- RevisionQuestion
- ContextPanel
- SourcePopover / SourceDetails
- RelatedLink

Names may differ, but components must remain generic.

Do not hard-code appendicitis copy inside reusable UI components.

---

## 11. Presentation / assessment UI

Make assessment content visually scannable.

Possible structure:
- classic pattern card;
- history categories;
- examination;
- important alternatives;
- red flags.

Do not display every sentence as a separate decorative card.
Use hierarchy intentionally.

---

## 12. Investigations UI

Create a clearer layout for:
- bloods;
- urine;
- imaging;
- diagnostic synthesis.

Imaging should visually distinguish:
- ultrasound;
- CT;
- MRI;
- limitations/context.

Do not add unsupported diagnostic statistics.

---

## 13. Management UI

Where content supports it, render management as a readable decision framework rather than long prose.

For example:

```text
Suspected appendicitis
        ↓
Assess stability
   ↙          ↘
Stable       Deteriorating
  ↓               ↓
Further       Resuscitation +
assessment     urgent senior review
```

This can be a semantic HTML/CSS pathway.

Do not invent algorithmic recommendations beyond the existing sourced content.

---

## 14. Anatomy UI

Improve anatomy presentation even without custom images yet.

Use:
- labelled structure cards;
- relational anatomy;
- "why it matters in theatre";
- nearby structures / danger areas.

Do not build SVG or 3D anatomy in this task.

Leave clear extension points for future visual anatomy.

---

## 15. Appendicectomy UI

Turn the operative sequence into a high-quality stepper/timeline.

Example structure:
1. Position and prepare
2. Access
3. Identify appendix
4. Control mesoappendix
5. Secure/divide base
6. Retrieve specimen
7. Inspect / haemostasis
8. Close

Each step can expose concise detail.

Requirements:
- keyboard accessible;
- works without hover;
- useful on mobile;
- no fake animation;
- no implication that this replaces supervised training.

Avoid universally fixed port coordinates or device mandates.

---

## 16. Complications UI

Use structured complication cards/table.

Each complication should visually separate where supported:
- recognition;
- why it matters;
- broad response/escalation.

Do not invent incidence figures.

---

## 17. Consent UI

Make consent visibly different from ordinary prose.

Structure around:
- Why the procedure?
- Reasonable alternatives
- Material risks
- What might change during surgery?
- Patient-specific factors
- Questions / understanding

Preserve RCS supported decision-making principles.

Do not turn consent into a fixed tick-box list.

---

## 18. Hot Seat / revision UI

Keep this non-gamified but make it useful.

Each question should render as an active-recall component:
- question visible first;
- answer can be revealed;
- evidence/source remains accessible;
- keyboard accessible;
- training-level filtering still works.

No scores, streaks, XP, leaderboards or fake performance metrics.

---

# PART E — MOBILE-FIRST USE

## 19. Mobile quick-jump navigation

On topic pages, add a compact sticky or easily accessible quick-jump system.

The user should be able to move rapidly between:
- Overview
- Assess
- Investigate
- Manage
- Operate
- Complications

Exact labels may vary.

Do not allow this to obscure content or dominate the viewport.

---

## 20. One-handed usability

At 320–430px widths:
- no horizontal overflow;
- touch targets are comfortable;
- no essential information requires hover;
- evidence remains reachable;
- topic navigation remains reachable;
- tables degrade gracefully;
- operative steps remain legible;
- breadcrumbs collapse sensibly.

Treat mobile as a primary use case.

---

# PART F — EVIDENCE AND TRUST

## 21. Evidence visibility

Important claims should have unobtrusive but visible source access.

Prefer compact source markers near content with:
- short label;
- accessible full name;
- link/anchor to reference detail.

Do not make the bibliography dominate every page.

The Evidence page/subpage should contain:
- full references;
- source limitations;
- local-policy notes;
- editorial status;
- known unresolved clinical-review TODOs.

---

## 22. Clinical review status

Keep appendicitis:
- status = awaiting-review
- clinicalReviewer = null
- lastClinicallyReviewed = null

The status must remain visible but not visually overwhelming.

Do not imply sign-off.

---

# PART G — RELATED CONTENT FOUNDATION

## 23. Related content model

Add a small reusable related-content relationship model if needed.

Future relationship types may include:
- related condition;
- related procedure;
- anatomy;
- complication;
- theatre skill.

For now, only use real existing destinations.

Do not create dead cards/links for content that does not exist.

This task should lay a clean foundation, not build a full knowledge graph.

---

## 24. Conditions and procedures

Do not fully separate condition/procedure content yet, but avoid architecture that makes this impossible later.

The canonical condition remains:
- Acute appendicitis

Its related procedure is conceptually:
- Laparoscopic appendicectomy

The new subpage structure should make future extraction/reuse of procedure content straightforward.

---

# PART H — SEARCH PREPARATION

## 25. Improve indexing metadata, but do not build search yet

Ensure sections/subpages can expose useful:
- title;
- aliases;
- keywords;
- category;
- specialty;
- route;
- heading labels.

This should make a later global search implementation straightforward.

Do not implement the actual search engine in Task 04.

---

# PART I — DESIGN DIRECTION

## 26. Preserve the Dissect visual identity

Keep:
- restrained green/off-white/charcoal palette;
- DM Sans / DM Mono;
- thin borders;
- restrained shadows;
- compact labels;
- generous whitespace;
- clinical editorial feel;
- meaningful amber/red/green states.

Avoid:
- gradients;
- glassmorphism;
- giant rounded SaaS cards;
- cartoon medical imagery;
- excessive icons;
- excessive badges;
- excessive animation;
- generic med-tech aesthetics.

Desired feel:

**premium surgical atlas × modern clinical decision tool × interactive simulator**

This task should move significantly closer to that feeling.

---

# PART J — ACCESSIBILITY

## 27. Accessibility requirements

Maintain or improve:
- semantic headings;
- keyboard navigation;
- visible focus;
- reduced motion;
- sufficient colour contrast;
- correct aria-current;
- proper landmark use;
- accessible disclosure controls;
- accessible source labels;
- table semantics.

No important interaction may depend only on colour.

---

# PART K — TESTING

## 28. Unit/component coverage

Add/update tests for:
- specialty/category taxonomy;
- multi-category topic discovery;
- canonical topic URL;
- topic subpage resolution;
- quick-reference selection logic if introduced;
- grouped topic navigation;
- no duplicate content objects;
- active-recall reveal behaviour;
- training-level filtering across subpages;
- evidence/source links.

---

## 29. Playwright coverage

Verify at least:

### Learn
- `/learn` shows specialty browsing;
- General Surgery is discoverable;
- `/learn/general-surgery` loads directly;
- Acute appendicitis appears in relevant category views;
- same topic links to one canonical URL.

### Topic
- hub loads directly;
- all core subpages load directly;
- refresh works;
- breadcrumbs work;
- topic navigation shows current page;
- training-level persistence works;
- advanced reveal works;
- Hot Seat answer reveal works;
- evidence is reachable;
- draft/awaiting-review status remains correct.

### Mobile
- Pixel-sized viewport;
- 320px viewport;
- no horizontal overflow;
- quick-jump/topic navigation usable;
- operative stepper usable;
- consent and complication layouts readable;
- no browser console errors.

---

# PART L — PERFORMANCE / ARCHITECTURE

## 30. Keep the implementation simple

Prefer:
- Server Components by default;
- static generation;
- explicit registry/taxonomy data;
- small client islands only for interactions;
- no global state library;
- no UI framework dependency unless genuinely necessary.

Do not add a CMS/database.

Do not create speculative abstractions for specialties that do not exist yet.

---

# DO NOT DO IN TASK 04

- no simulation engine;
- no branching clinical cases;
- no operative rehearsal simulator;
- no anatomy SVG/3D viewer;
- no imaging viewer;
- no real global search;
- no authentication;
- no database;
- no case log;
- no payments;
- no AI tutor;
- no gamification;
- no bulk creation of new topics;
- no fake specialty/module content.

---

# Acceptance criteria

Task 04 is complete when:

- Learn opens into a specialty-led browsing experience.
- General Surgery has its own scalable category-led landing page.
- Topics can belong to multiple categories without duplication.
- Acute appendicitis has one canonical URL and a hub + meaningful subpages.
- The hub works as a genuine quick-reference page.
- Topic navigation is grouped and contextual rather than a 16-item flat section list.
- Breadcrumbs work.
- Mobile quick navigation works.
- The UI is materially richer than plain text rendering.
- Assessment, investigations, management, anatomy, appendicectomy, complications, consent and Hot Seat each have purposeful presentation.
- Hot Seat uses active recall reveal.
- Evidence remains accessible.
- Awaiting-review status is preserved.
- Training-level depth still works across the new structure.
- No new unsupported clinical claims are introduced.
- No fake content is added just to fill the site.
- lint, typecheck, tests, build and Playwright all pass.
- no browser console errors.
- no horizontal overflow at 320px.

---

# Completion report

At completion provide:

1. information architecture summary;
2. route map;
3. taxonomy/data-model changes;
4. UI component changes;
5. files added/changed;
6. screenshots inspected;
7. mobile behaviour summary;
8. accessibility checks;
9. full validation results;
10. any content migrations performed;
11. anything deliberately deferred;
12. recommendations for Task 05.

