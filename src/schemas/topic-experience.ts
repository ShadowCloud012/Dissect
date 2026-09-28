import { z } from 'zod';
import { stableIdSchema, textSchema, trainingLevelSchema } from './shared';

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
const blockSelectionSchema = z.strictObject({
  blockId: stableIdSchema,
  label: textSchema,
  page: stableIdSchema,
  group: stableIdSchema,
  // A single complete authored list item or table row can be surfaced
  // without paraphrasing it.
  itemIndex: z.number().int().nonnegative().optional(),
});
// Labelled rows of short extracts. Each extract must appear verbatim in its
// source block (validated), so the overview can name things concisely
// without new wording; sources come from the extracted blocks.
const extractSelectionSchema = z.strictObject({
  label: textSchema,
  page: stableIdSchema,
  group: stableIdSchema,
  numbered: z.boolean().optional(),
  rows: z
    .array(
      z.strictObject({
        label: textSchema,
        // Overview rows are universal unless marked level-sensitive.
        minimumLevel: trainingLevelSchema.optional(),
        extracts: z
          .array(z.strictObject({ text: textSchema, blockId: stableIdSchema }))
          .min(1),
      }),
    )
    .min(1),
});
const selectionSchema = z.union([blockSelectionSchema, extractSelectionSchema]);
export const perioperativePhases = ['before', 'during', 'after'] as const;
// Presentation-only grouping of quick-reference selections on the hub.
const quickReferenceGroupSchema = z.strictObject({
  id: stableIdSchema,
  title: textSchema,
  // alert: safety-critical; feature: the group this topic leads with.
  tone: z.enum(['alert', 'feature']).optional(),
  // Groups tagged with a phase render as one Before → In → After sequence.
  phase: z.enum(perioperativePhases).optional(),
  // Optional contextual links (e.g. ward/theatre) shown with the group.
  contextId: stableIdSchema.optional(),
});
// Where the learner is in the surgical episode; not a treatment algorithm.
const journeyStepSchema = z.strictObject({
  label: textSchema,
  page: stableIdSchema.optional(),
  // Or a quick-reference group on the hub itself.
  group: stableIdSchema.optional(),
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
  quickReferenceGroups: z.array(quickReferenceGroupSchema).min(1),
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
  journey: z.array(journeyStepSchema).default([]),
});
export type TopicExperience = z.input<typeof topicExperienceSchema>;
export type TopicPage = z.infer<typeof topicPageSchema>;
export type BlockPresentation = z.infer<typeof blockPresentationSchema>;
export type TopicPathway = z.infer<typeof pathwaySchema>;
export type ExtractSelection = z.infer<typeof extractSelectionSchema>;
export function isExtractSelection(
  selection: z.infer<typeof selectionSchema>,
): selection is ExtractSelection {
  return 'rows' in selection;
}
