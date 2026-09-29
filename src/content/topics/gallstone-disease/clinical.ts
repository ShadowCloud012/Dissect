import type { TopicSection } from '@/schemas/topic';

export const clinicalSections = [
  {
    id: 'overview',
    title: 'Overview',
    blocks: [
      {
        id: 'definition',
        type: 'definition',
        minimumLevel: 'medical-student',
        term: 'Acute cholecystitis',
        meaning:
          'Inflammation of the gallbladder, usually when a gallstone blocks the cystic duct; it is potentially serious because of the risk of complications.',
        referenceIds: ['nhs-cholecystitis'],
      },
      {
        id: 'biliary-colic-definition',
        type: 'definition',
        minimumLevel: 'medical-student',
        term: 'Biliary colic',
        meaning:
          'Pain caused when a gallstone blocks a bile duct; most gallstones cause no symptoms.',
        referenceIds: ['nhs-gallstones'],
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
            'Right upper abdominal or epigastric pain, often after fatty meals, which may spread to the right shoulder or back; persistent pain suggests acute cholecystitis.',
          ],
          [
            'Why urgent?',
            'Acute cholecystitis can progress to gangrene or perforation, with peritonitis or an abscess.',
          ],
          [
            'How assessed?',
            'History, examination, blood tests including liver function tests, and ultrasound.',
          ],
          [
            'Broad treatment?',
            'Laparoscopic cholecystectomy for symptomatic gallstones, and early surgery for acute cholecystitis when suitable.',
          ],
        ],
        referenceIds: [
          'lapchole-textbook',
          'nhs-cholecystitis',
          'nice-gallstones',
        ],
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
          'Biliary colic: severe, often constant pain in the upper middle or right upper abdomen, lasting from over 30 minutes to several hours, sometimes with nausea or vomiting.',
          'Acute cholecystitis: sudden, persistent right upper quadrant pain that may spread towards the right shoulder, is worse on deep breathing and does not settle within a few hours.',
          'Associated features can include fever, nausea, vomiting, sweating, loss of appetite and jaundice.',
        ],
        referenceIds: ['nhs-gallstones', 'nhs-cholecystitis'],
      },
      {
        id: 'risk-factors',
        type: 'keyPoints',
        minimumLevel: 'medical-student',
        items: [
          'Gallstones are more likely in people over 40, women, people living with obesity, after rapid weight loss, and with conditions such as diabetes or Crohn’s disease.',
        ],
        referenceIds: ['nhs-gallstones'],
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
          'Look for right upper quadrant tenderness and Murphy’s sign: pain and inspiratory arrest as the gallbladder descends onto the examining hand during a deep breath. No single clinical or laboratory finding establishes or excludes acute cholecystitis, so combine history, examination, blood tests and imaging.',
        ],
        referenceIds: [
          'wses-cholecystitis',
          'nhs-cholecystitis',
          'cholecystitis-textbook',
        ],
      },
      {
        id: 'deterioration',
        type: 'warning',
        minimumLevel: 'foundation',
        title: 'Recognise deterioration',
        text: 'Clinical deterioration or failure to improve with initial treatment should raise concern about complications such as gallbladder empyema, and prompt escalation for possible sepsis using the applicable pathway.',
        referenceIds: ['cholecystitis-textbook', 'nice-sepsis'],
      },
      {
        id: 'gallstone-complications',
        type: 'keyPoints',
        minimumLevel: 'medical-student',
        items: [
          'Gallstones can cause cholecystitis, pancreatitis and jaundice.',
          'Acute cholecystitis can lead to gangrene of the gallbladder or perforation, which can spread infection within the abdomen (peritonitis) or form an abscess.',
        ],
        referenceIds: ['nhs-gallstones', 'nhs-cholecystitis'],
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
        caption: 'Consider alternatives when the pattern does not fit',
        columns: ['Group', 'Examples to consider'],
        rows: [
          [
            'Biliary',
            'Biliary colic, bile duct stones (choledocholithiasis), cholangitis',
          ],
          ['Pancreatic and hepatic', 'Pancreatitis, hepatitis'],
          [
            'Upper gastrointestinal',
            'Gastritis, peptic ulcer disease, hiatus hernia',
          ],
          [
            'Other',
            'Appendicitis, mesenteric ischaemia, small bowel obstruction; the presentation can resemble cardiac conditions',
          ],
        ],
        referenceIds: ['cholecystitis-textbook'],
      },
    ],
  },
  {
    id: 'investigations',
    title: 'Investigations',
    blocks: [
      {
        id: 'blood-tests',
        type: 'keyPoints',
        minimumLevel: 'medical-student',
        items: [
          'Liver function tests are offered with ultrasound to people with suspected gallstone disease.',
          'A raised CRP and white cell count support acute cholecystitis but do not establish it on their own.',
          'Raised bilirubin raises suspicion of bile duct obstruction; check amylase or lipase if pancreatitis is possible.',
        ],
        referenceIds: [
          'nice-gallstones',
          'wses-cholecystitis',
          'cholecystitis-textbook',
        ],
      },
      {
        id: 'liver-tests-caution',
        type: 'prose',
        minimumLevel: 'foundation',
        paragraphs: [
          'Abnormal liver function tests or bilirubin alone should not be used to identify bile duct stones; they prompt further assessment.',
        ],
        referenceIds: ['wses-cholecystitis'],
      },
    ],
  },
  {
    id: 'imaging',
    title: 'Imaging',
    blocks: [
      {
        id: 'ultrasound',
        type: 'definition',
        minimumLevel: 'medical-student',
        term: 'Ultrasound',
        meaning:
          'The first-line imaging test: it shows gallstones and signs of inflammation such as gallbladder wall thickening and pericholecystic fluid, and can show a dilated bile duct.',
        referenceIds: [
          'nice-gallstones',
          'wses-cholecystitis',
          'cholecystitis-textbook',
        ],
      },
      {
        id: 'mrcp',
        type: 'prose',
        minimumLevel: 'foundation',
        paragraphs: [
          'MRCP is considered when ultrasound has not shown bile duct stones but the duct is dilated or liver function tests are abnormal; endoscopic ultrasound is considered if MRCP does not allow a diagnosis.',
        ],
        referenceIds: ['nice-gallstones'],
      },
      {
        id: 'further-imaging',
        type: 'prose',
        minimumLevel: 'cst',
        paragraphs: [
          'Further imaging is used in selected patients according to local expertise and availability: HIDA scanning is the most accurate for acute cholecystitis but is limited by resources, MRI is as accurate as ultrasound, and CT is less accurate.',
        ],
        localPolicyMayVary: true,
        referenceIds: ['wses-cholecystitis'],
      },
    ],
  },
  {
    id: 'management',
    title: 'Management',
    blocks: [
      {
        id: 'initial-care',
        type: 'checklist',
        minimumLevel: 'foundation',
        title: 'Initial care for acute cholecystitis',
        items: [
          'Arrange surgical assessment and senior help appropriate to severity and your competence.',
          'Give intravenous fluids and analgesia; patients are usually kept nil by mouth at first.',
          'Give antibiotics according to local policy when infection is suspected.',
        ],
        localPolicyMayVary: true,
        referenceIds: [
          'rcs-gsp',
          'nhs-cholecystitis',
          'cholecystitis-textbook',
        ],
      },
      {
        id: 'surgery-indications',
        type: 'keyPoints',
        minimumLevel: 'medical-student',
        items: [
          'People with symptomatic gallbladder stones are offered laparoscopic cholecystectomy.',
          'People with acute cholecystitis are offered early laparoscopic cholecystectomy, within 1 week of diagnosis.',
          'Asymptomatic stones in a normal gallbladder and biliary tree do not need treatment unless symptoms develop.',
          'Planned laparoscopic cholecystectomy is offered as a day case unless circumstances or clinical condition make an inpatient stay necessary.',
        ],
        referenceIds: ['nice-gallstones'],
      },
      {
        id: 'bile-duct-stones',
        type: 'prose',
        minimumLevel: 'cst',
        paragraphs: [
          'Bile duct stones are cleared alongside laparoscopic cholecystectomy, either surgically during the operation or by ERCP before or during it.',
        ],
        referenceIds: ['nice-gallstones'],
      },
      {
        id: 'not-fit-for-surgery',
        type: 'prose',
        minimumLevel: 'cst',
        paragraphs: [
          'Percutaneous cholecystostomy is offered for gallbladder empyema when surgery is contraindicated and conservative management has failed, and cholecystectomy is reconsidered once the patient is well enough. WSES recommends gallbladder drainage for patients not suitable for surgery and advises avoiding laparoscopic cholecystectomy in septic shock or with absolute anaesthetic contraindications.',
        ],
        referenceIds: ['nice-gallstones', 'wses-cholecystitis'],
      },
    ],
  },
] satisfies TopicSection[];
