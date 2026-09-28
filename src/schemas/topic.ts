import { z } from 'zod';
import { contentBlockSchema } from './content-block';
import { referenceSchema } from './reference';
import { dateSchema, stableIdSchema, textSchema } from './shared';
import { topicExperienceSchema } from './topic-experience';

const metadataFields = {
  id: stableIdSchema,
  slug: stableIdSchema,
  title: textSchema,
  specialty: stableIdSchema,
  categories: z
    .array(stableIdSchema)
    .min(1)
    .refine((ids) => new Set(ids).size === ids.length, 'Duplicate category ID'),
  summary: textSchema,
  keywords: z.array(textSchema).min(1),
  aliases: z.array(textSchema).optional(),
};
export const topicMetadataSchema = z.discriminatedUnion('contentKind', [
  z.strictObject({
    ...metadataFields,
    contentKind: z.literal('non-clinical-demo'),
    demoReviewedAt: dateSchema,
  }),
  z
    .strictObject({
      ...metadataFields,
      contentKind: z.literal('clinical'),
      status: z.enum(['draft', 'awaiting-review', 'clinically-reviewed']),
      clinicalReviewer: textSchema.nullable(),
      lastClinicallyReviewed: dateSchema.nullable(),
    })
    .superRefine((metadata, context) => {
      if (metadata.status === 'clinically-reviewed') {
        if (!metadata.clinicalReviewer)
          context.addIssue({
            code: 'custom',
            path: ['clinicalReviewer'],
            message: 'Clinically reviewed content requires a named reviewer',
          });
        if (!metadata.lastClinicallyReviewed)
          context.addIssue({
            code: 'custom',
            path: ['lastClinicallyReviewed'],
            message: 'Clinically reviewed content requires a review date',
          });
      } else if (
        metadata.clinicalReviewer !== null ||
        metadata.lastClinicallyReviewed !== null
      ) {
        context.addIssue({
          code: 'custom',
          path: ['status'],
          message: 'Unreviewed content must not imply clinical sign-off',
        });
      }
    }),
]);
export const topicSectionSchema = z.strictObject({
  id: stableIdSchema,
  title: textSchema,
  summary: textSchema.optional(),
  showReferences: z.boolean().optional(),
  blocks: z.array(contentBlockSchema).min(1),
});
export const topicSchema = z
  .strictObject({
    metadata: topicMetadataSchema,
    sections: z.array(topicSectionSchema).min(1),
    references: z.array(referenceSchema),
    experience: topicExperienceSchema.optional(),
  })
  .superRefine((topic, context) => {
    if (topic.experience) {
      const experience = topic.experience;
      const pageIds = new Set(experience.pages.map((page) => page.slug));
      const blocks = topic.sections.flatMap((section) => section.blocks);
      const fail = (message: string) =>
        context.addIssue({ code: 'custom', path: ['experience'], message });
      if (pageIds.size !== experience.pages.length) fail('Duplicate page slug');
      if (!pageIds.has('evidence'))
        fail('Topic experience requires an evidence page');
      if (!topic.sections.some((section) => section.id === 'overview'))
        fail('Topic experience requires an overview section');
      const assigned = experience.pages.flatMap((page) => page.sectionIds);
      if (new Set(assigned).size !== assigned.length)
        fail('Sections must have one subpage owner');
      for (const id of assigned)
        if (!topic.sections.some((section) => section.id === id))
          fail(`Unknown section: ${id}`);
      for (const section of topic.sections)
        if (section.id !== 'overview' && !assigned.includes(section.id))
          fail(`Unassigned section: ${section.id}`);
      for (const selection of experience.quickReference) {
        const block = blocks.find((block) => block.id === selection.blockId);
        const page = experience.pages.find(
          (page) => page.slug === selection.page,
        );
        if (!block || !page) {
          fail('Unknown quick-reference block/page');
          continue;
        }
        if (block.type === 'question' || block.type === 'claimGroup')
          fail('Quick reference requires a concise factual block');
        if (
          !topic.sections.some(
            (section) =>
              page.sectionIds.includes(section.id) &&
              section.blocks.includes(block),
          )
        )
          fail('Quick reference must link to its owning page');
        if (
          selection.itemIndex !== undefined &&
          (!('items' in block) || selection.itemIndex >= block.items.length)
        )
          fail('Invalid quick-reference item index');
      }
      for (const contextPanel of experience.contexts)
        for (const link of contextPanel.links)
          if (!pageIds.has(link.page))
            fail(`Unknown related page: ${link.page}`);
      const styled = experience.presentation.map((item) => item.blockId);
      if (new Set(styled).size !== styled.length)
        fail('Duplicate presentation block');
      for (const item of experience.presentation) {
        const block = blocks.find((block) => block.id === item.blockId);
        if (!block) fail(`Unknown presentation block: ${item.blockId}`);
        if (
          item.itemLabels &&
          (!block ||
            !('items' in block) ||
            item.itemLabels.length !== block.items.length)
        )
          fail('Item labels must match authored items');
        if (
          (item.variant === 'steps' || item.variant === 'consent') &&
          block?.type !== 'checklist'
        )
          fail('Steps/consent require a checklist');
        if (item.variant === 'complications' && block?.type !== 'table')
          fail('Complications require a table');
        if (
          item.variant === 'cards' &&
          (!block || !('items' in block) || !item.itemLabels)
        )
          fail('Cards require a list block with item labels');
      }
      const pageOwnsBlock = (pageSlug: string, blockId: string) => {
        const page = experience.pages.find((entry) => entry.slug === pageSlug);
        return topic.sections.some(
          (section) =>
            page?.sectionIds.includes(section.id) &&
            section.blocks.some((block) => block.id === blockId),
        );
      };
      for (const pathway of experience.pathways) {
        if (!pageIds.has(pathway.page))
          fail(`Unknown pathway page: ${pathway.page}`);
        for (const node of [...pathway.steps, ...pathway.branches])
          if (!pageOwnsBlock(pathway.page, node.blockId))
            fail(`Pathway block must belong to its page: ${node.blockId}`);
      }
      for (const related of experience.related)
        if (!pageIds.has(related.page))
          fail(`Unknown related page: ${related.page}`);
    }
    if (
      topic.metadata.contentKind === 'clinical' &&
      topic.references.length === 0
    )
      context.addIssue({
        code: 'custom',
        path: ['references'],
        message: 'Clinical topics require references',
      });
    if (topic.sections.filter((section) => section.showReferences).length > 1)
      context.addIssue({
        code: 'custom',
        path: ['sections'],
        message: 'Only one section may display the reference list',
      });
    const references = new Set(
      topic.references.map((reference) => reference.id),
    );
    const seen = new Set<string>();
    function unique(kind: string, id: string, path: (string | number)[]) {
      const key = `${kind}:${id}`;
      if (seen.has(key))
        context.addIssue({
          code: 'custom',
          path,
          message: `Duplicate ${kind} ID: ${id}`,
        });
      seen.add(key);
    }
    function checkReferences(ids: string[], path: (string | number)[]) {
      ids.forEach((id, index) => {
        if (!references.has(id))
          context.addIssue({
            code: 'custom',
            path: [...path, index],
            message: `Unknown reference ID: ${id}`,
          });
      });
    }
    topic.references.forEach((reference, index) =>
      unique('reference', reference.id, ['references', index, 'id']),
    );
    topic.sections.forEach((section, sectionIndex) => {
      const sectionPath = ['sections', sectionIndex];
      unique('section', section.id, [...sectionPath, 'id']);
      section.blocks.forEach((block, blockIndex) => {
        const path = [...sectionPath, 'blocks', blockIndex];
        unique('block', block.id, [...path, 'id']);
        checkReferences(block.referenceIds, [...path, 'referenceIds']);
        if (
          topic.metadata.contentKind === 'clinical' &&
          block.type !== 'sourceNote' &&
          block.type !== 'claimGroup' &&
          block.referenceIds.length === 0
        )
          context.addIssue({
            code: 'custom',
            path: [...path, 'referenceIds'],
            message:
              'Clinical content requires a reference; use sourceNote only for editorial notes',
          });
        if (block.type === 'claimGroup')
          block.claims.forEach((claim, claimIndex) => {
            unique('claim', claim.id, [...path, 'claims', claimIndex, 'id']);
            checkReferences(claim.referenceIds, [
              ...path,
              'claims',
              claimIndex,
              'referenceIds',
            ]);
          });
      });
    });
  });
export type Topic = z.infer<typeof topicSchema>;
export type TopicMetadata = z.infer<typeof topicMetadataSchema>;
export type TopicSection = z.infer<typeof topicSectionSchema>;

export function validateTopic(input: unknown, context = 'topic'): Topic {
  const result = topicSchema.safeParse(input);
  if (!result.success) {
    throw new Error(
      `Invalid content in ${context}:\n${result.error.issues.map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`).join('\n')}`,
    );
  }
  return result.data;
}
