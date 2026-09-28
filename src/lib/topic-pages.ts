import type { Topic, TopicMetadata } from '@/schemas/topic';
import { isExtractSelection } from '@/schemas/topic-experience';

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
// Resolves every quick-reference entry to the authored blocks it draws on.
export function selectQuickReference(topic: Topic) {
  return (topic.experience?.quickReference ?? []).map((selection) =>
    isExtractSelection(selection)
      ? {
          ...selection,
          kind: 'extracts' as const,
          rows: selection.rows.map((row) => ({
            ...row,
            extracts: row.extracts.map((extract) => ({
              ...extract,
              block: findBlock(topic, extract.blockId),
            })),
          })),
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
