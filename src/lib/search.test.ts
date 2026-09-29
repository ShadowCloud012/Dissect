import { describe, expect, it } from 'vitest';
import { topicRegistry } from '@/content/registry';
import type { SearchDocument } from './search-documents';
import { searchIndex } from './search';

const titles = { 'general-surgery': 'General Surgery' };
const documents = topicRegistry.searchDocuments();
const search = (query: string) => searchIndex(documents, query, titles);
const summary = (query: string) =>
  search(query).map((result) => [result.kind, result.href]);

// Synthetic documents isolate each ranking rule from real content.
const doc = (
  id: string,
  fields: Partial<SearchDocument> = {},
): SearchDocument => ({
  id,
  kind: 'page',
  pageRole: null,
  title: id,
  href: `/learn/general-surgery/fixture/${id}`,
  specialty: 'general-surgery',
  categories: [],
  status: 'awaiting-review',
  aliases: [],
  keywords: [],
  pageTitles: [],
  headings: [],
  anatomyTerms: [],
  complicationTerms: [],
  conditions: ['Fixture condition'],
  procedures: [],
  ...fields,
});
const rank = (docs: SearchDocument[], query: string) =>
  searchIndex(docs, query, titles).map((result) => [result.id, result.tier]);

describe('ranking', () => {
  it('orders tiers from exact title to anatomy/complication terms', () => {
    const docs = [
      doc('term', { title: 'Term', anatomyTerms: ['Vessel'] }),
      doc('heading', { title: 'Heading', headings: ['Vessel'] }),
      doc('keyword', { title: 'Keyword', keywords: ['vessel'] }),
      doc('alias-contains', { title: 'A', aliases: ['Great vessel'] }),
      doc('title-contains', { title: 'Great vessel' }),
      doc('normalised', { title: 'B', aliases: ['VESSEL.'] }),
      doc('exact-alias', { title: 'C', aliases: ['Vessel'] }),
      doc('exact-title', { title: 'Vessel' }),
    ];
    expect(rank(docs, 'vessel')).toEqual([
      ['exact-title', 1],
      ['exact-alias', 2],
      ['normalised', 3],
      ['title-contains', 4],
      ['alias-contains', 5],
      ['keyword', 6],
      ['heading', 7],
      ['term', 8],
    ]);
  });
  it('lets an exact title beat a title that merely contains the query', () => {
    expect(
      rank(
        [
          doc('long', { title: 'Acute cholecystitis' }),
          doc('short', { title: 'Cholecystitis' }),
        ],
        'cholecystitis',
      ),
    ).toEqual([
      ['short', 1],
      ['long', 4],
    ]);
  });
  it('lets an exact alias beat a heading match', () => {
    expect(
      rank(
        [
          doc('heading', { headings: ['Imaging'] }),
          doc('alias', { aliases: ['Imaging'] }),
        ],
        'imaging',
      ).map(([id]) => id),
    ).toEqual(['alias', 'heading']);
  });
  it('breaks ties by kind, then title, then URL', () => {
    const docs = [
      doc('b', { title: 'Beta', keywords: ['x'] }),
      doc('a', { title: 'Alpha', keywords: ['x'] }),
      doc('p', { kind: 'procedure', title: 'Zeta', keywords: ['x'] }),
      doc('n', { pageRole: 'anatomy', title: 'Omega', keywords: ['x'] }),
    ];
    // A term match leads with the specific page, then the procedure.
    expect(rank(docs, 'x').map(([id]) => id)).toEqual(['n', 'p', 'a', 'b']);
    expect(rank([...docs].reverse(), 'x')).toEqual(rank(docs, 'x'));
  });
  it('matches whole words only, never partial words or typos', () => {
    const docs = [doc('d', { title: 'Cholecystectomy' })];
    for (const query of ['chole', 'cholecystectomyy', 'cholecystectom'])
      expect(rank(docs, query)).toEqual([]);
  });
});

describe('real terms', () => {
  it.each([
    ['appendicitis', 'condition', 'acute-appendicitis'],
    ['appendectomy', 'procedure', 'acute-appendicitis/appendicectomy'],
    ['appendicectomy', 'procedure', 'acute-appendicitis/appendicectomy'],
    [
      'lap chole',
      'procedure',
      'gallstone-disease/laparoscopic-cholecystectomy',
    ],
    [
      'Gallbladder removal',
      'procedure',
      'gallstone-disease/laparoscopic-cholecystectomy',
    ],
    ['biliary colic', 'condition', 'gallstone-disease'],
    ['cystic duct', 'anatomy', 'gallstone-disease/anatomy'],
    ['bile duct injury', 'complications', 'gallstone-disease/complications'],
    ['mesoappendix', 'anatomy', 'acute-appendicitis/anatomy'],
    ['stump appendicitis', 'complications', 'acute-appendicitis/complications'],
    [
      'critical view',
      'procedure',
      'gallstone-disease/laparoscopic-cholecystectomy',
    ],
  ])('"%s" leads with the %s', (query, kind, path) => {
    expect(summary(query)[0]).toEqual([kind, `/learn/general-surgery/${path}`]);
  });
  it('flags one exact condition or procedure, agreeing with resolveTerm', () => {
    for (const query of [
      'appendicitis',
      'Appendectomy',
      'lap chole',
      'biliary colic',
    ]) {
      const [first, ...rest] = search(query);
      expect(first.exact).toBe(true);
      expect(rest.some((result) => result.exact)).toBe(false);
      expect(first.id.split(':')[1]).toBe(
        topicRegistry.resolveTerm(query)[0].id,
      );
    }
    // Term matches are not exact names.
    expect(search('cystic duct').some((result) => result.exact)).toBe(false);
  });
  it('keeps conditions and procedures as separate results', () => {
    expect(summary('appendicectomy')).toEqual([
      ['procedure', '/learn/general-surgery/acute-appendicitis/appendicectomy'],
      ['condition', '/learn/general-surgery/acute-appendicitis'],
    ]);
  });
  it('explains non-title matches with the authored term', () => {
    const [procedure] = search('lap chole');
    expect(procedure.match).toEqual({ field: 'alias', term: 'lap chole' });
    const [anatomy] = search('cystic duct');
    expect(anatomy).toMatchObject({
      title: 'Anatomy — Gallstone disease and acute cholecystitis',
      specialty: 'General Surgery',
      parent: 'Gallstone disease and acute cholecystitis',
      match: { field: 'keyword', term: 'cystic duct' },
    });
  });
  it('keeps every result on a canonical URL, once, with its review status', () => {
    for (const query of [
      'anatomy',
      'appendicitis',
      'bile duct injury',
      'cholecystectomy',
    ]) {
      const results = search(query);
      const hrefs = results.map((result) => result.href);
      expect(new Set(hrefs).size).toBe(hrefs.length);
      for (const result of results) {
        expect(documents.map((entry) => entry.href)).toContain(result.href);
        expect(result.status).toBe('awaiting-review');
      }
    }
    // Each procedure appears once, as a procedure, never as a plain page.
    expect(
      search('cholecystectomy').filter((result) =>
        result.href.endsWith('/laparoscopic-cholecystectomy'),
      ),
    ).toEqual([expect.objectContaining({ kind: 'procedure' })]);
  });
  it('does not guess', () => {
    for (const query of [
      '',
      '   ',
      'lap appy',
      'hernia',
      'appendisitis',
      'LC',
      'xyz',
    ])
      expect(search(query)).toEqual([]);
  });
});
