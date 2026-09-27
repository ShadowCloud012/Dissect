# Dissect v2 — Product & Technical Blueprint

## 1. Product definition
Dissect is a UK-first surgical education and reference platform designed to be useful from medical school through surgical training. It combines fast reference material with case-based practice, operative rehearsal, anatomy, imaging, consent, complications, and viva-style questioning.

### Core product rule
**Reference first, simulation second, same underlying content.**

A user should be able to:
1. Find an answer quickly during study or clinical work.
2. Understand why it is true and see the source.
3. Explore the relevant anatomy/operation/complication in depth.
4. Practise applying the same knowledge in a case.

### Initial scope
- Specialty: General Surgery
- Flagship topic: Acute appendicitis
- Flagship procedure: Laparoscopic appendicectomy
- Initial training levels: Medical Student, FY1/2, CST, Registrar

Do not expand to multiple specialties until the appendicitis vertical slice is excellent and a second General Surgery topic proves the architecture generalises.

## 2. Product principles
1. **Clinical topic is the centre of the product.** Anatomy, imaging, operative rehearsal, complications, consent, questions and evidence are views of a topic/procedure, not disconnected top-level modules.
2. **Progressive disclosure.** Core information is visible first; advanced material is revealed by training level or explicit expansion.
3. **Source important claims.** Clinical recommendations, numerical risks and guideline-dependent claims require references.
4. **Fast reference.** A user should reach common answers in <=3 interactions from search or navigation.
5. **One content source, many experiences.** Reference pages, Hot Seat, rehearsal and simulations consume the same structured topic data where practical.
6. **Mobile is first-class.**
7. **Educational, not prescriptive clinical decision support.**
8. **Do not redesign the brand.** Preserve the existing Dissect visual DNA.

## 3. Information architecture
### Primary navigation
- Learn
- Practice
- Theatre
- Saved
- Search

Do not make Anatomy / Complications / Rehearsal separate top-level silos.

### Learn hierarchy
```
Learn
└── General Surgery
    ├── Emergency General Surgery
    │   ├── Acute appendicitis
    │   ├── Acute cholecystitis [later]
    │   ├── Small bowel obstruction [later]
    │   └── Diverticulitis [later]
    ├── Colorectal [later]
    ├── Upper GI [later]
    ├── HPB [later]
    ├── Breast [later]
    ├── Endocrine [later]
    └── Abdominal wall / hernia [later]
```

### Topic anatomy: Acute appendicitis
- Overview
- Presentation
- Assessment
- Differential diagnoses
- Investigations
- Imaging
- Diagnosis / severity
- Management
- Special situations
- Anatomy
- Laparoscopic appendicectomy
- Post-operative care
- Complications
- Consent
- Hot Seat
- Evidence & references

### Practice hierarchy
```
Practice
└── General Surgery
    └── Acute appendicitis
        ├── Initial assessment case
        ├── Imaging / diagnosis decisions
        ├── Consent station
        ├── Operative rehearsal
        ├── Post-op deterioration
        └── Hot Seat
```

### Theatre
Cross-specialty reference content only:
- Theatre etiquette
- Scrubbing / gowning / gloving
- Instruments
- Sutures
- Knots
- Energy devices
- Drains
- Basic laparoscopy
- Positioning
- WHO checklist / human factors

## 4. Routes
Use real URL routes. URLs must be shareable, bookmarkable and reload-safe.

Suggested App Router routes:
```
/
/learn
/learn/general-surgery
/learn/general-surgery/acute-appendicitis
/learn/general-surgery/acute-appendicitis/presentation
/learn/general-surgery/acute-appendicitis/assessment
/learn/general-surgery/acute-appendicitis/investigations
/learn/general-surgery/acute-appendicitis/imaging
/learn/general-surgery/acute-appendicitis/management
/learn/general-surgery/acute-appendicitis/anatomy
/learn/general-surgery/acute-appendicitis/laparoscopic-appendicectomy
/learn/general-surgery/acute-appendicitis/post-op
/learn/general-surgery/acute-appendicitis/complications
/learn/general-surgery/acute-appendicitis/consent
/learn/general-surgery/acute-appendicitis/hot-seat
/learn/general-surgery/acute-appendicitis/evidence

/practice
/practice/general-surgery/acute-appendicitis
/practice/general-surgery/acute-appendicitis/initial-assessment
/practice/general-surgery/acute-appendicitis/operative-rehearsal
/practice/general-surgery/acute-appendicitis/post-op-deterioration

/theatre
/theatre/instruments
/theatre/sutures
/theatre/scrubbing
/theatre/etiquette

/search
/saved
```

## 5. Technical stack
- Next.js 16 Active LTS, latest patched stable release
- App Router
- React
- TypeScript strict mode
- Tailwind CSS
- ESLint
- Prettier
- Vitest + React Testing Library
- Playwright
- Zod
- One consistent icon library

Prefer Server Components by default, minimal dependencies, static generation for educational content, and no global state library initially.

Defer authentication, database, payments, CMS, AI tutor, social features, and production case logs.

