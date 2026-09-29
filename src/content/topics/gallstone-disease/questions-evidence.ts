import type { TopicSection } from '@/schemas/topic';

export const questionsEvidenceSections = [
  {
    id: 'hot-seat',
    title: 'Hot Seat',
    summary:
      'Check your understanding of the case and the operation. Answers deepen with training level; reveal advanced content to read every question.',
    blocks: [
      {
        id: 'imaging-question',
        type: 'question',
        minimumLevel: 'medical-student',
        question:
          'What is the first-line imaging test for suspected gallstone disease?',
        answer:
          'Ultrasound, alongside liver function tests; it shows gallstones and signs of gallbladder inflammation.',
        referenceIds: ['nice-gallstones', 'wses-cholecystitis'],
      },
      {
        id: 'triangle-question',
        type: 'question',
        minimumLevel: 'medical-student',
        question: 'What are the borders of the hepatocystic triangle?',
        answer:
          'The cystic duct, the common hepatic duct and the edge of the liver.',
        referenceIds: ['lapchole-textbook'],
      },
      {
        id: 'timing-question',
        type: 'question',
        minimumLevel: 'foundation',
        question:
          'When is laparoscopic cholecystectomy offered for acute cholecystitis?',
        answer:
          'Early: within 1 week of diagnosis, when the patient is suitable.',
        referenceIds: ['nice-gallstones'],
      },
      {
        id: 'review-question',
        type: 'question',
        minimumLevel: 'foundation',
        question: 'Which symptoms after cholecystectomy need prompt review?',
        answer:
          'Severe or worsening pain, jaundice, fever or shivering, wound infection signs, or leg swelling; leg swelling with breathlessness or chest pain needs emergency care.',
        referenceIds: ['nhs-gallbladder-removal'],
      },
      {
        id: 'cvs-question',
        type: 'question',
        minimumLevel: 'cst',
        question:
          'What are the three components of the critical view of safety?',
        answer:
          'All fibrofatty tissue cleared from the hepatocystic triangle; two, and only two, structures entering the gallbladder; and the lower third of the gallbladder separated from the liver bed to expose the cystic plate.',
        referenceIds: ['lapchole-textbook'],
      },
      {
        id: 'conversion-question',
        type: 'question',
        minimumLevel: 'cst',
        question: 'Is conversion to open cholecystectomy a failure?',
        answer:
          'No. It is a judicious decision, recommended for severe inflammation, adhesions, bleeding in the hepatocystic triangle or suspected bile duct injury.',
        referenceIds: ['wses-cholecystitis', 'lapchole-textbook'],
      },
      {
        id: 'no-cvs-question',
        type: 'question',
        minimumLevel: 'registrar',
        question:
          'What are the options when the critical view of safety cannot be obtained?',
        answer:
          'Intraoperative biliary imaging when the anatomy is uncertain, and a low threshold for calling another surgeon for help; if the anatomy still cannot be defined, the multi-society guideline suggests considering subtotal cholecystectomy. These suggestions rest largely on expert opinion or very low-certainty evidence.',
        referenceIds: ['safe-cholecystectomy'],
      },
      {
        id: 'bdi-question',
        type: 'question',
        minimumLevel: 'registrar',
        question:
          'What should happen when a bile duct injury is suspected or confirmed?',
        answer:
          'Referral to an experienced surgeon or multispecialty hepatobiliary team; suspected injury is also a reason to consider conversion.',
        referenceIds: ['safe-cholecystectomy', 'wses-cholecystitis'],
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
        text: 'NICE CG188 is the UK gallstone guideline. WSES 2020 is the current WSES guideline for acute calculous cholecystitis and is not UK-specific. The multi-society safe cholecystectomy guideline was read in full; most of its recommendations are conditional or expert opinion because the evidence is of low certainty. StatPearls chapters supply descriptive anatomy and technique, not recommendations. NHS pages provide labelled patient information.',
        referenceIds: [],
      },
      {
        id: 'evidence-limitations',
        type: 'sourceNote',
        minimumLevel: 'medical-student',
        text: 'Clinical-review TODO: verify the Tokyo Guidelines 2018 diagnostic and severity criteria (not reproduced here) and confirm the critical view criteria against the primary description. Antibiotic choices, prophylaxis timing and some imaging pathways depend on local policy; no numerical risks are given.',
        referenceIds: [],
      },
    ],
  },
] satisfies TopicSection[];
