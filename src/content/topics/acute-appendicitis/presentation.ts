import type { TopicSection } from '@/schemas/topic';

export const presentationSections = [
  {
    id: 'overview',
    title: 'Overview',
    blocks: [
      {
        id: 'definition',
        type: 'definition',
        minimumLevel: 'medical-student',
        term: 'Acute appendicitis',
        meaning:
          'Inflammation of the vermiform appendix, requiring prompt hospital assessment because perforation can lead to peritonitis or sepsis.',
        referenceIds: ['nhs-appendicitis'],
      },
      {
        id: 'at-a-glance',
        type: 'table',
        minimumLevel: 'medical-student',
        caption: 'At a glance',
        columns: ['Question', 'Quick answer'],
        rows: [
          [
            'Typical pattern?',
            'Central abdominal pain moving to the right lower abdomen; the pattern is not universal.',
          ],
          ['Why urgent?', 'Perforation and systemic illness can develop.'],
          [
            'How assessed?',
            'History, examination and selected blood, urine and imaging tests.',
          ],
          [
            'Broad treatment?',
            'Appendicectomy is usual; antibiotics alone are an option for some patients.',
          ],
        ],
        referenceIds: ['nhs-appendicitis'],
      },
      {
        id: 'education-notice',
        type: 'sourceNote',
        minimumLevel: 'medical-student',
        text: 'Educational reference for learners, not patient-specific medical advice. This draft needs named clinician review before publication.',
        referenceIds: [],
      },
    ],
  },
  {
    id: 'presentation',
    title: 'Presentation',
    blocks: [
      {
        id: 'symptom-pattern',
        type: 'keyPoints',
        minimumLevel: 'medical-student',
        items: [
          'Ask about onset, progression and migration of pain; movement or coughing may worsen it.',
          'Associated features include appetite loss, nausea or vomiting, fever and altered bowel habit.',
          'Children, older adults and pregnant people may have less typical pain. A missing classic pattern does not settle the diagnosis.',
        ],
        referenceIds: ['nhs-appendicitis'],
      },
      {
        id: 'relevant-history',
        type: 'keyPoints',
        minimumLevel: 'medical-student',
        items: [
          'Explore urinary symptoms, flank pain, menstrual/pregnancy history and vaginal symptoms where relevant; these help identify mimics.',
          'Clarify previous episodes, bowel symptoms, comorbidities, medications and allergies as part of assessment.',
        ],
        referenceIds: ['appendicitis-textbook', 'nhs-anaesthesia'],
      },
    ],
  },
  {
    id: 'assessment',
    title: 'Assessment',
    blocks: [
      {
        id: 'examination',
        type: 'prose',
        minimumLevel: 'medical-student',
        paragraphs: [
          'Assess the whole patient and abdomen. Right iliac fossa tenderness, guarding or rebound suggest local peritoneal irritation; widespread tenderness or rigidity raises concern for generalised peritonitis. Individual named signs do not independently establish appendicitis.',
        ],
        referenceIds: ['appendicitis-textbook'],
      },
      {
        id: 'deterioration',
        type: 'warning',
        minimumLevel: 'foundation',
        title: 'Recognise physiological deterioration',
        text: 'New confusion, circulatory compromise, increasing respiratory rate or reduced urine output warrant urgent reassessment and escalation for possible sepsis. In applicable adults, use NEWS2 alongside clinical concern; a score must not override concern.',
        referenceIds: ['nice-sepsis'],
      },
      {
        id: 'patient-factors',
        type: 'prose',
        minimumLevel: 'foundation',
        paragraphs: [
          'Review frailty, comorbidity and individual perioperative risk with the surgical and anaesthetic teams. These influence preparation and postoperative care.',
        ],
        referenceIds: ['nice-perioperative'],
      },
      {
        id: 'fluid-assessment',
        type: 'prose',
        minimumLevel: 'foundation',
        paragraphs: [
          'Assess hydration, circulation, intake/losses and fluid balance. If IV fluids are needed, prescribe for the assessed problem and reassess clinical response and renal/electrolyte results; avoid an automatic fluid regimen.',
        ],
        referenceIds: ['nice-fluids'],
      },
    ],
  },
  {
    id: 'differential-diagnoses',
    title: 'Differential diagnoses',
    blocks: [
      {
        id: 'differential-table',
        type: 'table',
        minimumLevel: 'medical-student',
        caption: 'Reconsider the diagnosis when the pattern does not fit',
        columns: ['Group / examples', 'Useful clues to explore'],
        rows: [
          [
            'GI: gastroenteritis, terminal ileitis/Crohn disease',
            'Diarrhoea or a recurrent bowel history; neither alone excludes appendicitis.',
          ],
          [
            'Urinary: UTI, ureteric stone',
            'Dysuria, frequency or flank-to-groin pain.',
          ],
          [
            'Gynaecological: ectopic pregnancy, pelvic inflammatory disease, ovarian pathology',
            'Pregnancy possibility, bleeding, discharge or pelvic symptoms.',
          ],
          [
            'Other: mesenteric adenitis, testicular torsion',
            'Age, preceding illness or scrotal symptoms; examine the relevant system.',
          ],
        ],
        referenceIds: ['appendicitis-textbook'],
      },
    ],
  },
  {
    id: 'investigations',
    title: 'Investigations',
    blocks: [
      {
        id: 'inflammatory-markers',
        type: 'prose',
        minimumLevel: 'medical-student',
        paragraphs: [
          'FBC and CRP can support the assessment of inflammation; interpret them with symptoms, examination and imaging rather than as standalone diagnostic tests.',
        ],
        referenceIds: ['appendicitis-textbook'],
      },
      {
        id: 'urine-pregnancy',
        type: 'keyPoints',
        minimumLevel: 'medical-student',
        items: [
          'Urine testing helps assess alternative causes. Include pregnancy testing when pregnancy is possible.',
          'Select further tests according to the presentation; no single investigation always confirms appendicitis.',
        ],
        referenceIds: ['nhs-appendicitis'],
      },
      {
        id: 'renal-tests',
        type: 'prose',
        minimumLevel: 'foundation',
        paragraphs: [
          'U&Es and creatinine inform fluid/electrolyte assessment and ongoing IV-fluid monitoring. Relate abnormalities to hydration, losses and renal function rather than ordering a universal panel.',
        ],
        referenceIds: ['nice-fluids'],
      },
      {
        id: 'sepsis-tests',
        type: 'prose',
        minimumLevel: 'foundation',
        paragraphs: [
          'When sepsis is suspected, follow the appropriate local pathway for further assessment and investigations. Use age- and pregnancy-appropriate pathways; adult NEWS2 guidance is not a universal rule for every patient.',
        ],
        localPolicyMayVary: true,
        referenceIds: ['nice-sepsis'],
      },
    ],
  },
] satisfies TopicSection[];
