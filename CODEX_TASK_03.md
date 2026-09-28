# Codex Task 03 — Publish the first real clinical topic: Acute appendicitis

Read `AGENTS.md`, `README.md`, `DEVELOPMENT.md`, `CODEX_TASK_02.md`, and this task fully before changing code.

## Goal
Use the structured content engine built in Task 02 to create the first real Dissect clinical reference topic:

**General Surgery → Acute appendicitis**

This is the first production-shaped clinical vertical slice. It must be genuinely useful as a fast UK-oriented reference while remaining clearly labelled as **draft / awaiting clinical review** until a named clinician signs it off.

Do not build the practice/simulation engine yet. Do not add operative rehearsal interactions yet. This task is the reference topic only.

---

## 1. Clinical publication status

Add explicit clinical editorial status to clinical topic metadata.

Support at least:
- draft
- awaiting-review
- clinically-reviewed

For this topic use:
- status: `awaiting-review`
- clinical reviewer: unset / null
- reviewed date: do not imply clinical sign-off has occurred

The UI must clearly communicate:
**Draft educational content — awaiting clinical review**

Do not display "last clinically reviewed" for a topic that has not actually been reviewed.

If needed, evolve the metadata schema cleanly rather than abusing the existing date field.

---

## 2. Source hierarchy

Clinical content must be traceable to authoritative sources.

Use the following hierarchy when researching and writing content:

### UK-first
1. NICE guidance / NICE CKS where directly relevant and available.
2. Royal College of Surgeons of England standards/guidance for consent, professionalism and perioperative surgical principles.
3. NHS / NHS England / GIRFT guidance where relevant.
4. Relevant UK specialty-society guidance where authoritative and current.

### International evidence when UK guidance is absent or incomplete
5. World Society of Emergency Surgery (WSES) appendicitis guidelines.
6. High-quality systematic reviews / major peer-reviewed studies where required for specific claims.

### Rules
- Do not imply a NICE appendicitis guideline exists if there is no directly applicable NICE guideline.
- Do not invent local antibiotic choices. State that antibiotic selection should follow local antimicrobial policy unless a cited national source establishes otherwise.
- Do not invent risk percentages merely to fill the page.
- Numerical claims require references.
- Contested or evolving management areas must be presented with nuance and sources.
- Do not cite a secondary educational website when an authoritative primary guideline/source is available.
- Every external source added must have a real URL and accurate title/year.
- Do not fabricate DOI, authors, organisations, dates, or URLs.
- If a fact cannot be supported confidently, omit it or add a TODO for clinical review.

---

## 3. Minimum approved source set

The topic should include, where relevant:

- Current Royal College of Surgeons of England consent / supported decision-making guidance.
- Current RCS England Good Surgical Practice where relevant.
- WSES Jerusalem guidelines for diagnosis and treatment of acute appendicitis (use the latest current version you can verify; do not assume a newer version exists without checking).
- Relevant NICE/NICE CKS material only where it directly applies.
- Relevant UK perioperative / antimicrobial / VTE / surgical-site guidance only where applicable and accurately sourced.

Before finalising references, verify each source rather than copying citation strings from memory.

---

## 4. Topic path and metadata

Create:

`/learn/general-surgery/acute-appendicitis`

Metadata should include:
- id
- slug
- title: Acute appendicitis
- specialty: general-surgery
- category: Emergency General Surgery
- concise summary
- keywords
- aliases such as appendicitis / acute appendix inflammation where useful for later search
- contentKind: clinical
- publication/review status as above

Update the Learn page so General Surgery and Acute appendicitis are discoverable without needing to know the URL.

Do not create fake cards for unavailable specialties.

---

## 5. Required sections

Build the topic from structured content using the existing renderer and add schema/block types only when genuinely needed.

Required ordered sections:

1. Overview
2. Presentation
3. Assessment
4. Differential diagnoses
5. Investigations
6. Imaging
7. Diagnosis and severity
8. Management
9. Special situations
10. Surgical anatomy
11. Laparoscopic appendicectomy
12. Postoperative care
13. Complications
14. Consent
15. Hot Seat
16. Evidence and references

The page must remain usable as a quick reference; do not turn every section into long textbook prose.

---

## 6. Content design rule: Answer → Why → Source

For important clinical questions, optimise for three layers:

1. **Answer** — the concise fact/action a learner needs quickly.
2. **Why** — brief explanation/rationale.
3. **Source** — reference link/provenance.

Use key points, definitions, tables, claims and source notes instead of long uninterrupted prose.

---

## 7. Training-level depth

Use the existing minimum-level system meaningfully.

### Medical Student
Must cover:
- typical presentation;
- important history;
- examination;
- core differentials;
- basic investigations;
- diagnosis principles;
- broad management;
- essential appendix anatomy;
- broad principles of appendicectomy;
- common complications.

### Foundation
Add:
- practical initial management;
- analgesia/fluids as principles without inventing local protocols;
- escalation;
- interpreting common blood/imaging findings;
- preoperative preparation;
- postoperative review;
- recognising deterioration;
- discharge considerations.

