import {
  validateTopic,
  type ReviewState,
  type Topic,
  type TopicMetadata,
} from '@/schemas/topic';
import { getSpecialty, getCategory } from '@/content/specialties';
import { checkSharedIntegrity, type SharedLibrary } from './shared-content';
import { buildSearchDocuments, normaliseTerm } from './search-documents';
import type { EntityLink, ProcedureRelation } from './topic-pages';

const topicHrefOf = (metadata: Pick<TopicMetadata, 'specialty' | 'slug'>) =>
  `/learn/${metadata.specialty}/${metadata.slug}`;

// A condition or procedure as discovery and future search see it. Every
// relationship is derived from the procedure records, declared once.
export type DiscoveryEntry = {
  kind: 'condition' | 'procedure';
  id: string;
  title: string;
  summary: string;
  href: string;
  aliases: string[];
  keywords: string[];
  specialty: string;
  categories: string[];
  // A procedure carries its owning topic's review state.
  review: ReviewState;
  conditions: EntityLink[];
  procedures: EntityLink[];
};

const reviewOf = (metadata: TopicMetadata): ReviewState =>
  metadata.contentKind === 'clinical'
    ? {
        contentKind: metadata.contentKind,
        status: metadata.status,
        clinicalReviewer: metadata.clinicalReviewer,
        lastClinicallyReviewed: metadata.lastClinicallyReviewed,
      }
    : {
        contentKind: metadata.contentKind,
        demoReviewedAt: metadata.demoReviewedAt,
      };

// Builds the condition ↔ procedure graph. A procedure belongs to the topic
// that owns its page and may also list further conditions it is relevant
// to; each side's links are derived from that one declaration.
function buildRelationships(topics: Topic[]) {
  const clinical = topics.flatMap((topic) =>
    topic.metadata.contentKind === 'clinical'
      ? [{ topic, metadata: topic.metadata }]
      : [],
  );
  const conditionLink = (metadata: TopicMetadata): EntityLink => ({
    id: metadata.id,
    title: metadata.title,
    href: topicHrefOf(metadata),
  });
  const procedures = clinical.flatMap(({ metadata }) =>
    metadata.procedures.map((procedure) => {
      const linked = procedure.linkedConditionIds.map((id) => {
        const match = clinical.find((entry) => entry.metadata.id === id);
        if (!match)
          throw new Error(
            `Procedure ${procedure.id} links an unknown condition: ${id}`,
          );
        return match.metadata;
      });
      return {
        owner: metadata,
        procedure,
        href: `${topicHrefOf(metadata)}/${procedure.page}`,
        conditionMetadata: [metadata, ...linked],
      };
    }),
  );
  const discovery: DiscoveryEntry[] = clinical.flatMap(({ metadata }) => {
    const related = procedures.filter((entry) =>
      entry.conditionMetadata.some((item) => item.id === metadata.id),
    );
    const condition: DiscoveryEntry = {
      kind: 'condition',
      id: metadata.id,
      title: metadata.title,
      summary: metadata.summary,
      href: topicHrefOf(metadata),
      aliases: metadata.aliases ?? [],
      keywords: metadata.keywords,
      specialty: metadata.specialty,
      categories: metadata.categories,
      review: reviewOf(metadata),
      conditions: [],
      procedures: related.map(({ procedure, href }) => ({
        id: procedure.id,
        title: procedure.title,
        href,
      })),
    };
    const owned = procedures
      .filter((entry) => entry.owner === metadata)
      .map(({ procedure, href, conditionMetadata }): DiscoveryEntry => ({
        kind: 'procedure',
        id: procedure.id,
        title: procedure.title,
        summary: procedure.summary,
        href,
        aliases: procedure.aliases,
        keywords: procedure.keywords,
        specialty: metadata.specialty,
        // Discoverable wherever any of its conditions is.
        categories: [
          ...new Set(conditionMetadata.flatMap((item) => item.categories)),
        ],
        review: reviewOf(metadata),
        conditions: conditionMetadata.map(conditionLink),
        procedures: [],
      }));
    return [condition, ...owned];
  });
  // Procedures related to one condition, as its topic pages render them.
  const relationsFor = (topic: Topic): ProcedureRelation[] =>
    procedures
      .filter((entry) =>
        entry.conditionMetadata.some((item) => item.id === topic.metadata.id),
      )
      .map(({ owner, procedure, href, conditionMetadata }) => {
        const own = owner.id === topic.metadata.id;
        return {
          id: procedure.id,
          title: procedure.title,
          summary: procedure.summary,
          href,
          conditions: conditionMetadata.map(conditionLink),
          // Page relationships apply only within the owning topic.
          ...(own && {
            page: procedure.page,
            anatomyPage: procedure.anatomyPage,
            complicationsPage: procedure.complicationsPage,
            aftercarePage: procedure.aftercarePage,
          }),
        };
      });
  return { discovery, relationsFor };
}

export function createTopicRegistry(
  entries: readonly { source: string; content: unknown }[],
  options: { sharedLibrary?: SharedLibrary } = {},
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
    if (options.sharedLibrary)
      checkSharedIntegrity(topic, options.sharedLibrary);
    const path = `${topic.metadata.specialty}/${topic.metadata.slug}`;
    if (ids.has(topic.metadata.id) || paths.has(path))
      throw new Error(
        `Duplicate topic registration: ${topic.metadata.id} (${path})`,
      );
    ids.add(topic.metadata.id);
    paths.add(path);
  }
  const { discovery, relationsFor } = buildRelationships(topics);
  // Condition and procedure IDs share one namespace so links are unambiguous.
  const discoveryIds = discovery.map((entry) => entry.id);
  if (new Set(discoveryIds).size !== discoveryIds.length)
    throw new Error('Duplicate condition/procedure ID');
  // A title or alias names exactly one condition or procedure.
  const names = new Map<string, string>();
  for (const entry of discovery)
    for (const name of new Set(
      [entry.title, ...entry.aliases].map(normaliseTerm),
    )) {
      const owner = names.get(name);
      if (owner && owner !== entry.id)
        throw new Error(`Ambiguous name "${name}": ${owner} and ${entry.id}`);
      names.set(name, entry.id);
    }
  const searchDocuments = buildSearchDocuments(topics, discovery);
  // Return fresh values so a consumer cannot mutate the validated registry.
  const copy = (topic: Topic) => structuredClone(topic);
  const inScope = (
    entry: DiscoveryEntry,
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
    // Procedures related to a condition topic, for its pages.
    relationsFor: (topic: Topic) =>
      structuredClone(
        relationsFor(
          topics.find((entry) => entry.metadata.id === topic.metadata.id)!,
        ),
      ),
    searchDocuments: () => structuredClone(searchDocuments),
    // Exact, normalised title/alias resolution (e.g. "Lap. chole" → the
    // procedure). A foundation for search, not a search engine.
    resolveTerm: (term: string) => {
      const id = names.get(normaliseTerm(term));
      return structuredClone(discovery.filter((entry) => entry.id === id));
    },
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
