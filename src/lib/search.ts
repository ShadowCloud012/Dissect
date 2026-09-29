import type { SearchDocument } from './search-documents';
import { normaliseTerm } from './search-terms';

// Deterministic metadata search over the generated search documents. No
// fuzzy matching, typo correction or clinical prose: a query matches a term
// when it equals it or appears in it as whole words, after normalisation.

export type SearchResultKind =
  'condition' | 'procedure' | 'anatomy' | 'complications' | 'page';
export const resultKindLabels: Record<SearchResultKind, string> = {
  condition: 'Condition',
  procedure: 'Procedure',
  anatomy: 'Anatomy',
  complications: 'Complications',
  page: 'Topic page',
};
// Why a result matched, shown to the reader; a title match needs no note.
export type MatchField =
  'title' | 'alias' | 'keyword' | 'heading' | 'anatomy' | 'complication';
export const matchLabels: Record<Exclude<MatchField, 'title'>, string> = {
  alias: 'Also known as',
  keyword: 'Matched keyword',
  heading: 'Matched heading',
  anatomy: 'Matched anatomy term',
  complication: 'Matched complication term',
};
export type SearchResult = {
  id: string;
  kind: SearchResultKind;
  title: string;
  href: string;
  specialty: string;
  // The condition a procedure or subpage belongs to.
  parent: string | null;
  status: string;
  // 1 (best) to 8; used for ordering and tests, never displayed.
  tier: number;
  match: { field: MatchField; term: string };
  // The one condition or procedure whose name is exactly the query.
  exact: boolean;
};

// Ranking tiers, best first:
// 1 exact title · 2 exact alias · 3 normalised title/alias ·
// 4 title contains · 5 alias contains · 6 keyword ·
// 7 section heading · 8 anatomy/complication term.
const exactly = (term: string) =>
  term.trim().toLowerCase().replace(/\s+/g, ' ');
const containsWords = (term: string, query: string) =>
  ` ${normaliseTerm(term)} `.includes(` ${query} `);

function bestMatch(document: SearchDocument, raw: string, query: string) {
  const candidates: { tier: number; field: MatchField; term: string }[] = [];
  const add = (tier: number, field: MatchField, term: string) =>
    candidates.push({ tier, field, term });
  const { title } = document;
  if (exactly(title) === raw) add(1, 'title', title);
  else if (normaliseTerm(title) === query) add(3, 'title', title);
  else if (containsWords(title, query)) add(4, 'title', title);
  for (const alias of document.aliases)
    if (exactly(alias) === raw) add(2, 'alias', alias);
    else if (normaliseTerm(alias) === query) add(3, 'alias', alias);
    else if (containsWords(alias, query)) add(5, 'alias', alias);
  for (const keyword of document.keywords)
    if (containsWords(keyword, query)) add(6, 'keyword', keyword);
  for (const heading of document.headings)
    if (containsWords(heading, query)) add(7, 'heading', heading);
  for (const term of document.anatomyTerms)
    if (containsWords(term, query)) add(8, 'anatomy', term);
  for (const term of document.complicationTerms)
    if (containsWords(term, query)) add(8, 'complication', term);
  // The first candidate at the best tier: authored order breaks ties.
  return candidates.reduce<(typeof candidates)[number] | undefined>(
    (best, candidate) =>
      !best || candidate.tier < best.tier ? candidate : best,
    undefined,
  );
}

// Equal tiers are ordered by kind. A name match (tiers 1–5) leads with the
// condition or procedure; a keyword or term match (tiers 6–8) leads with the
// most specific page, e.g. mesoappendix → Anatomy before the operation.
const nameOrder: SearchResultKind[] = [
  'condition',
  'procedure',
  'anatomy',
  'complications',
  'page',
];
const termOrder: SearchResultKind[] = [
  'anatomy',
  'complications',
  'procedure',
  'condition',
  'page',
];
const kindRank = (result: SearchResult) =>
  (result.tier <= 5 ? nameOrder : termOrder).indexOf(result.kind);
function kindOf(document: SearchDocument): SearchResultKind {
  if (document.kind !== 'page') return document.kind;
  if (document.pageRole === 'anatomy') return 'anatomy';
  if (document.pageRole === 'complications') return 'complications';
  return 'page';
}

export function searchIndex(
  documents: SearchDocument[],
  query: string,
  specialtyTitles: Record<string, string>,
): SearchResult[] {
  const normalised = normaliseTerm(query);
  if (!normalised) return [];
  const raw = exactly(query);
  const results = documents.flatMap((document) => {
    const match = bestMatch(document, raw, normalised);
    if (!match) return [];
    const kind = kindOf(document);
    const parent =
      document.kind === 'condition' ? null : document.conditions[0];
    return [
      {
        id: document.id,
        kind,
        // Subpage titles ("Anatomy") are named with their condition.
        title:
          document.kind === 'page'
            ? `${document.title} — ${parent}`
            : document.title,
        href: document.href,
        specialty: specialtyTitles[document.specialty] ?? document.specialty,
        parent,
        status: document.status,
        tier: match.tier,
        match: { field: match.field, term: match.term },
        exact: false,
      },
    ];
  });
  // A name shared by a condition/procedure and the query resolves to it.
  const named = results.filter(
    (result) =>
      result.tier <= 3 &&
      (result.kind === 'condition' || result.kind === 'procedure'),
  );
  if (named.length === 1) named[0].exact = true;
  return results.sort(
    (a, b) =>
      Number(b.exact) - Number(a.exact) ||
      a.tier - b.tier ||
      kindRank(a) - kindRank(b) ||
      a.title.localeCompare(b.title, 'en') ||
      a.href.localeCompare(b.href, 'en'),
  );
}
