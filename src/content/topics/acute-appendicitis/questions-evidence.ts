import type { TopicSection } from '@/schemas/topic';

export const questionsEvidenceSections = [
  {
    id: 'hot-seat',
    title: 'Hot Seat',
    summary:
      'A static question bank. Answers deepen with training level; reveal advanced content to read every question.',
    blocks: [
      {
        id: 'pain-migration',
        type: 'question',
        minimumLevel: 'medical-student',
        question:
          'Why can pain move from the centre to the right lower abdomen?',
        answer:
          'Early visceral pain can give way to localised pain as adjacent parietal peritoneum becomes irritated.',
        referenceIds: ['appendix-anatomy'],
      },
      {
        id: 'appendix-base',
        type: 'question',
        minimumLevel: 'medical-student',
        question: 'Which landmark helps find the appendiceal base?',
        answer: 'Follow the caecal taeniae to their convergence.',
        referenceIds: ['appendix-anatomy'],
      },
      {
        id: 'mri-role',
        type: 'question',
        minimumLevel: 'medical-student',
        question: 'Why might MRI help in suspected appendicitis?',
        answer:
          'It avoids ionising radiation; evidence includes pregnant patients and children, although study quality limits certainty.',
        referenceIds: ['cochrane-mri'],
      },
      {
        id: 'severity-question',
        type: 'question',
        minimumLevel: 'medical-student',
        question: 'What findings make appendicitis complicated?',
        answer:
          'Perforation, abscess or purulent peritonitis; other classification details vary. Describe the actual findings.',
        referenceIds: ['wses-2020-terminology'],
      },
      {
        id: 'consent-question',
        type: 'question',
        minimumLevel: 'medical-student',
        question: 'Is a consent form the whole consent process?',
        answer:
          'No. Support understanding of options and material risks, invite questions and document the discussion.',
        referenceIds: ['rcs-consent'],
      },
      {
        id: 'fluid-question',
        type: 'question',
        minimumLevel: 'foundation',
        question: 'What should accompany an IV-fluid prescription?',
        answer:
          'An assessed indication and reassessment of clinical response, fluid balance, renal function and electrolytes.',
        referenceIds: ['nice-fluids'],
      },
      {
        id: 'analgesia-question',
        type: 'question',
        minimumLevel: 'foundation',
        question: 'How should perioperative analgesia be chosen?',
        answer:
          'Individualise it to the patient, procedure, comorbidities, renal function, medicines and preferences.',
        referenceIds: ['nice-perioperative'],
      },
      {
        id: 'deterioration-question',
        type: 'question',
        minimumLevel: 'foundation',
        question: 'What should new confusion or oliguria prompt?',
        answer:
          'Urgent reassessment and escalation for physiological deterioration, including possible sepsis; use the applicable population pathway.',
        referenceIds: ['nice-sepsis'],
      },
      {
        id: 'antibiotic-question',
        type: 'question',
        minimumLevel: 'foundation',
        question: 'Where should antibiotic choice come from?',
        answer:
          'The local antimicrobial formulary/pathway, accounting for allergy and microbiology; this topic supplies no universal regimen.',
        referenceIds: ['nice-antimicrobial-stewardship'],
      },
      {
        id: 'discharge-question',
        type: 'question',
        minimumLevel: 'foundation',
        question:
          'What safety-net information should be discussed before discharge?',
        answer:
          'Worsening pain, fever, wound changes or persistent vomiting warrant advice/reassessment; explain whom to contact and how.',
        referenceIds: ['gstt-recovery'],
      },
      {
        id: 'artery-question',
        type: 'question',
        minimumLevel: 'cst',
        question: 'Why identify the mesoappendix before dividing it?',
        answer:
          'It contains the appendicular vascular supply; deliberate identification and control matter.',
        referenceIds: ['appendix-anatomy', 'appendectomy-textbook'],
      },
      {
        id: 'port-question',
        type: 'question',
        minimumLevel: 'cst',
        question:
          'Why are fixed port coordinates inappropriate as a universal rule?',
        answer:
          'Access and working geometry depend on the patient, exposure and operative findings.',
        referenceIds: ['appendectomy-textbook'],
      },
      {
        id: 'base-question',
        type: 'question',
        minimumLevel: 'cst',
        question: 'What should be established before dividing the base?',
        answer:
          'Identify the appendix–caecum junction and adjacent bowel, then choose secure control appropriate to the findings.',
        referenceIds: ['appendix-anatomy', 'appendectomy-textbook'],
      },
      {
        id: 'help-question',
        type: 'question',
        minimumLevel: 'cst',
        question: 'When should you seek senior operative help?',
        answer:
          'When complexity or uncertainty exceeds your competence; involve an experienced colleague before proceeding beyond safe capability.',
        referenceIds: ['rcs-gsp'],
      },
      {
        id: 'wound-question',
        type: 'question',
        minimumLevel: 'cst',
        question:
          'What guides antibiotic selection for suspected wound cellulitis?',
        answer:
          'Likely organisms, microbiological results and local resistance patterns.',
        referenceIds: ['nice-ssi'],
      },
      {
        id: 'material-risk-question',
        type: 'question',
        minimumLevel: 'cst',
        question: 'What makes a risk material in consent?',
        answer:
          'Its significance to this individual patient, discussed alongside options and their priorities; a standard list is insufficient.',
        referenceIds: ['rcs-consent'],
      },
      {
        id: 'antibiotics-evidence-question',
        type: 'question',
        minimumLevel: 'registrar',
        question: 'Why not generalise APPAC to every patient?',
        answer:
          'It studied selected adults with CT-confirmed uncomplicated disease; recurrence and later surgery remain relevant, and other populations need separate evidence.',
        referenceIds: ['appac-follow-up'],
      },
      {
        id: 'abscess-follow-up-question',
        type: 'question',
        minimumLevel: 'registrar',
        question: 'Why plan follow-up after non-operative abscess treatment?',
        answer:
          'The current WSES guideline highlights detection of underlying neoplasm. Confirm the detailed pathway with the senior team.',
        referenceIds: ['wses-2025'],
      },
      {
        id: 'mri-certainty-question',
        type: 'question',
        minimumLevel: 'registrar',
        question:
          'Does a high reported MRI accuracy remove diagnostic uncertainty?',
        answer:
          'No. Cochrane identified methodological limitations and potential bias; interpret imaging within the clinical assessment.',
        referenceIds: ['cochrane-mri'],
      },
      {
        id: 'unexpected-question',
        type: 'question',
        minimumLevel: 'registrar',
        question: 'How should unexpected operative findings change the plan?',
        answer:
          'Seek appropriate expertise, make decisions within competence and record the findings and revised strategy.',
        referenceIds: ['rcs-gsp'],
      },
    ],
  },
  {
    id: 'evidence-and-references',
    title: 'Evidence and references',
    showReferences: true,
    blocks: [
      {
        id: 'evidence-status',
        type: 'sourceNote',
        minimumLevel: 'medical-student',
        text: 'Draft educational content — awaiting clinical review. No clinician has signed off this topic. Source verification is not clinical review.',
        referenceIds: [],
      },
      {
        id: 'evidence-scope',
        type: 'sourceNote',
        minimumLevel: 'medical-student',
        text: 'UK NICE and RCS sources support applicable perioperative and professional principles; no NICE appendicitis guideline is claimed. NHS trust leaflets provide labelled patient-information context. Textbooks supply descriptive anatomy and clinical/operative features, not current management recommendations.',
        referenceIds: [],
      },
      {
        id: 'evidence-limitations',
        type: 'sourceNote',
        minimumLevel: 'medical-student',
        text: 'The latest verified WSES edition is titled 2025 and was published in 2026. Its accessible abstract supports this draft’s broad framework; full recommendation tables need clinician verification. The superseded 2020 edition is retained only for severity terminology. Non-operative eligibility, abscess follow-up and special-population pathways need particular scrutiny.',
        referenceIds: [],
      },
      {
        id: 'local-pathways',
        type: 'sourceNote',
        minimumLevel: 'medical-student',
        text: 'Antimicrobial choices, doses and some imaging and perioperative pathways depend on local policy. No local protocol is represented as a national recommendation. Risk percentages, imaging performance estimates, fixed discharge timings and a universal interval-appendicectomy rule are deliberately absent.',
        referenceIds: [],
      },
    ],
  },
] satisfies TopicSection[];
