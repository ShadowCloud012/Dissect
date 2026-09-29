import type { TopicExperience } from '@/schemas/topic-experience';

// Routing and presentation pointers only. Clinical wording lives in the audited blocks.
export const experience = {
  pages: [
    {
      slug: 'assessment',
      title: 'Assessment',
      shortTitle: 'Assess',
      quickJump: true,
      description: 'Presentation, examination and important alternatives.',
      group: 'Clinical',
      sectionIds: ['presentation', 'assessment', 'differential-diagnoses'],
      aliases: ['presentation', 'history', 'examination'],
      keywords: ['pain', 'deterioration', 'differentials'],
    },
    {
      slug: 'investigations',
      title: 'Investigations',
      shortTitle: 'Investigate',
      quickJump: true,
      description: 'Tests, imaging and the diagnosis in context.',
      group: 'Clinical',
      sectionIds: ['investigations', 'imaging', 'diagnosis-and-severity'],
      aliases: ['imaging', 'diagnosis'],
      keywords: ['bloods', 'urine', 'ultrasound', 'CT', 'MRI', 'severity'],
    },
    {
      slug: 'management',
      title: 'Management',
      shortTitle: 'Manage',
      quickJump: true,
      description: 'Initial care, treatment options and special situations.',
      group: 'Clinical',
      sectionIds: ['management', 'special-situations'],
      aliases: ['treatment'],
      keywords: ['antibiotics', 'source control', 'abscess'],
    },
    {
      slug: 'anatomy',
      title: 'Anatomy',
      quickJump: true,
      description: 'Structures, relationships and operative relevance.',
      group: 'Operative',
      sectionIds: ['surgical-anatomy'],
      aliases: ['surgical anatomy'],
      keywords: ['caecum', 'mesoappendix', 'taeniae'],
    },
    {
      slug: 'appendicectomy',
      title: 'Appendicectomy',
      shortTitle: 'Operate',
      quickJump: true,
      description: 'Preparation, sequence and operative judgement.',
      group: 'Operative',
      sectionIds: ['laparoscopic-appendicectomy'],
      aliases: ['laparoscopic appendicectomy', 'appendectomy'],
      keywords: ['positioning', 'ports', 'base', 'retrieval'],
    },
    {
      slug: 'post-op',
      title: 'Post-op',
      description: 'Review, recovery, discharge and follow-up.',
      group: 'Operative',
      sectionIds: ['postoperative-care'],
      aliases: ['postoperative care'],
      keywords: ['recovery', 'discharge', 'histology'],
    },
    {
      slug: 'complications',
      title: 'Complications',
      quickJump: true,
      description:
        'Patient-information context and supported response principles.',
      group: 'Operative',
      sectionIds: ['complications'],
      aliases: ['postoperative concerns'],
      keywords: ['infection', 'bleeding', 'ileus', 'VTE'],
    },
    {
      slug: 'consent',
      title: 'Consent',
      description: 'Support an individual decision, beyond a checklist.',
      group: 'Operative',
      sectionIds: ['consent'],
      aliases: ['supported decision-making'],
      keywords: ['alternatives', 'material risks', 'understanding'],
    },
    {
      slug: 'hot-seat',
      title: 'Hot Seat',
      description: 'Check your understanding of the case and the operation.',
      group: 'Revision',
      sectionIds: ['hot-seat'],
      aliases: ['revision', 'viva'],
      keywords: ['questions', 'active recall'],
    },
    {
      slug: 'evidence',
      title: 'Evidence',
      description: 'Sources, limitations and outstanding clinical review.',
      group: 'Revision',
      sectionIds: ['evidence-and-references'],
      aliases: ['references'],
      keywords: ['guidelines', 'local policy', 'review'],
    },
  ],
  quickReference: [
    // Overview = what; subpages = why, when and nuance. Extracts are
    // verbatim fragments of the named blocks (schema-validated).
    {
      label: 'Presentation',
      page: 'assessment',
      group: 'snapshot',
      rows: [
        {
          label: 'Typical',
          extracts: [
            {
              text: 'Central abdominal pain moving to the right lower abdomen',
              blockId: 'at-a-glance',
            },
            { text: 'the pattern is not universal', blockId: 'at-a-glance' },
          ],
        },
        {
          label: 'Ask about',
          extracts: [
            {
              text: 'onset, progression and migration of pain',
              blockId: 'symptom-pattern',
            },
            {
              text: 'movement or coughing may worsen it',
              blockId: 'symptom-pattern',
            },
          ],
        },
        {
          label: 'Associated',
          extracts: [
            {
              text: 'appetite loss, nausea or vomiting, fever and altered bowel habit',
              blockId: 'symptom-pattern',
            },
          ],
        },
        {
          label: 'Examination',
          extracts: [
            {
              text: 'Right iliac fossa tenderness, guarding or rebound suggest local peritoneal irritation',
              blockId: 'examination',
            },
          ],
        },
        {
          label: 'Atypical',
          extracts: [
            {
              text: 'Children, older adults and pregnant people may have less typical pain',
              blockId: 'symptom-pattern',
            },
          ],
        },
      ],
    },
    {
      label: 'Investigations',
      page: 'investigations',
      group: 'snapshot',
      rows: [
        {
          label: 'Bloods',
          extracts: [
            { text: 'FBC', blockId: 'inflammatory-markers' },
            { text: 'CRP', blockId: 'inflammatory-markers' },
            { text: 'U&Es and creatinine', blockId: 'renal-tests' },
          ],
        },
        {
          label: 'Urine',
          extracts: [
            { text: 'Urine testing', blockId: 'urine-pregnancy' },
            {
              text: 'pregnancy testing when pregnancy is possible',
              blockId: 'urine-pregnancy',
            },
          ],
        },
        {
          label: 'Imaging',
          extracts: [
            { text: 'Ultrasound', blockId: 'ultrasound' },
            { text: 'CT', blockId: 'ct-findings' },
            { text: 'MRI', blockId: 'mri' },
          ],
        },
        {
          label: 'Sepsis suspected',
          extracts: [
            {
              text: 'follow the appropriate local pathway for further assessment and investigations',
              blockId: 'sepsis-tests',
            },
          ],
        },
        {
          label: 'Remember',
          extracts: [
            {
              text: 'no single investigation always confirms appendicitis',
              blockId: 'urine-pregnancy',
            },
          ],
        },
      ],
    },
    {
      label: 'Management',
      page: 'management',
      group: 'snapshot',
      rows: [
        {
          label: 'First',
          extracts: [
            {
              text: 'Arrange surgical assessment and senior help appropriate to urgency and your competence',
              blockId: 'initial-support',
            },
          ],
        },
        {
          label: 'Support',
          extracts: [
            {
              text: 'Provide individualised analgesia',
              blockId: 'initial-support',
            },
            {
              text: 'assess the indication for IV fluids',
              blockId: 'fluid-support',
            },
          ],
        },
        {
          label: 'Options',
          extracts: [
            {
              text: 'Laparoscopic appendicectomy remains a standard operative pathway',
              blockId: 'operative-pathway',
            },
            {
              text: 'Antibiotics alone can be an option in selected uncomplicated disease',
              blockId: 'operative-pathway',
            },
          ],
        },
        {
          label: 'Decision',
          extracts: [
            {
              text: 'the choice requires an informed discussion rather than a universal treatment rule',
              blockId: 'operative-pathway',
            },
          ],
        },
      ],
    },
    {
      blockId: 'at-a-glance',
      label: 'Why it is urgent',
      page: 'assessment',
      group: 'do-not-miss',
      itemIndex: 1,
    },
    {
      blockId: 'deterioration',
      label: 'Do not miss deterioration',
      page: 'assessment',
      group: 'do-not-miss',
    },
    {
      label: 'Peritonitis',
      page: 'management',
      group: 'do-not-miss',
      rows: [
        {
          label: 'Escalate',
          extracts: [
            {
              text: 'Generalised peritonitis needs urgent surgical assessment for source control',
              blockId: 'peritonitis-plan',
            },
          ],
        },
      ],
    },
    {
      label: 'Preparation',
      page: 'appendicectomy',
      group: 'before-theatre',
      rows: [
        {
          label: 'Plan',
          extracts: [
            {
              text: 'Agree a perioperative plan with the surgical and anaesthetic teams',
              blockId: 'initial-support',
            },
            {
              text: 'complete the surgical safety checklist',
              blockId: 'initial-support',
            },
          ],
        },
        {
          label: 'Anaesthetic',
          extracts: [
            {
              text: 'establish medical conditions, current medicines and previous allergic reactions to medicines',
              blockId: 'anaesthetic-history',
            },
          ],
        },
        {
          label: 'Individual risk',
          extracts: [
            {
              text: 'Review frailty, comorbidity and individual perioperative risk',
              blockId: 'patient-factors',
            },
          ],
        },
        {
          label: 'VTE',
          extracts: [
            {
              text: 'Assess VTE and bleeding risk and agree appropriate prophylaxis',
              blockId: 'operative-preparation',
            },
          ],
        },
        {
          label: 'Antimicrobials',
          extracts: [
            {
              text: 'Choose antimicrobial agents, doses and allergy alternatives through local policy',
              blockId: 'antimicrobial-policy',
            },
          ],
        },
      ],
    },
    {
      label: 'Consent discussion',
      page: 'consent',
      group: 'before-theatre',
      rows: [
        {
          label: 'Why',
          extracts: [
            {
              text: 'Explain why intervention is proposed and what the expected operation involves',
              blockId: 'supported-decision',
            },
          ],
        },
        {
          label: 'Alternatives',
          extracts: [
            {
              text: 'Discuss reasonable alternatives, including non-operative treatment when applicable and what no treatment could mean',
              blockId: 'supported-decision',
            },
          ],
        },
        {
          label: 'Material risks',
          extracts: [
            {
              text: 'Explore what matters to this patient; discuss material risks in that context',
              blockId: 'supported-decision',
            },
          ],
        },
        {
          label: 'Risks to discuss',
          extracts: [
            {
              text: 'Discuss anaesthetic considerations, bleeding, infection, collection, injury to adjacent structures and possible further intervention in relation to this patient',
              blockId: 'procedure-specific-discussion',
            },
          ],
        },
        {
          label: 'May change',
          extracts: [
            {
              text: 'Explain that findings may change the approach',
              blockId: 'procedure-specific-discussion',
            },
          ],
        },
        {
          label: 'Understanding',
          extracts: [
            {
              text: 'Allow questions, check understanding and document the discussion',
              blockId: 'supported-decision',
            },
            {
              text: 'A signed form does not replace this conversation',
              blockId: 'supported-decision',
            },
          ],
        },
      ],
    },
    {
      blockId: 'preoperative-preparation-todo',
      label: 'Not yet covered',
      page: 'appendicectomy',
      group: 'before-theatre',
    },
    {
      label: 'Anatomy & landmarks',
      page: 'anatomy',
      group: 'theatre',
      rows: [
        {
          label: 'Origin',
          extracts: [
            {
              text: 'The appendix arises from the posteromedial caecum near the ileocaecal junction',
              blockId: 'appendix-origin',
            },
          ],
        },
        {
          label: 'Find the base',
          extracts: [
            {
              text: 'Following the caecal taeniae to their convergence helps locate the appendiceal base',
              blockId: 'appendix-origin',
            },
          ],
        },
        {
          label: 'Tip',
          extracts: [
            {
              text: 'The tip can lie retrocaecally, in the pelvis or near the ileum',
              blockId: 'appendix-origin',
            },
          ],
        },
        {
          label: 'Blood supply',
          extracts: [
            {
              text: 'The mesoappendix carries the appendicular arterial supply',
              blockId: 'mesoappendix',
            },
          ],
        },
      ],
    },
    {
      label: 'The operation',
      page: 'appendicectomy',
      group: 'theatre',
      numbered: true,
      rows: [
        {
          label: 'Position & access',
          extracts: [
            {
              text: 'Position supine, adjusting tilt for exposure',
              blockId: 'operative-sequence',
            },
          ],
        },
        {
          label: 'Explore & identify',
          extracts: [
            {
              text: 'Identify caecum, terminal ileum and appendix before dividing tissue',
              blockId: 'operative-sequence',
            },
          ],
        },
        {
          label: 'Mesoappendix & base',
          extracts: [
            {
              text: 'Expose and control the mesoappendix and its vessels; secure and divide the appendiceal base',
              blockId: 'operative-sequence',
            },
          ],
        },
        {
          label: 'Retrieve & assess',
          extracts: [
            {
              text: 'Retrieve the specimen in a bag; assess contamination',
              blockId: 'operative-sequence',
            },
          ],
        },
        {
          label: 'Inspect & close',
          extracts: [
            {
              text: 'Check haemostasis and the secured base',
              blockId: 'operative-sequence',
            },
            {
              text: 'close the relevant abdominal-wall layers',
              blockId: 'operative-sequence',
            },
          ],
        },
      ],
    },
    {
      blockId: 'structures-at-risk',
      label: 'Danger areas',
      page: 'anatomy',
      group: 'theatre',
    },
    {
      label: 'What can change the plan',
      page: 'appendicectomy',
      group: 'theatre',
      rows: [
        {
          label: 'Findings',
          extracts: [
            {
              text: 'Poor visualisation or difficult anatomy may require a changed approach',
              blockId: 'operative-judgement',
            },
          ],
        },
        {
          label: 'Seek help',
          extracts: [
            {
              text: 'uncertainty is a reason to seek senior help',
              blockId: 'operative-judgement',
            },
          ],
        },
        {
          // Conversion and strategy reasoning stay level-sensitive.
          label: 'Strategy',
          minimumLevel: 'cst',
          extracts: [
            { text: 'including conversion', blockId: 'operative-judgement' },
            {
              text: 'Device choice and strategy depend on findings and expertise',
              blockId: 'operative-judgement',
            },
          ],
        },
      ],
    },
    {
      label: 'On the ward',
      page: 'post-op',
      group: 'after-surgery',
      rows: [
        {
          label: 'Review',
          extracts: [
            {
              text: 'Review observations, symptoms and the operative findings; escalate deterioration promptly',
              blockId: 'postoperative-review',
            },
          ],
        },
        {
          label: 'Comfort & intake',
          extracts: [
            {
              text: 'Individualise analgesia and review fluid/intake needs',
              blockId: 'postoperative-review',
            },
          ],
        },
        {
          label: 'Mobilise',
          extracts: [
            {
              text: 'Encourage mobilisation when appropriate and reassess VTE/bleeding risk',
              blockId: 'postoperative-review',
            },
          ],
        },
        {
          label: 'Antibiotics',
          minimumLevel: 'foundation',
          extracts: [
            {
              text: 'Distinguish prophylaxis from treatment',
              blockId: 'postoperative-antibiotics',
            },
          ],
        },
      ],
    },
    {
      label: 'Reassess promptly',
      page: 'complications',
      group: 'after-surgery',
      rows: [
        {
          label: 'Recovery',
          extracts: [
            {
              text: 'Persistent vomiting, increasing wound pain/redness or fever need reassessment',
              blockId: 'recovery-basics',
            },
          ],
        },
        {
          label: 'Possible VTE',
          extracts: [
            {
              text: 'New calf pain or breathlessness needs prompt assessment for possible VTE',
              blockId: 'vte-complication',
            },
          ],
        },
      ],
    },
    {
      blockId: 'complications-table',
      label: 'Important complications',
      page: 'complications',
      group: 'after-surgery',
    },
    {
      label: 'Discharge & follow-up',
      page: 'post-op',
      group: 'after-surgery',
      rows: [
        {
          label: 'Readiness',
          extracts: [
            {
              text: 'Judge readiness from recovery, oral intake, pain control and the agreed home-care plan rather than a fixed discharge time',
              blockId: 'discharge-plan',
            },
          ],
        },
        {
          label: 'Safety-net',
          extracts: [
            {
              text: 'Give clear instructions for symptoms requiring help and how to access it',
              blockId: 'recovery-basics',
            },
          ],
        },
        {
          label: 'Histology',
          extracts: [
            {
              text: 'Ensure responsibility for reviewing and communicating histology is clear',
              blockId: 'histology-follow-up',
            },
          ],
        },
      ],
    },
  ],
  quickReferenceGroups: [
    { id: 'snapshot', title: 'Clinical snapshot' },
    { id: 'do-not-miss', title: 'Do not miss', tone: 'alert' },
    {
      id: 'before-theatre',
      title: 'Before theatre',
      phase: 'before',
      contextId: 'before-theatre',
    },
    {
      id: 'theatre',
      title: 'Going to theatre',
      tone: 'feature',
      phase: 'during',
      contextId: 'theatre',
    },
    {
      id: 'after-surgery',
      title: 'After surgery · on the ward',
      phase: 'after',
      contextId: 'ward',
    },
  ],
  journey: [
    { label: 'Assessment', page: 'assessment' },
    { label: 'Investigations', page: 'investigations' },
    { label: 'Decision', page: 'management' },
    { label: 'Pre-op', group: 'before-theatre' },
    { label: 'Theatre', page: 'appendicectomy' },
    { label: 'Recovery', page: 'post-op' },
  ],
  contexts: [
    {
      id: 'before-theatre',
      title: 'Before theatre',
      description: 'From the decision to operate to arriving in theatre.',
      links: [
        { title: 'Decision & initial care', page: 'management' },
        { title: 'Full consent discussion', page: 'consent' },
        { title: 'Operative preparation', page: 'appendicectomy' },
      ],
    },
    {
      id: 'ward',
      title: 'On the ward',
      description: 'Review, recognise change and plan the next conversation.',
      links: [
        { title: 'Assessment & deterioration', page: 'assessment' },
        { title: 'Postoperative review & safety-netting', page: 'post-op' },
        { title: 'Complications & review gaps', page: 'complications' },
      ],
    },
    {
      id: 'theatre',
      title: 'Going to theatre',
      description:
        'Orientate yourself before the case and discuss with your supervisor.',
      links: [
        { title: 'Anatomy & structures at risk', page: 'anatomy' },
        {
          title: 'Positioning, access & operative sequence',
          page: 'appendicectomy',
        },
        { title: 'Questions to revise', page: 'hot-seat' },
      ],
    },
  ],
  presentation: [
    {
      blockId: 'symptom-pattern',
      label: 'Presentation pattern',
      itemLabels: [
        'Pain history',
        'Associated features',
        'Atypical presentations',
      ],
      variant: 'cards',
    },
    {
      blockId: 'deterioration',
      label: 'Red flags · escalate',
      variant: 'escalation',
    },
    {
      blockId: 'relevant-history',
      label: 'Diagnostic history',
      variant: 'plain',
    },
    {
      blockId: 'anaesthetic-history',
      label: 'Anaesthetic preparation',
      variant: 'plain',
    },
    { blockId: 'examination', label: 'Examination', variant: 'plain' },
    {
      blockId: 'patient-factors',
      label: 'The individual patient',
      variant: 'plain',
    },
    {
      blockId: 'fluid-assessment',
      label: 'Hydration & circulation',
      variant: 'plain',
    },
    {
      blockId: 'inflammatory-markers',
      label: 'Bloods · inflammatory markers',
      group: 'Bloods & urine',
      variant: 'fact',
    },
    {
      blockId: 'urine-pregnancy',
      label: 'Urine & pregnancy testing',
      group: 'Bloods & urine',
      variant: 'fact',
    },
    {
      blockId: 'renal-tests',
      label: 'Bloods · renal function',
      group: 'Bloods & urine',
      variant: 'fact',
    },
    { blockId: 'sepsis-tests', label: 'Further assessment', variant: 'plain' },
    {
      blockId: 'imaging-choice',
      label: 'Imaging in context',
      variant: 'plain',
    },
    {
      blockId: 'ultrasound',
      label: 'Ultrasound',
      group: 'Imaging modalities',
      variant: 'fact',
    },
    {
      blockId: 'ct-findings',
      label: 'CT',
      group: 'Imaging modalities',
      variant: 'fact',
    },
    {
      blockId: 'mri',
      label: 'MRI',
      group: 'Imaging modalities',
      variant: 'fact',
    },
    {
      blockId: 'diagnostic-synthesis',
      label: 'Bring the findings together',
      variant: 'pathway',
    },
    {
      blockId: 'operative-pathway',
      label: 'Discuss treatment options',
      variant: 'pathway',
    },
    {
      blockId: 'initial-support',
      label: 'Initial support',
      variant: 'pathway',
    },
    { blockId: 'fluid-support', label: 'Assess fluid needs', variant: 'plain' },
    {
      blockId: 'antimicrobial-policy',
      label: 'Follow the applicable policy',
      variant: 'plain',
    },
    {
      blockId: 'nonoperative-discussion',
      label: 'Selected uncomplicated disease',
      variant: 'pathway',
    },
    {
      blockId: 'peritonitis-plan',
      label: 'Peritonitis & deterioration',
      variant: 'escalation',
    },
    {
      blockId: 'abscess-options',
      label: 'Mass / abscess · paediatric context',
      variant: 'pathway',
    },
    {
      blockId: 'appendix-origin',
      label: 'Structures & landmarks',
      itemLabels: ['Origin & relations', 'Finding the base & tip'],
      variant: 'cards',
    },
    {
      blockId: 'mesoappendix',
      label: 'Relational anatomy · mesoappendix',
      variant: 'fact',
    },
    {
      blockId: 'structures-at-risk',
      label: 'Danger areas · why it matters in theatre',
      variant: 'danger',
    },
    {
      blockId: 'postoperative-review',
      label: 'Review on the ward',
      variant: 'fact',
    },
    {
      blockId: 'discharge-plan',
      label: 'Before discharge',
      variant: 'pathway',
    },
    {
      blockId: 'complications-table',
      label: 'Complication context',
      variant: 'complications',
    },
    {
      blockId: 'supported-decision',
      label: 'A supported decision',
      itemLabels: [
        'Why this procedure?',
        'Reasonable alternatives',
        'Material risks & patient priorities',
        'Questions & understanding',
      ],
      variant: 'consent',
    },
    {
      blockId: 'procedure-specific-discussion',
      label: 'Material risks & what might change',
      variant: 'pathway',
    },
    {
      blockId: 'consent-depth',
      label: 'Patient preferences & understanding',
      variant: 'fact',
    },
  ],
  pathways: [
    {
      id: 'management-overview',
      page: 'management',
      title: 'How the management content fits together',
      caption:
        'Orientation to the sections below — not a treatment algorithm. Follow the linked content, senior advice and local policy.',
      steps: [
        {
          label: 'Initial support, analgesia & senior involvement',
          blockId: 'initial-support',
        },
      ],
      branches: [
        { label: 'Discuss treatment options', blockId: 'operative-pathway' },
        {
          label: 'Generalised peritonitis or deterioration',
          blockId: 'peritonitis-plan',
        },
        { label: 'Mass or abscess', blockId: 'abscess-options' },
      ],
    },
  ],
  related: [
    {
      kind: 'procedure',
      title: 'Laparoscopic appendicectomy',
      page: 'appendicectomy',
    },
    { kind: 'anatomy', title: 'Surgical anatomy', page: 'anatomy' },
    {
      kind: 'complication',
      title: 'Complications after appendicectomy',
      page: 'complications',
    },
  ],
  // Step → Why → Anatomy → Danger → What changes the plan. Walkthrough content
  // must be textually sourced (validated) AND semantically authored for the
  // role it is shown in (manually reviewed mapping, pinned by a test). A
  // related fact that was not written as, e.g., a rationale is a gap, not a
  // "Why". Fields default to their source block's depth.
  walkthroughs: [
    {
      id: 'appendicectomy',
      page: 'appendicectomy',
      blockId: 'operative-sequence',
      steps: [
        {
          itemIndex: 0,
          label: 'Position & access',
          // The port answer explains why coordinates vary, not why this step
          // is performed; it stays a linked question.
          gaps: ['why'],
          links: [
            {
              label: 'Hot Seat: why no fixed port coordinates',
              page: 'hot-seat',
              blockId: 'port-question',
            },
          ],
        },
        {
          itemIndex: 1,
          label: 'Explore & identify',
          // The mesoappendix sentence describes dissection anatomy, not a
          // rationale for exploring and identifying.
          gaps: ['why'],
          fields: [
            {
              kind: 'anatomy',
              extracts: [
                {
                  text: 'The appendix arises from the posteromedial caecum near the ileocaecal junction',
                  blockId: 'appendix-origin',
                },
                {
                  text: 'The tip can lie retrocaecally, in the pelvis or near the ileum',
                  blockId: 'appendix-origin',
                },
              ],
            },
            {
              kind: 'danger',
              extracts: [
                {
                  text: 'Relate the variable appendix position and exposure to the structures actually in view',
                  blockId: 'structures-at-risk',
                },
              ],
            },
            {
              // The simple acknowledgement is universal; strategy is not.
              kind: 'changes',
              minimumLevel: 'medical-student',
              extracts: [
                {
                  text: 'Poor visualisation or difficult anatomy may require a changed approach',
                  blockId: 'operative-judgement',
                },
              ],
            },
          ],
          links: [
            {
              label: 'Anatomy: origin & landmarks',
              page: 'anatomy',
              blockId: 'appendix-origin',
            },
            {
              label: 'Hot Seat: finding the base',
              page: 'hot-seat',
              blockId: 'appendix-base',
            },
          ],
        },
        {
          itemIndex: 2,
          label: 'Mesoappendix & base',
          fields: [
            {
              // Authored as a rationale: "Why identify the mesoappendix
              // before dividing it?" — quoted whole, cause included.
              kind: 'why',
              extracts: [
                {
                  text: 'It contains the appendicular vascular supply; deliberate identification and control matter',
                  blockId: 'artery-question',
                },
              ],
            },
            {
              kind: 'anatomy',
              extracts: [
                {
                  text: 'The mesoappendix carries the appendicular arterial supply',
                  blockId: 'mesoappendix',
                },
                {
                  text: 'Following the caecal taeniae to their convergence helps locate the appendiceal base',
                  blockId: 'appendix-origin',
                },
              ],
            },
            {
              kind: 'danger',
              extracts: [
                {
                  text: 'Adjacent bowel, bladder and vessels can be injured during surgery',
                  blockId: 'structures-at-risk',
                },
              ],
            },
          ],
          // Base-control technique (Hot Seat) is technique choice, not a
          // change of plan; it stays a linked question.
          links: [
            {
              label: 'Anatomy: mesoappendix',
              page: 'anatomy',
              blockId: 'mesoappendix',
            },
            {
              label: 'Danger areas',
              page: 'anatomy',
              blockId: 'structures-at-risk',
            },
            {
              label: 'Complications: bleeding, bowel injury',
              page: 'complications',
              blockId: 'complications-table',
            },
            {
              label: 'Hot Seat: before dividing the base',
              page: 'hot-seat',
              blockId: 'base-question',
            },
          ],
        },
        { itemIndex: 3, label: 'Retrieve & assess', gaps: ['why'] },
        {
          itemIndex: 4,
          label: 'Inspect & close',
          gaps: ['why'],
          links: [
            {
              label: 'After theatre: postoperative review',
              page: 'post-op',
              blockId: 'postoperative-review',
            },
          ],
        },
      ],
    },
  ],
  briefings: [
    {
      id: 'theatre-prep',
      page: 'appendicectomy',
      title: '5-minute theatre prep',
      caption:
        'Seeing or assisting with this case soon? Start here — the walkthrough below goes deeper.',
      variant: 'prep',
      rows: [
        {
          // Describes treatment options, not an indication, so not "Why".
          label: 'Treatment',
          extracts: [
            {
              text: 'Appendicectomy is usual; antibiotics alone are an option for some patients',
              blockId: 'at-a-glance',
            },
          ],
          link: {
            label: 'Management',
            page: 'management',
            blockId: 'operative-pathway',
          },
        },
        {
          label: 'The operation',
          extracts: [
            {
              text: 'Under general anaesthesia, laparoscopic access allows exploration and removal of the appendix',
              blockId: 'operation-outline',
            },
          ],
        },
        {
          label: 'Setup',
          extracts: [
            {
              text: 'Confirm the agreed procedure and perioperative plan during the safety checklist',
              blockId: 'operative-preparation',
            },
            {
              text: 'Position supine, adjusting tilt for exposure',
              blockId: 'operative-sequence',
            },
          ],
        },
        {
          label: 'Anatomy',
          extracts: [
            {
              text: 'Following the caecal taeniae to their convergence helps locate the appendiceal base',
              blockId: 'appendix-origin',
            },
            {
              text: 'The mesoappendix carries the appendicular arterial supply',
              blockId: 'mesoappendix',
            },
          ],
          link: { label: 'Anatomy', page: 'anatomy' },
        },
        {
          label: 'Sequence',
          extracts: [
            {
              text: 'identification, mesoappendix and base control, retrieval, inspection and closure',
              blockId: 'operation-outline',
            },
          ],
          link: { label: 'Walkthrough', page: 'appendicectomy', step: 1 },
        },
        {
          label: 'Danger',
          extracts: [
            {
              text: 'Adjacent bowel, bladder and vessels can be injured during surgery',
              blockId: 'structures-at-risk',
            },
          ],
          link: {
            label: 'Danger areas',
            page: 'anatomy',
            blockId: 'structures-at-risk',
          },
        },
        {
          label: 'Plan may change',
          extracts: [
            {
              text: 'Poor visualisation or difficult anatomy may require a changed approach',
              blockId: 'operative-judgement',
            },
          ],
          link: {
            label: 'What changes the plan',
            page: 'appendicectomy',
            blockId: 'operative-judgement',
          },
        },
        {
          label: 'Consent',
          extracts: [
            {
              text: 'Discuss anaesthetic considerations, bleeding, infection, collection, injury to adjacent structures and possible further intervention',
              blockId: 'procedure-specific-discussion',
            },
            {
              text: 'Explain that findings may change the approach',
              blockId: 'procedure-specific-discussion',
            },
          ],
          link: {
            label: 'Consent',
            page: 'consent',
            blockId: 'procedure-specific-discussion',
          },
        },
        {
          label: 'After',
          extracts: [
            {
              text: 'Review observations, symptoms and the operative findings; escalate deterioration promptly',
              blockId: 'postoperative-review',
            },
          ],
          link: {
            label: 'Post-op',
            page: 'post-op',
            blockId: 'postoperative-review',
          },
        },
      ],
    },
    {
      id: 'what-changes-the-plan',
      page: 'appendicectomy',
      title: 'What changes the plan',
      caption:
        'The textbook sequence is a starting point; operative judgement responds to findings.',
      variant: 'plan',
      replacesBlockId: 'operative-judgement',
      absorbsBlockIds: ['unexpected-findings'],
      rows: [
        {
          label: 'Standard',
          extracts: [
            {
              text: 'The broad sequence is identification, mesoappendix and base control, retrieval, inspection and closure',
              blockId: 'operation-outline',
            },
          ],
          link: { label: 'Walkthrough', page: 'appendicectomy', step: 1 },
        },
        {
          label: 'May change it',
          extracts: [
            {
              text: 'Poor visualisation or difficult anatomy may require a changed approach',
              blockId: 'operative-judgement',
            },
            {
              text: 'unexpected findings or complexity beyond your competence',
              blockId: 'unexpected-findings',
            },
          ],
        },
        {
          label: 'Always',
          extracts: [
            {
              text: 'uncertainty is a reason to seek senior help',
              blockId: 'operative-judgement',
            },
          ],
        },
        {
          label: 'In consent',
          extracts: [
            {
              text: 'Explain that findings may change the approach',
              blockId: 'procedure-specific-discussion',
            },
          ],
          link: {
            label: 'Consent',
            page: 'consent',
            blockId: 'procedure-specific-discussion',
          },
        },
        {
          label: 'Strategy',
          minimumLevel: 'cst',
          extracts: [
            { text: 'including conversion', blockId: 'operative-judgement' },
            {
              text: 'Device choice and strategy depend on findings and expertise',
              blockId: 'operative-judgement',
            },
          ],
          link: {
            label: 'Hot Seat: senior help',
            page: 'hot-seat',
            blockId: 'help-question',
          },
        },
        {
          label: 'Unexpected findings',
          minimumLevel: 'registrar',
          extracts: [
            {
              text: 'involve an appropriately experienced colleague',
              blockId: 'unexpected-findings',
            },
            {
              text: 'Make the revised plan explicit and document the findings and decisions',
              blockId: 'unexpected-findings',
            },
          ],
          link: {
            label: 'Hot Seat: unexpected findings',
            page: 'hot-seat',
            blockId: 'unexpected-question',
          },
        },
      ],
    },
  ],
  // Cross-links that explain why two concepts belong together.
  blockLinks: [
    {
      blockId: 'appendix-origin',
      links: [
        {
          label: 'In the operation: step 2 · Explore & identify',
          page: 'appendicectomy',
          step: 2,
        },
        {
          label: 'Step 3 · Mesoappendix & base',
          page: 'appendicectomy',
          step: 3,
        },
      ],
    },
    {
      blockId: 'mesoappendix',
      links: [
        {
          label: 'In the operation: step 3 · Mesoappendix & base',
          page: 'appendicectomy',
          step: 3,
        },
        {
          label: 'Hot Seat: why identify the mesoappendix',
          page: 'hot-seat',
          blockId: 'artery-question',
        },
      ],
    },
    {
      blockId: 'structures-at-risk',
      links: [
        {
          label: 'Where it matters: operative steps 2–3',
          page: 'appendicectomy',
          step: 2,
        },
        {
          label: 'Complications: bowel injury, bleeding',
          page: 'complications',
          blockId: 'complications-table',
        },
      ],
    },
    {
      blockId: 'complications-table',
      links: [
        {
          label: 'Danger areas in theatre',
          page: 'anatomy',
          blockId: 'structures-at-risk',
        },
        {
          label: 'Operation: mesoappendix & base control',
          page: 'appendicectomy',
          step: 3,
        },
        {
          label: 'Consent: risks to discuss',
          page: 'consent',
          blockId: 'procedure-specific-discussion',
        },
      ],
    },
    {
      blockId: 'procedure-specific-discussion',
      links: [
        {
          label: 'What changes the plan in theatre',
          page: 'appendicectomy',
          blockId: 'operative-judgement',
        },
        {
          label: 'Complications described to patients',
          page: 'complications',
          blockId: 'complications-table',
        },
      ],
    },
    {
      blockId: 'postoperative-review',
      links: [
        {
          label: 'The operation: walkthrough',
          page: 'appendicectomy',
          step: 1,
        },
      ],
    },
    {
      blockId: 'appendix-base',
      links: [
        {
          label: 'Anatomy: origin & landmarks',
          page: 'anatomy',
          blockId: 'appendix-origin',
        },
        {
          label: 'In the operation: step 2',
          page: 'appendicectomy',
          step: 2,
        },
      ],
    },
    {
      blockId: 'artery-question',
      links: [
        {
          label: 'In the operation: step 3',
          page: 'appendicectomy',
          step: 3,
        },
      ],
    },
    {
      blockId: 'port-question',
      links: [
        {
          label: 'In the operation: step 1',
          page: 'appendicectomy',
          step: 1,
        },
      ],
    },
    {
      blockId: 'base-question',
      links: [
        {
          label: 'In the operation: step 3',
          page: 'appendicectomy',
          step: 3,
        },
      ],
    },
    {
      blockId: 'help-question',
      links: [
        {
          label: 'What changes the plan',
          page: 'appendicectomy',
          blockId: 'operative-judgement',
        },
      ],
    },
    {
      blockId: 'unexpected-question',
      links: [
        {
          label: 'What changes the plan',
          page: 'appendicectomy',
          blockId: 'operative-judgement',
        },
      ],
    },
  ],
} satisfies TopicExperience;
