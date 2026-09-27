import { describe, expect, it } from 'vitest';
import { howDissectContentWorks } from '@/content/demo/how-dissect-content-works';
import { validateTopic } from './topic';
const fixture = () => validateTopic(howDissectContentWorks, 'demo fixture');
describe('topic validation', () => {
  it('accepts the demo and every supported block type', () => {
    expect(
      new Set(
        fixture().sections.flatMap((section) =>
          section.blocks.map((block) => block.type),
        ),
      ).size,
    ).toBe(9);
  });
  it('reports malformed content with source and field path', () => {
    const topic = fixture();
    topic.metadata.lastClinicallyReviewed = '2026-02-30';
    expect(() => validateTopic(topic, 'broken-fixture.ts')).toThrow(
      /broken-fixture.ts:[\s\S]*metadata.lastClinicallyReviewed/,
    );
  });
  it('rejects unknown fields rather than silently stripping them', () => {
    expect(() => validateTopic({ ...fixture(), unexpected: true })).toThrow(
      /Unrecognized key/,
    );
  });
  it('rejects broken block and claim reference IDs with their paths', () => {
    const topic = fixture();
    topic.sections[0].blocks[0].referenceIds = ['missing-source'];
    const group = topic.sections[2].blocks[0];
    if (group.type !== 'claimGroup') throw new Error('Expected claim fixture');
    group.claims[0].referenceIds = ['missing-claim-source'];
    expect(() => validateTopic(topic)).toThrow(
      /sections.0.blocks.0.referenceIds.0: Unknown reference ID/,
    );
    expect(() => validateTopic(topic)).toThrow(
      /sections.2.blocks.0.claims.0.referenceIds.0: Unknown reference ID/,
    );
  });
  it('rejects duplicate IDs and mismatched table rows', () => {
    const topic = fixture();
    topic.references.push(topic.references[0]);
    topic.sections[1].id = topic.sections[0].id;
    expect(() => validateTopic(topic)).toThrow(/Duplicate reference ID/);
    expect(() => validateTopic(topic)).toThrow(/Duplicate section ID/);
    const table = topic.sections[1].blocks.find(
      (block) => block.type === 'table',
    );
    if (!table || table.type !== 'table')
      throw new Error('Expected table fixture');
    table.rows[0] = ['wrong width'];
    expect(() => validateTopic(topic)).toThrow(/Each row must match/);
  });
  it('rejects unsafe source URLs, invalid levels and unreferenced claims', () => {
    const topic = fixture();
    topic.references[0].url = 'javascript:alert(1)';
    expect(() => validateTopic(topic)).toThrow(/references.0.url/);
    const group = topic.sections[2].blocks[0];
    if (group.type !== 'claimGroup') throw new Error('Expected claim fixture');
    group.claims[0].referenceIds = [];
    expect(() => validateTopic(topic)).toThrow(/claims.0.referenceIds/);
    expect(() =>
      validateTopic({
        ...topic,
        sections: [
          {
            ...topic.sections[0],
            blocks: [
              { ...topic.sections[0].blocks[0], minimumLevel: 'consultant' },
            ],
          },
        ],
      }),
    ).toThrow(/minimumLevel/);
  });
});
