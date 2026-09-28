import type { TopicSection } from '@/schemas/topic';

export const operativeCareSections = [
  {
    id: 'surgical-anatomy',
    title: 'Surgical anatomy',
    summary:
      'Descriptive textbook anatomy; management recommendations use separate sources.',
    blocks: [
      {
        id: 'appendix-origin',
        type: 'keyPoints',
        minimumLevel: 'medical-student',
        items: [
          'The appendix arises from the posteromedial caecum near the ileocaecal junction. The caecum is the beginning of the large bowel; the terminal ileum joins it nearby.',
          'Following the caecal taeniae to their convergence helps locate the appendiceal base. The tip can lie retrocaecally, in the pelvis or near the ileum.',
        ],
        referenceIds: ['appendix-anatomy'],
      },
      {
        id: 'mesoappendix',
        type: 'prose',
        minimumLevel: 'cst',
        paragraphs: [
          'The mesoappendix carries the appendicular arterial supply. Its relationship to the terminal ileum and caecum matters during dissection; identify the base and adjacent bowel before division.',
        ],
        referenceIds: ['appendix-anatomy', 'appendectomy-textbook'],
      },
      {
        id: 'structures-at-risk',
        type: 'prose',
        minimumLevel: 'cst',
        paragraphs: [
          'Adjacent bowel, bladder and vessels can be injured during surgery. Relate the variable appendix position and exposure to the structures actually in view.',
        ],
        referenceIds: [
          'leicester-appendicectomy',
          'appendix-anatomy',
          'appendectomy-textbook',
        ],
      },
    ],
  },
  {
    id: 'laparoscopic-appendicectomy',
    title: 'Laparoscopic appendicectomy',
    blocks: [
      {
        id: 'operative-disclaimer',
        type: 'sourceNote',
        minimumLevel: 'medical-student',
        text: 'Operative learning only: this outline supports understanding and discussion with a supervisor. It does not replace supervised surgical training or a patient-specific operative plan.',
        referenceIds: [],
      },
      {
        id: 'operation-outline',
        type: 'prose',
        minimumLevel: 'medical-student',
        paragraphs: [
          'Under general anaesthesia, laparoscopic access allows exploration and removal of the appendix. The broad sequence is identification, mesoappendix and base control, retrieval, inspection and closure.',
        ],
        referenceIds: ['appendectomy-textbook'],
      },
      {
        id: 'operative-preparation',
        type: 'prose',
        minimumLevel: 'foundation',
        paragraphs: [
          'Confirm the agreed procedure and perioperative plan during the safety checklist. Assess VTE and bleeding risk and agree appropriate prophylaxis; reassess if the clinical situation changes.',
        ],
        localPolicyMayVary: true,
        referenceIds: ['nice-perioperative', 'nice-vte'],
      },
      {
        id: 'operative-sequence',
        type: 'checklist',
        minimumLevel: 'cst',
        title: 'Understand the operative sequence',
        items: [
          'Position supine, adjusting tilt for exposure. Plan access and working ports for the patient and anticipated anatomy; there are no universal coordinates.',
          'Explore systematically. Identify caecum, terminal ileum and appendix before dividing tissue.',
          'Expose and control the mesoappendix and its vessels; secure and divide the appendiceal base with an appropriate technique.',
          'Retrieve the specimen in a bag; assess contamination and inspect the operative field.',
          'Check haemostasis and the secured base. Inspect access sites and close the relevant abdominal-wall layers.',
        ],
        referenceIds: ['appendectomy-textbook'],
      },
      {
        id: 'operative-judgement',
        type: 'prose',
        minimumLevel: 'cst',
        paragraphs: [
          'Poor visualisation or difficult anatomy may require a changed approach, including conversion. Device choice and strategy depend on findings and expertise; uncertainty is a reason to seek senior help.',
        ],
        referenceIds: ['appendectomy-textbook', 'rcs-gsp'],
      },
      {
        id: 'unexpected-findings',
        type: 'prose',
        minimumLevel: 'registrar',
        paragraphs: [
          'With unexpected findings or complexity beyond your competence, involve an appropriately experienced colleague. Make the revised plan explicit and document the findings and decisions.',
        ],
        referenceIds: ['rcs-gsp'],
      },
    ],
  },
  {
    id: 'postoperative-care',
    title: 'Postoperative care',
    blocks: [
      {
        id: 'recovery-basics',
        type: 'keyPoints',
        minimumLevel: 'medical-student',
        items: [
          'Review progress, pain and the wound; support return to drinking, eating and activity as recovery allows.',
          'Give clear instructions for symptoms requiring help and how to access it. Persistent vomiting, increasing wound pain/redness or fever need reassessment.',
        ],
        referenceIds: ['gstt-recovery', 'nhs-appendicitis'],
      },
      {
        id: 'postoperative-review',
        type: 'checklist',
        minimumLevel: 'foundation',
        title: 'Foundation review',
        items: [
          'Review observations, symptoms and the operative findings; escalate deterioration promptly.',
          'Individualise analgesia and review fluid/intake needs.',
          'Encourage mobilisation when appropriate and reassess VTE/bleeding risk.',
        ],
        referenceIds: [
          'rcs-gsp',
          'nice-sepsis',
          'nice-perioperative',
          'nice-fluids',
          'nice-vte',
        ],
      },
      {
        id: 'postoperative-antibiotics',
        type: 'prose',
        minimumLevel: 'foundation',
        paragraphs: [
          'Distinguish prophylaxis from treatment. The postoperative antibiotic plan depends on uncomplicated versus complicated disease and the operative findings. Current WSES guidance favours short treatment courses for complicated disease; verify the detailed recommendation and local policy rather than applying one course to everyone.',
        ],
        localPolicyMayVary: true,
        referenceIds: ['wses-2025', 'nice-ssi'],
      },
      {
        id: 'discharge-plan',
        type: 'prose',
        minimumLevel: 'foundation',
        paragraphs: [
          'Judge readiness from recovery, oral intake, pain control and the agreed home-care plan rather than a fixed discharge time. Explain wound care, activity advice and who to contact if recovery worsens.',
        ],
        referenceIds: [
          'gstt-recovery',
          'nhs-appendicitis',
          'nice-perioperative',
        ],
      },
      {
        id: 'histology-follow-up',
        type: 'prose',
        minimumLevel: 'foundation',
        paragraphs: [
          'Ensure responsibility for reviewing and communicating histology is clear. Unexpected pathology can require further assessment; explain any follow-up plan to the patient.',
        ],
        referenceIds: ['leicester-appendicectomy', 'rcs-gsp'],
      },
    ],
  },
  {
    id: 'complications',
    title: 'Complications',
    blocks: [
      {
        id: 'complications-table',
        type: 'table',
        minimumLevel: 'medical-student',
        caption:
          'Complications described in patient information — not a treatment protocol',
        columns: ['Complication', 'Patient-information context'],
        rows: [
          ['Wound infection', 'Redness, pus or fever may occur.'],
          [
            'Collection',
            'An infected collection can develop inside the abdomen after surgery.',
          ],
          [
            'Bleeding',
            'Bleeding can occur at the wound or inside the abdomen.',
          ],
          ['Ileus', 'Bowel function can be slow to recover after surgery.'],
          [
            'Bowel injury',
            'Injury may be recognised during surgery or afterwards.',
          ],
        ],
        referenceIds: ['leicester-appendicectomy'],
      },
      {
        id: 'stump-problem',
        type: 'prose',
        minimumLevel: 'medical-student',
        paragraphs: [
          'Residual appendiceal tissue can become inflamed after appendicectomy. Recurrent compatible pain still needs assessment; previous surgery does not eliminate every appendix-related cause.',
        ],
        referenceIds: ['nhs-appendicitis'],
      },
      {
        id: 'vte-complication',
        type: 'prose',
        minimumLevel: 'medical-student',
        paragraphs: [
          'New calf pain or breathlessness needs prompt assessment for possible VTE. Prevention requires individual VTE/bleeding assessment, appropriate prophylaxis and mobilisation.',
        ],
        referenceIds: ['gstt-recovery', 'nice-vte'],
      },
      {
        id: 'anaesthetic-complications',
        type: 'prose',
        minimumLevel: 'medical-student',
        paragraphs: [
          'Nausea and sore throat can follow general anaesthesia; breathing difficulty or persistent confusion needs assessment rather than reassurance alone. Recovery staff monitor for complications and provide treatment. Individual perioperative risk determines monitoring needs.',
        ],
        referenceIds: ['nhs-anaesthesia', 'nice-perioperative'],
      },
      {
        id: 'complication-response',
        type: 'prose',
        minimumLevel: 'cst',
        paragraphs: [
          'For suspected wound cellulitis, select treatment for likely organisms using microbiology and local resistance information.',
        ],
        localPolicyMayVary: true,
        referenceIds: ['nice-ssi'],
      },
      {
        id: 'complication-management-todo',
        type: 'sourceNote',
        minimumLevel: 'cst',
        text: 'Clinical-review TODO: verify technical assessment and treatment pathways for postoperative collections, bleeding, ileus and bowel injury. The patient-information table is not a management algorithm.',
        referenceIds: [],
      },
    ],
  },
  {
    id: 'consent',
    title: 'Consent',
    blocks: [
      {
        id: 'supported-decision',
        type: 'checklist',
        minimumLevel: 'medical-student',
        title: 'Support an individual decision',
        items: [
          'Explain why intervention is proposed and what the expected operation involves.',
          'Discuss reasonable alternatives, including non-operative treatment when applicable and what no treatment could mean.',
          'Explore what matters to this patient; discuss material risks in that context.',
          'Allow questions, check understanding and document the discussion. A signed form does not replace this conversation.',
        ],
        referenceIds: ['rcs-consent'],
      },
      {
        id: 'procedure-specific-discussion',
        type: 'prose',
        minimumLevel: 'cst',
        paragraphs: [
          'Discuss anaesthetic considerations, bleeding, infection, collection, injury to adjacent structures and possible further intervention in relation to this patient. Explain that findings may change the approach; do not promise an uncomplicated laparoscopic course.',
        ],
        referenceIds: ['leicester-appendicectomy', 'rcs-consent'],
      },
      {
        id: 'consent-depth',
        type: 'prose',
        minimumLevel: 'cst',
        paragraphs: [
          'Clarify the scope of consent, including foreseeable changes in strategy, and the patient’s preferences. Support communication and decision-making capacity; involve appropriate expertise when consent is uncertain. Do not replace this with a fixed risk checklist.',
        ],
        referenceIds: ['rcs-consent'],
      },
    ],
  },
] satisfies TopicSection[];
