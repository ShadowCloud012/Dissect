# Task 03 completion report

Implemented 28 September 2026. Route:
`/learn/general-surgery/acute-appendicitis`, discoverable from Learn.
**Awaiting review**: reviewer and clinical review date are null.

## Instructions and scope

AGENTS.md, README.md, DEVELOPMENT.md and CODEX_TASK_02.md were read before edits.
CODEX_TASK_03.md was absent locally; the complete
[repository specification](https://github.com/ShadowCloud012/Dissect/blob/main/CODEX_TASK_03.md)
was read through GitHub (file SHA
`849868fa6b5bfeb1e8b7e90d672b39b886fb7627`).
No simulations, interactive rehearsal, viewers, search implementation, accounts,
database, new dependencies or shell redesign were added.

## Full clinical source list

All URLs, titles and years were checked against the source/publisher.
Access date: 28 September 2026. NHS years denote page review years; StatPearls
years denote chapter updates, not the rolling book-container year. RCS consent's
2016 date was corroborated by its publication catalogue and launch announcement;
it remains linked from the current RCS consent page.

| Stable ID                  | Source / URL                                                                                                                                                                                  | Year | Scope / verification limitation                                                                                                                                                                   |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `nhs-appendicitis`         | [Appendicitis](https://www.nhs.uk/conditions/appendicitis/)                                                                                                                                   | 2024 | Page reviewed 9 August 2024. Patient-facing overview; not a prescribing protocol.                                                                                                                 |
| `rcs-consent`              | [Consent: Supported Decision-Making — A Guide to Good Practice](https://www.rcseng.ac.uk/standards-and-research/standards-and-guidance/good-practice-guides/consent/)                         | 2016 | Current RCS consent resource links the 2016 guide; read alongside Good Surgical Practice 2025.                                                                                                    |
| `rcs-gsp`                  | [Good Surgical Practice](https://www.rcseng.ac.uk/standards-and-research/good-surgical-practice/)                                                                                             | 2025 | 2025 edition. Professional standards, supervision, records and continuity of care.                                                                                                                |
| `nice-perioperative`       | [Perioperative care in adults (NG180)](https://www.nice.org.uk/guidance/ng180/chapter/Recommendations)                                                                                        | 2020 | Adult perioperative guidance, not an appendicitis guideline.                                                                                                                                      |
| `nice-vte`                 | [Venous thromboembolism in over 16s: reducing the risk of hospital-acquired deep vein thrombosis or pulmonary embolism (NG89)](https://www.nice.org.uk/guidance/ng89/chapter/recommendations) | 2018 | Published 2018; updated 2019. VTE and bleeding risk assessment.                                                                                                                                   |
| `nice-ssi`                 | [Surgical site infections: prevention and treatment (NG125)](https://www.nice.org.uk/guidance/NG125/chapter/recommendations)                                                                  | 2019 | Updated 2020. Prophylaxis and infection care; antibiotic selection follows local formulary.                                                                                                       |
| `nice-fluids`              | [Intravenous fluid therapy in adults in hospital (CG174)](https://www.nice.org.uk/guidance/cg174/evidence/full-guideline-pdf-191667999)                                                       | 2013 | Adult fluid assessment and reassessment; no universal fluid prescription is supplied here.                                                                                                        |
| `nice-sepsis`              | [Suspected sepsis in people aged 16 or over: recognition, assessment and early management (NG253)](https://www.nice.org.uk/guidance/ng253)                                                    | 2025 | Published 19 November 2025. This adult pathway excludes pregnant/recently pregnant people; separate population pathways apply.                                                                    |
| `wses-2025`                | [Diagnosis and Treatment of Acute Appendicitis: 2025 Edition of the World Society of Emergency Surgery Jerusalem Guidelines](https://doi.org/10.1001/jamasurg.2025.6218)                      | 2026 | Published 28 January 2026 in JAMA Surgery. Latest edition verified for this draft. Accessible abstract used; detailed recommendation tables require clinician verification against the full text. |
| `appac-follow-up`          | [Antibiotic Therapy for Uncomplicated Acute Appendicitis: Ten-Year Follow-Up of the APPAC Randomized Clinical Trial](https://jamanetwork.com/journals/jama/fullarticle/2844116)               | 2026 | JAMA. Finnish trial follow-up in adults with CT-confirmed uncomplicated disease; its results are not universal eligibility criteria.                                                              |
| `cochrane-mri`             | [Magnetic resonance imaging (MRI) for diagnosis of acute appendicitis](https://www.cochrane.org/evidence/CD012028_magnetic-resonance-imaging-mri-diagnosis-acute-appendicitis)                | 2021 | Published 14 December 2021; searches to February 2021. Methodological limitations may bias diagnostic accuracy estimates.                                                                         |
| `leicester-appendicectomy` | [Having surgery to remove your appendix](https://yourhealth.leicestershospitals.nhs.uk/library/chuggs/general-surgery/2494-having-surgery-to-remove-your-appendix/file)                       | 2026 | Leaflet 1377, version 2, reviewed May 2026. Local patient information, not a national management pathway.                                                                                         |
| `cuh-children`             | [Appendicitis in children — information for parents and carers](https://www.cuh.nhs.uk/patient-information/appendicitis-in-children-information-for-parents-and-carers/)                      | 2025 | Version 5, approved 24 September 2025. High-level paediatric context; local treatment pathways are not generalised.                                                                               |
| `gstt-recovery`            | [Appendicectomy (surgery to remove the appendix) — Recovery after an appendicectomy](https://www.guysandstthomas.nhs.uk/health-information/appendicectomy/recovery-after-appendicectomy)      | 2025 | Reviewed July 2025. Recovery and safety-netting principles; no fixed discharge timetable adopted.                                                                                                 |
| `appendix-anatomy`         | [Anatomy, Abdomen and Pelvis: Appendix](https://www.ncbi.nlm.nih.gov/sites/books/NBK459205/)                                                                                                  | 2023 | StatPearls chapter updated 8 August 2023. Descriptive anatomy, not a management guideline.                                                                                                        |
| `appendectomy-textbook`    | [Appendectomy](https://www.ncbi.nlm.nih.gov/sites/books/NBK580514/)                                                                                                                           | 2025 | StatPearls chapter updated 14 May 2025. Descriptive technique only; devices and strategies vary.                                                                                                  |
| `appendicitis-textbook`    | [Appendicitis](https://www.ncbi.nlm.nih.gov/sites/books/NBK493193/)                                                                                                                           | 2024 | StatPearls chapter updated 12 February 2024. Used for examination, differentials and descriptive findings, not to override current guidelines.                                                    |
| `wses-2020-terminology`    | [Diagnosis and treatment of acute appendicitis: 2020 update of the WSES Jerusalem guidelines](https://wjes.biomedcentral.com/articles/10.1186/s13017-020-00306-3)                             | 2020 | Superseded edition, retained only for severity terminology and documented definitional variation. Current management is linked to the verified 2025 edition (published 2026).                     |
| `nhs-anaesthesia`          | [General anaesthetic](https://www.nhs.uk/tests-and-treatments/general-anaesthesia/)                                                                                                           | 2024 | Page reviewed 29 November 2024. Patient-facing preparation, recovery and adverse effects.                                                                                                         |

The 2025 WSES edition, published January 2026, is the latest verified version.
Its accessible abstract supports the broad framework; full recommendation tables
were not accessible and are not represented as verified. The superseded 2020
edition is retained solely for severity terminology and variation in definitions.

## Architecture and schemas

The Task 02 registry, generic route, server-first renderer and local training-level
store remain. The new topic composes presentation, management, operative/recovery
care, questions/evidence and reference modules. The production build statically
generates the route.

All 16 requested sections are present, with 20 static questions: 5 Medical Student,
5 Foundation, 6 CST and 4 Registrar. Depth is cumulative; advanced reveal does not
change the stored level. Facts have block references; editorial limitations use
source notes. The demo remains non-clinical.

UI refinements: one header selector, contextual depth label, compact source labels
with full accessible names, sticky scrollable desktop section index, and full
bibliography in the evidence section. Existing tokens, fonts and layout remain.

Schema changes:

- Discriminated clinical/demo metadata. Clinical status is draft, awaiting-review
  or clinically-reviewed.
- Clinically-reviewed requires a named reviewer and valid date. Other statuses
  require null sign-off fields. The demo now uses demoReviewedAt.
- Clinical topics require references; factual blocks require reference IDs.
  Source notes are a documented editorial exception. Claim references and
  duplicate/unknown-ID checks remain.
- Question block: question, model answer, minimum level, required reference IDs.
- Optional block localPolicyMayVary; reference shortTitle and patient-information
  evidence type; one optional section showReferences flag.

Structural validation does not establish medical accuracy or clinical review.

## Files added or changed

Added:

- src/components/topic/editorial-status.tsx
- src/schemas/clinical-editorial.test.tsx
- src/content/topics/acute-appendicitis/index.ts
- src/content/topics/acute-appendicitis/presentation.ts
- src/content/topics/acute-appendicitis/management.ts
- src/content/topics/acute-appendicitis/operative-care.ts
- src/content/topics/acute-appendicitis/questions-evidence.ts
- src/content/topics/acute-appendicitis/references.ts
- src/content/topics/acute-appendicitis/acute-appendicitis.test.tsx
- tests/e2e/appendicitis.spec.ts
- TASK_03_REPORT.md

Changed:

- src/schemas/topic.ts
- src/schemas/content-block.ts
- src/schemas/reference.ts
- src/schemas/topic.test.ts
- src/schemas/README.md
- src/components/content/content-renderer.tsx
- src/components/references/source-badge.tsx
- src/components/topic/topic-layout.tsx
- src/components/topic/topic-depth.tsx
- src/components/topic/topic-layout.test.tsx
- src/content/demo/how-dissect-content-works.ts (demo-date field only)
- src/content/registry.ts
- src/content/README.md
- src/app/learn/page.tsx
- src/app/page.tsx
- src/app/layout.tsx
- DEVELOPMENT.md

The pre-existing next-env.d.ts dev-generated change returned to its tracked
production form during the build; there was no manual edit.

## Validation commands and results

| Command              | Result                                                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| npm run lint         | Passed, zero warnings; rerun after the browser-test correction.                                                                |
| npm run typecheck    | Passed on infrastructure and the complete topic.                                                                               |
| npm run test         | Passed: initially 15, then 20, finally 22 tests in 9 files.                                                                    |
| npm run build        | Passed; new route statically generated.                                                                                        |
| npm run test:e2e     | Final: 8 passed in 19.9s, desktop Chromium and Pixel 7, including 320px. No browser console/page errors on tested valid flows. |
| npm run format:check | Passed after formatting the new browser test.                                                                                  |
| git diff --check     | Passed.                                                                                                                        |

Successful formatting commands:

- npx prettier --write src/schemas src/components/topic src/components/content/content-renderer.tsx src/components/references/source-badge.tsx src/content/demo/how-dissect-content-works.ts
- npx prettier --write src/content/topics src/app/learn/page.tsx src/app/layout.tsx src/app/page.tsx src/content/registry.ts src/components/topic/topic-depth.tsx
- npx prettier --write src/content/topics/acute-appendicitis tests/e2e/appendicitis.spec.ts
- npx prettier --write tests/e2e/appendicitis.spec.ts
- npx prettier --write TASK_03_REPORT.md DEVELOPMENT.md src/content/README.md src/schemas/README.md

First Playwright run: six passed; both new tests failed because the locator expected
“Open source:” while the accessible name was “Open source :”. The assertion now
tolerates whitespace; the links worked. The next full suite passed all eight.
One intermediate format check failed on the new test; it was formatted and passed
the next check. No acceptance failure is waived. Windows Playwright used sandbox
escalation for browser/server process cleanup.

## Screenshots inspected

In ignored Playwright outputs:
`test-results/appendicitis-appendicitis--e28a9-epth-navigation-and-sources-{desktop,mobile}-chromium/`.

- Desktop: appendicitis-student.png and appendicitis-registrar.png (overall layout),
  appendicitis-operation.png, appendicitis-consent.png, appendicitis-source.png.
- Pixel 7: appendicitis-status.png, appendicitis-operation.png,
  appendicitis-consent.png.
- 320px desktop-browser viewport: appendicitis-320-top.png,
  appendicitis-320-complications.png.

Full-page captures establish structure; detail captures establish readable text.
The 320px table wraps within its container. Tests cover direct loading, metadata,
Learn discovery, keyboard section navigation, source anchors, depth persistence,
advanced reveal, status, no false review date, overflow and browser errors.

## Deliberate omissions and deviations

No universal antibiotic agent, dose, fixed duration or discharge time is supplied.
No precise risk/recurrence percentages, imaging performance estimates, radiation
thresholds or mandatory score cut-offs are asserted.

Detailed immunocompromised management, pregnancy treatment algorithms, adult
mass/abscess eligibility, age-based neoplasm follow-up thresholds and a universal
interval-appendicectomy rule are omitted pending full current-guideline verification.
These gaps are visible in the topic. No device or port map is mandated.

These are permitted source-limited omissions, not expanded scope. The remote task
specification, abstract-level WSES access and explicitly historical terminology
citation are the implementation qualifications. No clinical sign-off is claimed.

## Named clinician review before publication

A named surgeon must review all claim-source pairings, adult/paediatric boundaries,
severity terminology, complicated disease/source control, non-operative eligibility,
abscess/neoplasm follow-up, anatomy and operative sequence, unexpected findings,
consent and patient-specific risks.

Obtain relevant anaesthetic, antimicrobial, radiology and paediatric/obstetric
input. Verify full current WSES recommendation tables and local policies.
Only an actual review should populate the reviewer and review-date fields.

## Before Task 04

Decide accountable authorship/review, sign-off and re-review rules, whether draft
routes should be public/indexable, and ownership of local-policy maintenance.
Resolve the flagged clinical gaps before reusing content in interactive scenarios.
Keep the next task bounded by its written specification.

## Reviewable commits

- 3270e57: clinical editorial safeguards and static question rendering.
- c0b9b1b: sourced acute appendicitis draft and levelled question bank.
- Final validation/documentation commit: browser coverage and this report.
