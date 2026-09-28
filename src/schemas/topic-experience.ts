import { z } from 'zod';
import { stableIdSchema, textSchema } from './shared';

export const topicPageGroups = ['Clinical', 'Operative', 'Revision'] as const;
export const topicPageSchema = z.strictObject({
  slug: stableIdSchema,
  title: textSchema,
  // Compact label for the mobile quick-jump bar; falls back to title.
  shortTitle: textSchema.optional(),
  quickJump: z.boolean().optional(),
  description: textSchema,
  group: z.enum(topicPageGroups),
  sectionIds: z.array(stableIdSchema).min(1),
  aliases: z.array(textSchema),
  keywords: z.array(textSchema),
});
export const blockPresentationSchema = z.strictObject({
  blockId: stableIdSchema,
  label: textSchema,
  itemLabels: z.array(textSchema).optional(),
  // Consecutive blocks sharing a group render together as a labelled grid.
  group: textSchema.optional(),
  variant: z.enum([
    'plain',
    'fact',
    'cards',
    'pathway',
    'escalation',
    'danger',
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
// A navigational overview of authored blocks on one page. Labels orient the
// reader; the clinical wording stays in the linked blocks.
const pathwaySchema = z.strictObject({
  id: stableIdSchema,
  page: stableIdSchema,
  title: textSchema,
  caption: textSchema,
  steps: z
    .array(z.strictObject({ label: textSchema, blockId: stableIdSchema }))
    .min(1),
  branches: z
    .array(z.strictObject({ label: textSchema, blockId: stableIdSchema }))
    .min(2),
});
export const relatedKinds = [
  'related-condition',
  'procedure',
  'anatomy',
  'complication',
  'theatre-skill',
] as const;
// Only real destinations are allowed; currently pages within the same topic.
const relatedSchema = z.strictObject({
  kind: z.enum(relatedKinds),
  title: textSchema,
  page: stableIdSchema,
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
  pathways: z.array(pathwaySchema).default([]),
  related: z.array(relatedSchema).default([]),
});
export type TopicExperience = z.input<typeof topicExperienceSchema>;
export type TopicPage = z.infer<typeof topicPageSchema>;
export type BlockPresentation = z.infer<typeof blockPresentationSchema>;
export type TopicPathway = z.infer<typeof pathwaySchema>;
