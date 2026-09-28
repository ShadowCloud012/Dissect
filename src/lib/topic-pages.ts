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
