import { z } from 'zod';
import { dateSchema, stableIdSchema, textSchema } from './shared';

export const evidenceTypes = [
  'guideline',
  'systematic-review',
  'primary-study',
  'expert-consensus',
  'textbook',
  'local-policy',
  'patient-information',
] as const;
export const referenceSchema = z.strictObject({
  id: stableIdSchema,
  organisation: textSchema.optional(),
  authors: z.array(textSchema).min(1).optional(),
  title: textSchema,
  shortTitle: textSchema.optional(),
  publication: textSchema.optional(),
  year: z.number().int().min(1).max(9999),
  url: z.url({ protocol: /^https?$/ }).optional(),
  accessedAt: dateSchema.optional(),
  evidenceType: z.enum(evidenceTypes),
  notes: textSchema.optional(),
});
export type Reference = z.infer<typeof referenceSchema>;
