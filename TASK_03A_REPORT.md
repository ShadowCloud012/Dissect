# Task 03A — clinical provenance and copy audit

Acute appendicitis remains **Draft educational content — awaiting clinical review**.
`status: awaiting-review`, `clinicalReviewer: null`, and `lastClinicallyReviewed: null`
are unchanged. This is an editorial source-scope audit, not clinician sign-off.
All required task documents were read in full before edits.

## Architecture and scope

No schema, routing, dependency, training-level or visual architecture changes.
The existing four structured section modules and reference model are retained.
There are still 16 clinical sections and 20 static questions. One mixed history
block was split; one editorial complication-management TODO was added within the
existing section. No new clinical section or product feature was introduced.

## Every changed or added content block

| Block ID                                   | Change and reason                                                                                                                                                                                                        |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `relevant-history`                         | Narrowed to urinary/bowel symptoms and inflammatory bowel history supported by the Appendicitis chapter's history/differential sections. Removed the anaesthesia citation from diagnostic history.                       |
| `anaesthetic-history` (split out)          | Medical conditions, medicines and previous medicine allergy now have their own explicitly pre-anaesthetic context, supported by NHS General anaesthetic preparation.                                                     |
| `examination`                              | Removed the generalised tenderness/rigidity inference not established by the cited passage. Retained the chapter's local peritoneal signs and diagnostic limitations.                                                    |
| `differential-table`                       | Retained source-listed differentials; removed the mixed discriminator column that exceeded the cited chapter. Added NHS Appendicitis for urinary tract infection. Expanded GI/UTI abbreviations.                         |
| `mri`                                      | Replaced a specialist/local-pathway recommendation attributed to a diagnostic review with a statement of that review's limits.                                                                                           |
| `severity`                                 | Qualified uncomplicated terminology rather than presenting one definition as universal; the historical WSES source explicitly describes definitional variation.                                                          |
| `operative-pathway`                        | Added RCS consent guidance for the informed-decision component, alongside WSES for broad treatment options.                                                                                                              |
| `antimicrobial-policy`                     | Added NICE NG15 for general prescribing, allergy and dose considerations; NG125 remains for surgical prophylaxis and infected/dirty surgery.                                                                             |
| `peritonitis-plan`                         | Added the full-text 2023 multi-society surgical source-control guideline. Distinguished surgical assessment/source control from NICE sepsis assessment, and made resuscitation conditional on clinical need.             |
| `abscess-options`                          | Reframed the entire example as CUH paediatric patient information. Adult management remains an explicit review TODO; the accessible WSES abstract does not establish an adult abscess algorithm.                         |
| `pregnancy`                                | Removed a specialist-pathway instruction unsupported by the MRI review. Retained its pregnancy evidence and imaging-sequence limitation.                                                                                 |
| `mesoappendix`                             | Added the Appendectomy technique chapter for the dissection/division claim; anatomy alone was insufficient.                                                                                                              |
| `structures-at-risk`                       | Added the technique chapter for exposure/intraoperative identification, alongside anatomy and patient-facing injury context.                                                                                             |
| `recovery-basics`                          | Added NHS Appendicitis for return to oral intake; GSTT covers wound/activity and safety-netting.                                                                                                                         |
| `postoperative-review`                     | Added NICE sepsis for recognising/escalating physiological deterioration; other references retain their separate records, analgesia, fluids and VTE roles.                                                               |
| `discharge-plan`                           | Added NHS Appendicitis for oral recovery and NICE NG180 for pain/discharge planning; GSTT alone did not support all readiness criteria.                                                                                  |
| `complications-table`                      | Converted the mixed recognition/technical response table to explicitly labelled patient-information context. Retained only descriptions directly supported by the Leicester leaflet's complications section.             |
| `vte-complication`                         | Added GSTT for calf pain/breathlessness safety-netting; retained NG89 for prevention. Removed swelling from this source-limited wording.                                                                                 |
| `complication-response`                    | Removed the general deterioration diagnostic instruction attributed only to wound-infection guidance. Retained NG125-supported cellulitis antibiotic selection. Deterioration remains addressed in its dedicated blocks. |
| `complication-management-todo` (editorial) | Records the missing technical assessment/treatment pathways for named clinician review; does not assert a replacement algorithm.                                                                                         |
| `antibiotic-question`                      | Replaced NG125 with NG15, which covers the question's general antimicrobial policy, allergy and microbiology scope.                                                                                                      |
| `artery-question`                          | Added the technique chapter for vascular identification/control.                                                                                                                                                         |
| `base-question`                            | Added the technique chapter for identification and base control.                                                                                                                                                         |

