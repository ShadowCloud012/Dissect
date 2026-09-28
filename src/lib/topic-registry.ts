import { validateTopic, type Topic } from '@/schemas/topic';
import { getSpecialty, getCategory } from '@/content/specialties';

export function createTopicRegistry(
  entries: readonly { source: string; content: unknown }[],
) {
  const topics = entries.map(({ source, content }) =>
    validateTopic(content, source),
  );
  const ids = new Set<string>();
  const paths = new Set<string>();
  for (const topic of topics) {
    if (topic.metadata.contentKind === 'clinical') {
      if (!getSpecialty(topic.metadata.specialty))
        throw new Error('Unknown clinical specialty');
      for (const category of topic.metadata.categories)
        if (!getCategory(topic.metadata.specialty, category))
          throw new Error(`Unknown category: ${category}`);
    }
    const path = `${topic.metadata.specialty}/${topic.metadata.slug}`;
    if (ids.has(topic.metadata.id) || paths.has(path))
      throw new Error(
        `Duplicate topic registration: ${topic.metadata.id} (${path})`,
      );
    ids.add(topic.metadata.id);
    paths.add(path);
  }
  // Return fresh values so a consumer cannot mutate the validated registry.
  const copy = (topic: Topic) => structuredClone(topic);
  return {
    listBySpecialty: (specialty: string) =>
      topics
        .filter((topic) => topic.metadata.specialty === specialty)
        .map((topic) => structuredClone(topic.metadata)),
    listByCategory: (specialty: string, category: string) =>
      topics
        .filter(
          (topic) =>
            topic.metadata.specialty === specialty &&
            topic.metadata.categories.includes(category),
        )
        .map((topic) => structuredClone(topic.metadata)),
    countTopics: (specialty: string, category?: string) =>
      topics.filter(
        (topic) =>
          topic.metadata.specialty === specialty &&
          (!category || topic.metadata.categories.includes(category)),
      ).length,
    listTopics: () => topics.map((topic) => structuredClone(topic.metadata)),
    getTopic: (specialty: string, slug: string) => {
      const topic = topics.find(
        ({ metadata }) =>
          metadata.specialty === specialty && metadata.slug === slug,
      );
      return topic ? copy(topic) : undefined;
    },
  };
}
