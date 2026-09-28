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
    accessedAt: '2026-09-28',
  },
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
    accessedAt: '2026-09-28',
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
    accessedAt: '2026-09-28',
  },
  {
    id: 'nice-perioperative',
    organisation: 'NICE',
    title: 'Perioperative care in adults (NG180)',
    shortTitle: 'NICE NG180',
    year: 2020,
    url: 'https://www.nice.org.uk/guidance/ng180/chapter/Recommendations',
    evidenceType: 'guideline',
    notes: 'Adult perioperative guidance, not an appendicitis guideline.',
    accessedAt: '2026-09-28',
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
    accessedAt: '2026-09-28',
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
    accessedAt: '2026-09-28',
  },
  {
    id: 'wses-2025',
    organisation: 'World Society of Emergency Surgery',
    title:
      'Diagnosis and Treatment of Acute Appendicitis: 2025 Edition of the World Society of Emergency Surgery Jerusalem Guidelines',
    shortTitle: 'WSES 2025 edition',
    year: 2026,
    url: 'https://doi.org/10.1001/jamasurg.2025.6218',
    evidenceType: 'guideline',
    notes:
      'Published 28 January 2026 in JAMA Surgery. Latest edition verified for this draft. Accessible abstract used; detailed recommendation tables require clinician verification against the full text.',
    accessedAt: '2026-09-28',
  },
  {
    id: 'appac-follow-up',
    title:
      'Antibiotic Therapy for Uncomplicated Acute Appendicitis: Ten-Year Follow-Up of the APPAC Randomized Clinical Trial',
    shortTitle: 'APPAC follow-up',
    year: 2026,
    url: 'https://jamanetwork.com/journals/jama/fullarticle/2844116',
    evidenceType: 'primary-study',
    notes:
      'JAMA. Finnish trial follow-up in adults with CT-confirmed uncomplicated disease; its results are not universal eligibility criteria.',
    accessedAt: '2026-09-28',
  },
  {
    id: 'cochrane-mri',
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
    accessedAt: '2026-09-28',
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
    accessedAt: '2026-09-28',
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
    accessedAt: '2026-09-28',
    notes:
      'Superseded edition, retained only for severity terminology and documented definitional variation. Current management is linked to the verified 2025 edition (published 2026).',
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
] satisfies Reference[];
