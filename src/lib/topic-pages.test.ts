import { expect, it } from 'vitest';
import { topicRegistry } from '@/content/registry';
import { getCategory, specialties } from '@/content/specialties';
import { validateTopic } from '@/schemas/topic';
import {
  localPolicyEntries,
  quickReferenceBlocks,
  resolveTopicPage,
  selectQuickReference,
  topicHref,
} from './topic-pages';
const topic = topicRegistry.getTopic('general-surgery', 'acute-appendicitis')!;
it('discovers each canonical topic in its categories without inflating counts', () => {
  expect(specialties).toHaveLength(1);
  expect(topicRegistry.listBySpecialty('general-surgery')).toHaveLength(2);
  expect(topicRegistry.countTopics('general-surgery')).toBe(2);
  const hrefs = (category: string) =>
    topicRegistry
      .listByCategory('general-surgery', category)
      .map((metadata) => topicHref(metadata));
  expect(hrefs('colorectal')).toEqual([
    '/learn/general-surgery/acute-appendicitis',
  ]);
  expect(hrefs('hpb')).toEqual(['/learn/general-surgery/gallstone-disease']);
  expect(hrefs('emergency-general-surgery')).toEqual([
    '/learn/general-surgery/acute-appendicitis',
    '/learn/general-surgery/gallstone-disease',
  ]);
  for (const category of ['emergency-general-surgery', 'colorectal', 'hpb'])
    expect(getCategory('general-surgery', category)).toBeDefined();
  expect(topicRegistry.listByCategory('general-surgery', 'breast')).toEqual([]);
});
it('classifies conditions and procedures and links them both ways', () => {
  const conditions = topicRegistry.listConditions('general-surgery');
  const procedures = topicRegistry.listProcedures('general-surgery');
  expect(conditions.every((entry) => entry.kind === 'condition')).toBe(true);
  expect(procedures.every((entry) => entry.kind === 'procedure')).toBe(true);
  // Every procedure's canonical URL is a real subpage of its condition.
  for (const procedure of procedures) {
    const [condition] = procedure.conditions;
    expect(procedure.href.startsWith(`${condition.href}/`)).toBe(true);
    const topic = topicRegistry.getTopic(
      'general-surgery',
      condition.href.split('/').at(-1)!,
    )!;
    expect(
      topic.experience!.pages.some((page) =>
        procedure.href.endsWith(`/${page.slug}`),
      ),
    ).toBe(true);
    // …and that condition lists the procedure back.
    expect(
      conditions
        .find((entry) => entry.id === condition.id)!
        .procedures.map((entry) => entry.id),
    ).toContain(procedure.id);
  }
  // Procedures inherit discovery categories from their condition.
  expect(
    topicRegistry.listProcedures('general-surgery', 'hpb').map((p) => p.id),
  ).toEqual(['laparoscopic-cholecystectomy']);
  // The demo topic is neither a condition nor a procedure.
  expect(
    topicRegistry.discoveryEntries().map((entry) => entry.id),
  ).not.toContain('how-dissect-content-works');
});
it.each([
  ['lap chole', 'procedure', 'laparoscopic-cholecystectomy'],
  ['Laparoscopic cholecystectomy', 'procedure', 'laparoscopic-cholecystectomy'],
  ['cholecystectomy', 'procedure', 'laparoscopic-cholecystectomy'],
  ['appendicectomy', 'procedure', 'laparoscopic-appendicectomy'],
  ['appendectomy', 'procedure', 'laparoscopic-appendicectomy'],
  ['acute cholecystitis', 'condition', 'gallstone-disease'],
  ['biliary colic', 'condition', 'gallstone-disease'],
  ['appendicitis', 'condition', 'acute-appendicitis'],
])('resolves the term "%s" to one %s', (term, kind, id) => {
  const matches = topicRegistry.resolveTerm(term);
  expect(matches.map((entry) => [entry.kind, entry.id])).toEqual([[kind, id]]);
});
it('resolves subpages using original sections and selects blocks by identity', () => {
  const owned = topic.experience!.pages.flatMap(
    (page) => resolveTopicPage(topic, page.slug)!.sections,
  );
  expect(owned).toHaveLength(15);
  expect(new Set(owned).size).toBe(15);
  for (const section of owned) expect(topic.sections).toContain(section);
  // Block entries and every extract resolve to the authored block objects.
  for (const entry of selectQuickReference(topic))
    for (const block of quickReferenceBlocks(entry))
      expect(topic.sections.flatMap((section) => section.blocks)).toContain(
        block,
      );
  expect(resolveTopicPage(topic, 'missing')).toBeUndefined();
});
it('rejects dangling pages, duplicate ownership and invalid item selections', () => {
  const invalid = structuredClone(topic);
  invalid.experience!.pages[0].sectionIds.push('missing');
  expect(() => validateTopic(invalid)).toThrow(/Unknown section/);
  invalid.experience = structuredClone(topic.experience);
  invalid.experience!.pages[1].sectionIds.push('presentation');
  expect(() => validateTopic(invalid)).toThrow(/one subpage owner/);
  const itemSelection = () =>
    invalid.experience!.quickReference.find(
      (selection) => 'itemIndex' in selection,
    ) as { itemIndex?: number };
  invalid.experience = structuredClone(topic.experience);
  itemSelection().itemIndex = 99;
  expect(() => validateTopic(invalid)).toThrow(/item index/);
  invalid.experience = structuredClone(topic.experience);
  invalid.experience!.contexts[0].links[0].page = 'missing';
  expect(() => validateTopic(invalid)).toThrow(/Unknown related page/);
  invalid.experience = structuredClone(topic.experience);
  invalid.experience!.quickReference[0].group = 'missing';
  expect(() => validateTopic(invalid)).toThrow(/Unknown quick-reference group/);
  invalid.experience = structuredClone(topic.experience);
  invalid.experience!.quickReferenceGroups.push({ id: 'unused', title: 'X' });
  expect(() => validateTopic(invalid)).toThrow(/Empty quick-reference group/);
  // at-a-glance has four rows, so row index 4 does not exist.
  invalid.experience = structuredClone(topic.experience);
  itemSelection().itemIndex = 4;
  expect(() => validateTopic(invalid)).toThrow(/item index/);
  // Extracts must be verbatim fragments of their source block.
  const extracts = () =>
    invalid.experience!.quickReference.find((selection) => 'rows' in selection)!
      .rows as { extracts: { text: string; blockId: string }[] }[];
  invalid.experience = structuredClone(topic.experience);
  extracts()[0].extracts[0].text = 'Pain always starts centrally';
  expect(() => validateTopic(invalid)).toThrow(/not verbatim/);
  invalid.experience = structuredClone(topic.experience);
  extracts()[0].extracts[0].blockId = 'missing';
  expect(() => validateTopic(invalid)).toThrow(/Unknown extract block/);
  // Walkthroughs quote their sources, cover every authored step in order and
  // never mark a populated field as a gap.
  const walkthrough = () => invalid.experience!.walkthroughs[0];
  invalid.experience = structuredClone(topic.experience);
  walkthrough().steps[1].fields[0].extracts[0].text = 'Always retrocaecal';
  expect(() => validateTopic(invalid)).toThrow(/not verbatim/);
  invalid.experience = structuredClone(topic.experience);
  walkthrough().steps.pop();
  expect(() => validateTopic(invalid)).toThrow(/cover each authored step/);
  invalid.experience = structuredClone(topic.experience);
  walkthrough().steps[2].gaps.push('why');
  expect(() => validateTopic(invalid)).toThrow(/gap is also populated/);
  // A panel may only stand in for a block it quotes.
  invalid.experience = structuredClone(topic.experience);
  invalid.experience!.briefings[1].absorbsBlockIds.push('operation-outline');
  invalid.experience!.briefings[1].rows =
    invalid.experience!.briefings[1].rows.filter(
      (row) =>
        !row.extracts.some(
          (extract) => extract.blockId === 'operation-outline',
        ),
    );
  expect(() => validateTopic(invalid)).toThrow(/must quote the block/);
  // Cross-links must point at real pages, blocks on those pages and steps.
  invalid.experience = structuredClone(topic.experience);
  invalid.experience!.blockLinks[0].links[0] = {
    label: 'X',
    page: 'anatomy',
    blockId: 'operative-sequence',
  };
  expect(() => validateTopic(invalid)).toThrow(/Link block not on its page/);
  invalid.experience = structuredClone(topic.experience);
  invalid.experience!.blockLinks[0].links[0] = {
    label: 'X',
    page: 'appendicectomy',
    step: 9,
  };
  expect(() => validateTopic(invalid)).toThrow(/Unknown walkthrough step/);
  invalid.experience = structuredClone(topic.experience);
  invalid.experience!.journey.push({ label: 'X', page: 'missing' });
  expect(() => validateTopic(invalid)).toThrow(/Unknown journey page/);
  invalid.experience = structuredClone(topic.experience);
  invalid.experience!.journey.push({ label: 'X' });
  expect(() => validateTopic(invalid)).toThrow(/needs a page or a group/);
  invalid.experience = structuredClone(topic.experience);
  invalid.experience!.pathways[0].branches[0].blockId = 'symptom-pattern';
  expect(() => validateTopic(invalid)).toThrow(/belong to its page/);
  invalid.experience = structuredClone(topic.experience);
  delete invalid.experience!.presentation.find(
    (item) => item.variant === 'cards',
  )!.itemLabels;
  expect(() => validateTopic(invalid)).toThrow(/Cards require/);
});
it('exposes quick-jump pages and locates every local-policy block on its owning page', () => {
  expect(
    topic.experience!.pages.filter((page) => page.quickJump).map((p) => p.slug),
  ).toEqual([
    'assessment',
    'investigations',
    'management',
    'anatomy',
    'appendicectomy',
    'complications',
  ]);
  const entries = localPolicyEntries(topic);
  const flagged = topic.sections
    .flatMap((section) => section.blocks)
    .filter((block) => block.localPolicyMayVary);
  expect(entries.map((entry) => entry.anchor)).toEqual(
    flagged.map((block) => `block-${block.id}`),
  );
  for (const entry of entries) {
    const owned = resolveTopicPage(topic, entry.page.slug)!.sections.flatMap(
      (section) => section.blocks.map((block) => `block-${block.id}`),
    );
    expect(owned).toContain(entry.anchor);
  }
});
