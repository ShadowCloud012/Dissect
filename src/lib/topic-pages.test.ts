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
  topicIndexEntries,
} from './topic-pages';
const topic = topicRegistry.getTopic('general-surgery', 'acute-appendicitis')!;
it('discovers one canonical topic in two categories without inflating counts', () => {
  expect(specialties).toHaveLength(1);
  expect(topicRegistry.listBySpecialty('general-surgery')).toHaveLength(1);
  expect(topicRegistry.countTopics('general-surgery')).toBe(1);
  for (const category of ['emergency-general-surgery', 'colorectal']) {
    const found = topicRegistry.listByCategory('general-surgery', category);
    expect(found).toHaveLength(1);
    expect(topicHref(found[0])).toBe(
      '/learn/general-surgery/acute-appendicitis',
    );
    expect(getCategory('general-surgery', category)).toBeDefined();
  }
  expect(topicRegistry.listByCategory('general-surgery', 'breast')).toEqual([]);
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
  expect(topicIndexEntries(topic)).toHaveLength(10);
  expect(
    topicIndexEntries(topic).every(
      (entry) =>
        entry.headings.length &&
        entry.route.startsWith(topicHref(topic.metadata)),
    ),
  ).toBe(true);
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
  invalid.experience = structuredClone(topic.experience);
  invalid.experience!.journey.push({ label: 'X', page: 'missing' });
  expect(() => validateTopic(invalid)).toThrow(/Unknown journey page/);
  invalid.experience = structuredClone(topic.experience);
  invalid.experience!.journey.push({ label: 'X' });
  expect(() => validateTopic(invalid)).toThrow(/needs a page or a group/);
  invalid.experience = structuredClone(topic.experience);
  invalid.experience!.related[0].page = 'missing';
  expect(() => validateTopic(invalid)).toThrow(/Unknown related page/);
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
