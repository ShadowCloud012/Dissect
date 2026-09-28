import { z } from 'zod';
import { stableIdSchema, textSchema } from './shared';

export const topicPageSchema = z.strictObject({
  slug: stableIdSchema,
  title: textSchema,
  description: textSchema,
  group: z.enum(['Clinical', 'Operative', 'Revision']),
  sectionIds: z.array(stableIdSchema).min(1),
  aliases: z.array(textSchema),
  keywords: z.array(textSchema),
});
export const blockPresentationSchema = z.strictObject({
  blockId: stableIdSchema,
  label: textSchema,
  itemLabels: z.array(textSchema).optional(),
  variant: z.enum([
    'plain',
    'fact',
    'pathway',
    'steps',
    'complications',
    'consent',
  ]),
});
const selectionSchema = z.strictObject({
  blockId: stableIdSchema,
  label: textSchema,
  page: stableIdSchema,
  // A single complete authored item can be surfaced without paraphrasing it.
  itemIndex: z.number().int().nonnegative().optional(),
});
export const topicExperienceSchema = z.strictObject({
  pages: z.array(topicPageSchema).min(1),
  quickReference: z.array(selectionSchema).min(1),
  contexts: z.array(
    z.strictObject({
      id: stableIdSchema,
      title: textSchema,
      description: textSchema,
      links: z
        .array(z.strictObject({ title: textSchema, page: stableIdSchema }))
        .min(1),
    }),
  ),
  presentation: z.array(blockPresentationSchema),
});
export type TopicExperience = z.infer<typeof topicExperienceSchema>;
export type TopicPage = z.infer<typeof topicPageSchema>;
export type BlockPresentation = z.infer<typeof blockPresentationSchema>;
