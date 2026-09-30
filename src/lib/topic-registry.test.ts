import { describe, expect, it } from 'vitest';
import { howDissectContentWorks } from '@/content/demo/how-dissect-content-works';
import { acuteAppendicitis } from '@/content/topics/acute-appendicitis';
import { gallstoneDisease } from '@/content/topics/gallstone-disease';
import { topicRegistry } from '@/content/registry';
import { validateTopic } from '@/schemas/topic';
import { createTopicRegistry } from './topic-registry';
const entry = { source: 'demo', content: howDissectContentWorks };

// A structural fixture, not clinical content: it links one procedure to a
// second condition to prove the model supports many-to-many relationships.
function linkedFixture(linkedConditionIds: string[]) {
  const gallstone = structuredClone(gallstoneDisease);
  Object.assign(gallstone.metadata.procedures[0], { linkedConditionIds });
  return createTopicRegistry([
    { source: 'appendicitis', content: acuteAppendicitis },
    { source: 'gallstone', content: gallstone },
  ]);
}

describe('condition ↔ procedure relationships', () => {
  it('link each current condition to its procedure and back', () => {
    const entries = topicRegistry.discoveryEntries();
    const pairs = entries.map((item) => [
      item.kind,
      item.id,
      [...item.conditions, ...item.procedures].map((link) => link.id),
    ]);
    expect(pairs).toEqual([
      ['condition', 'acute-appendicitis', ['laparoscopic-appendicectomy']],
      ['procedure', 'laparoscopic-appendicectomy', ['acute-appendicitis']],
      ['condition', 'gallstone-disease', ['laparoscopic-cholecystectomy']],
      ['procedure', 'laparoscopic-cholecystectomy', ['gallstone-disease']],
    ]);
    // Canonical routes are unchanged.
    expect(entries.map((item) => item.href)).toEqual([
      '/learn/general-surgery/acute-appendicitis',
      '/learn/general-surgery/acute-appendicitis/appendicectomy',
      '/learn/general-surgery/gallstone-disease',
      '/learn/general-surgery/gallstone-disease/laparoscopic-cholecystectomy',
    ]);
    // A procedure shows its owning topic's review state.
    for (const item of entries)
      expect(item.review).toEqual({
        contentKind: 'clinical',
        status: 'awaiting-review',
        clinicalReviewer: null,
        lastClinicallyReviewed: null,
      });
  });
  it('support a procedure with several conditions and a condition with several procedures', () => {
    const registry = linkedFixture(['acute-appendicitis']);
    const [appendicitis, appendicectomy, , cholecystectomy] =
      registry.discoveryEntries();
    expect(appendicitis.procedures.map((link) => link.id)).toEqual([
      'laparoscopic-appendicectomy',
      'laparoscopic-cholecystectomy',
    ]);
    expect(cholecystectomy.conditions.map((link) => link.id)).toEqual([
      'gallstone-disease',
      'acute-appendicitis',
    ]);
    // Discoverable from every linked condition's categories.
    expect(cholecystectomy.categories).toEqual([
      'emergency-general-surgery',
      'hpb',
      'colorectal',
    ]);
    expect(appendicectomy.conditions.map((link) => link.id)).toEqual([
      'acute-appendicitis',
    ]);
    // Cross-topic links keep one canonical URL and no page relationships.
    const topic = registry.getTopic('general-surgery', 'acute-appendicitis')!;
    expect(registry.relationsFor(topic)).toEqual([
      expect.objectContaining({
        id: 'laparoscopic-appendicectomy',
        page: 'appendicectomy',
        anatomyPage: 'anatomy',
      }),
      expect.not.objectContaining({ page: expect.anything() }),
    ]);
    expect(registry.relationsFor(topic)[1].href).toBe(
      '/learn/general-surgery/gallstone-disease/laparoscopic-cholecystectomy',
    );
  });
  it('reject unknown or self-referencing condition links', () => {
    expect(() => linkedFixture(['missing-condition'])).toThrow(
      /links an unknown condition: missing-condition/,
    );
    expect(() => linkedFixture(['gallstone-disease'])).toThrow(
      /already belongs to its own condition/,
    );
  });
  it('reject procedure pages that repeat the procedure names', () => {
    const invalid = structuredClone(gallstoneDisease);
    invalid.experience.pages.find(
      (page) => page.slug === 'laparoscopic-cholecystectomy',
    )!.aliases = ['lap chole'];
    expect(() => validateTopic(invalid)).toThrow(
      /Procedure page aliases belong on the procedure/,
    );
  });
});

describe('exact, normalised term resolution', () => {
  it.each([
    ['lap chole', 'procedure', 'laparoscopic-cholecystectomy'],
    ['Lap. Chole', 'procedure', 'laparoscopic-cholecystectomy'],
    [
      'laparoscopic cholecystectomy',
      'procedure',
      'laparoscopic-cholecystectomy',
    ],
    ['cholecystectomy', 'procedure', 'laparoscopic-cholecystectomy'],
    ['gallbladder removal', 'procedure', 'laparoscopic-cholecystectomy'],
    ['appendicectomy', 'procedure', 'laparoscopic-appendicectomy'],
    ['Appendectomy', 'procedure', 'laparoscopic-appendicectomy'],
    ['appendicitis', 'condition', 'acute-appendicitis'],
    ['acute cholecystitis', 'condition', 'gallstone-disease'],
    [' Biliary  colic ', 'condition', 'gallstone-disease'],
  ])('resolves "%s" to one %s', (term, kind, id) => {
    expect(
      topicRegistry.resolveTerm(term).map((item) => [item.kind, item.id]),
    ).toEqual([[kind, id]]);
  });
  it('does not guess', () => {
    for (const term of ['chole', 'appendix removal', 'gall bladder', ''])
      expect(topicRegistry.resolveTerm(term)).toEqual([]);
  });
  it('rejects a name shared by two conditions or procedures', () => {
    const clash = structuredClone(gallstoneDisease);
    clash.metadata.procedures[0].aliases.push('Appendectomy');
    expect(() =>
      createTopicRegistry([
        { source: 'appendicitis', content: acuteAppendicitis },
        { source: 'gallstone', content: clash },
      ]),
    ).toThrow(/Ambiguous name "appendectomy"/);
  });
});
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

it('rejects the same anatomy view ID in two topics', () => {
  const gallstone = structuredClone(gallstoneDisease);
  gallstone.experience.anatomyViews[0].id = 'appendicectomy-anatomy';
  gallstone.experience.theatrePreps[0].anatomyViewId = 'appendicectomy-anatomy';
  expect(() =>
    createTopicRegistry([
      { source: 'appendicitis', content: acuteAppendicitis },
      { source: 'gallstone', content: gallstone },
    ]),
  ).toThrow(/Duplicate anatomy view ID: appendicectomy-anatomy/);
});
