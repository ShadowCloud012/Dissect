import type { TopicInput } from '@/schemas/topic';
import { clinicalSections } from './clinical';
import { operativeSections } from './operative';
import { questionsEvidenceSections } from './questions-evidence';
import { references } from './references';
import { experience } from './experience';

// One condition topic for the gallstone spectrum (biliary colic through acute
// cholecystitis), following NICE CG188: splitting it would duplicate the
// investigations, management and the same operation.
export const gallstoneDisease = {
  metadata: {
    id: 'gallstone-disease',
    slug: 'gallstone-disease',
    title: 'Gallstone disease and acute cholecystitis',
    specialty: 'general-surgery',
    categories: ['emergency-general-surgery', 'hpb'],
    summary:
      'Biliary colic and acute cholecystitis: assessment, investigation, management and the operation, with UK sources.',
    keywords: [
      'gallstones',
      'gallbladder',
      'right upper quadrant pain',
      'cholelithiasis',
      'emergency general surgery',
    ],
    aliases: [
      'acute cholecystitis',
      'cholecystitis',
      'gallstones',
      'biliary colic',
      'cholelithiasis',
      'symptomatic gallstones',
    ],
    contentKind: 'clinical',
    procedures: [
      {
        id: 'laparoscopic-cholecystectomy',
        title: 'Laparoscopic cholecystectomy',
        page: 'laparoscopic-cholecystectomy',
        summary:
          'Theatre prep, the critical view of safety, danger areas and what changes the plan.',
        aliases: [
          'lap chole',
          'cholecystectomy',
          'laparoscopic cholecystectomy',
          'gallbladder removal',
          'keyhole gallbladder surgery',
        ],
        keywords: [
          'critical view of safety',
          'hepatocystic triangle',
          'bile duct injury',
        ],
      },
    ],
    status: 'awaiting-review',
    clinicalReviewer: null,
    lastClinicallyReviewed: null,
  },
  sections: [
    ...clinicalSections,
    ...operativeSections,
    ...questionsEvidenceSections,
  ],
  references,
  experience,
} satisfies TopicInput;
