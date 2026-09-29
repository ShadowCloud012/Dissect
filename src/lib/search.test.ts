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
  it('orders tiers from exact names through prefixes to anatomy terms', () => {
    const docs = [
      doc('term-words', { title: 'T1', anatomyTerms: ['Great vessel'] }),
      doc('term-starts', { title: 'T2', anatomyTerms: ['Vessels'] }),
      doc('heading', { title: 'H', headings: ['Vessel wall'] }),
      doc('keyword-prefix', { title: 'K1', keywords: ['great vessels'] }),
      doc('keyword-words', { title: 'K2', keywords: ['great vessel'] }),
      doc('keyword-starts', { title: 'K3', keywords: ['vessel wall'] }),
      doc('name-prefix', { title: 'N', aliases: ['Great vessels'] }),
      doc('alias-words', { title: 'A1', aliases: ['Great vessel'] }),
      doc('title-words', { title: 'Great vessel' }),
      doc('alias-starts', { title: 'A2', aliases: ['Vessels'] }),
      doc('title-starts', { title: 'Vessel wall' }),
      doc('normalised', { title: 'B', aliases: ['VESSEL.'] }),
      doc('exact-alias', { title: 'C', aliases: ['Vessel'] }),
      doc('exact-title', { title: 'Vessel' }),
    ];
    expect(rank(docs, 'vessel')).toEqual([
      ['exact-title', 1],
      ['exact-alias', 2],
      ['normalised', 3],
      ['title-starts', 4],
      ['alias-starts', 5],
      ['title-words', 6],
      ['alias-words', 7],
      ['name-prefix', 8],
      ['keyword-starts', 9],
      ['keyword-words', 10],
      ['keyword-prefix', 11],
      ['heading', 12],
      ['term-starts', 13],
      ['term-words', 14],
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
      ['long', 6],
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
  it('matches word starts from three characters, never mid-word or typos', () => {
    const docs = [doc('d', { title: 'Laparoscopic cholecystectomy' })];
    // Word starts, including a partly typed last word.
    for (const query of ['chole', 'lap', 'laparoscopic chol'])
      expect(rank(docs, query).map(([id]) => id)).toEqual(['d']);
    // Never inside a word, beyond the word, or with a typo.
    for (const query of [
      'lecyst',
      'scopic',
      'cholecystectomyy',
      'cholecistectomy',
    ])
      expect(rank(docs, query)).toEqual([]);
    // One or two characters match only whole words.
    for (const query of ['l', 'la', 'ch'])
      expect(rank(docs, query)).toEqual([]);
    expect(
      rank([doc('ct', { title: 'Imaging', keywords: ['CT'] })], 'ct'),
    ).toEqual([['ct', 9]]);
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

describe('prefix search on real content', () => {
  const path = (href: string) => href.replace('/learn/general-surgery/', '');
  const order = (query: string) =>
    search(query).map((result) => [result.kind, path(result.href)]);
  it.each([['app'], ['appe'], ['append']])(
    '"%s" leads with appendicitis, the operation, then its anatomy',
    (query) => {
      expect(order(query)).toEqual([
        ['condition', 'acute-appendicitis'],
        ['procedure', 'acute-appendicitis/appendicectomy'],
        ['anatomy', 'acute-appendicitis/anatomy'],
        ['complications', 'acute-appendicitis/complications'],
      ]);
    },
  );
  it.each([['chol'], ['chole']])(
    '"%s" leads with the gallstone condition, then the operation',
    (query) => {
      expect(order(query).slice(0, 2)).toEqual([
        ['condition', 'gallstone-disease'],
        ['procedure', 'gallstone-disease/laparoscopic-cholecystectomy'],
      ]);
    },
  );
  it('"cystic" leads with gallstone anatomy, then the operation', () => {
    expect(order('cystic')).toEqual([
      ['anatomy', 'gallstone-disease/anatomy'],
      ['procedure', 'gallstone-disease/laparoscopic-cholecystectomy'],
    ]);
    expect(search('cystic')[0].match).toEqual({
      field: 'keyword',
      term: 'cystic duct',
    });
  });
  it('"meso" leads with appendicitis anatomy and names the matched term', () => {
    const [first] = search('meso');
    expect(path(first.href)).toBe('acute-appendicitis/anatomy');
    expect(first.match).toEqual({ field: 'keyword', term: 'mesoappendix' });
  });
  it('"bile" finds gallstone complications, operation, investigations and anatomy', () => {
    expect(order('bile')).toEqual([
      ['complications', 'gallstone-disease/complications'],
      ['procedure', 'gallstone-disease/laparoscopic-cholecystectomy'],
      ['page', 'gallstone-disease/investigations'],
      ['anatomy', 'gallstone-disease/anatomy'],
    ]);
  });
  it('keeps exact names ahead of prefixes', () => {
    // "appendicitis" is an exact alias; prefix-only pages rank below it.
    const [exact, ...rest] = search('appendicitis');
    expect(exact).toMatchObject({ exact: true, tier: 2, kind: 'condition' });
    for (const result of rest) expect(result.tier).toBeGreaterThan(2);
    // A prefix is never marked as an exact match.
    expect(search('app').some((result) => result.exact)).toBe(false);
  });
  it('stays quiet for short, mid-word and misspelt queries', () => {
    for (const query of [
      'a',
      'ap',
      'pend',
      'ectomy',
      'appendisitis',
      'cholesystitis',
    ])
      expect(search(query)).toEqual([]);
  });
  it('never duplicates a URL', () => {
    for (const query of ['app', 'chol', 'bile', 'lap', 'ana']) {
      const hrefs = search(query).map((result) => result.href);
      expect(new Set(hrefs).size).toBe(hrefs.length);
    }
  });
});
