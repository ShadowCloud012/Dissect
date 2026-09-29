import type { TopicInput } from '@/schemas/topic';
import { presentationSections } from './presentation';
import { managementSections } from './management';
import { operativeCareSections } from './operative-care';
import { questionsEvidenceSections } from './questions-evidence';
import { references } from './references';
import { experience } from './experience';

export const acuteAppendicitis = {
  metadata: {
    id: 'acute-appendicitis',
    slug: 'acute-appendicitis',
    title: 'Acute appendicitis',
    specialty: 'general-surgery',
    categories: ['emergency-general-surgery', 'colorectal'],
    summary:
      'Assessment, management and operative understanding, with UK sources and progressively deeper learning.',
    keywords: [
      'appendicitis',
      'appendix',
      'appendicectomy',
      'right iliac fossa',
      'emergency general surgery',
    ],
    aliases: [
      'appendicitis',
      'acute appendix inflammation',
      'laparoscopic appendicectomy',
    ],
    contentKind: 'clinical',
    status: 'awaiting-review',
    clinicalReviewer: null,
    lastClinicallyReviewed: null,
  },
  sections: [
    ...presentationSections,
    ...managementSections,
    ...operativeCareSections,
    ...questionsEvidenceSections,
  ],
  references,
  experience,
} satisfies TopicInput;
