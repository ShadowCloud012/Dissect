import type { Topic, TopicMetadata } from '@/schemas/topic';
import type { ContentBlock } from '@/schemas/content-block';
import { isExtractSelection, type TopicLink } from '@/schemas/topic-experience';
import {
  trainingLevelRank,
  trainingLevels,
  type TrainingLevel,
} from '@/lib/training-level';

export function topicHref(metadata: Pick<TopicMetadata, 'specialty' | 'slug'>) {
  return `/learn/${metadata.specialty}/${metadata.slug}`;
}
export function resolveTopicPage(topic: Topic, slug: string) {
  const page = topic.experience?.pages.find((page) => page.slug === slug);
  return page
    ? {
        page,
        sections: page.sectionIds.map((id) =>
          topic.sections.find((section) => section.id === id)!,
        ),
      }
    : undefined;
}
function findBlock(topic: Topic, id: string) {
  return topic.sections
    .flatMap((section) => section.blocks)
    .find((block) => block.id === id)!;
}
export const stepAnchor = (walkthroughId: string, step: number) =>
  `step-${walkthroughId}-${step}`;
// Real routes/anchors only; links are validated against the topic schema.
export function linkHref(topic: Topic, link: TopicLink) {
  const walkthrough = link.step
    ? topic.experience?.walkthroughs.find((entry) => entry.page === link.page)
    : undefined;
  const anchor = link.blockId
    ? `#block-${link.blockId}`
    : walkthrough
      ? `#${stepAnchor(walkthrough.id, link.step!)}`
      : '';
  return `${topicHref(topic.metadata)}/${link.page}${anchor}`;
}
function resolveLinks(topic: Topic, links: TopicLink[]) {
  return links.map((link) => ({
    label: link.label,
    href: linkHref(topic, link),
  }));
}
type ExtractRow = {
  label: string;
  minimumLevel?: TrainingLevel;
  extracts: { text: string; blockId: string }[];
  link?: TopicLink;
};
export function resolveRows(topic: Topic, rows: ExtractRow[]) {
  return rows.map((row) => ({
    label: row.label,
    minimumLevel: row.minimumLevel,
    href: row.link ? linkHref(topic, row.link) : undefined,
    linkLabel: row.link?.label,
    extracts: row.extracts.map((extract) => ({
      ...extract,
      block: findBlock(topic, extract.blockId),
    })),
  }));
}
export type ResolvedRow = ReturnType<typeof resolveRows>[number];
const uniqueReferences = (blocks: ContentBlock[]) => [
  ...new Set(blocks.flatMap((block) => block.referenceIds)),
];
// Resolves every quick-reference entry to the authored blocks it draws on.
export function selectQuickReference(topic: Topic) {
  return (topic.experience?.quickReference ?? []).map((selection) =>
    isExtractSelection(selection)
      ? {
          ...selection,
          kind: 'extracts' as const,
          rows: resolveRows(topic, selection.rows),
        }
      : {
          ...selection,
          kind: 'block' as const,
          block: findBlock(topic, selection.blockId),
        },
  );
}
export function quickReferenceBlocks(
  entry: ReturnType<typeof selectQuickReference>[number],
) {
  return entry.kind === 'block'
    ? [entry.block]
    : entry.rows.flatMap((row) => row.extracts.map((extract) => extract.block));
}
// Hub groups with resolved links. Sources are de-duplicated per group so each
// source is listed once beside the answers it supports.
export function groupQuickReference(topic: Topic) {
  const experience = topic.experience;
  if (!experience) return [];
  const base = topicHref(topic.metadata);
  const entries = selectQuickReference(topic).map((entry) => {
    const owned =
      entry.kind === 'block' &&
      resolveTopicPage(topic, entry.page)!.sections.some((section) =>
        section.blocks.includes(entry.block),
      );
    // Flag policy dependence from universally shown content only; gated rows
    // carry the note on their full page.
    const universal =
      entry.kind === 'block'
        ? [entry.block]
        : entry.rows
            .filter((row) => !row.minimumLevel)
            .flatMap((row) => row.extracts.map((extract) => extract.block));
    return {
      ...entry,
      localPolicyMayVary: universal.some((block) => block.localPolicyMayVary),
      pageTitle: experience.pages.find((page) => page.slug === entry.page)!
        .title,
      href: `${base}/${entry.page}${owned ? `#block-${entry.block.id}` : ''}`,
    };
  });
  return experience.quickReferenceGroups.map((group) => {
    const members = entries.filter((entry) => entry.group === group.id);
    return {
      ...group,
      entries: members,
      referenceIds: [
        ...new Set(
          members.flatMap((entry) =>
            quickReferenceBlocks(entry).flatMap((block) => block.referenceIds),
          ),
        ),
      ],
      context: experience.contexts.find(
        (context) => context.id === group.contextId,
      ),
    };
  });
}
// Journey steps resolved to hub anchors or subpages.
export function topicJourney(topic: Topic) {
  const base = topicHref(topic.metadata);
  return (topic.experience?.journey ?? []).map((step) => ({
    label: step.label,
    href: step.page ? `${base}/${step.page}` : `#quick-${step.group}`,
  }));
}
// Walkthrough fields default to the depth of their deepest source block, so
// the page's training level decides how much operative reasoning appears.
function deepestLevel(blocks: ContentBlock[]): TrainingLevel {
  return blocks.reduce<TrainingLevel>(
    (deepest, block) =>
      trainingLevelRank(block.minimumLevel) > trainingLevelRank(deepest)
        ? block.minimumLevel
        : deepest,
    trainingLevels[0].id,
  );
}
export function resolveWalkthroughs(topic: Topic, page: string) {
  return (topic.experience?.walkthroughs ?? [])
    .filter((walkthrough) => walkthrough.page === page)
    .map((walkthrough) => {
      const block = findBlock(topic, walkthrough.blockId);
      const items = block.type === 'checklist' ? block.items : [];
      const steps = walkthrough.steps.map((step, index) => {
        const fields = step.fields.map((field) => {
          const extracts = field.extracts.map((extract) => ({
            ...extract,
            block: findBlock(topic, extract.blockId),
          }));
          return {
            kind: field.kind,
            minimumLevel:
              field.minimumLevel ??
              deepestLevel(extracts.map((extract) => extract.block)),
            extracts,
          };
        });
        return {
          number: index + 1,
          anchor: stepAnchor(walkthrough.id, index + 1),
          label: step.label,
          text: items[step.itemIndex],
          fields,
          gaps: step.gaps,
          links: resolveLinks(topic, step.links),
        };
      });
      return {
        id: walkthrough.id,
        block,
        absorbsBlockIds: walkthrough.absorbsBlockIds,
        steps,
        referenceIds: uniqueReferences([
          block,
          ...steps.flatMap((step) =>
            step.fields.flatMap((field) =>
              field.extracts.map((extract) => extract.block),
            ),
          ),
        ]),
      };
    });
}
export type ResolvedWalkthrough = ReturnType<
  typeof resolveWalkthroughs
