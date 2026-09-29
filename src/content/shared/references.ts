import type { Reference } from '@/schemas/reference';

// Sources genuinely cited by more than one topic. A topic cites them by ID;
// its Evidence page lists only the shared sources it actually cites.
// Topic-specific sources stay in each topic's own references.ts.
export const sharedReferences = [
  {
    id: 'rcs-consent',
    organisation: 'Royal College of Surgeons of England',
    title: 'Consent: Supported Decision-Making — A Guide to Good Practice',
    shortTitle: 'RCS consent',
    year: 2016,
    url: 'https://www.rcseng.ac.uk/standards-and-research/standards-and-guidance/good-practice-guides/consent/',
    evidenceType: 'guideline',
    notes:
      'Current RCS consent resource links the 2016 guide; read alongside Good Surgical Practice 2025.',
    accessedAt: '2026-09-29',
  },
  {
    id: 'rcs-gsp',
    organisation: 'Royal College of Surgeons of England',
    title: 'Good Surgical Practice',
    shortTitle: 'RCS practice',
    year: 2025,
    url: 'https://www.rcseng.ac.uk/standards-and-research/good-surgical-practice/',
    evidenceType: 'guideline',
    notes:
      '2025 edition. Professional standards, supervision, records and continuity of care.',
    accessedAt: '2026-09-29',
  },
  {
    id: 'nice-perioperative',
    organisation: 'NICE',
    title: 'Perioperative care in adults (NG180)',
    shortTitle: 'NICE NG180',
    year: 2020,
    url: 'https://www.nice.org.uk/guidance/ng180/chapter/Recommendations',
    evidenceType: 'guideline',
    notes: 'Adult perioperative guidance, not a condition-specific guideline.',
    accessedAt: '2026-09-29',
  },
  {
    id: 'nice-vte',
    organisation: 'NICE',
    title:
      'Venous thromboembolism in over 16s: reducing the risk of hospital-acquired deep vein thrombosis or pulmonary embolism (NG89)',
    shortTitle: 'NICE NG89',
    year: 2018,
    url: 'https://www.nice.org.uk/guidance/ng89/chapter/recommendations',
    evidenceType: 'guideline',
    notes: 'Published 2018; updated 2019. VTE and bleeding risk assessment.',
    accessedAt: '2026-09-29',
  },
  {
    id: 'nice-sepsis',
    organisation: 'NICE',
    title:
      'Suspected sepsis in people aged 16 or over: recognition, assessment and early management (NG253)',
    shortTitle: 'NICE NG253',
    year: 2025,
    url: 'https://www.nice.org.uk/guidance/ng253',
    evidenceType: 'guideline',
    notes:
      'Published 19 November 2025. This adult pathway excludes pregnant/recently pregnant people; separate population pathways apply.',
    accessedAt: '2026-09-29',
  },
  {
    id: 'surgical-access-textbook',
    authors: ['Leandra A. Jelinek', 'Mia Marietta', 'Mark W. Jones'],
    title: 'Surgical Access Incisions',
    shortTitle: 'Textbook surgical access',
    publication: 'StatPearls',
    year: 2024,
    url: 'https://www.ncbi.nlm.nih.gov/sites/books/NBK541018/',
    evidenceType: 'textbook',
    notes:
      'StatPearls chapter updated 5 October 2024. Descriptive laparoscopic entry and abdominal-wall anatomy; not a procedure-specific guideline. Techniques vary by surgeon and setting.',
    accessedAt: '2026-09-29',
  },
] satisfies Reference[];
