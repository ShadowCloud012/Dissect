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
// A cross-link to a real destination in this topic: a page, a block on that
// page, or a step of the operative walkthrough on that page (validated).
export const topicLinkSchema = z.strictObject({
  label: textSchema,
  page: stableIdSchema,
  blockId: stableIdSchema.optional(),
  step: z.number().int().positive().optional(),
});
// A short extract that must appear verbatim in its source block (validated),
// so summaries name things concisely without new wording.
const extractSchema = z.strictObject({
  text: textSchema,
  blockId: stableIdSchema,
});
const extractRowSchema = z.strictObject({
  label: textSchema,
  // Summary rows are universal unless marked level-sensitive.
  minimumLevel: trainingLevelSchema.optional(),
  extracts: z.array(extractSchema).min(1),
  link: topicLinkSchema.optional(),
});
// Labelled rows of extracts; sources come from the extracted blocks.
const extractSelectionSchema = z.strictObject({
  label: textSchema,
  page: stableIdSchema,
  group: stableIdSchema,
  numbered: z.boolean().optional(),
  rows: z.array(extractRowSchema).min(1),
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
export const walkthroughFieldKinds = [
  'why',
  'anatomy',
  'danger',
  'changes',
] as const;
// Step → Why → Anatomy → Danger → What changes the plan, built from an
// authored step list plus verbatim extracts. Unsupported fields are declared
// as editorial gaps rather than written.
const walkthroughSchema = z.strictObject({
  id: stableIdSchema,
  page: stableIdSchema,
  // The checklist block whose items are the steps; the walkthrough renders
  // in its place.
  blockId: stableIdSchema,
  // Rationale/anatomy blocks written for walkthrough fields and quoted in
  // full there, so they are not rendered a second time.
  absorbsBlockIds: z.array(stableIdSchema).default([]),
  steps: z
    .array(
      z.strictObject({
        itemIndex: z.number().int().nonnegative(),
        label: textSchema,
        fields: z
          .array(
            z.strictObject({
              kind: z.enum(walkthroughFieldKinds),
              // Defaults to the highest level of the extracted blocks.
              minimumLevel: trainingLevelSchema.optional(),
              extracts: z.array(extractSchema).min(1),
            }),
          )
          .default([]),
        gaps: z.array(z.enum(walkthroughFieldKinds)).default([]),
        links: z.array(topicLinkSchema).default([]),
      }),
    )
    .min(1),
});
// A compact labelled panel on a subpage (e.g. theatre prep). It sits at the
// top of the page, or replaces a block it fully represents.
const briefingSchema = z.strictObject({
  id: stableIdSchema,
  page: stableIdSchema,
  title: textSchema,
  caption: textSchema.optional(),
  variant: z.enum(['prep', 'plan']),
  replacesBlockId: stableIdSchema.optional(),
  // Further blocks whose wording the panel represents, not rendered again.
  absorbsBlockIds: z.array(stableIdSchema).default([]),
  rows: z.array(extractRowSchema).min(1),
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
  walkthroughs: z.array(walkthroughSchema).default([]),
  briefings: z.array(briefingSchema).default([]),
  // Explanatory cross-links shown beneath a block.
  blockLinks: z
    .array(
      z.strictObject({
        blockId: stableIdSchema,
        links: z.array(topicLinkSchema).min(1),
      }),
    )
    .default([]),
});
export type TopicExperience = z.input<typeof topicExperienceSchema>;
export type TopicPage = z.infer<typeof topicPageSchema>;
export type BlockPresentation = z.infer<typeof blockPresentationSchema>;
export type TopicPathway = z.infer<typeof pathwaySchema>;
export type ExtractSelection = z.infer<typeof extractSelectionSchema>;
export type TopicLink = z.infer<typeof topicLinkSchema>;
export type Walkthrough = z.infer<typeof walkthroughSchema>;
export type Briefing = z.infer<typeof briefingSchema>;
export function isExtractSelection(
  selection: z.infer<typeof selectionSchema>,
): selection is ExtractSelection {
  return 'rows' in selection;
}