### CST
Add:
- operative planning;
- port-positioning principles;
- detailed relevant anatomy;
- operative sequence;
- appendix/mesoappendix/base considerations;
- difficult appendix principles;
- conversion/escalation principles;
- consent depth;
- complication management;
- viva-level questions.

### Registrar
Add selectively:
- complex/atypical presentations;
- appendiceal mass/abscess decision-making;
- pregnancy considerations at an appropriately sourced level;
- difficult anatomy / unexpected findings;
- nuanced evidence controversies;
- operative judgement principles.

Do not add complexity merely to make the registrar layer look larger.

---

## 8. Overview section

Make this highly scannable.

Include:
- one-sentence definition;
- why the condition matters;
- hallmark presentation pattern with appropriate caveats;
- immediate high-yield learning points;
- a compact "At a glance" summary.

Avoid unsupported epidemiological percentages.

---

## 9. Presentation and assessment

Include concise structured content for:
- pain history and migration pattern;
- associated GI/systemic symptoms;
- relevant urinary/gynaecological history where appropriate;
- examination principles;
- signs of localised vs generalised peritonism;
- sepsis/physiological deterioration red flags;
- relevant patient factors.

Avoid presenting individual signs as perfectly sensitive/specific diagnostic tests unless sourced.

---

## 10. Differential diagnoses

Create a useful differential table grouped where appropriate:
- GI/surgical;
- urinary;
- gynaecological where relevant;
- other important mimics.

Prioritise clinically useful discriminators rather than exhaustive lists.

---

## 11. Investigations

Cover:
- FBC;
- CRP;
- U&Es / renal function where clinically relevant;
- urinalysis;
- pregnancy testing where relevant;
- other tests based on presentation;
- limitations of inflammatory markers.

Do not create a rigid universal panel if guidance/context does not support it.

---

## 12. Imaging

Explain practical roles and limitations of:
- ultrasound;
- CT;
- MRI where relevant, including pregnancy considerations at an appropriately sourced level.

Include:
- what learners should look for;
- when imaging helps;
- why modality choice varies by age/pregnancy/local pathway.

Do not invent radiation thresholds or diagnostic performance numbers without robust sources.

---

## 13. Diagnosis and severity

Explain:
- diagnosis is clinical + laboratory + imaging context;
- uncomplicated vs complicated appendicitis;
- perforation/abscess/phlegmon concepts;
- scoring systems only if their role and limitations are properly sourced.

Do not turn a score into a mandatory UK rule unless a source supports that.

---

## 14. Management

Present management as a decision framework, not a single rigid recipe.

Cover:
- initial supportive management;
- surgical referral/escalation;
- laparoscopic appendicectomy as an operative pathway where appropriate;
- antibiotics as part of care, explicitly deferring agent choice/dosing to local antimicrobial policy unless nationally sourced;
- non-operative antibiotic management as an evidence-based option in selected uncomplicated cases, with appropriate uncertainty/recurrence context and no oversimplification;
- management principles for perforation/generalised peritonitis;
- appendiceal abscess/phlegmon principles;
- senior decision-making where evidence/patient factors matter.

Any controversial/evolving recommendation must have attached references.

---

## 15. Special situations

Keep concise and clearly sourced.

Include where evidence supports:
- children (high-level only unless adequately sourced);
- pregnancy;
- older adults;
- immunocompromised patients;
- appendiceal mass/abscess.

If evidence is insufficient for a useful statement, omit rather than speculate.

---

## 16. Surgical anatomy

Create a high-quality textual anatomy reference that will later connect to the Anatomy Viewer.

Cover:
- appendix origin;
- caecum;
- taeniae coli as a localisation principle;
- mesoappendix;
- appendiceal artery;
- terminal ileum / ileocaecal region;
- variable appendix positions;
- structures at risk / nearby anatomy.

Do not build imagery yet.

Where appropriate, distinguish textbook anatomy from evidence-based management references.

---

## 17. Laparoscopic appendicectomy

This section should teach operative understanding without pretending to replace supervised surgical training.

Include:
- indication/context;
- preparation principles;
- positioning;
- port-placement principles rather than falsely universal exact coordinates;
- systematic exploration;
- identification of appendix;
- mesoappendix control;
- appendix base division;
- specimen retrieval;
- assessment of contamination;
- haemostasis;
- closure principles;
- situations requiring senior help / alternative strategy.

Do not present one device or technique as universally required where practice varies.

Add a visible educational disclaimer appropriate to operative learning.

No interactive rehearsal yet; that is a later task.

---

## 18. Postoperative care

Cover principles such as:
- observations and clinical review;
- analgesia;
- oral intake/mobilisation when appropriate;
- antibiotic continuation depending on uncomplicated/complicated disease and local policy/evidence;
- discharge readiness;
- safety-netting;
- histology/follow-up principles where appropriate.

