import type { Topic } from '@/schemas/topic';
import { resolveTopicPage, topicHref } from './topic-pages';
import { normaliseTerm } from './search-terms';

export { normaliseTerm };

// De-duplicates by normalised form, keeping the first authored spelling.
function uniqueTerms(terms: string[]) {
  const seen = new Set<string>();
  return terms.filter((term) => {
    const key = normaliseTerm(term);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export type SearchDocumentKind = 'condition' | 'procedure' | 'page';
// What a topic subpage is to its procedure(s), if anything.
export type SearchPageRole =
  'anatomy' | 'complications' | 'aftercare' | 'theatre-prep';
// Curated metadata and headings only; no clinical prose is indexed.
export type SearchDocument = {
  id: string;
  kind: SearchDocumentKind;
  pageRole: SearchPageRole | null;
  title: string;
  href: string;
  specialty: string;
  categories: string[];
  status: string;
  aliases: string[];
  keywords: string[];
  pageTitles: string[];
  headings: string[];
  anatomyTerms: string[];
  complicationTerms: string[];
  conditions: string[];
  procedures: string[];
};
// The discovery fields the builder needs (see topic-registry).
type Entity = {
  kind: 'condition' | 'procedure';
  id: string;
  title: string;
  href: string;
  aliases: string[];
  keywords: string[];
  categories: string[];
  conditions: { title: string }[];
  procedures: { title: string }[];
};

function pageSections(topic: Topic, slug?: string) {
  return slug ? (resolveTopicPage(topic, slug)?.sections ?? []) : [];
}
const headingsOf = (topic: Topic, slug?: string) =>
  pageSections(topic, slug).map((section) => section.title);
const pageOf = (topic: Topic, slug?: string) =>
  topic.experience?.pages.find((page) => page.slug === slug);
// Anatomy terms: the anatomy page's keywords and defined terms.
function anatomyTerms(topic: Topic, slug?: string) {
  return uniqueTerms([
    ...(pageOf(topic, slug)?.keywords ?? []),
    ...pageSections(topic, slug).flatMap((section) =>
      section.blocks.flatMap((block) =>
        block.type === 'definition' ? [block.term] : [],
      ),
    ),
  ]);
}
// Complication terms: the page's keywords and the named rows of its tables.
function complicationTerms(topic: Topic, slug?: string) {
  return uniqueTerms([
    ...(pageOf(topic, slug)?.keywords ?? []),
    ...pageSections(topic, slug).flatMap((section) =>
      section.blocks.flatMap((block) =>
        block.type === 'table' ? block.rows.map((row) => row[0]) : [],
      ),
    ),
  ]);
}

// One document per canonical URL: each condition hub, each procedure page
// and every other topic subpage. Order follows registration and page order.
export function buildSearchDocuments(
  topics: Topic[],
  entities: Entity[],
): SearchDocument[] {
  return topics.flatMap((topic) => {
    const { metadata } = topic;
    if (metadata.contentKind !== 'clinical' || !topic.experience) return [];
    const condition = entities.find(
      (entity) => entity.kind === 'condition' && entity.id === metadata.id,
    )!;
    const owned = metadata.procedures;
    const common = {
      specialty: metadata.specialty,
      status: metadata.status,
    };
    const pages = topic.experience.pages;
    const conditionDocument: SearchDocument = {
      ...common,
      id: `condition:${metadata.id}`,
      kind: 'condition',
      pageRole: null,
      title: metadata.title,
      href: condition.href,
      categories: condition.categories,
      aliases: uniqueTerms(condition.aliases),
      keywords: uniqueTerms(condition.keywords),
      pageTitles: pages.map((page) => page.title),
      headings: uniqueTerms(
        pages
          .filter((page) => page.group === 'Clinical')
          .flatMap((page) => headingsOf(topic, page.slug)),
      ),
      anatomyTerms: [],
      complicationTerms: [],
      conditions: [],
      procedures: condition.procedures.map((procedure) => procedure.title),
    };
    const procedureDocuments = owned.map((procedure): SearchDocument => {
      const entity = entities.find(
        (item) => item.kind === 'procedure' && item.id === procedure.id,
      )!;
      return {
        ...common,
        id: `procedure:${procedure.id}`,
        kind: 'procedure',
        pageRole: null,
        title: procedure.title,
        href: entity.href,
        categories: entity.categories,
        aliases: uniqueTerms(procedure.aliases),
        keywords: uniqueTerms([
          ...procedure.keywords,
          ...(pageOf(topic, procedure.page)?.keywords ?? []),
        ]),
        pageTitles: [],
        headings: headingsOf(topic, procedure.page),
        anatomyTerms: anatomyTerms(topic, procedure.anatomyPage),
        complicationTerms: complicationTerms(
          topic,
          procedure.complicationsPage,
        ),
        conditions: entity.conditions.map((item) => item.title),
        procedures: [],
      };
    });
    const procedurePages = new Set(owned.map((procedure) => procedure.page));
    const pageDocuments = pages
      .filter((page) => !procedurePages.has(page.slug))
      .map((page): SearchDocument => {
        const forProcedures = (key: 'anatomyPage' | 'complicationsPage') =>
          owned.filter((procedure) => procedure[key] === page.slug);
        const anatomyOf = forProcedures('anatomyPage');
        const complicationsOf = forProcedures('complicationsPage');
        return {
          ...common,
          id: `page:${metadata.id}/${page.slug}`,
          kind: 'page',
          pageRole: anatomyOf.length
            ? 'anatomy'
            : complicationsOf.length
              ? 'complications'
              : owned.some((procedure) => procedure.aftercarePage === page.slug)
                ? 'aftercare'
                : null,
          title: page.title,
          href: `${topicHref(metadata)}/${page.slug}`,
          categories: metadata.categories,
          aliases: uniqueTerms(page.aliases),
          keywords: uniqueTerms(page.keywords),
          pageTitles: [],
          headings: headingsOf(topic, page.slug),
          anatomyTerms: anatomyOf.length ? anatomyTerms(topic, page.slug) : [],
          complicationTerms: complicationsOf.length
            ? complicationTerms(topic, page.slug)
            : [],
          conditions: [metadata.title],
          procedures: [...anatomyOf, ...complicationsOf]
            .map((procedure) => procedure.title)
            .filter((title, index, all) => all.indexOf(title) === index),
        };
      });
    // Theatre Prep pages: found by their procedure's names as keywords, so the
    // Procedure itself always outranks them for those names.
    const prepDocuments = owned
      .filter((procedure) =>
        topic.experience!.theatrePreps.some(
          (prep) => prep.procedureId === procedure.id,
        ),
      )
      .map((procedure): SearchDocument => ({
        ...common,
        id: `theatre-prep:${procedure.id}`,
        kind: 'page',
        pageRole: 'theatre-prep',
        title: 'Theatre Prep',
        href: `${topicHref(metadata)}/${procedure.page}/theatre-prep`,
        categories: metadata.categories,
        aliases: [],
        keywords: uniqueTerms([procedure.title, ...procedure.aliases]),
        pageTitles: [],
        headings: [],
        anatomyTerms: [],
        complicationTerms: [],
        conditions: [metadata.title],
        procedures: [procedure.title],
      }));
    return [
      conditionDocument,
      ...procedureDocuments,
      ...pageDocuments,
      ...prepDocuments,
    ];
  });
}
