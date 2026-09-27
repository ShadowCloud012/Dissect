import { validateTopic, type Topic } from '@/schemas/topic';

export function createTopicRegistry(
  entries: readonly { source: string; content: unknown }[],
) {
  const topics = entries.map(({ source, content }) =>
    validateTopic(content, source),
  );
  const ids = new Set<string>();
  const paths = new Set<string>();
  for (const topic of topics) {
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
