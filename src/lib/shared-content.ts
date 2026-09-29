import { z } from 'zod';
import { referenceSchema, type Reference } from '@/schemas/reference';
import {
  contentBlockSchema,
  type ContentBlock,
  type ContentBlockInput,
} from '@/schemas/content-block';
import { walkthroughFieldKinds } from '@/schemas/topic-experience';
import type { Topic, TopicInput, TopicSectionInput } from '@/schemas/topic';

// One explicit shared layer, no inheritance:
// - shared sources: cited by ID from any topic; a topic's Evidence page lists
//   only the shared sources that topic actually cites;
// - shared blocks: included by explicit `{ include: id }` entries, copied
//   unchanged and marked as shared, with the walkthrough field kinds they
//   were reviewed for.

const sharedBlockSchema = z.strictObject({
  // Walkthrough fields this block may fill in any topic that includes it.
  walkthroughFields: z.array(z.enum(walkthroughFieldKinds)),
  block: contentBlockSchema,
});
export type SharedBlockDefinition = z.input<typeof sharedBlockSchema>;
export type SharedLibrary = {
  references: Reference[];
  blocks: z.infer<typeof sharedBlockSchema>[];
};
// An authored section may include a shared block in place of a local one.
export type SharedInclude = { include: string };
export type AuthoredSection = Omit<TopicSectionInput, 'blocks'> & {
  blocks: (ContentBlockInput | SharedInclude)[];
};
export type AuthoredTopic = Omit<TopicInput, 'sections'> & {
  sections: AuthoredSection[];
};

const citedIds = (block: ContentBlockInput) => [
  ...(block.referenceIds ?? []),
  ...(block.type === 'claimGroup'
    ? block.claims.flatMap((claim) => claim.referenceIds)
    : []),
];
function unique(ids: string[], kind: string) {
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) throw new Error(`Duplicate shared ${kind} ID: ${id}`);
    seen.add(id);
  }
}

export function createSharedLibrary(input: {
  references: Reference[];
  blocks: SharedBlockDefinition[];
}): SharedLibrary {
  const references = input.references.map((reference) =>
    referenceSchema.parse(reference),
  );
  const blocks = input.blocks.map((entry) => sharedBlockSchema.parse(entry));
  unique(
    references.map((reference) => reference.id),
    'source',
  );
  unique(
    blocks.map((entry) => entry.block.id),
    'block',
  );
  const known = new Set(references.map((reference) => reference.id));
  for (const { block } of blocks) {
    // Shared blocks stay sourced, and only by shared sources, so they carry
    // the same provenance into every topic that includes them.
    const cited = citedIds(block);
    if (block.type !== 'sourceNote' && cited.length === 0)
      throw new Error(`Shared block needs a source: ${block.id}`);
    for (const id of cited)
      if (!known.has(id))
        throw new Error(
          `Shared block ${block.id} cites a non-shared source: ${id}`,
        );
  }
  return { references, blocks };
}

// Resolves explicit includes and appends the shared sources the topic cites.
// Local IDs may not reuse shared IDs, so there is never a precedence rule.
// Generic so a topic keeps its authored metadata type (e.g. its procedures).
export function composeTopic<T extends AuthoredTopic>(
  topic: T,
  library: SharedLibrary,
): Omit<T, 'sections' | 'references'> &
  Pick<TopicInput, 'sections' | 'references'> {
  const context = topic.metadata.id;
  const sharedBlockIds = new Set(library.blocks.map(({ block }) => block.id));
  const sharedSourceIds = new Set(
    library.references.map((reference) => reference.id),
  );
  for (const reference of topic.references)
    if (sharedSourceIds.has(reference.id))
      throw new Error(
        `${context}: local source duplicates shared source: ${reference.id}`,
      );
  const sections = topic.sections.map((section) => ({
    ...section,
    blocks: section.blocks.map((entry): ContentBlockInput => {
      if ('include' in entry) {
        const shared = library.blocks.find(
          ({ block }) => block.id === entry.include,
        );
        if (!shared)
          throw new Error(`${context}: unknown shared block: ${entry.include}`);
        return {
          ...structuredClone(shared.block),
          shared: { walkthroughFields: [...shared.walkthroughFields] },
        };
      }
      if (sharedBlockIds.has(entry.id))
        throw new Error(
          `${context}: local block reuses a shared block ID: ${entry.id}`,
        );
      return entry;
    }),
  }));
  const cited = new Set(
    sections.flatMap((section) => section.blocks.flatMap(citedIds)),
  );
  return {
    ...topic,
    sections,
    references: [
      ...topic.references,
      ...library.references.filter((reference) => cited.has(reference.id)),
    ],
  };
}

// A validated topic may only mark a block as shared if it is an unchanged
// copy of the library block, and may only list shared sources verbatim.
export function checkSharedIntegrity(topic: Topic, library: SharedLibrary) {
  const context = topic.metadata.id;
  const same = (a: unknown, b: unknown) =>
    JSON.stringify(a) === JSON.stringify(b);
  for (const block of topic.sections.flatMap((section) => section.blocks)) {
    if (!block.shared) continue;
    const entry = library.blocks.find((item) => item.block.id === block.id);
    const { shared, ...content } = block as ContentBlock & {
      shared: NonNullable<ContentBlock['shared']>;
    };
    if (
      !entry ||
      !same(content, entry.block) ||
      !same(shared.walkthroughFields, entry.walkthroughFields)
    )
      throw new Error(`${context}: shared block was altered: ${block.id}`);
  }
  for (const reference of topic.references) {
    const shared = library.references.find((item) => item.id === reference.id);
    if (shared && !same(reference, shared))
      throw new Error(`${context}: shared source was altered: ${reference.id}`);
  }
}
