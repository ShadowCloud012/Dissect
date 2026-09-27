import { expect, it } from 'vitest';
import { howDissectContentWorks } from '@/content/demo/how-dissect-content-works';
import { createTopicRegistry } from './topic-registry';
const entry = { source: 'demo', content: howDissectContentWorks };
it('exposes metadata, sections and sources, with specialty-scoped lookup', () => {
  const registry = createTopicRegistry([entry]);
  expect(registry.listTopics()).toHaveLength(1);
  const topic = registry.getTopic('demo', 'how-dissect-content-works')!;
  expect(topic.sections).toHaveLength(3);
  expect(topic.references).toHaveLength(2);
  expect(registry.getTopic('other', topic.metadata.slug)).toBeUndefined();
  topic.metadata.title = 'Changed';
  expect(registry.listTopics()[0].title).toBe('How Dissect content works');
});
it('rejects malformed and duplicate registrations', () => {
  expect(() =>
    createTopicRegistry([{ source: 'bad.ts', content: {} }]),
  ).toThrow(/bad.ts/);
  expect(() => createTopicRegistry([entry, entry])).toThrow(
    /Duplicate topic registration/,
  );
});
