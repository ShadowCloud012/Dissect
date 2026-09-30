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
  // 1 (best) to 14; used for ordering and tests, never displayed.
  tier: number;
  match: { field: MatchField; term: string };
  // The one condition or procedure whose name is exactly the query.
  exact: boolean;
};

// Ranking tiers, best first. "Starts with" means the whole term begins with
// the query; a word prefix means a later word does. Matches only ever begin
// at a word boundary, never mid-word ("pend" does not match "appendix").
//  1 exact title              ·  2 exact alias
//  3 normalised title/alias   ·  4 title starts with   ·  5 alias starts with
//  6 title whole words        ·  7 alias whole words   ·  8 title/alias word prefix
//  9 keyword starts with      · 10 keyword whole words · 11 keyword word prefix
// 12 section heading          · 13 anatomy/complication term starts with
// 14 anatomy/complication term whole words or word prefix
const exactly = (term: string) =>
  term.trim().toLowerCase().replace(/\s+/g, ' ');
// Prefix matching needs at least three characters, so "a" or "ap" do not
// return half the site; shorter queries still match whole words ("CT").
export const minimumPrefixLength = 3;
type Strength = 'starts' | 'words' | 'prefix';
function strength(term: string, query: string): Strength | undefined {
  const normalised = ` ${normaliseTerm(term)} `;
  const prefixes = query.length >= minimumPrefixLength;
  if (normalised.startsWith(` ${query} `)) return 'starts';
  if (prefixes && normalised.startsWith(` ${query}`)) return 'starts';
  if (normalised.includes(` ${query} `)) return 'words';
  if (prefixes && normalised.includes(` ${query}`)) return 'prefix';
  return undefined;
}

function bestMatch(document: SearchDocument, raw: string, query: string) {
  const candidates: { tier: number; field: MatchField; term: string }[] = [];
  const add = (tier: number, field: MatchField, term: string) =>
    candidates.push({ tier, field, term });
  const names = [
    ...[document.title].map((term) => ['title', term, 1, 4, 6] as const),
    ...document.aliases.map((term) => ['alias', term, 2, 5, 7] as const),
  ];
  for (const [field, term, exact, starts, words] of names) {
    const match = strength(term, query);
    if (exactly(term) === raw) add(exact, field, term);
    else if (normaliseTerm(term) === query) add(3, field, term);
    else if (match === 'starts') add(starts, field, term);
    else if (match === 'words') add(words, field, term);
    else if (match === 'prefix') add(8, field, term);
  }
  for (const keyword of document.keywords) {
    const match = strength(keyword, query);
    if (match)
      add({ starts: 9, words: 10, prefix: 11 }[match], 'keyword', keyword);
  }
  for (const heading of document.headings)
    if (strength(heading, query)) add(12, 'heading', heading);
  for (const [field, terms] of [
    ['anatomy', document.anatomyTerms],
    ['complication', document.complicationTerms],
  ] as const)
    for (const term of terms) {
      const match = strength(term, query);
      if (match) add(match === 'starts' ? 13 : 14, field, term);
    }
  // The first candidate at the best tier: authored order breaks ties.
  return candidates.reduce<(typeof candidates)[number] | undefined>(
    (best, candidate) =>
      !best || candidate.tier < best.tier ? candidate : best,
    undefined,
  );
}

// Equal tiers are ordered by kind. A name match (tiers 1–8) leads with the
// condition or procedure; a keyword or term match (tiers 9–14) leads with the
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
  (result.tier <= 8 ? nameOrder : termOrder).indexOf(result.kind);
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
            ? // Theatre Prep is named with its procedure, other pages with
              // their condition.
              `${document.title} — ${document.pageRole === 'theatre-prep' ? document.procedures[0] : parent}`
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
