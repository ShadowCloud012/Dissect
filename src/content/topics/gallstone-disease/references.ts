import type { Reference } from '@/schemas/reference';

export const references = [
  {
    id: 'nice-gallstones',
    organisation: 'NICE',
    title: 'Gallstone disease: diagnosis and management (CG188)',
    shortTitle: 'NICE CG188',
    year: 2014,
    url: 'https://www.nice.org.uk/guidance/cg188/chapter/Recommendations',
    evidenceType: 'guideline',
    notes:
      'Published 29 October 2014. UK recommendations for diagnosis, gallbladder and bile duct stones, and patient information.',
    accessedAt: '2026-09-29',
  },
  {
    id: 'wses-cholecystitis',
    authors: ['Michele Pisano', 'Niccolò Allievi', 'Kurinchi Gurusamy'],
    organisation: 'World Society of Emergency Surgery',
    publication: 'World Journal of Emergency Surgery',
    title:
      '2020 World Society of Emergency Surgery updated guidelines for the diagnosis and treatment of acute calculus cholecystitis',
    shortTitle: 'WSES 2020 cholecystitis',
    year: 2020,
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7643471/',
    evidenceType: 'guideline',
    notes:
      'First three authors listed. Current WSES edition for acute calculous cholecystitis (open-access full text read). Not UK-specific.',
    accessedAt: '2026-09-29',
  },
  {
    id: 'safe-cholecystectomy',
    authors: ['L. Michael Brunt', 'Daniel J. Deziel', 'Dana A. Telem'],
    publication: 'Annals of Surgery',
    title:
      'Safe Cholecystectomy Multi-society Practice Guideline and State of the Art Consensus Conference on Prevention of Bile Duct Injury During Cholecystectomy',
    shortTitle: 'Multi-society safe cholecystectomy',
    year: 2020,
    url: 'https://www.sages.org/publications/guidelines/safe-cholecystectomy-multi-society-practice-guideline/',
    evidenceType: 'guideline',
    notes:
      'First three authors listed. SAGES, AHPBA, IHPBA, SSAT and EAES; published in Annals of Surgery (doi:10.1097/SLA.0000000000003791). Full text read on the SAGES site. Most recommendations are conditional or expert opinion because of low-certainty evidence; strong recommendations cover biliary imaging for uncertain anatomy or suspected injury, and referral after bile duct injury.',
    accessedAt: '2026-09-29',
  },
  {
    id: 'lapchole-textbook',
    authors: ['Uzair Asad', 'Cecily F. Wang', 'Mark W. Jones'],
    publication: 'StatPearls',
    title: 'Laparoscopic Cholecystectomy',
    shortTitle: 'Textbook laparoscopic cholecystectomy',
    year: 2025,
    url: 'https://www.ncbi.nlm.nih.gov/sites/books/NBK448145/',
    evidenceType: 'textbook',
    notes:
      'StatPearls chapter updated 2 July 2025. Descriptive anatomy and technique; not a guideline. Port positions, devices and closure vary.',
    accessedAt: '2026-09-29',
  },
  {
    id: 'gallbladder-anatomy-textbook',
    authors: ['Mark W. Jones', 'Bradley Boget', 'Tafline C. Arbor'],
    publication: 'StatPearls',
    title: 'Anatomy, Abdomen and Pelvis: Gallbladder',
    shortTitle: 'Textbook gallbladder anatomy',
    year: 2026,
    url: 'https://www.ncbi.nlm.nih.gov/sites/books/NBK459288/',
    evidenceType: 'textbook',
    notes:
      'First three authors listed. StatPearls chapter updated 5 July 2026. Descriptive anatomy, including the original and modern boundaries of the hepatocystic triangle.',
    accessedAt: '2026-09-29',
  },
  {
    id: 'cholecystitis-textbook',
    authors: ['Mark W. Jones', 'Gregory Santos', 'Parth J. Patel'],
    publication: 'StatPearls',
    title: 'Acute Cholecystitis',
    shortTitle: 'Textbook acute cholecystitis',
    year: 2025,
    url: 'https://www.ncbi.nlm.nih.gov/sites/books/NBK459171/',
    evidenceType: 'textbook',
    notes:
      'StatPearls chapter updated 6 July 2025. Descriptive clinical features, differentials and recovery; not a guideline.',
    accessedAt: '2026-09-29',
  },
  {
    id: 'nhs-gallstones',
    organisation: 'NHS',
    title: 'Gallstones',
    shortTitle: 'NHS gallstones',
    year: 2025,
    url: 'https://www.nhs.uk/conditions/gallstones/',
    evidenceType: 'patient-information',
    notes: 'Page reviewed 11 August 2025. Patient-facing overview.',
    accessedAt: '2026-09-29',
  },
  {
    id: 'nhs-cholecystitis',
    organisation: 'NHS',
    title: 'Acute cholecystitis',
    shortTitle: 'NHS cholecystitis',
    year: 2023,
    url: 'https://www.nhs.uk/conditions/acute-cholecystitis/',
    evidenceType: 'patient-information',
    notes:
      'Page reviewed 21 February 2023; its stated review date (February 2026) has passed. Patient-facing overview.',
    accessedAt: '2026-09-29',
  },
  {
    id: 'nhs-gallbladder-removal',
    organisation: 'NHS',
    title: 'Gallbladder removal',
    shortTitle: 'NHS gallbladder removal',
    year: 2025,
    url: 'https://www.nhs.uk/tests-and-treatments/gallbladder-removal/',
    evidenceType: 'patient-information',
    notes:
      'Pages reviewed 3 July 2025 (why, preparation, how it is done, recovery, complications). Patient information, not a protocol.',
    accessedAt: '2026-09-29',
  },
] satisfies Reference[];
