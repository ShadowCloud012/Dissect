import type { TopicExperience } from '@/schemas/topic-experience';

// Routing and presentation pointers only. Clinical wording lives in the
// sourced blocks; every extract below is validated as verbatim.
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
      aliases: ['presentation', 'biliary colic', 'murphy sign'],
      keywords: ['right upper quadrant pain', 'jaundice', 'differentials'],
    },
    {
      slug: 'investigations',
      title: 'Investigations',
      shortTitle: 'Investigate',
      quickJump: true,
      description: 'Blood tests, liver tests and imaging.',
      group: 'Clinical',
      sectionIds: ['investigations', 'imaging'],
      aliases: ['imaging', 'ultrasound', 'MRCP'],
      keywords: ['liver function tests', 'CRP', 'bile duct stones'],
    },
    {
      slug: 'management',
      title: 'Management',
      shortTitle: 'Manage',
      quickJump: true,
      description: 'Initial care, when surgery is offered, and alternatives.',
      group: 'Clinical',
      sectionIds: ['management'],
      aliases: ['treatment'],
      keywords: ['early cholecystectomy', 'cholecystostomy', 'ERCP'],
    },
    {
      slug: 'anatomy',
      title: 'Anatomy',
      quickJump: true,
      description: 'Biliary anatomy, the hepatocystic triangle and variation.',
      group: 'Operative',
      sectionIds: ['surgical-anatomy'],
      aliases: ['surgical anatomy', 'Calot triangle', 'hepatocystic triangle'],
      keywords: [
        'cystic duct',
        'cystic artery',
        'common bile duct',
        'common hepatic duct',
      ],
    },
    {
      slug: 'laparoscopic-cholecystectomy',
      title: 'Laparoscopic cholecystectomy',
      shortTitle: 'Operate',
      quickJump: true,
      description:
        'Theatre prep, operative sequence and what changes the plan.',
      group: 'Operative',
      sectionIds: ['laparoscopic-cholecystectomy'],
      keywords: ['critical view of safety', 'bile duct injury', 'conversion'],
    },
    {
      slug: 'post-op',
      title: 'Post-op',
      description: 'Ward review, recovery and when to seek help.',
      group: 'Operative',
      sectionIds: ['postoperative-care'],
      aliases: ['postoperative care'],
      keywords: ['recovery', 'discharge', 'shoulder-tip pain'],
    },
    {
      slug: 'complications',
      title: 'Complications',
      quickJump: true,
      description: 'Patient-information context and review gaps.',
      group: 'Operative',
      sectionIds: ['complications'],
      aliases: ['postoperative concerns'],
      keywords: ['bile leak', 'retained stones', 'bile duct injury'],
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
    {
      label: 'Presentation',
      page: 'assessment',
      group: 'snapshot',
      rows: [
        {
          label: 'Biliary colic',
          extracts: [
            {
              text: 'severe, often constant pain in the upper middle or right upper abdomen',
              blockId: 'symptom-pattern',
            },
          ],
        },
        {
          label: 'Cholecystitis',
          extracts: [
            {
              text: 'sudden, persistent right upper quadrant pain that may spread towards the right shoulder',
              blockId: 'symptom-pattern',
            },
          ],
        },
        {
          label: 'Associated',
          extracts: [
            {
              text: 'fever, nausea, vomiting, sweating, loss of appetite and jaundice',
              blockId: 'symptom-pattern',
            },
          ],
        },
        {
          label: 'Examination',
          extracts: [
            {
              text: 'right upper quadrant tenderness and Murphy’s sign',
              blockId: 'examination',
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
            { text: 'Liver function tests', blockId: 'blood-tests' },
            { text: 'CRP and white cell count', blockId: 'blood-tests' },
            {
              text: 'amylase or lipase if pancreatitis is possible',
              blockId: 'blood-tests',
            },
          ],
        },
        {
          label: 'Imaging',
          extracts: [
            { text: 'Ultrasound', blockId: 'ultrasound' },
            { text: 'The first-line imaging test', blockId: 'ultrasound' },
          ],
        },
        {
          label: 'Bile ducts',
          extracts: [
            {
              text: 'MRCP is considered when ultrasound has not shown bile duct stones but the duct is dilated or liver function tests are abnormal',
              blockId: 'mrcp',
            },
          ],
        },
        {
          label: 'Remember',
          extracts: [
            {
              text: 'No single clinical or laboratory finding establishes or excludes acute cholecystitis',
              blockId: 'examination',
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
              text: 'Arrange surgical assessment and senior help appropriate to severity and your competence',
              blockId: 'initial-care',
            },
          ],
        },
        {
          label: 'Support',
          extracts: [
            {
              text: 'Give intravenous fluids and analgesia',
              blockId: 'initial-care',
            },
            {
              text: 'Give antibiotics according to local policy when infection is suspected',
              blockId: 'initial-care',
            },
          ],
        },
        {
          label: 'Surgery',
          extracts: [
            {
              text: 'People with symptomatic gallbladder stones are offered laparoscopic cholecystectomy',
              blockId: 'surgery-indications',
            },
            {
              text: 'People with acute cholecystitis are offered early laparoscopic cholecystectomy, within 1 week of diagnosis',
              blockId: 'surgery-indications',
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
      label: 'Recognise deterioration',
      page: 'assessment',
      group: 'do-not-miss',
    },
    {
      label: 'Preparation',
      page: 'laparoscopic-cholecystectomy',
      group: 'before-theatre',
      rows: [
        {
          label: 'Plan',
          extracts: [
            {
              text: 'Confirm the agreed procedure and perioperative plan during the safety checklist',
              blockId: 'operative-preparation',
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
          label: 'Antibiotics',
          extracts: [
            {
              text: 'give prophylactic antibiotics according to institutional protocol',
              blockId: 'operative-preparation',
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
              text: 'Explain why cholecystectomy is proposed and what the operation involves',
              blockId: 'supported-decision',
            },
          ],
        },
        {
          label: 'Alternatives',
          extracts: [
            {
              text: 'Discuss reasonable alternatives and what no treatment could mean; in acute cholecystitis, drainage of the gallbladder may be offered when surgery is not an option',
              blockId: 'supported-decision',
            },
          ],
        },
        {
          label: 'Risks to discuss',
          extracts: [
            {
              text: 'Discuss bleeding, infection, injury to the bile ducts or other organs, bile leak, retained stones and blood clots in relation to this patient',
              blockId: 'procedure-risks',
            },
          ],
        },
        {
          label: 'May change',
          extracts: [
            {
              text: 'explain that open surgery is sometimes needed',
              blockId: 'procedure-risks',
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
          ],
        },
      ],
    },
    {
      blockId: 'preoperative-preparation-todo',
      label: 'Not yet covered',
      page: 'laparoscopic-cholecystectomy',
      group: 'before-theatre',
    },
    {
      label: 'Anatomy & landmarks',
      page: 'anatomy',
      group: 'theatre',
      rows: [
        {
          label: 'Triangle',
          extracts: [
            {
              text: 'The space bounded by the cystic duct, the common hepatic duct and the edge of the liver',
              blockId: 'hepatocystic-triangle',
            },
          ],
        },
        {
          label: 'Ducts',
          extracts: [
            {
              text: 'The cystic duct usually connects the gallbladder to the common bile duct',
              blockId: 'biliary-anatomy',
            },
          ],
        },
        {
          label: 'Artery',
          extracts: [
            {
              text: 'The cystic artery usually arises from the right hepatic artery, but its origin and course vary',
              blockId: 'cystic-artery',
            },
          ],
        },
        {
          label: 'Variation',
          extracts: [
            {
              text: 'Biliary anatomy varies considerably, which matters for surgical safety',
              blockId: 'biliary-anatomy',
            },
          ],
        },
      ],
    },
    {
      label: 'The operation',
      page: 'laparoscopic-cholecystectomy',
      group: 'theatre',
      numbered: true,
      rows: [
        {
          label: 'Position & access',
          extracts: [
            {
              text: 'Position supine, then tilt head-up and slightly to the left',
              blockId: 'operative-sequence',
            },
          ],
        },
        {
          label: 'Expose',
          extracts: [
            {
              text: 'Retract the gallbladder fundus towards the right shoulder to expose the hepatocystic triangle',
              blockId: 'operative-sequence',
            },
          ],
        },
        {
          label: 'Critical view',
          extracts: [
            {
              text: 'achieve the critical view of safety before clipping or dividing any structure',
              blockId: 'operative-sequence',
            },
          ],
        },
        {
          label: 'Clip & divide',
          extracts: [
            {
              text: 'Clip and divide the cystic duct and cystic artery once they are confirmed',
              blockId: 'operative-sequence',
            },
          ],
        },
        {
          label: 'Separate',
          extracts: [
            {
              text: 'Dissect the gallbladder from the liver bed',
              blockId: 'operative-sequence',
            },
          ],
        },
        {
          label: 'Finish',
          extracts: [
            {
              text: 'Check haemostasis, retrieve the gallbladder in a pouch, inspect the port sites and close',
              blockId: 'operative-sequence',
            },
          ],
        },
      ],
    },
    {
      blockId: 'bile-duct-danger',
      label: 'Danger areas',
      page: 'anatomy',
      group: 'theatre',
    },
    {
      label: 'What can change the plan',
      page: 'laparoscopic-cholecystectomy',
      group: 'theatre',
      rows: [
        {
          label: 'Findings',
          extracts: [
            {
              text: 'open surgery is sometimes needed, for example if the gallbladder is very inflamed or keyhole removal is not possible',
              blockId: 'operation-outline',
            },
          ],
        },
        {
          label: 'Seek help',
          extracts: [
            {
              text: 'With unclear anatomy or complexity beyond your competence, involve an appropriately experienced colleague',
              blockId: 'senior-help',
            },
          ],
        },
        {
          label: 'Strategy',
          minimumLevel: 'cst',
          extracts: [
            {
              text: 'The multi-society guideline strongly recommends intraoperative biliary imaging, particularly cholangiography, when the anatomy is uncertain or a bile duct injury is suspected, although the certainty of evidence is very low',
              blockId: 'unclear-anatomy',
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
              text: 'Review observations, pain, the wounds and the operative findings; escalate deterioration promptly',
              blockId: 'postoperative-review',
            },
          ],
        },
        {
          label: 'Mobilise',
          extracts: [
            {
              text: 'Reassess VTE and bleeding risk and encourage mobilisation',
              blockId: 'postoperative-review',
            },
          ],
        },
        {
          label: 'Antibiotics',
          minimumLevel: 'foundation',
          extracts: [
            {
              text: 'Do not continue antibiotics routinely after surgery for uncomplicated cholecystitis when the source is controlled',
              blockId: 'postoperative-review',
            },
          ],
        },
      ],
    },
    {
      blockId: 'postoperative-warning',
      label: 'Reassess promptly',
      page: 'post-op',
      group: 'after-surgery',
    },
    {
      blockId: 'complications-table',
      label: 'Important complications',
      page: 'complications',
      group: 'after-surgery',
    },
    {
      label: 'Going home',
      page: 'post-op',
      group: 'after-surgery',
      rows: [
        {
          label: 'Discharge',
          extracts: [
            {
              text: 'Many people go home on the same day; some need to stay overnight',
              blockId: 'recovery-basics',
            },
          ],
        },
        {
          label: 'Expect',
          extracts: [
            {
              text: 'Shoulder-tip pain from retained carbon dioxide can occur and settles as the gas is absorbed',
              blockId: 'recovery-basics',
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
    { label: 'Theatre', page: 'laparoscopic-cholecystectomy' },
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
        {
          title: 'Operative preparation',
          page: 'laparoscopic-cholecystectomy',
        },
      ],
    },
    {
      id: 'theatre',
      title: 'Going to theatre',
      description:
        'Orientate yourself before the case and discuss with your supervisor.',
      links: [
        { title: 'Anatomy & the hepatocystic triangle', page: 'anatomy' },
        {
          title: 'Operative sequence & critical view',
          page: 'laparoscopic-cholecystectomy',
        },
        { title: 'Questions to revise', page: 'hot-seat' },
      ],
    },
    {
      id: 'ward',
      title: 'On the ward',
      description: 'Review, recognise change and plan the next conversation.',
      links: [
        { title: 'Assessment & deterioration', page: 'assessment' },
        { title: 'Postoperative review & recovery', page: 'post-op' },
        { title: 'Complications & review gaps', page: 'complications' },
      ],
    },
  ],
  presentation: [
    {
      blockId: 'symptom-pattern',
      label: 'Presentation pattern',
      itemLabels: [
        'Biliary colic',
        'Acute cholecystitis',
        'Associated features',
      ],
      variant: 'cards',
    },
    {
      blockId: 'deterioration',
      label: 'Red flags · escalate',
      variant: 'escalation',
    },
    { blockId: 'examination', label: 'Examination', variant: 'plain' },
    {
      blockId: 'gallstone-complications',
      label: 'Why it matters',
      variant: 'fact',
    },
    { blockId: 'blood-tests', label: 'Blood tests', variant: 'fact' },
    {
      blockId: 'liver-tests-caution',
      label: 'Liver tests in context',
      variant: 'plain',
    },
    { blockId: 'ultrasound', label: 'Ultrasound', variant: 'fact' },
    { blockId: 'mrcp', label: 'MRCP & endoscopic ultrasound', variant: 'fact' },
    {
      blockId: 'further-imaging',
      label: 'Further imaging',
      variant: 'plain',
    },
    { blockId: 'initial-care', label: 'Initial care', variant: 'pathway' },
    {
      blockId: 'surgery-indications',
      label: 'When surgery is offered',
      variant: 'fact',
    },
    {
      blockId: 'bile-duct-stones',
      label: 'Bile duct stones',
      variant: 'plain',
    },
    {
      blockId: 'not-fit-for-surgery',
      label: 'When surgery is not suitable',
      variant: 'plain',
    },
    { blockId: 'gallbladder-structure', label: 'Gallbladder', variant: 'fact' },
    { blockId: 'biliary-anatomy', label: 'Bile ducts', variant: 'fact' },
    { blockId: 'cystic-artery', label: 'Blood supply', variant: 'fact' },
    {
      blockId: 'bile-duct-danger',
      label: 'Danger · bile duct injury',
      variant: 'danger',
    },
    {
      blockId: 'cvs-criteria',
      label: 'Critical view of safety',
      itemLabels: [
        'Clear the triangle',
        'Two structures only',
        'Expose the cystic plate',
      ],
      variant: 'cards',
    },
    {
      blockId: 'technique-variation',
      label: 'Technique varies',
      variant: 'plain',
    },
    {
      blockId: 'postoperative-review',
      label: 'Review on the ward',
      variant: 'fact',
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
      blockId: 'procedure-risks',
      label: 'Material risks & what might change',
      variant: 'pathway',
    },
    {
      blockId: 'patient-understanding',
      label: 'What the patient should understand',
      variant: 'fact',
    },
  ],
  // Step → Why → Anatomy → Danger → What changes the plan. Each field is
  // sourced and was written for its role; unsupported fields are gaps.
  walkthroughs: [
    {
      id: 'cholecystectomy',
      page: 'laparoscopic-cholecystectomy',
      blockId: 'operative-sequence',
      absorbsBlockIds: [
        'positioning-rationale',
        'exposure-rationale',
        'cvs-purpose',
        'bleeding-check-rationale',
        'closure-rationale',
      ],
      steps: [
        {
          itemIndex: 0,
          label: 'Position & access',
          fields: [
            {
              kind: 'why',
              extracts: [
                {
                  text: 'Tilting the patient head-up with a slight left tilt elevates the gallbladder and lets adjacent organs fall away, improving visualisation and reducing the risk of injury',
                  blockId: 'positioning-rationale',
                },
                {
                  text: 'Wide preparation and draping allow conversion to open surgery if needed',
                  blockId: 'positioning-rationale',
                },
              ],
            },
          ],
          links: [
            {
              label: 'What changes the plan',
              page: 'laparoscopic-cholecystectomy',
              blockId: 'senior-help',
            },
          ],
        },
        {
          itemIndex: 1,
          label: 'Expose the hepatocystic triangle',
          fields: [
            {
              kind: 'why',
              extracts: [
                {
                  text: 'Retracting the gallbladder fundus upwards and laterally towards the right shoulder exposes the hepatocystic triangle',
                  blockId: 'exposure-rationale',
                },
              ],
            },
            {
              kind: 'anatomy',
              extracts: [
                {
                  text: 'The space bounded by the cystic duct, the common hepatic duct and the edge of the liver',
                  blockId: 'hepatocystic-triangle',
                },
              ],
            },
          ],
          links: [
            {
              label: 'Anatomy: hepatocystic triangle',
              page: 'anatomy',
              blockId: 'hepatocystic-triangle',
            },
            {
              label: 'Hot Seat: borders of the triangle',
              page: 'hot-seat',
              blockId: 'triangle-question',
            },
          ],
        },
        {
          itemIndex: 2,
          label: 'Achieve the critical view of safety',
          fields: [
            {
              kind: 'why',
              extracts: [
                {
                  text: 'A multi-society guideline suggests using the critical view of safety to identify the cystic duct and cystic artery before they are clipped and divided',
                  blockId: 'cvs-purpose',
                },
                {
                  text: 'The recommendation rests on expert opinion, not direct comparative evidence; the critical view helps minimise, but does not remove, the risk of bile duct injury',
                  blockId: 'cvs-purpose',
                },
              ],
            },
            {
              kind: 'anatomy',
              extracts: [
                {
                  text: 'Biliary anatomy varies considerably, which matters for surgical safety',
                  blockId: 'biliary-anatomy',
                },
              ],
            },
            {
              kind: 'danger',
              extracts: [
                {
                  text: 'Bile duct injury is the most common serious complication of laparoscopic cholecystectomy, and the critical view of safety is used to minimise that risk',
                  blockId: 'bile-duct-danger',
                },
              ],
            },
            {
              kind: 'changes',
              extracts: [
                {
                  text: 'The multi-society guideline strongly recommends intraoperative biliary imaging, particularly cholangiography, when the anatomy is uncertain or a bile duct injury is suspected',
                  blockId: 'unclear-anatomy',
                },
              ],
            },
          ],
          links: [
            {
              label: 'The three criteria (CST depth)',
              page: 'laparoscopic-cholecystectomy',
              blockId: 'cvs-criteria',
            },
            {
              label: 'Anatomy: bile duct injury',
              page: 'anatomy',
              blockId: 'bile-duct-danger',
            },
            {
              label: 'What changes the plan',
              page: 'laparoscopic-cholecystectomy',
              blockId: 'senior-help',
            },
            {
              label: 'Hot Seat: the critical view',
              page: 'hot-seat',
              blockId: 'cvs-question',
            },
          ],
        },
        {
          itemIndex: 3,
          label: 'Clip & divide',
          // No sourced rationale beyond "once confirmed", which restates the
          // step; left as a visible gap.
          gaps: ['why'],
          fields: [
            {
              kind: 'anatomy',
              extracts: [
                {
                  text: 'The cystic duct usually connects the gallbladder to the common bile duct, and the common hepatic duct lies above this junction',
                  blockId: 'biliary-anatomy',
                },
                {
                  text: 'The cystic artery usually arises from the right hepatic artery, but its origin and course vary',
                  blockId: 'cystic-artery',
                },
              ],
            },
          ],
          links: [
            {
              label: 'Anatomy: blood supply',
              page: 'anatomy',
              blockId: 'cystic-artery',
            },
          ],
        },
        {
          itemIndex: 4,
          label: 'Separate from the liver bed',
          gaps: ['why'],
          fields: [
            {
              kind: 'anatomy',
              extracts: [
                {
                  text: 'The gallbladder lies on the underside of the liver, between segments IVb and V',
                  blockId: 'gallbladder-structure',
                },
              ],
            },
          ],
          links: [
            {
              label: 'Anatomy: gallbladder',
              page: 'anatomy',
              blockId: 'gallbladder-structure',
            },
          ],
        },
        {
          itemIndex: 5,
          label: 'Inspect, retrieve & close',
          fields: [
            {
              kind: 'why',
              extracts: [
                {
                  text: 'Reducing the insufflation pressure before finishing can reveal venous bleeding that the higher pressure had tamponaded',
                  blockId: 'bleeding-check-rationale',
                },
                {
                  text: 'Fascial closure of larger port sites is described to reduce the risk of port-site hernia; practice varies',
                  blockId: 'closure-rationale',
                },
              ],
            },
          ],
          links: [
            {
              label: 'After theatre: ward review',
              page: 'post-op',
              blockId: 'postoperative-review',
            },
            {
              label: 'Complications',
              page: 'complications',
              blockId: 'complications-table',
            },
          ],
        },
      ],
    },
  ],
  briefings: [
    {
      id: 'theatre-prep',
      page: 'laparoscopic-cholecystectomy',
      title: 'Theatre prep at a glance',
      caption:
        'Seeing or assisting with this case soon? Start here — the walkthrough below goes deeper.',
      variant: 'prep',
      rows: [
        {
          label: 'Treatment',
          extracts: [
            {
              text: 'People with symptomatic gallbladder stones are offered laparoscopic cholecystectomy',
              blockId: 'surgery-indications',
            },
          ],
          link: {
            label: 'Management',
            page: 'management',
            blockId: 'surgery-indications',
          },
        },
        {
          label: 'The operation',
          extracts: [
            {
              text: 'Under general anaesthetic, the gallbladder is removed through several small cuts using a laparoscope',
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
              text: 'Position supine, then tilt head-up and slightly to the left',
              blockId: 'operative-sequence',
            },
          ],
        },
        {
          label: 'Anatomy',
          extracts: [
            {
              text: 'The space bounded by the cystic duct, the common hepatic duct and the edge of the liver',
              blockId: 'hepatocystic-triangle',
            },
          ],
          link: { label: 'Anatomy', page: 'anatomy' },
        },
        {
          label: 'Key principle',
          extracts: [
            {
              text: 'A multi-society guideline suggests using the critical view of safety to identify the cystic duct and cystic artery before they are clipped and divided',
              blockId: 'cvs-purpose',
            },
          ],
          link: {
            label: 'Walkthrough',
            page: 'laparoscopic-cholecystectomy',
            step: 3,
          },
        },
        {
          label: 'Danger',
          extracts: [
            {
              text: 'Bile duct injury is the most common serious complication of laparoscopic cholecystectomy',
              blockId: 'bile-duct-danger',
            },
          ],
          link: {
            label: 'Danger areas',
            page: 'anatomy',
            blockId: 'bile-duct-danger',
          },
        },
        {
          label: 'Plan may change',
          extracts: [
            {
              text: 'open surgery is sometimes needed, for example if the gallbladder is very inflamed or keyhole removal is not possible',
              blockId: 'operation-outline',
            },
          ],
          link: {
            label: 'What changes the plan',
            page: 'laparoscopic-cholecystectomy',
            blockId: 'senior-help',
          },
        },
        {
          label: 'Consent',
          extracts: [
            {
              text: 'Discuss bleeding, infection, injury to the bile ducts or other organs, bile leak, retained stones and blood clots in relation to this patient',
              blockId: 'procedure-risks',
            },
          ],
          link: {
            label: 'Consent',
            page: 'consent',
            blockId: 'procedure-risks',
          },
        },
        {
          label: 'After',
          extracts: [
            {
              text: 'Review observations, pain, the wounds and the operative findings; escalate deterioration promptly',
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
      page: 'laparoscopic-cholecystectomy',
      title: 'What changes the plan',
      caption:
        'The textbook sequence is a starting point; operative judgement responds to findings.',
      variant: 'plan',
      replacesBlockId: 'senior-help',
      absorbsBlockIds: [
        'difficult-gallbladder',
        'unclear-anatomy',
        'conversion',
        'subtotal-cholecystectomy',
        'bile-duct-injury-referral',
      ],
      rows: [
        {
          label: 'Standard',
          extracts: [
            {
              text: 'achieve the critical view of safety before clipping or dividing any structure',
              blockId: 'operative-sequence',
            },
          ],
          link: {
            label: 'Walkthrough',
            page: 'laparoscopic-cholecystectomy',
            step: 1,
          },
        },
        {
          label: 'Always',
          extracts: [
            {
              text: 'With unclear anatomy or complexity beyond your competence, involve an appropriately experienced colleague',
              blockId: 'senior-help',
            },
          ],
        },
        {
          label: 'In consent',
          extracts: [
            {
              text: 'explain that open surgery is sometimes needed',
              blockId: 'procedure-risks',
            },
          ],
          link: {
            label: 'Consent',
            page: 'consent',
            blockId: 'procedure-risks',
          },
        },
        {
          label: 'Difficult gallbladder',
          minimumLevel: 'cst',
          extracts: [
            {
              text: 'A difficult gallbladder can relate to obesity, adhesions, acute or chronic inflammation, a distended gallbladder or liver cirrhosis',
              blockId: 'difficult-gallbladder',
            },
          ],
        },
        {
          label: 'Unclear anatomy',
          minimumLevel: 'cst',
          extracts: [
            {
              text: 'The multi-society guideline strongly recommends intraoperative biliary imaging, particularly cholangiography, when the anatomy is uncertain or a bile duct injury is suspected, although the certainty of evidence is very low',
              blockId: 'unclear-anatomy',
            },
          ],
        },
        {
          label: 'Conversion',
          minimumLevel: 'cst',
          extracts: [
            {
              text: 'WSES recommends conversion to open surgery for severe local inflammation, adhesions, bleeding in the hepatocystic triangle or suspected bile duct injury',
              blockId: 'conversion',
            },
            {
              text: 'Conversion is a judicious clinical decision, not a complication or a failure',
              blockId: 'conversion',
            },
          ],
          link: {
            label: 'Hot Seat: conversion',
            page: 'hot-seat',
            blockId: 'conversion-question',
          },
        },
        {
          label: 'Critical view not obtainable',
          minimumLevel: 'registrar',
          extracts: [
            {
              text: 'When the critical view of safety cannot be achieved and the anatomy cannot be clearly defined by other methods, such as imaging, the multi-society guideline suggests considering subtotal cholecystectomy rather than total cholecystectomy by a fundus-first approach (expert opinion)',
              blockId: 'subtotal-cholecystectomy',
            },
            {
              text: 'This avoids dissection in the hepatocystic triangle; WSES also recommends subtotal cholecystectomy when anatomical identification is difficult and the risk of injury is high',
              blockId: 'subtotal-cholecystectomy',
            },
          ],
          link: {
            label: 'Hot Seat: no critical view',
            page: 'hot-seat',
            blockId: 'no-cvs-question',
          },
        },
        {
          label: 'Bile duct injury',
          minimumLevel: 'registrar',
          extracts: [
            {
              text: 'Confirmed or suspected bile duct injury should be referred to an experienced surgeon or a multispecialty hepatobiliary team',
              blockId: 'bile-duct-injury-referral',
            },
          ],
          link: {
            label: 'Hot Seat: bile duct injury',
            page: 'hot-seat',
            blockId: 'bdi-question',
          },
        },
      ],
    },
  ],
  // Cross-links that explain why two concepts belong together.
  // Schematic operative anatomy for the cholecystectomy. Every statement is a
  // verbatim extract; each step link must be quoted by that walkthrough step.
  // The critical-view criteria stay at CST depth with their textbook source.
  anatomyViews: [
    {
      id: 'cholecystectomy-anatomy',
      page: 'anatomy',
      walkthroughId: 'cholecystectomy',
      title: 'The hepatocystic triangle',
      caption:
        'The structures identified for the critical view of safety, the structures divided, and the bile ducts to be protected.',
      structures: [
        {
          id: 'gallbladder',
          label: 'Gallbladder',
          roles: ['removed'],
          fields: [
            {
              kind: 'what',
              extracts: [
                {
                  text: 'The gallbladder lies on the underside of the liver, between segments IVb and V, and has a fundus, body, infundibulum and neck',
                  blockId: 'gallbladder-structure',
                },
              ],
            },
            {
              kind: 'why',
              extracts: [
                {
                  text: 'Retracting the gallbladder fundus upwards and laterally towards the right shoulder exposes the hepatocystic triangle',
                  blockId: 'exposure-rationale',
                },
                {
                  text: 'Dissect the gallbladder from the liver bed, from the infundibulum towards the fundus',
                  blockId: 'operative-sequence',
                },
                {
                  text: 'retrieve the gallbladder in a pouch',
                  blockId: 'operative-sequence',
                },
              ],
            },
          ],
          steps: [2, 5, 6],
        },
        {
          id: 'hepatocystic-triangle',
          label: 'Hepatocystic triangle',
          roles: ['landmark'],
          fields: [
            {
              kind: 'what',
              extracts: [
                {
                  text: 'The space bounded by the cystic duct, the common hepatic duct and the edge of the liver',
                  blockId: 'hepatocystic-triangle',
                },
                {
                  text: 'It usually contains the cystic artery and a lymph node (the Lund node, sometimes miscalled the Calot node)',
                  blockId: 'hepatocystic-triangle',
                },
              ],
            },
            {
              kind: 'why',
              extracts: [
                {
                  text: 'Dissect the hepatocystic triangle to achieve the critical view of safety before clipping or dividing any structure',
                  blockId: 'operative-sequence',
                },
              ],
            },
            {
              kind: 'identify',
              extracts: [
                {
                  text: 'Clear all fibrofatty tissue from the hepatocystic triangle',
                  blockId: 'cvs-criteria',
                },
              ],
            },
          ],
          steps: [2, 3],
          links: [
            {
              label: 'The three criteria of the critical view (CST depth)',
              page: 'laparoscopic-cholecystectomy',
              blockId: 'cvs-criteria',
            },
          ],
        },
        {
          id: 'cystic-duct',
          label: 'Cystic duct',
          roles: ['controlled'],
          fields: [
            {
              kind: 'what',
              extracts: [
                {
                  text: 'The cystic duct usually connects the gallbladder to the common bile duct',
                  blockId: 'biliary-anatomy',
                },
              ],
            },
            {
              kind: 'why',
              extracts: [
                {
                  text: 'A multi-society guideline suggests using the critical view of safety to identify the cystic duct and cystic artery before they are clipped and divided',
                  blockId: 'cvs-purpose',
                },
                {
                  text: 'The recommendation rests on expert opinion, not direct comparative evidence; the critical view helps minimise, but does not remove, the risk of bile duct injury',
                  blockId: 'cvs-purpose',
                },
              ],
            },
            {
              kind: 'identify',
              extracts: [
                {
                  text: 'Identify two, and only two, tubular structures entering the gallbladder: the cystic duct and the cystic artery',
                  blockId: 'cvs-criteria',
                },
              ],
            },
          ],
          steps: [3, 4],
        },
        {
          id: 'cystic-artery',
          label: 'Cystic artery',
          roles: ['controlled'],
          fields: [
            {
              kind: 'what',
              extracts: [
                {
                  text: 'The cystic artery usually arises from the right hepatic artery, but its origin and course vary',
                  blockId: 'cystic-artery',
                },
              ],
            },
            {
              kind: 'why',
              extracts: [
                {
                  text: 'A multi-society guideline suggests using the critical view of safety to identify the cystic duct and cystic artery before they are clipped and divided',
                  blockId: 'cvs-purpose',
                },
              ],
            },
            {
              kind: 'identify',
              extracts: [
                {
                  text: 'Identify two, and only two, tubular structures entering the gallbladder: the cystic duct and the cystic artery',
                  blockId: 'cvs-criteria',
                },
              ],
            },
          ],
          steps: [3, 4],
        },
        {
          id: 'common-hepatic-duct',
          label: 'Common hepatic duct',
          roles: ['at-risk'],
          fields: [
            {
              kind: 'what',
              extracts: [
                {
                  text: 'the common hepatic duct lies above this junction',
                  blockId: 'biliary-anatomy',
                },
              ],
            },
            {
              kind: 'risk',
              extracts: [
                {
                  text: 'Bile duct injury is the most common serious complication of laparoscopic cholecystectomy, and the critical view of safety is used to minimise that risk',
                  blockId: 'bile-duct-danger',
                },
              ],
            },
          ],
          steps: [3, 4],
          links: [
            {
              label: 'Complications: bile duct or organ injury',
              page: 'complications',
              blockId: 'complications-table',
            },
          ],
        },
        {
          id: 'common-bile-duct',
          label: 'Common bile duct',
          roles: ['at-risk'],
          fields: [
            {
              kind: 'what',
              extracts: [
                {
                  text: 'The cystic duct usually connects the gallbladder to the common bile duct',
                  blockId: 'biliary-anatomy',
                },
              ],
            },
            {
              kind: 'risk',
              extracts: [
                {
                  text: 'Bile duct injury is the most common serious complication of laparoscopic cholecystectomy, and the critical view of safety is used to minimise that risk',
                  blockId: 'bile-duct-danger',
                },
              ],
            },
          ],
          steps: [3, 4],
          links: [
            {
              label: 'Complications: bile duct or organ injury',
              page: 'complications',
              blockId: 'complications-table',
            },
          ],
        },
      ],
      notes: [
        {
          text: 'Biliary anatomy varies considerably, which matters for surgical safety',
          blockId: 'biliary-anatomy',
        },
      ],
      links: [
        {
          label: 'When the anatomy is unclear: what changes the plan',
          page: 'laparoscopic-cholecystectomy',
          blockId: 'senior-help',
        },
      ],
    },
  ],
  // Theatre Prep composes existing content only: verbatim extracts, plus the
  // anatomy view, walkthrough and plan panel by ID.
  theatrePreps: [
    {
      procedureId: 'laparoscopic-cholecystectomy',
      anatomyViewId: 'cholecystectomy-anatomy',
      walkthroughId: 'cholecystectomy',
      planBriefingId: 'what-changes-the-plan',
      patient: [
        {
          label: 'Why this operation',
          extracts: [
            {
              text: 'People with symptomatic gallbladder stones are offered laparoscopic cholecystectomy',
              blockId: 'surgery-indications',
            },
            {
              text: 'People with acute cholecystitis are offered early laparoscopic cholecystectomy, within 1 week of diagnosis',
              blockId: 'surgery-indications',
            },
          ],
          link: {
            label: 'Management',
            page: 'management',
            blockId: 'surgery-indications',
          },
        },
        {
          label: 'Why it matters',
          extracts: [
            {
              text: 'Acute cholecystitis can lead to gangrene of the gallbladder or perforation, which can spread infection within the abdomen (peritonitis) or form an abscess',
              blockId: 'gallstone-complications',
            },
          ],
        },
        {
          label: 'Bile duct stones',
          minimumLevel: 'cst',
          extracts: [
            {
              text: 'Bile duct stones are cleared alongside laparoscopic cholecystectomy, either surgically during the operation or by ERCP before or during it',
              blockId: 'bile-duct-stones',
            },
          ],
        },
        {
          label: 'If surgery is not suitable',
          minimumLevel: 'cst',
          extracts: [
            {
              text: 'Percutaneous cholecystostomy is offered for gallbladder empyema when surgery is contraindicated and conservative management has failed',
              blockId: 'not-fit-for-surgery',
            },
          ],
        },
      ],
      before: [
        {
          label: 'Bloods',
          extracts: [
            {
              text: 'Liver function tests are offered with ultrasound to people with suspected gallstone disease',
              blockId: 'blood-tests',
            },
            {
              text: 'A raised CRP and white cell count support acute cholecystitis but do not establish it on their own',
              blockId: 'blood-tests',
            },
            {
              text: 'Raised bilirubin raises suspicion of bile duct obstruction',
              blockId: 'blood-tests',
            },
          ],
          link: { label: 'Investigations', page: 'investigations' },
        },
        {
          label: 'Imaging',
          extracts: [
            {
              text: 'The first-line imaging test: it shows gallstones and signs of inflammation such as gallbladder wall thickening and pericholecystic fluid, and can show a dilated bile duct',
              blockId: 'ultrasound',
            },
          ],
        },
        {
          label: 'MRCP',
          minimumLevel: 'foundation',
          extracts: [
            {
              text: 'MRCP is considered when ultrasound has not shown bile duct stones but the duct is dilated or liver function tests are abnormal',
              blockId: 'mrcp',
            },
          ],
        },
        {
          label: 'Team and initial care',
          minimumLevel: 'foundation',
          extracts: [
            {
              text: 'Arrange surgical assessment and senior help appropriate to severity and your competence',
              blockId: 'initial-care',
            },
            {
              text: 'Give intravenous fluids and analgesia; patients are usually kept nil by mouth at first',
              blockId: 'initial-care',
            },
          ],
        },
        {
          label: 'Checklist, VTE and prophylaxis',
          minimumLevel: 'foundation',
          extracts: [
            {
              text: 'Confirm the agreed procedure and perioperative plan during the safety checklist',
              blockId: 'operative-preparation',
            },
            {
              text: 'Assess VTE and bleeding risk and agree appropriate prophylaxis; give prophylactic antibiotics according to institutional protocol',
              blockId: 'operative-preparation',
            },
          ],
        },
        {
          label: 'Escalate',
          minimumLevel: 'foundation',
          extracts: [
            {
              text: 'Clinical deterioration or failure to improve with initial treatment should raise concern about complications such as gallbladder empyema, and prompt escalation for possible sepsis using the applicable pathway',
              blockId: 'deterioration',
            },
          ],
        },
      ],
      consent: [
        {
          label: 'Why and what',
          extracts: [
            {
              text: 'Explain why cholecystectomy is proposed and what the operation involves',
              blockId: 'supported-decision',
            },
          ],
        },
        {
          label: 'Alternatives',
          extracts: [
            {
              text: 'Discuss reasonable alternatives and what no treatment could mean; in acute cholecystitis, drainage of the gallbladder may be offered when surgery is not an option',
              blockId: 'supported-decision',
            },
          ],
        },
        {
          label: 'What patients are told',
          extracts: [
            {
              text: 'It is usually keyhole surgery under general anaesthetic through a few small cuts; open surgery is sometimes needed, for example if the gallbladder is very inflamed',
              blockId: 'patient-understanding',
            },
            {
              text: 'Risks include blood clots, wound infection, bile leak, stones left in the bile ducts and injury to the bile ducts or other organs; individual risk depends on age and general health',
              blockId: 'patient-understanding',
            },
          ],
        },
        {
          label: 'Risks to discuss',
          minimumLevel: 'cst',
          extracts: [
            {
              text: 'Discuss bleeding, infection, injury to the bile ducts or other organs, bile leak, retained stones and blood clots in relation to this patient, and explain that open surgery is sometimes needed',
              blockId: 'procedure-risks',
            },
          ],
        },
      ],
      after: [
        {
          label: 'Recovery',
          extracts: [
            {
              text: 'Many people go home on the same day; some need to stay overnight',
              blockId: 'recovery-basics',
            },
            {
              text: 'Shoulder-tip pain from retained carbon dioxide can occur and settles as the gas is absorbed',
              blockId: 'recovery-basics',
            },
          ],
        },
        {
          label: 'Red flags',
          extracts: [
            {
              text: 'Severe or worsening pain, yellowing of the skin or eyes, a high temperature or shivering, wound redness, swelling or pus, or leg swelling need prompt assessment',
              blockId: 'postoperative-warning',
            },
          ],
        },
        {
          label: 'Ward review',
          minimumLevel: 'foundation',
          extracts: [
            {
              text: 'Review observations, pain, the wounds and the operative findings; escalate deterioration promptly',
              blockId: 'postoperative-review',
            },
          ],
        },
        {
          label: 'Antibiotics',
          minimumLevel: 'foundation',
          extracts: [
            {
              text: 'Do not continue antibiotics routinely after surgery for uncomplicated cholecystitis when the source is controlled',
              blockId: 'postoperative-review',
            },
          ],
        },
        {
          label: 'Bile leak',
          minimumLevel: 'cst',
          extracts: [
            {
              text: 'A postoperative bile leak can present with vague pain, fever and raised bilirubin',
              blockId: 'bile-leak',
            },
          ],
        },
      ],
      gaps: [
        { section: 'before', blockId: 'preoperative-preparation-todo' },
        {
          section: 'consent',
          blockId: 'operation-consent-todo',
          belowLevel: 'cst',
        },
      ],
    },
  ],
  blockLinks: [
    {
      blockId: 'hepatocystic-triangle',
      links: [
        {
          label: 'In the operation: step 2 · exposing the triangle',
          page: 'laparoscopic-cholecystectomy',
          step: 2,
        },
        {
          label: 'Step 3 · the critical view of safety',
          page: 'laparoscopic-cholecystectomy',
          step: 3,
        },
      ],
    },
    {
      blockId: 'cystic-artery',
      links: [
        {
          label: 'In the operation: step 4 · clip & divide',
          page: 'laparoscopic-cholecystectomy',
          step: 4,
        },
      ],
    },
    {
      blockId: 'bile-duct-danger',
      links: [
        {
          label: 'Where it matters: step 3 · critical view of safety',
          page: 'laparoscopic-cholecystectomy',
          step: 3,
        },
        {
          label: 'Complications: bile duct injury',
          page: 'complications',
          blockId: 'complications-table',
        },
      ],
    },
    {
      blockId: 'complications-table',
      links: [
        {
          label: 'Danger in theatre: bile duct injury',
          page: 'anatomy',
          blockId: 'bile-duct-danger',
        },
        {
          label: 'Operation: the critical view of safety',
          page: 'laparoscopic-cholecystectomy',
          step: 3,
        },
        {
          label: 'Consent: risks to discuss',
          page: 'consent',
          blockId: 'procedure-risks',
        },
      ],
    },
    {
      blockId: 'procedure-risks',
      links: [
        {
          label: 'What changes the plan in theatre',
          page: 'laparoscopic-cholecystectomy',
          blockId: 'senior-help',
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
          label: 'The operation: final inspection (step 6)',
          page: 'laparoscopic-cholecystectomy',
          step: 6,
        },
      ],
    },
    {
      blockId: 'postoperative-warning',
      links: [
        {
          label: 'Complications after cholecystectomy',
          page: 'complications',
          blockId: 'complications-table',
        },
      ],
    },
    {
      blockId: 'triangle-question',
      links: [
        {
          label: 'Anatomy: hepatocystic triangle',
          page: 'anatomy',
          blockId: 'hepatocystic-triangle',
        },
        {
          label: 'In the operation: step 2',
          page: 'laparoscopic-cholecystectomy',
          step: 2,
        },
      ],
    },
    {
      blockId: 'cvs-question',
      links: [
        {
          label: 'In the operation: step 3',
          page: 'laparoscopic-cholecystectomy',
          step: 3,
        },
      ],
    },
    {
      blockId: 'conversion-question',
      links: [
        {
          label: 'What changes the plan',
          page: 'laparoscopic-cholecystectomy',
          blockId: 'senior-help',
        },
      ],
    },
    {
      blockId: 'no-cvs-question',
      links: [
        {
          label: 'What changes the plan',
          page: 'laparoscopic-cholecystectomy',
          blockId: 'senior-help',
        },
      ],
    },
    {
      blockId: 'bdi-question',
      links: [
        {
          label: 'What changes the plan',
          page: 'laparoscopic-cholecystectomy',
          blockId: 'senior-help',
        },
      ],
    },
  ],
} satisfies TopicExperience;
