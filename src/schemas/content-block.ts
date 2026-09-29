import { z } from 'zod';
import { clinicalClaimSchema } from './clinical-claim';
import { stableIdSchema, textSchema, trainingLevelSchema } from './shared';
import { walkthroughFieldKinds } from './topic-experience';

// Set only by composeTopic when a topic includes a block from the shared
// library: it marks the block as shared and lists the walkthrough field kinds
// it has been reviewed for. Local blocks never carry it.
export const sharedBlockMarkerSchema = z.strictObject({
  walkthroughFields: z.array(z.enum(walkthroughFieldKinds)),
});

const common = {
  id: stableIdSchema,
  minimumLevel: trainingLevelSchema,
  referenceIds: z.array(stableIdSchema).default([]),
  localPolicyMayVary: z.boolean().optional(),
  shared: sharedBlockMarkerSchema.optional(),
};
export const contentBlockSchema = z.discriminatedUnion('type', [
  z.strictObject({
    ...common,
    type: z.literal('question'),
    question: textSchema,
    answer: textSchema,
    referenceIds: z.array(stableIdSchema).min(1),
  }),
  z.strictObject({
    ...common,
    type: z.literal('prose'),
    paragraphs: z.array(textSchema).min(1),
  }),
  z.strictObject({
    ...common,
    type: z.literal('keyPoints'),
    items: z.array(textSchema).min(1),
  }),
  z.strictObject({
    ...common,
    type: z.literal('definition'),
    term: textSchema,
    meaning: textSchema,
  }),
  z.strictObject({
    ...common,
    type: z.literal('warning'),
    title: textSchema,
    text: textSchema,
  }),
  z.strictObject({
    ...common,
    type: z.literal('clinicalPearl'),
    title: textSchema,
    text: textSchema,
  }),
  z.strictObject({
    ...common,
    type: z.literal('checklist'),
    title: textSchema,
    items: z.array(textSchema).min(1),
  }),
  z
    .strictObject({
      ...common,
      type: z.literal('table'),
      caption: textSchema,
      columns: z.array(textSchema).min(1),
      rows: z.array(z.array(textSchema).min(1)).min(1),
    })
    .refine(
      (table) => table.rows.every((row) => row.length === table.columns.length),
      { message: 'Each row must match the column count', path: ['rows'] },
    ),
  z.strictObject({
    ...common,
    type: z.literal('claimGroup'),
    claims: z.array(clinicalClaimSchema).min(1),
  }),
  z.strictObject({
    ...common,
    type: z.literal('sourceNote'),
    text: textSchema,
  }),
]);
export type ContentBlock = z.infer<typeof contentBlockSchema>;
export type ContentBlockInput = z.input<typeof contentBlockSchema>;
