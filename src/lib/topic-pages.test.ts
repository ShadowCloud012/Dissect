import { expect, it } from 'vitest';
import { topicRegistry } from '@/content/registry';
import { getCategory, specialties } from '@/content/specialties';
import { validateTopic } from '@/schemas/topic';
import {
  localPolicyEntries,
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
  for (const entry of selectQuickReference(topic))
    expect(topic.sections.flatMap((section) => section.blocks)).toContain(
      entry.block,
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
  invalid.experience = structuredClone(topic.experience);
  invalid.experience!.quickReference[0].itemIndex = 99;
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
  invalid.experience = structuredClone(topic.experience);
  invalid.experience!.quickReference[0].itemIndex = 4;
  expect(() => validateTopic(invalid)).toThrow(/item index/);
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
