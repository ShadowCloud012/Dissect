# Codex Task 03A — Clinical provenance and copy audit before feature expansion

Read `AGENTS.md`, `README.md`, `DEVELOPMENT.md`, `CODEX_TASK_03.md`, `TASK_03_REPORT.md`, and this task fully before changing code.

## Goal
Perform a narrow correction and provenance-quality pass on the Acute appendicitis reference before any practice/simulation/search feature work.

Do not add new product features. Do not broaden the medical scope. Do not mark the topic clinically reviewed.

The aim is to ensure each clinical statement is supported by a source appropriate to the claim being made, not merely accompanied by a citation.

## 1. Claim-to-source audit
Review every block in the acute appendicitis topic and ask:

- Does each cited source actually support every clinically meaningful statement in that block?
- Is the source being used within its proper scope?
- Is a patient-information leaflet being used only for patient-information/recovery/risk context rather than as the sole authority for technical management?
- Is a paediatric local pathway being accidentally generalized to adults?
- Is a general guideline being stretched beyond what it establishes?

Where a block contains multiple distinct claims with different evidence bases, either:
- split the block; or
- attach all appropriate references.

Do not retain a citation merely because it is adjacent/relevant.

## 2. Specific items to review

### Relevant history
Review `relevant-history` in `presentation.ts`.
The NHS general-anaesthesia page is not an obvious source for the whole history-taking statement.
Split or replace references so each statement has appropriate provenance.

### Generalised peritonitis / source control
Review `peritonitis-plan`.
NICE sepsis supports recognition/escalation of deterioration, but source-control planning is an appendicitis/surgical-management claim.
Add an appropriate appendicitis/surgical source or narrow the wording.

### Appendiceal mass / abscess
Review `abscess-options`.
Do not use a local paediatric CUH patient pathway as support for a general adult management statement.
Either:
- restrict the content explicitly to paediatric context;
- support adult principles with the verified current WSES source where the accessible publication supports them; or
- keep the adult detail as an explicit clinical-review TODO rather than a clinical claim.

### Complication management
Review the complications table in `operative-care.ts`.
A local patient leaflet may support the existence/recognition of complications but should not be the sole authority for management claims such as drainage, transfusion, reoperation or decompression unless the source actually says so.

Split "recognition" from "management" if needed.
Use higher-quality appropriate sources where available; otherwise simplify the management language or mark it for review.

### Older adults / neoplasm follow-up
The current WSES abstract explicitly supports follow-up strategies after non-operative treatment of appendicitis with abscess to detect neoplasms. Keep the statement broad unless full recommendation details are verified.
Do not add age thresholds or mandated tests from secondary summaries unless verified from the actual guideline.

### Postoperative antibiotics
The WSES abstract explicitly states that postoperative antibiotics in complicated appendicitis should be limited to short courses.
Keep the page's current non-prescriptive stance unless detailed recommendations are verified.
Do not add drug regimens or universal duration wording beyond what is directly supported.

## 3. Evidence hierarchy labels
Keep the existing evidence-type system but make the UI/documentation clear that:
- guideline / systematic review / primary study / textbook / patient information describe source type;
- source type does not itself prove that every linked claim is supported.

Do not introduce fake evidence scores.

## 4. Research-reference metadata
For major research/guideline sources, add author/publication metadata where confidently available and useful:
- WSES 2025 edition / JAMA Surgery;
- APPAC 10-year follow-up / JAMA;
- Cochrane MRI review if metadata is reliably available.

Do not fabricate author lists.

## 5. Copy quality
Fix obvious copy issues, including:
- "Higher-level content remain available" → grammatically correct wording.
- inconsistent UK terminology/capitalisation where present.
- overly broad claims that can be made more precise without adding complexity.

Do not rewrite the visual voice into textbook prose.

## 6. Draft status
Keep:
- status = awaiting-review
- clinicalReviewer = null
- lastClinicallyReviewed = null

The topic must continue to display:
"Draft educational content — awaiting clinical review"

Do not weaken this safeguard.

## 7. Tests
Add or update tests where practical to prevent regression in the exact areas changed.

At minimum:
- schema/reference integrity still passes;
- appendicitis topic renders;
- awaiting-review state is unchanged;
- no duplicate training-level selector;
- no browser console errors.

No need to invent an automated "medical truth" validator.

## 8. Validation
Run:
- npm run lint
- npm run typecheck
- npm test
- npm run build
- npm run test:e2e
- npm run format:check
- git diff --check

## Do not do
- no new clinical sections;
- no simulation;
- no operative rehearsal interaction;
- no search implementation;
- no authentication/database;
- no anatomy/imaging viewer;
- no redesign.

## Completion report
Provide:
1. every block whose wording/references changed;
2. why each changed;
3. source metadata added;
4. any claims removed because support was insufficient;
5. test/build results;
6. any remaining clinical-review TODOs.
