import { z } from 'zod';
import { contentBlockSchema } from './content-block';
import { referenceSchema } from './reference';
import { dateSchema, stableIdSchema, textSchema } from './shared';

const metadataFields = {
  id: stableIdSchema,
  slug: stableIdSchema,
  title: textSchema,
  specialty: stableIdSchema,
  category: textSchema,
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
  })
  .superRefine((topic, context) => {
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