>[number];
export function resolveBriefings(topic: Topic, page: string) {
  return (topic.experience?.briefings ?? [])
    .filter((briefing) => briefing.page === page)
    .map((briefing) => {
      const rows = resolveRows(topic, briefing.rows);
      return {
        ...briefing,
        rows,
        referenceIds: uniqueReferences(
          rows.flatMap((row) => row.extracts.map((extract) => extract.block)),
        ),
      };
    });
}
export type ResolvedBriefing = ReturnType<typeof resolveBriefings>[number];
export function resolveBlockLinks(topic: Topic) {
  return Object.fromEntries(
    (topic.experience?.blockLinks ?? []).map((entry) => [
      entry.blockId,
      resolveLinks(topic, entry.links),
    ]),
  );
}
// Blocks flagged as policy-dependent, located on their owning subpage.
export function localPolicyEntries(topic: Topic) {
  const pages = topic.experience?.pages ?? [];
  return topic.sections.flatMap((section) => {
    const page = pages.find((entry) => entry.sectionIds.includes(section.id));
    if (!page) return [];
    return section.blocks
      .filter(
        (block) =>
          block.localPolicyMayVary ||
          (block.type === 'claimGroup' &&
            block.claims.some((claim) => claim.localPolicyMayVary)),
      )
      .map((block) => ({
        page,
        anchor: `block-${block.id}`,
        label:
          topic.experience?.presentation.find(
            (item) => item.blockId === block.id,
          )?.label ?? section.title,
      }));
  });
}
// Index-ready records, not a search implementation or duplicated clinical content.
export function topicIndexEntries(topic: Topic) {
  return (topic.experience?.pages ?? []).map((page) => ({
    title: page.title,
    aliases: page.aliases,
    keywords: page.keywords,
    specialty: topic.metadata.specialty,
    categories: topic.metadata.categories,
    route: `${topicHref(topic.metadata)}/${page.slug}`,
    headings: resolveTopicPage(topic, page.slug)!.sections.map(
      (section) => section.title,
    ),
  }));
}
