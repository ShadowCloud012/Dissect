import { z } from 'zod';
import { stableIdSchema, textSchema } from '@/schemas/shared';

const categorySchema = z.strictObject({
  id: stableIdSchema,
  title: textSchema,
});
export const specialtySchema = z.strictObject({
  id: stableIdSchema,
  slug: stableIdSchema,
  title: textSchema,
  description: textSchema,
  categories: z.array(categorySchema),
});
export const specialties = z.array(specialtySchema).parse([
  {
    id: 'general-surgery',
    slug: 'general-surgery',
    title: 'General Surgery',
    description:
      'Clinical assessment, operative understanding and care around surgery.',
    categories: [
      { id: 'emergency-general-surgery', title: 'Emergency General Surgery' },
      { id: 'upper-gi', title: 'Upper GI' },
      { id: 'hpb', title: 'HPB' },
      { id: 'colorectal', title: 'Colorectal' },
      { id: 'breast', title: 'Breast' },
      { id: 'endocrine', title: 'Endocrine' },
      { id: 'abdominal-wall-hernia', title: 'Abdominal Wall / Hernia' },
    ],
  },
]);
export function getSpecialty(slug: string) {
  return specialties.find((entry) => entry.slug === slug);
}
export function getCategory(specialty: string, id: string) {
  return getSpecialty(specialty)?.categories.find((entry) => entry.id === id);
}
