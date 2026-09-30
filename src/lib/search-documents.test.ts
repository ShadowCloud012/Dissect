import { expect, it } from 'vitest';
import { topicRegistry } from '@/content/registry';
import { normaliseTerm } from './search-documents';

const documents = topicRegistry.searchDocuments();
const document = (id: string) => documents.find((entry) => entry.id === id)!;

it.each([
  ['  Lap   CHOLE ', 'lap chole'],
  ['Lap. chole', 'lap chole'],
  ['lap-chole', 'lap chole'],
  ['Calot’s triangle', 'calot triangle'],
  ["Murphy's sign", 'murphy sign'],
  ['Crème & brûlée', 'creme and brulee'],
])('normalises "%s" predictably', (term, expected) => {
  expect(normaliseTerm(term)).toBe(expected);
});

it('generates one document per canonical URL, deterministically', () => {
  const ids = documents.map((entry) => entry.id);
  const hrefs = documents.map((entry) => entry.href);
  expect(new Set(ids).size).toBe(ids.length);
  expect(new Set(hrefs).size).toBe(hrefs.length);
  expect(topicRegistry.searchDocuments()).toEqual(documents);
  // Two condition hubs, two procedure pages and 20 other pages; the
  // procedure pages are not indexed a second time as plain pages.
  expect(documents.filter((entry) => entry.kind === 'condition')).toHaveLength(
    2,
  );
  expect(documents.filter((entry) => entry.kind === 'procedure')).toHaveLength(
    2,
  );
  // 18 topic subpages plus one Theatre Prep page per procedure.
  expect(documents.filter((entry) => entry.kind === 'page')).toHaveLength(20);
  expect(hrefs).not.toContain(
    '/learn/general-surgery/how-dissect-content-works',
  );
  // Every document points at a real topic route.
  for (const entry of documents) {
    const [, , specialty, slug, page] = entry.href.split('/');
    const topic = topicRegistry.getTopic(specialty, slug)!;
    if (page)
      expect(topic.experience!.pages.map((item) => item.slug)).toContain(page);
  }
});

it('keeps condition and procedure kinds, names and relationships', () => {
  expect(document('condition:gallstone-disease')).toMatchObject({
    kind: 'condition',
    title: 'Gallstone disease and acute cholecystitis',
    href: '/learn/general-surgery/gallstone-disease',
    categories: ['emergency-general-surgery', 'hpb'],
    status: 'awaiting-review',
    aliases: expect.arrayContaining(['acute cholecystitis', 'biliary colic']),
    procedures: ['Laparoscopic cholecystectomy'],
    pageTitles: expect.arrayContaining(['Assessment', 'Evidence']),
  });
  expect(document('procedure:laparoscopic-cholecystectomy')).toMatchObject({
    kind: 'procedure',
    href: '/learn/general-surgery/gallstone-disease/laparoscopic-cholecystectomy',
    aliases: expect.arrayContaining(['lap chole', 'gallbladder removal']),
    conditions: ['Gallstone disease and acute cholecystitis'],
    // Anatomy and complication terms come from the procedure's related pages.
    anatomyTerms: expect.arrayContaining([
      'Hepatocystic triangle',
      'cystic duct',
    ]),
    complicationTerms: expect.arrayContaining(['bile leak', 'Wound infection']),
  });
  expect(document('procedure:laparoscopic-appendicectomy')).toMatchObject({
    aliases: expect.arrayContaining(['appendicectomy', 'appendectomy']),
    anatomyTerms: expect.arrayContaining(['mesoappendix']),
    complicationTerms: expect.arrayContaining(['Collection']),
  });
  expect(document('page:gallstone-disease/anatomy')).toMatchObject({
    kind: 'page',
    aliases: expect.arrayContaining(['Calot triangle']),
    procedures: ['Laparoscopic cholecystectomy'],
  });
});

it('indexes curated metadata and headings, not clinical prose', () => {
  const text = JSON.stringify(documents);
  // Authored sentences never enter the index.
  for (const topic of ['acute-appendicitis', 'gallstone-disease'])
    for (const block of topicRegistry
      .getTopic('general-surgery', topic)!
      .sections.flatMap((section) => section.blocks))
      if (block.type === 'prose')
        expect(text).not.toContain(block.paragraphs[0]);
  // No term is repeated within one field once normalised.
  for (const entry of documents)
    for (const field of [
      entry.aliases,
      entry.keywords,
      entry.anatomyTerms,
      entry.complicationTerms,
    ]) {
      const normalised = field.map(normaliseTerm);
      expect(new Set(normalised).size).toBe(normalised.length);
    }
});
