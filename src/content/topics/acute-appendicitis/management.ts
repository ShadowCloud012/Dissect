import type { TopicSection } from '@/schemas/topic';

export const managementSections = [
  {
    id: 'imaging',
    title: 'Imaging',
    blocks: [
      {
        id: 'imaging-choice',
        type: 'prose',
        minimumLevel: 'medical-student',
        paragraphs: [
          'Imaging helps resolve diagnostic uncertainty alongside clinical assessment. Risk-stratification tools can support decisions, but are not a replacement for judgement or a mandatory UK scoring rule.',
        ],
        localPolicyMayVary: true,
        referenceIds: ['wses-2025'],
      },
      {
        id: 'ultrasound',
        type: 'definition',
        minimumLevel: 'medical-student',
        term: 'Ultrasound',
        meaning:
          'Useful in children; it may help establish the diagnosis when clinical assessment is uncertain. A paediatric team determines the next step if uncertainty remains.',
        referenceIds: ['cuh-children'],
      },
      {
        id: 'ct-findings',
        type: 'prose',
        minimumLevel: 'foundation',
        paragraphs: [
          'CT can show appendiceal enlargement, wall thickening and surrounding fat inflammation. Interpret the whole study and clinical picture, not an isolated feature. It uses ionising radiation.',
        ],
        referenceIds: ['appendicitis-textbook'],
      },
      {
        id: 'mri',
        type: 'prose',
        minimumLevel: 'medical-student',
        paragraphs: [
          'MRI avoids ionising radiation and can help assess suspected appendicitis, including in pregnancy and children. Many patients in the Cochrane review had an inconclusive ultrasound first. Reported accuracy was promising, but study quality limits certainty. Modality choice needs radiology input and an appropriate local pathway.',
        ],
        localPolicyMayVary: true,
        referenceIds: ['cochrane-mri'],
      },
    ],
  },
  {
    id: 'diagnosis-and-severity',
    title: 'Diagnosis and severity',
    blocks: [
      {
        id: 'diagnostic-synthesis',
        type: 'prose',
        minimumLevel: 'medical-student',
        paragraphs: [
          'Combine clinical assessment, laboratory findings and imaging. WSES supports risk stratification and imaging to improve accuracy; diagnostic uncertainty still needs a clinical plan.',
        ],
        referenceIds: ['wses-2025'],
      },
      {
        id: 'severity',
        type: 'table',
        minimumLevel: 'medical-student',
        caption: 'Describe the findings, not just a label',
        columns: ['Term', 'Meaning / qualification'],
        rows: [
          [
            'Uncomplicated',
            'Inflammation without perforation, abscess or purulent peritonitis.',
          ],
          [
            'Complicated',
            'Perforation, abscess or purulent peritonitis; definitions differ over non-perforated gangrene and other findings.',
          ],
          [
            'Perforation',
            'A breach of the appendiceal wall; contamination may be localised or more widespread.',
          ],
        ],
        referenceIds: ['wses-2020-terminology'],
      },
      {
        id: 'mass-abscess',
        type: 'definition',
        minimumLevel: 'medical-student',
        term: 'Mass / phlegmon versus abscess',
        meaning:
          'An inflammatory mass involves adjacent tissues surrounding the appendix; an abscess is a collection of pus. They are not interchangeable descriptions.',
        referenceIds: ['cuh-children'],
      },
    ],
  },
  {
    id: 'management',
    title: 'Management',
    blocks: [
      {
        id: 'operative-pathway',
        type: 'prose',
        minimumLevel: 'medical-student',
        paragraphs: [
          'Laparoscopic appendicectomy remains a standard operative pathway. Antibiotics alone can be an option in selected uncomplicated disease; the choice requires an informed discussion rather than a universal treatment rule.',
        ],
        referenceIds: ['wses-2025'],
      },
      {
        id: 'initial-support',
        type: 'checklist',
        minimumLevel: 'foundation',
        title: 'Initial support and preparation',
        items: [
          'Arrange surgical assessment and senior help appropriate to urgency and your competence.',
          'Agree a perioperative plan with the surgical and anaesthetic teams; complete the surgical safety checklist.',
          'Provide individualised analgesia; consider renal function, comorbidity, allergies and current medicines.',
        ],
        referenceIds: ['rcs-gsp', 'nice-perioperative'],
      },
      {
        id: 'fluid-support',
        type: 'prose',
        minimumLevel: 'foundation',
        paragraphs: [
          'If oral intake is inadequate or resuscitation is needed, assess the indication for IV fluids and reassess response, losses and electrolytes.',
        ],
        localPolicyMayVary: true,
        referenceIds: ['nice-fluids'],
      },
      {
        id: 'antimicrobial-policy',
        type: 'prose',
        minimumLevel: 'foundation',
        paragraphs: [
          'Choose antimicrobial agents, doses and allergy alternatives through local policy. NICE supports local-formulary surgical prophylaxis and treatment in addition to prophylaxis for infected/dirty surgery; this is not an appendicitis-specific prescription.',
        ],
        localPolicyMayVary: true,
        referenceIds: ['nice-ssi'],
      },
      {
        id: 'nonoperative-discussion',
        type: 'prose',
        minimumLevel: 'registrar',
        paragraphs: [
          'Antibiotic treatment can avoid immediate surgery in selected uncomplicated cases, but later recurrence or appendicectomy remains possible. APPAC studied selected adults with CT-confirmed uncomplicated disease in Finland; do not extrapolate its results to every age, severity or setting. Discuss these trade-offs and the follow-up plan.',
        ],
        referenceIds: ['appac-follow-up'],
      },
      {
        id: 'peritonitis-plan',
        type: 'prose',
        minimumLevel: 'foundation',
        paragraphs: [
          'Generalised peritonitis or physiological deterioration requires urgent senior surgical assessment and resuscitation, with a plan to control the source of infection. Do not substitute an uncomplicated-disease antibiotic pathway for assessment of a deteriorating patient.',
        ],
        referenceIds: ['nice-sepsis'],
      },
      {
        id: 'abscess-options',
        type: 'prose',
        minimumLevel: 'registrar',
        paragraphs: [
          'For an appendiceal mass or abscess, treatment may involve antibiotics, drainage or surgery. Plan with the senior team; anatomy and the patient’s course matter. The CUH source illustrates a paediatric pathway, not a national adult protocol.',
        ],
        localPolicyMayVary: true,
        referenceIds: ['cuh-children'],
      },
    ],
  },
  {
    id: 'special-situations',
    title: 'Special situations',
    blocks: [
      {
        id: 'children',
        type: 'prose',
        minimumLevel: 'medical-student',
        paragraphs: [
          'Children need paediatric assessment and age-appropriate care. Ultrasound and observation may help when the diagnosis is unclear; paediatric protocols guide treatment.',
        ],
        referenceIds: ['cuh-children'],
      },
      {
        id: 'pregnancy',
        type: 'prose',
        minimumLevel: 'registrar',
        paragraphs: [
          'In pregnancy, MRI offers imaging without ionising radiation when further assessment is needed. Cochrane includes pregnant patients but highlights limitations in the evidence; it does not establish a universal imaging sequence. Agree the pathway with the relevant specialist teams.',
        ],
        localPolicyMayVary: true,
        referenceIds: ['cochrane-mri'],
      },
      {
        id: 'older-adults',
        type: 'prose',
        minimumLevel: 'registrar',
        paragraphs: [
          'In older adults, perioperative planning should account for frailty and comorbidity. After non-operative treatment of an appendiceal abscess, ensure follow-up is explicitly planned to address possible underlying neoplasm.',
        ],
        referenceIds: ['nice-perioperative', 'wses-2025'],
      },
      {
        id: 'special-populations-todo',
        type: 'sourceNote',
        minimumLevel: 'registrar',
        text: 'Clinical-review TODO: verify detailed pregnancy, immunocompromised-patient and adult mass/abscess pathways against the full current guideline. No drug regimens, interval-operation rule or age threshold is asserted here.',
        referenceIds: [],
      },
    ],
  },
] satisfies TopicSection[];
