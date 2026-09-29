import { validateTopic, type Topic, type TopicMetadata } from '@/schemas/topic';
import { getSpecialty, getCategory } from '@/content/specialties';

const topicHrefOf = (metadata: Pick<TopicMetadata, 'specialty' | 'slug'>) =>
  `/learn/${metadata.specialty}/${metadata.slug}`;
const normaliseTerm = (term: string) =>
  term
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

// Discovery records for conditions and procedures. They carry the metadata a
// future search needs (kind, aliases, keywords, links) without an index.
function discoveryFor(metadata: TopicMetadata) {
  if (metadata.contentKind !== 'clinical') return [];
  const conditionHref = topicHrefOf(metadata);
  const procedures = metadata.procedures.map((procedure) => ({
    kind: 'procedure' as const,
    id: procedure.id,
    title: procedure.title,
    summary: procedure.summary,
    href: `${conditionHref}/${procedure.page}`,
    aliases: procedure.aliases,
    keywords: procedure.keywords,
    specialty: metadata.specialty,
    categories: metadata.categories,
    conditions: [
      { id: metadata.id, title: metadata.title, href: conditionHref },
    ],
    procedures: [] as { id: string; title: string; href: string }[],
    metadata,
  }));
  const condition = {
    kind: 'condition' as const,
    id: metadata.id,
    title: metadata.title,
    summary: metadata.summary,
    href: conditionHref,
    aliases: metadata.aliases ?? [],
    keywords: metadata.keywords,
    specialty: metadata.specialty,
    categories: metadata.categories,
    conditions: [] as { id: string; title: string; href: string }[],
    procedures: procedures.map(({ id, title, href }) => ({ id, title, href })),
    metadata,
  };
  return [condition, ...procedures];
}
export type DiscoveryEntry = ReturnType<typeof discoveryFor>[number];

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
  // Condition and procedure IDs share one namespace so links are unambiguous.
  const discovery = topics.flatMap((topic) => discoveryFor(topic.metadata));
  const discoveryIds = discovery.map((entry) => entry.id);
  if (new Set(discoveryIds).size !== discoveryIds.length)
    throw new Error('Duplicate condition/procedure ID');
  // Return fresh values so a consumer cannot mutate the validated registry.
  const copy = (topic: Topic) => structuredClone(topic);
  const inScope = (
    entry: { specialty: string; categories: string[] },
    specialty: string,
    category?: string,
  ) =>
    entry.specialty === specialty &&
    (!category || entry.categories.includes(category));
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
    listConditions: (specialty: string, category?: string) =>
      structuredClone(
        discovery.filter(
          (entry) =>
            entry.kind === 'condition' && inScope(entry, specialty, category),
        ),
      ),
    listProcedures: (specialty: string, category?: string) =>
      structuredClone(
        discovery.filter(
          (entry) =>
            entry.kind === 'procedure' && inScope(entry, specialty, category),
        ),
      ),
    discoveryEntries: () => structuredClone(discovery),
    // Exact title/alias resolution, e.g. "lap chole" → the procedure. A
    // foundation for later search, not a search engine.
    resolveTerm: (term: string) =>
      structuredClone(
        discovery.filter((entry) =>
          [entry.title, ...entry.aliases].some(
            (name) => normaliseTerm(name) === normaliseTerm(term),
          ),
        ),
      ),
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
