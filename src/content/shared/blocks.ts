import type { SharedBlockDefinition } from '@/lib/shared-content';

// Content whose clinical meaning, wording and sources are the same in every
// procedure that includes it. A topic includes a block explicitly with
// `{ include: '<id>' }`; it is never inherited or merged. `walkthroughFields`
// lists the operative-walkthrough roles each block has been reviewed for.
// Anything with procedure-specific nuance stays in its topic.
export const sharedBlocks = [
  {
    walkthroughFields: [],
    block: {
      id: 'operative-disclaimer',
      type: 'sourceNote',
      minimumLevel: 'medical-student',
      text: 'Operative learning only: this outline supports understanding and discussion with a supervisor. It does not replace supervised surgical training or a patient-specific operative plan.',
      referenceIds: [],
    },
  },
  {
    // Laparoscopic entry anatomy, independent of the operation that follows:
    // a Danger at access, not a procedure-specific Why.
    walkthroughFields: ['danger'],
    block: {
      id: 'abdominal-wall-access',
      type: 'prose',
      minimumLevel: 'medical-student',
      paragraphs: [
        'During secondary port placement the superficial and inferior epigastric and circumflex vessels of the abdominal wall are at risk. Their course varies, so no surface "safe zone" is reliable; transillumination and placing ports under direct vision help avoid them.',
        'Operative texts describe decompressing the bladder and stomach before the first trocar is inserted; practice varies. Adhesions from inflammation or previous surgery can make structures beneath the entry site more vulnerable.',
      ],
      referenceIds: ['surgical-access-textbook'],
    },
  },
] satisfies SharedBlockDefinition[];