Generic copy changed: ReferenceList now says **Source type**, with an explanation
that publication type is neither evidence certainty nor proof of claim support.
The existing `evidenceType` schema is unchanged. TopicDepth now reads
“Higher-level content remains available”. No evidence scores were introduced.

## Audit of retained blocks

Every original block was reviewed, including the static answers and editorial
notes. The following retained blocks were checked within the cited source scope;
this records the editorial decision, not an automated truth assessment.

| Blocks retained                                                                                                                                       | Source passage/scope checked                                                                                                                                 |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `definition`, `at-a-glance`, `symptom-pattern`, `urine-pregnancy`, `stump-problem`                                                                    | NHS Appendicitis: symptoms, urgent assessment, tests, broad patient treatment and complications.                                                             |
| `deterioration`, `sepsis-tests`, `deterioration-question`                                                                                             | NICE NG253 recognition, clinical concern and population-specific assessment; no universal NEWS2 rule.                                                        |
| `patient-factors`, `analgesia-question`                                                                                                               | NICE NG180 risk assessment, specialist recovery and individual postoperative analgesia (sections 1.3, 1.5, 1.6).                                             |
| `fluid-assessment`, `renal-tests`, `fluid-support`, `fluid-question`                                                                                  | NICE CG174 assessment, monitoring and reassessment; adult scope.                                                                                             |
| `inflammatory-markers`, `ct-findings`                                                                                                                 | Appendicitis textbook evaluation section: contextual laboratory interpretation and descriptive imaging.                                                      |
| `imaging-choice`, `diagnostic-synthesis`                                                                                                              | Current WSES abstract: risk stratification and imaging; no mandatory UK score asserted.                                                                      |
| `ultrasound`, `mass-abscess`, `children`                                                                                                              | CUH child diagnosis/observation and mass/abscess explanations; paediatric context or descriptive definitions only.                                           |
| `initial-support`                                                                                                                                     | RCS competence/escalation; NG180 checklist and individual analgesia.                                                                                         |
| `nonoperative-discussion`, `antibiotics-evidence-question`                                                                                            | APPAC abstract/trial report: selected Finnish adults with CT-confirmed uncomplicated disease; recurrence/later surgery and limited generalisability.         |
| `older-adults`                                                                                                                                        | NG180 frailty/comorbidity; current WSES abstract supports broad neoplasm follow-up after non-operative abscess treatment. No age threshold or mandated test. |
| `appendix-origin`, `pain-migration`, `appendix-base`                                                                                                  | Appendix anatomy chapter: structure/location and visceral/parietal pain.                                                                                     |
| `operation-outline`, `operative-sequence`, `port-question`                                                                                            | Appendectomy technique section: positioning, access variation, identification, control, retrieval, inspection and closure.                                   |
| `operative-preparation`                                                                                                                               | NG180 surgical checklist and NG89 VTE/bleeding risk assessment/reassessment.                                                                                 |
| `operative-judgement`                                                                                                                                 | Appendectomy technique: visualisation/conversion; RCS competence and help.                                                                                   |
| `unexpected-findings`, `help-question`, `unexpected-question`                                                                                         | RCS Good Surgical Practice: competence, colleagues, records and continuity.                                                                                  |
| `postoperative-antibiotics`                                                                                                                           | Current WSES abstract's broad short-course statement plus NG125 prophylaxis/treatment distinction. No drugs or fixed duration added.                         |
| `histology-follow-up`                                                                                                                                 | Leicester leaflet's unexpected pathology/further assessment and RCS records/communication responsibilities.                                                  |
| `anaesthetic-complications`                                                                                                                           | NHS anaesthesia adverse effects/recovery monitoring and NG180 specialist recovery.                                                                           |
| `supported-decision`, `consent-depth`, `consent-question`, `material-risk-question`                                                                   | RCS supported decision-making: options, material risks, communication, capacity and documentation.                                                           |
| `procedure-specific-discussion`                                                                                                                       | Leicester patient-facing procedural risks plus RCS individual consent discussion.                                                                            |
| `discharge-question`                                                                                                                                  | GSTT recovery warning symptoms and contact advice.                                                                                                           |
| `wound-question`                                                                                                                                      | NG125 recommendation 1.4.9: cellulitis treatment selection.                                                                                                  |
| `severity-question`                                                                                                                                   | Historical WSES 2020 definitional variation, not current treatment guidance.                                                                                 |
| `mri-role`, `mri-certainty-question`                                                                                                                  | Cochrane review population, non-ionising modality and methodological limitations.                                                                            |
| `abscess-follow-up-question`                                                                                                                          | Current WSES abstract's broad neoplasm follow-up statement; detailed pathway deferred.                                                                       |
| `education-notice`, `operative-disclaimer`, `special-populations-todo`, `evidence-status`, `evidence-scope`, `evidence-limitations`, `local-pathways` | Editorial notices checked for accurate scope and unresolved limitations; no clinical review or invented protocol claimed.                                    |