## 6. Repository structure
```
src/
├── app/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── navigation/
│   ├── content/
│   ├── topic/
│   ├── anatomy/
│   ├── imaging/
│   ├── operative/
│   ├── simulation/
│   ├── questions/
│   └── references/
├── content/
│   ├── specialties.ts
│   ├── general-surgery/
│   │   └── acute-appendicitis/
│   └── theatre/
├── lib/
├── schemas/
└── styles/
```

Avoid a single giant `surgicalData.ts` file.

## 7. Core data model
All content objects must be validated by Zod during development/build.

```ts
type TrainingLevel = 'medical-student' | 'foundation' | 'cst' | 'registrar';
type EvidenceStrength = 'guideline' | 'systematic-review' | 'primary-study' | 'expert-consensus' | 'textbook' | 'local-policy';

type Reference = {
  id: string;
  organisation?: string;
  authors?: string[];
  title: string;
  publication?: string;
  year: number;
  url?: string;
  accessedAt?: string;
  evidenceType: EvidenceStrength;
  notes?: string;
};

type ClinicalClaim = {
  id: string;
  text: string;
  minimumLevel: TrainingLevel;
  referenceIds: string[];
  localPolicyMayVary?: boolean;
};
```

Content blocks should use designed types such as prose, keyPoints, warning, clinicalPearl, definition, table, algorithm, checklist, anatomyStructure, imagingFinding, operativeStep, complication, question, sourceNote.

## 8. Training-level system
Training level changes depth, not truth.

- Medical Student: recognition, history/exam, differentials, basic investigations, principles of management, essential anatomy, broad operation, common complications.
- Foundation: practical initial management, escalation, interpreting investigations, peri-op preparation, post-op review, deterioration.
- CST: operative planning, detailed anatomy, port placement, steps, difficult situations, consent detail, viva depth.
- Registrar: complex decisions, atypical disease, operative nuance, complications, conversion/open strategy, evidence and controversy.

Advanced content must remain manually revealable.

## 9. Clinical governance
Every important clinical recommendation, statistic, risk, threshold or guideline-dependent claim needs provenance.

Each topic should include:
- last clinically reviewed date
- reference list
- source linkage at claim/block level where useful
- a visible note where local policy may differ

Codex must never invent missing clinical facts. Use TODO placeholders instead.

## 10. Visual system
Treat Dissect3 as the visual reference.

Preserve:
- Dissect green centred around #1D9E75 / #085041
- warm off-white #F7F6F3
- near-black #1A1917
- DM Sans / DM Mono character if practical
- thin borders
- restrained shadows
- compact tags
- generous whitespace
- semantic green/amber/red states
- editorial/clinical feel

Avoid gradients, glassmorphism, generic healthcare SaaS styling, excessive rounded cards, giant icons, cartoon medical imagery, excessive animation, and gamification aesthetics.

## 11. Core reusable components
Initial primitives:
- Button
- Badge
- Card
- Alert

Later domain components:
- TopicLayout
- SectionNav
- TrainingLevelSelector
- SourceBadge
- ReferenceList
- AnatomyViewer
- ImagingViewer
- OperativeStepper
- ComplicationCard
- SimulationDecision
- HotSeatQuestion
- ConsentGuide

Generic components must not contain appendicitis-specific copy.

## 12. Mobile
Mobile is a first-class product surface.
- Do not simply hide desktop sidebars.
- Convert contextual rails into drawers, sheets, sticky section navigation, or in-flow blocks.
- Preserve source access and training-level controls.
- Touch targets must be usable.
- Avoid horizontal overflow.

## 13. Search
Start with static content search over titles, aliases, headings, keywords and tags.
Search results should deep-link directly into a topic subsection.
No AI search initially.

## 14. Saved/progress MVP
Initially, local-only is acceptable:
- saved topics
- saved procedures
- last visited topic
- selected training level

No fake account state.

## 15. Accessibility
Target WCAG 2.2 AA where practical:
- semantic HTML
- keyboard navigation
- visible focus states
- no colour-only meaning
- accessible tabs/accordions/dialogs
- reduced motion
- useful alt text

## 16. Testing
Required before a task is complete:
- lint
- typecheck
- relevant unit/component tests
- production build
- relevant Playwright smoke tests

## 17. What to reuse from Dissect3
Use Dissect3 for visual reference, design tokens, interaction inspiration and identifying worthwhile product concepts.

Retain/rebuild concepts:
- landing visual language
- three-column topic layout
- Hot Seat
- operative rehearsal
- complication scenarios
- training level selector
- theatre basics

Do not port:
- useState screen router
- monolithic surgicalData.js
- fake dashboard stats
- fake testimonials
- disabled coming-soon cards
- unsourced clinical percentages
- hard-coded procedure-specific UI

## 18. Build sequence
Phase 0: repository foundation and design tokens.
Phase 1: shell, navigation, real routing, Learn/Practice/Theatre IA.
Phase 2: schemas, content registry, training-level filtering, references.
Phase 3: complete appendicitis reference.
Phase 4: practice/simulation engine.
Phase 5: search, saved MVP, responsive/accessibility/performance polish.
Phase 6: validate architecture with acute cholecystitis/laparoscopic cholecystectomy.

If the second topic requires substantial bespoke UI or schema rewrites, refactor before expanding further.