Avoid invented universal discharge timelines.

---

## 19. Complications

Create structured complication content.

Cover at least:
- wound infection;
- intra-abdominal collection;
- bleeding;
- ileus;
- bowel injury;
- stump-related complication at an appropriately proportionate level;
- VTE/anaesthetic/general surgical complications where appropriate.

For each useful complication include:
- recognition;
- why it matters;
- broad management/escalation principle.

Do not invent incidence percentages unless strongly sourced and genuinely educational.

---

## 20. Consent

Base the framework on current UK consent principles and supported decision-making.

Include:
- indication;
- expected procedure;
- alternatives, including no treatment/non-operative options where clinically applicable;
- general anaesthetic/surgical considerations;
- material procedure-specific risks;
- possibility of findings/strategy changing;
- patient-specific discussion;
- opportunity for questions.

Do not reduce consent to a fixed risk checklist. Make clear that material risks depend on the individual patient and discussion.

Do not invent precise risk percentages.

---

## 21. Hot Seat

This task may include a NON-INTERACTIVE question bank rendered as normal structured content.

Create approximately:
- 5 Medical Student questions;
- 5 Foundation questions;
- 6 CST questions;
- 4 Registrar questions.

Each should have:
- question;
- concise model answer;
- minimum level;
- references where the answer contains guideline-dependent or numerical claims.

If the current schema needs a question block type, add it cleanly and test it.

Do not build flash-card interaction yet unless it falls out trivially from existing generic architecture; interaction belongs in a later task.

---

## 22. Evidence section

Include:
- readable reference list;
- short "where guidance differs" / evidence uncertainty notes where relevant;
- clear indication that local policy may differ for antibiotics and some pathways;
- clinical review status.

Do not reproduce long passages from source material.

---

## 23. Topic UI refinements

While integrating real content, make only evidence-driven refinements.

Required:
- avoid unnecessary duplicate training-level selectors on the same topic screen; retain one obvious primary control and display contextual level information elsewhere if useful;
- preserve fast section navigation;
- make source access unobtrusive but visible;
- keep long sections readable;
- ensure desktop and mobile both work;
- keep the visual identity from Tasks 01–02.

Do not redesign the shell.

---

## 24. Content quality checks

Add tests/checks where practical to detect:
- clinical topic with no references;
- clinical claim without a reference when reference-required;
- duplicate IDs;
- invalid publication/review status combinations;
- clinically-reviewed status without reviewer/date;
- draft/awaiting-review topic falsely rendering "last clinically reviewed".

Do not attempt to automate whether a medical statement is actually correct; structural validation is not clinical review.

---

## 25. Testing

Add/update unit/component tests for:
- clinical editorial status logic;
- topic validation;
- training-level visibility for appendicitis content;
- reference integrity;
- new question block if added;
- topic rendering without duplicated controls.

Playwright should verify:
- `/learn/general-surgery/acute-appendicitis` loads directly;
- page title/metadata;
- section navigation;
- training-level persistence;
- advanced reveal;
- references;
- clinical draft/awaiting-review status visible;
- no false "clinically reviewed" message;
- mobile usability at 320px and a normal mobile viewport;
- no horizontal overflow;
- no console errors.

---

## 26. Clinical safety / editorial rules

This is educational material, not patient-specific medical advice.

Do not add alarming generic disclaimers repeatedly throughout the page. Use one restrained product-level educational notice where appropriate.

Never:
- invent a source;
- invent a statistic;
- convert local practice into a national recommendation;
- state that content has been clinically reviewed when it has not;
- hide uncertainty in contested management areas;
- claim one operative technique is universally standard when reasonable variation exists.

---

## 27. Do not do yet

- interactive initial-assessment simulation;
- operative rehearsal engine;
- complication simulator;
- anatomy SVG/3D viewer;
- imaging viewer;
- global search implementation;
- accounts/database;
- saved topics;
- case log;
- payments;
- AI tutor.

Those come after the reference topic is solid.

---

## Acceptance criteria

- Acute appendicitis is discoverable from Learn.
- Direct topic route works and is statically generated.
- All content comes from validated structured content.
- Content is useful at Medical Student level and progressively deepens through Registrar.
- Important clinical recommendations/claims are cited.
- No unsupported precise risk percentages have been added.
- Local-policy-dependent areas are marked.
- Consent reflects UK supported decision-making principles.
- Topic is visibly awaiting clinical review and does not falsely display a clinical review date.
- No duplicate training-level control creates confusing UX.
- Mobile remains fully usable.
- No real clinical content appears in the demo fixture.
- lint, typecheck, tests, build and Playwright pass.
- no browser console errors.

## Completion report

At completion provide:
1. clinical source list used, with URL/title/year;
2. content architecture summary;
3. schema changes;
4. files changed;
5. test/build results;
6. screenshots inspected;
7. clinical statements deliberately omitted because sourcing was uncertain;
8. areas specifically needing named clinician review before publication;
9. any proposed changes before Task 04.