## Sources and metadata added

The original 19 sources remain; two appropriate sources were added (21 total).
Full existing URLs are retained in `references.ts` and the Task 03 report.

- [WSES 2025 edition](https://doi.org/10.1001/jamasurg.2025.6218): authors Mauro Podda, Marco Ceresoli, Belinda De Simone; publication **JAMA Surgery**. The notes explicitly identify these as the first three authors, not a complete list. Publication year remains 2026; abstract-only limitation remains.
- [APPAC ten-year follow-up](https://jamanetwork.com/journals/jama/fullarticle/2844116): authors Paulina Salminen, Roosa Salminen, Johanna Kallio; publication **JAMA**. First-three-author scope explicitly labelled.
- [Cochrane MRI review](https://www.cochrane.org/evidence/CD012028_magnetic-resonance-imaging-mri-diagnosis-acute-appendicitis): D’Souza N, Hicks G, Beable R, Higginson A, Rud B; publication **Cochrane Database of Systematic Reviews**. Initials retained as published.
- New [Source control in emergency general surgery: WSES, GAIS, SIS-E, SIS-A guidelines](https://doi.org/10.1186/s13017-023-00509-4): first three authors Federico Coccolini, Massimo Sartelli, Robert Sawyer; **World Journal of Emergency Surgery**, 2023, published 21 July. Full-text diffuse-peritonitis/source-control/resuscitation passages checked. International surgical guidance supplements UK sepsis guidance for the exact surgical claim.
- New [NICE NG15](https://www.nice.org.uk/guidance/ng15/chapter/recommendations): NICE; **Antimicrobial stewardship: systems and processes for effective antimicrobial medicine use**, 2015. Recommendations 1.1.24, 1.1.27, 1.1.35–36 support the general prescribing scope. No appendicitis regimen inferred.

New records include stable IDs, titles, short titles, verified HTTPS URLs, source
types, scope notes and access date 28 September 2026. No invented author,
recommendation, numerical estimate or review status was added.

## Removed or deliberately narrowed claims

- The original general menstrual/vaginal/flank and previous-episode history bundle and the table's detailed symptom discriminators were not all supported by the linked passages. They were narrowed, rather than supplemented with guessed sources. Pregnancy testing and gynaecological differentials remain.
- Generalised tenderness/rigidity wording was removed from the local-examination source block.
- General adult mass/abscess management was removed from the paediatric example.
- General ileus decompression/hydration management and unsourced symptom-to-complication inferences were removed. The leaflet does mention some drainage/transfusion/reoperation possibilities, but those were also omitted from this table to keep it clearly patient-information context, rather than a technical response algorithm. Their removal does not mean those interventions lack evidence.
- MRI pathway/team instructions and a general deterioration instruction attached only to SSI guidance were removed from those source scopes.
- No neoplasm age threshold/test schedule, fixed postoperative antibiotic duration, drug regimen or new statistics were introduced.

## Files

Changed: the four clinical section modules and `references.ts` under
`src/content/topics/acute-appendicitis/`; its `acute-appendicitis.test.tsx`;
`src/components/references/reference-list.tsx`;
`src/components/topic/topic-depth.tsx`; `tests/e2e/appendicitis.spec.ts`;
`DEVELOPMENT.md`; `.prettierignore` (exclude user-authored Task 03/03A/04 specs,
following the existing task-document exclusions).
Added: this report. No changes to schemas or the historical Task 03 report.

## Validation and visual inspection

Validated on 28 September 2026:

| Command                                                                                                                                                                                      | Result                                                                                                                                                       |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `npm run lint`                                                                                                                                                                               | Passed twice; zero warnings.                                                                                                                                 |
| `npm run typecheck`                                                                                                                                                                          | Passed twice; generated route types and strict TypeScript.                                                                                                   |
| `npm test`                                                                                                                                                                                   | Passed twice: 23 tests across 9 files. Final run 11.66 seconds.                                                                                              |
| `npm run build`                                                                                                                                                                              | Passed twice; all 10 static pages generated, including the validated clinical topic.                                                                         |
| `npm run test:e2e`                                                                                                                                                                           | Initial launch stopped because port 3000 was occupied; no test assertion failed.                                                                             |
| `npm run test:e2e -- --config test-results/playwright-task03a.config.ts`                                                                                                                     | Passed twice: all 8 desktop/mobile tests. Final run 21.4 seconds. Same suite/production app on free port 3001; zero browser errors and no 320px overflow.    |
| `npx prettier --write src/content/topics/acute-appendicitis src/components/references/reference-list.tsx src/components/topic/topic-depth.tsx tests/e2e/appendicitis.spec.ts DEVELOPMENT.md` | Passed; scoped formatting.                                                                                                                                   |
| `npx prettier --write TASK_03A_REPORT.md`                                                                                                                                                    | Passed; report formatting.                                                                                                                                   |
| `npm run format:check`                                                                                                                                                                       | Final check passed. Initial check flagged the user-authored Task 04 specification; excluded it consistently with the other task specs, without modifying it. |
| `git diff --check`                                                                                                                                                                           | Passed during implementation and at completion.                                                                                                              |

A local Python helper initially failed because `python` was not on PATH; no edits
ran from that attempt. The bundled Python executable was then used successfully.
A Windows `rg` glob was corrected to `rg -g`; it did not affect validation.
Read-only process inspection required elevated access. No process was stopped.

Inspected screenshot files under the ignored
`test-results/task03a-results/appendicitis-appendicitis--e28a9-epth-navigation-and-sources-{desktop,mobile}-chromium/`:

- Desktop `appendicitis-history.png`, `appendicitis-source.png`, `appendicitis-status.png`.
- Mobile `appendicitis-history.png`, `appendicitis-management.png`, `appendicitis-source.png`, `appendicitis-320-complications.png`, `appendicitis-320-top.png`.

History citations are separated, the management example is visibly paediatric,
the 320px table and source badges wrap without clipping, and the draft banner is
visible. Initial source inspection caught an encoding error in the publication
separator; this was corrected, covered by a rendering assertion, rebuilt,
retested and visually re-inspected on desktop/mobile. The final separator is a
single middle dot. Final source/table screenshots were re-inspected after the
second Playwright run.

The report inventories all 80 resulting blocks (78 original plus the history
split and editorial TODO). Regression tests check source relationships, explicit
scope and metadata; they do not certify clinical truth.

## Remaining named-clinician review TODOs

- Review every retained clinical statement and its linked passage before publication, especially history/differential completeness after the deliberate narrowing.
- Verify full current WSES recommendations: adult mass/abscess selection, non-operative eligibility, neoplasm follow-up, pregnancy and immunocompromised pathways.
- Review technical complication recognition/treatment, operative descriptions, anaesthetic risks and discharge readiness with appropriate surgical/anaesthetic expertise.
- Confirm local antimicrobial, imaging, fluid and VTE policies within the relevant age/pregnancy scope.
- Agree the named author/reviewer, sign-off date and publication process. Source verification and passing software tests must never set clinical-review status.

## Deviations

No product-scope deviations. Playwright's default port was occupied by the user's
existing Dissect development server. The same suite and production build were
run using an ignored temporary configuration on port 3001, leaving that server
untouched. No persistent Playwright configuration or test requirements changed.
