import type { Reference } from '@/schemas/reference';

export const references = [
  {
    id: 'nhs-appendicitis',
    organisation: 'NHS',
    title: 'Appendicitis',
    shortTitle: 'NHS overview',
    year: 2024,
    url: 'https://www.nhs.uk/conditions/appendicitis/',
    evidenceType: 'patient-information',
    notes:
      'Page reviewed 9 August 2024. Patient-facing overview; not a prescribing protocol.',
    accessedAt: '2026-09-29',
  },
  {
    id: 'nice-ssi',
    organisation: 'NICE',
    title: 'Surgical site infections: prevention and treatment (NG125)',
    shortTitle: 'NICE NG125',
    year: 2019,
    url: 'https://www.nice.org.uk/guidance/NG125/chapter/recommendations',
    evidenceType: 'guideline',
    notes:
      'Updated 2020. Prophylaxis and infection care; antibiotic selection follows local formulary.',
    accessedAt: '2026-09-28',
  },
  {
    id: 'nice-fluids',
    organisation: 'NICE',
    title: 'Intravenous fluid therapy in adults in hospital (CG174)',
    shortTitle: 'NICE CG174',
    year: 2013,
    url: 'https://www.nice.org.uk/guidance/cg174/evidence/full-guideline-pdf-191667999',
    evidenceType: 'guideline',
    notes:
      'Adult fluid assessment and reassessment; no universal fluid prescription is supplied here.',
    accessedAt: '2026-09-28',
  },
  {
    id: 'wses-2025',
    authors: ['Mauro Podda', 'Marco Ceresoli', 'Belinda De Simone'],
    publication: 'JAMA Surgery',
    organisation: 'World Society of Emergency Surgery',
    title:
      'Diagnosis and Treatment of Acute Appendicitis: 2025 Edition of the World Society of Emergency Surgery Jerusalem Guidelines',
    shortTitle: 'WSES 2025 edition',
    year: 2026,
    url: 'https://doi.org/10.1001/jamasurg.2025.6218',
    evidenceType: 'guideline',
    notes:
      'First three authors listed. Published 28 January 2026. Latest edition verified for this draft. Accessible abstract used; detailed recommendation tables require clinician verification against the full text.',
    accessedAt: '2026-09-28',
  },
  {
    id: 'appac-follow-up',
    authors: ['Paulina Salminen', 'Roosa Salminen', 'Johanna Kallio'],
    publication: 'JAMA',
    title:
      'Antibiotic Therapy for Uncomplicated Acute Appendicitis: Ten-Year Follow-Up of the APPAC Randomized Clinical Trial',
    shortTitle: 'APPAC follow-up',
    year: 2026,
    url: 'https://jamanetwork.com/journals/jama/fullarticle/2844116',
    evidenceType: 'primary-study',
    notes:
      'First three authors listed. Finnish trial follow-up in adults with CT-confirmed uncomplicated disease; its results are not universal eligibility criteria.',
    accessedAt: '2026-09-28',
  },
  {
    id: 'cochrane-mri',
    authors: ['D’Souza N', 'Hicks G', 'Beable R', 'Higginson A', 'Rud B'],
    publication: 'Cochrane Database of Systematic Reviews',
    organisation: 'Cochrane',
    title:
      'Magnetic resonance imaging (MRI) for diagnosis of acute appendicitis',
    shortTitle: 'Cochrane MRI',
    year: 2021,
    url: 'https://www.cochrane.org/evidence/CD012028_magnetic-resonance-imaging-mri-diagnosis-acute-appendicitis',
    evidenceType: 'systematic-review',
    notes:
      'Published 14 December 2021; searches to February 2021. Methodological limitations may bias diagnostic accuracy estimates.',
    accessedAt: '2026-09-28',
  },
  {
    id: 'leicester-appendicectomy',
    organisation: 'University Hospitals of Leicester NHS Trust',
    title: 'Having surgery to remove your appendix',
    shortTitle: 'Leicester patient leaflet',
    year: 2026,
    url: 'https://yourhealth.leicestershospitals.nhs.uk/library/chuggs/general-surgery/2494-having-surgery-to-remove-your-appendix/file',
    evidenceType: 'patient-information',
    notes:
      'Leaflet 1377, version 2, reviewed May 2026. Local patient information, not a national management pathway.',
    accessedAt: '2026-09-28',
  },
  {
    id: 'cuh-children',
    organisation: 'Cambridge University Hospitals NHS Foundation Trust',
    title: 'Appendicitis in children — information for parents and carers',
    shortTitle: 'CUH children',
    year: 2025,
    url: 'https://www.cuh.nhs.uk/patient-information/appendicitis-in-children-information-for-parents-and-carers/',
    evidenceType: 'patient-information',
    notes:
      'Version 5, approved 24 September 2025. High-level paediatric context; local treatment pathways are not generalised.',
    accessedAt: '2026-09-28',
  },
  {
    id: 'gstt-recovery',
    organisation: 'Guy’s and St Thomas’ NHS Foundation Trust',
    title:
      'Appendicectomy (surgery to remove the appendix) — Recovery after an appendicectomy',
    shortTitle: 'GSTT recovery',
    year: 2025,
    url: 'https://www.guysandstthomas.nhs.uk/health-information/appendicectomy/recovery-after-appendicectomy',
    evidenceType: 'patient-information',
    notes:
      'Reviewed July 2025. Recovery and safety-netting principles; no fixed discharge timetable adopted.',
    accessedAt: '2026-09-28',
  },
  {
    id: 'appendix-anatomy',
    title: 'Anatomy, Abdomen and Pelvis: Appendix',
    shortTitle: 'Textbook anatomy',
    year: 2023,
    url: 'https://www.ncbi.nlm.nih.gov/sites/books/NBK459205/',
    evidenceType: 'textbook',
    notes:
      'StatPearls chapter updated 8 August 2023. Descriptive anatomy, not a management guideline.',
    accessedAt: '2026-09-29',
  },
  {
    id: 'appendectomy-textbook',
    title: 'Appendectomy',
    shortTitle: 'Textbook operative principles',
    year: 2025,
    url: 'https://www.ncbi.nlm.nih.gov/sites/books/NBK580514/',
    evidenceType: 'textbook',
    notes:
      'StatPearls chapter updated 14 May 2025. Descriptive technique only; devices and strategies vary.',
    accessedAt: '2026-09-29',
  },
  {
    id: 'ileocolic-anatomy',
    authors: ['Adekunle E. Omole', 'Doug W. Byerly'],
    title: 'Anatomy, Abdomen and Pelvis: Ileocolic Artery',
    shortTitle: 'Textbook ileocolic anatomy',
    publication: 'StatPearls',
    year: 2026,
    url: 'https://www.ncbi.nlm.nih.gov/sites/books/NBK544262/',
    evidenceType: 'textbook',
    notes:
      'StatPearls chapter updated 13 May 2026. Current descriptive arterial anatomy (appendicular artery from the inferior branch of the ileocolic artery); supersedes older "ileocecal artery" wording used elsewhere.',
    accessedAt: '2026-09-29',
  },
  {
    id: 'appendicitis-textbook',
    title: 'Appendicitis',
    shortTitle: 'Textbook clinical features',
    year: 2024,
    url: 'https://www.ncbi.nlm.nih.gov/sites/books/NBK493193/',
    evidenceType: 'textbook',
    notes:
      'StatPearls chapter updated 12 February 2024. Used for examination, differentials and descriptive findings, not to override current guidelines.',
    accessedAt: '2026-09-28',
  },
  {
    id: 'wses-2020-terminology',
    organisation: 'World Society of Emergency Surgery',
    title:
      'Diagnosis and treatment of acute appendicitis: 2020 update of the WSES Jerusalem guidelines',
    shortTitle: 'WSES 2020 terminology',
    year: 2020,
    url: 'https://wjes.biomedcentral.com/articles/10.1186/s13017-020-00306-3',
    evidenceType: 'guideline',
    accessedAt: '2026-09-29',
    notes:
      'Superseded edition, retained only for severity terminology and documented definitional variation. Not used for current operative recommendations; current management is linked to the 2025 edition (published 2026).',
  },
  {
    id: 'nhs-anaesthesia',
    organisation: 'NHS',
    title: 'General anaesthetic',
    shortTitle: 'NHS anaesthesia',
    year: 2024,
    url: 'https://www.nhs.uk/tests-and-treatments/general-anaesthesia/',
    evidenceType: 'patient-information',
    accessedAt: '2026-09-28',
    notes:
      'Page reviewed 29 November 2024. Patient-facing preparation, recovery and adverse effects.',
  },
  {
    id: 'wses-source-control',
    title:
      'Source control in emergency general surgery: WSES, GAIS, SIS-E, SIS-A guidelines',
    shortTitle: 'Surgical source control',
    authors: ['Federico Coccolini', 'Massimo Sartelli', 'Robert Sawyer'],
    publication: 'World Journal of Emergency Surgery',
    year: 2023,
    url: 'https://doi.org/10.1186/s13017-023-00509-4',
    evidenceType: 'guideline',
    notes:
      'First three authors listed. Published 21 July 2023. Full-text principles of diffuse peritonitis, source control and resuscitation; not a UK appendicitis-specific protocol.',
    accessedAt: '2026-09-28',
  },
  {
    id: 'nice-antimicrobial-stewardship',
    organisation: 'NICE',
    title:
      'Antimicrobial stewardship: systems and processes for effective antimicrobial medicine use (NG15)',
    shortTitle: 'NICE NG15',
    year: 2015,
    url: 'https://www.nice.org.uk/guidance/ng15/chapter/recommendations',
    evidenceType: 'guideline',
    notes:
      'Recommendations 1.1.24, 1.1.27 and 1.1.35–36: local/national guidance, microbiology, individual prescribing factors and documented departures. Not an appendicitis regimen.',
    accessedAt: '2026-09-28',
  },
] satisfies Reference[];
