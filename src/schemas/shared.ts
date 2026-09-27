import { z } from 'zod';
import { trainingLevels } from '@/lib/training-level';

export const stableIdSchema = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use a stable lowercase kebab-case ID');
export const textSchema = z.string().trim().min(1);
export const dateSchema = z.iso.date();
export const trainingLevelSchema = z.enum(trainingLevels.map(({ id }) => id));
