import type { Topic, TopicMetadata } from '@/schemas/topic';

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
export function selectQuickReference(topic: Topic) {
  return (topic.experience?.quickReference ?? []).map((selection) => ({
    ...selection,
    block: topic.sections
      .flatMap((section) => section.blocks)
      .find((block) => block.id === selection.blockId)!,
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
