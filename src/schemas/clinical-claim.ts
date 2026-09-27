import { z } from 'zod';
import { stableIdSchema, textSchema, trainingLevelSchema } from './shared';

export const clinicalClaimSchema = z.strictObject({
  id: stableIdSchema,
  text: textSchema,
  minimumLevel: trainingLevelSchema,
  referenceIds: z.array(stableIdSchema).min(1),
  localPolicyMayVary: z.boolean().optional(),
});
export type ClinicalClaim = z.infer<typeof clinicalClaimSchema>;
