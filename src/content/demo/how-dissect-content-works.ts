import type { z } from 'zod';
import { trainingLevels } from '@/lib/training-level';
import { topicSchema } from '@/schemas/topic';

const [student, foundation, cst, registrar] = trainingLevels;

export const howDissectContentWorks = {
  metadata: {
    id: 'how-dissect-content-works',
    slug: 'how-dissect-content-works',
    title: 'How Dissect content works',
    specialty: 'demo',
    categories: ['platform-guide'],
    summary:
      'A non-clinical demonstration of structured sections, learning depth and source access.',
    demoReviewedAt: '2026-09-28',
    keywords: ['demo', 'content', 'references'],
    aliases: ['Content engine demo'],
    contentKind: 'non-clinical-demo',
  },
  sections: [
    {
      id: 'overview',
      title: 'Overview',
      summary: 'One topic, several connected views.',
      blocks: [
        {
          id: 'introduction',
          type: 'prose',
          minimumLevel: student.id,
          paragraphs: [
            'This is a NON-CLINICAL demo. Every example describes the Dissect platform, not the care of a patient.',
          ],
        },
        {
          id: 'topic-definition',
          type: 'definition',
          minimumLevel: student.id,
          term: 'Structured topic',
          meaning:
            'An ordered collection of sections, content blocks and references.',
        },
        {
          id: 'core-points',
          type: 'keyPoints',
          minimumLevel: student.id,
          items: [
            'Navigate using section links.',
            'Choose your training level to explore different depths.',
            'Follow source badges to the reference list.',
          ],
        },
        {
          id: 'demo-warning',
          type: 'warning',
          minimumLevel: student.id,
          title: 'Demonstration only',
          text: 'This page contains no clinical guidance. The review date and evidence labels demonstrate metadata fields only.',
        },
      ],
    },
    {
      id: 'learning-depth',
      title: 'Learning depth',
      summary: 'Training level changes depth, not factual truth.',
      blocks: [
        {
          id: 'depth-intro',
          type: 'prose',
          minimumLevel: student.id,
          paragraphs: [
            'Core content stays visible at every level. You can also reveal all advanced examples without changing your selected level.',
          ],
        },
        {
          id: 'foundation-checklist',
          type: 'checklist',
          minimumLevel: foundation.id,
          title: 'Foundation example: exploring a topic',
          items: [
            'Read the section summary.',
            'Check the source attached to a statement.',
            'Return to the relevant section.',
          ],
        },
        {
          id: 'cst-table',
          type: 'table',
          minimumLevel: cst.id,
          caption: 'CST example: content structure',
          columns: ['Element', 'Purpose'],
          rows: [
            ['Section', 'Groups related blocks'],
            ['Reference ID', 'Connects a statement to its source'],
          ],
        },
        {
          id: 'registrar-pearl',
          type: 'clinicalPearl',
          minimumLevel: registrar.id,
          title: 'Registrar example: one content source',
          text: 'This reusable note style demonstrates the clinicalPearl block type using non-clinical text. Different views can use the same structured topic.',
        },
      ],
    },
    {
      id: 'sources',
      title: 'Sources and provenance',
      summary: 'Source links stay attached to the statements they support.',
      blocks: [
        {
          id: 'platform-claims',
          type: 'claimGroup',
          minimumLevel: student.id,
          claims: [
            {
              id: 'topic-centred-design',
              text: 'The Dissect blueprint places clinical topics at the centre of its information architecture.',
              minimumLevel: student.id,
              referenceIds: ['dissect-blueprint'],
            },
            {
              id: 'advanced-disclosure',
              text: 'Task 02 requires advanced content to remain intentionally revealable.',
              minimumLevel: registrar.id,
              referenceIds: ['content-engine-task'],
            },
          ],
        },
        {
          id: 'reference-note',
          type: 'sourceNote',
          minimumLevel: student.id,
          text: 'These sources are project specifications, not clinical evidence. Their evidence-type values exercise the schema and must not be interpreted as clinical authority.',
          referenceIds: ['dissect-blueprint', 'content-engine-task'],
        },
      ],
    },
  ],
  references: [
    {
      id: 'dissect-blueprint',
      organisation: 'Dissect project',
      title: 'Dissect v2 — Product & Technical Blueprint',
      publication: 'Repository README.md',
      year: 2026,
      url: 'https://github.com/ShadowCloud012/Dissect/blob/main/README.md',
      evidenceType: 'expert-consensus',
      notes:
        'Project specification. Evidence type is a non-clinical schema demonstration.',
    },
    {
      id: 'content-engine-task',
      organisation: 'Dissect project',
      title: 'Codex Task 02 — Build the structured content engine',
      publication: 'Repository CODEX_TASK_02.md',
      year: 2026,
      url: 'https://github.com/ShadowCloud012/Dissect/blob/main/CODEX_TASK_02.md',
      evidenceType: 'expert-consensus',
      notes:
        'Engineering requirements, not a clinical recommendation or evidence source.',
    },
  ],
} satisfies z.input<typeof topicSchema>;
