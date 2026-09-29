import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { topicRegistry } from '@/content/registry';
import { gallstoneDisease } from '@/content/topics/gallstone-disease';
import { sharedLibrary } from '@/content/shared';
import { sharedReferences } from '@/content/shared/references';
import { sharedBlocks } from '@/content/shared/blocks';
import { validateTopic } from '@/schemas/topic';
import { TopicExperience } from '@/components/topic/topic-experience';
import {
  checkSharedIntegrity,
  composeTopic,
  createSharedLibrary,
  type AuthoredTopic,
} from './shared-content';

const topic = (slug: string) =>
  topicRegistry.getTopic('general-surgery', slug)!;
const blocksOf = (slug: string) =>
  topic(slug).sections.flatMap((section) => section.blocks);
const cited = (slug: string) =>
  new Set(
    blocksOf(slug).flatMap((block) => [
      ...block.referenceIds,
      ...(block.type === 'claimGroup'
        ? block.claims.flatMap((claim) => claim.referenceIds)
        : []),
    ]),
  );
// A minimal authored topic for composition-only checks.
const authored = (overrides: Partial<AuthoredTopic> = {}): AuthoredTopic =>
  ({
    metadata: { id: 'fixture' },
    references: [
      {
        id: 'local-source',
        title: 'Local source',
        year: 2025,
        evidenceType: 'textbook',
      },
    ],
    sections: [
      {
        id: 'overview',
        title: 'Overview',
        blocks: [
          {
            id: 'local-fact',
            type: 'prose',
            minimumLevel: 'foundation',
            paragraphs: ['A local fact.'],
            referenceIds: ['local-source', 'nice-vte'],
          },
          { include: 'abdominal-wall-access' },
        ],
      },
    ],
    ...overrides,
  }) as AuthoredTopic;

describe('shared sources', () => {
  it('resolve shared and local references side by side', () => {
    const composed = composeTopic(authored(), sharedLibrary);
    expect(composed.references.map((reference) => reference.id)).toEqual([
      'local-source',
      // Only the shared sources this topic cites, in registry order.
      'nice-vte',
      'surgical-access-textbook',
    ]);
  });
  it('reject duplicate IDs and ambiguous precedence', () => {
    expect(() =>
      createSharedLibrary({
        references: [sharedReferences[0], sharedReferences[0]],
        blocks: [],
      }),
    ).toThrow(/Duplicate shared source ID: rcs-consent/);
    expect(() =>
      composeTopic(
        authored({ references: [sharedReferences[0]] }),
        sharedLibrary,
      ),
    ).toThrow(/local source duplicates shared source: rcs-consent/);
  });
  it('still fail validation for an unknown source', () => {
    const invalid = structuredClone(topic('gallstone-disease'));
    invalid.sections[0].blocks[0].referenceIds.push('missing-source');
    expect(() => validateTopic(invalid)).toThrow(
      /Unknown reference ID: missing-source/,
    );
  });
  it('are listed on an Evidence page only when that topic cites them', () => {
    for (const slug of ['acute-appendicitis', 'gallstone-disease']) {
      const ids = topic(slug).references.map((reference) => reference.id);
      // Every listed source is cited, and every cited source is listed.
      expect(new Set(ids)).toEqual(cited(slug));
      expect(new Set(ids).size).toBe(ids.length);
      // Shared sources arrive unchanged.
      for (const reference of topic(slug).references) {
        const shared = sharedReferences.find(
          (item) => item.id === reference.id,
        );
        if (shared) expect(reference).toEqual(shared);
      }
    }
    // Appendicitis-only sources stay off the gallstone Evidence page.
    const gallstone = topic('gallstone-disease').references.map((r) => r.id);
    expect(gallstone).not.toContain('nice-fluids');
    expect(gallstone).not.toContain('nhs-anaesthesia');
  });
  it('render on the Evidence page with their source type', () => {
    const evidence = topic('acute-appendicitis');
    render(<TopicExperience topic={evidence} pageSlug="evidence" />);
    const list = within(screen.getByRole('region', { name: 'References' }));
    expect(list.getAllByRole('listitem')).toHaveLength(
      evidence.references.length,
    );
    expect(
      document.getElementById('reference-surgical-access-textbook'),
    ).toHaveTextContent('Source type: textbook');
    expect(document.getElementById('reference-rcs-consent')).toHaveTextContent(
      'Source type: guideline',
    );
  });
});

// A test-only reuse of the shared access block in a second procedure, to
// prove the mechanism. It is not published: the cholecystectomy pages do not
// include this block until a dedicated clinical/editorial pass adds it.
function reuseFixture(kind: 'danger' | 'why') {
  const shared = new Set(sharedLibrary.references.map((item) => item.id));
  const input = structuredClone(gallstoneDisease) as unknown as AuthoredTopic;
  const fixture: AuthoredTopic = {
    ...input,
    // Back to the authored form: local sources and explicit includes only.
    references: input.references.filter((item) => !shared.has(item.id)),
    sections: input.sections.map((section) => ({
      ...section,
      blocks: section.blocks.map((block) =>
        'shared' in block && block.shared ? { include: block.id } : block,
      ),
    })),
  };
  fixture.sections
    .find((section) => section.id === 'surgical-anatomy')!
    .blocks.push({ include: 'abdominal-wall-access' });
  fixture.experience!.walkthroughs![0].steps[0].fields!.push({
    kind,
    extracts: [
      {
        text: 'During secondary port placement the superficial and inferior epigastric and circumflex vessels of the abdominal wall are at risk',
        blockId: 'abdominal-wall-access',
      },
    ],
  });
  return composeTopic(fixture, sharedLibrary);
}

describe('shared blocks', () => {
  it('are included explicitly, marked shared and coexist with local blocks', () => {
    const [section] = composeTopic(authored(), sharedLibrary).sections;
    expect(section.blocks.map((block) => block.id)).toEqual([
      'local-fact',
      'abdominal-wall-access',
    ]);
    expect(section.blocks[0]).not.toHaveProperty('shared');
    expect(section.blocks[1]).toMatchObject({
      shared: { walkthroughFields: ['danger'] },
    });
  });
  it('are published only where a topic explicitly includes them', () => {
    const where = (id: string) =>
      ['acute-appendicitis', 'gallstone-disease'].filter((slug) =>
        blocksOf(slug).some((block) => block.id === id),
      );
    expect(where('abdominal-wall-access')).toEqual(['acute-appendicitis']);
    expect(where('operative-disclaimer')).toEqual([
      'acute-appendicitis',
      'gallstone-disease',
    ]);
    // So its source is not listed for gallstone disease either.
    expect(
      topic('gallstone-disease').references.map((item) => item.id),
    ).not.toContain('surgical-access-textbook');
  });
  it('keep their wording, sources and training level wherever included', () => {
    const library = sharedBlocks.find(
      (entry) => entry.block.id === 'abdominal-wall-access',
    )!.block;
    const reused = validateTopic(reuseFixture('danger'));
    for (const blocks of [
      blocksOf('acute-appendicitis'),
      reused.sections.flatMap((section) => section.blocks),
    ]) {
      const block = blocks.find((item) => item.id === 'abdominal-wall-access')!;
      expect(block).toMatchObject({
        ...library,
        shared: { walkthroughFields: ['danger'] },
      });
      expect(block.minimumLevel).toBe('medical-student');
    }
    // Its shared source arrives with it, unchanged.
    expect(
      reused.references.find((item) => item.id === 'surgical-access-textbook'),
    ).toEqual(
      sharedReferences.find((item) => item.id === 'surgical-access-textbook'),
    );
    expect(() => checkSharedIntegrity(reused, sharedLibrary)).not.toThrow();
  });
  it('reject unknown includes and local blocks reusing a shared ID', () => {
    const unknown = authored();
    unknown.sections[0].blocks.push({ include: 'missing-block' });
    expect(() => composeTopic(unknown, sharedLibrary)).toThrow(
      /unknown shared block: missing-block/,
    );
    const shadow = authored();
    shadow.sections[0].blocks.push({
      id: 'operative-disclaimer',
      type: 'sourceNote',
      minimumLevel: 'medical-student',
      text: 'A local variant.',
    });
    expect(() => composeTopic(shadow, sharedLibrary)).toThrow(
      /local block reuses a shared block ID: operative-disclaimer/,
    );
  });
  it('must stay sourced by shared sources only', () => {
    const [access] = sharedBlocks.filter(
      (entry) => entry.block.id === 'abdominal-wall-access',
    );
    expect(() =>
      createSharedLibrary({
        references: sharedReferences,
        blocks: [
          { ...access, block: { ...access.block, referenceIds: ['local'] } },
        ],
      }),
    ).toThrow(/cites a non-shared source: local/);
    expect(() =>
      createSharedLibrary({
        references: sharedReferences,
        blocks: [{ ...access, block: { ...access.block, referenceIds: [] } }],
      }),
    ).toThrow(/needs a source/);
  });
  it('cannot be silently altered after inclusion', () => {
    const altered = topic('acute-appendicitis');
    const block = altered.sections
      .flatMap((section) => section.blocks)
      .find((item) => item.id === 'abdominal-wall-access')!;
    if (block.type === 'prose') block.paragraphs[0] = 'Changed wording.';
    expect(() => checkSharedIntegrity(altered, sharedLibrary)).toThrow(
      /shared block was altered: abdominal-wall-access/,
    );
    const source = topic('gallstone-disease');
    source.references.find((item) => item.id === 'rcs-consent')!.year = 2020;
    expect(() => checkSharedIntegrity(source, sharedLibrary)).toThrow(
      /shared source was altered: rcs-consent/,
    );
  });
});

describe('semantic provenance of shared blocks', () => {
  it('lets shared access anatomy fill Danger, never a procedure Why', () => {
    const walkthrough = topic('acute-appendicitis').experience!.walkthroughs[0];
    const kinds = walkthrough.steps.flatMap((step) =>
      step.fields
        .filter((field) =>
          field.extracts.some(
            (extract) => extract.blockId === 'abdominal-wall-access',
          ),
        )
        .map((field) => field.kind),
    );
    expect(kinds).toEqual(['danger']);
    // Valid as Danger in a second procedure, but that does not make it a
    // valid Why there.
    expect(() => validateTopic(reuseFixture('danger'))).not.toThrow();
    expect(() => validateTopic(reuseFixture('why'))).toThrow(
      /Shared block abdominal-wall-access is not approved for why fields/,
    );
    // Remapping the published appendicitis Danger also fails.
    const invalid = topic('acute-appendicitis');
    const step = invalid.experience!.walkthroughs[0].steps[0];
    step.fields = step.fields.map((field) =>
      field.kind === 'danger' ? { ...field, kind: 'changes' } : field,
    );
    expect(() => validateTopic(invalid)).toThrow(
      /Shared block abdominal-wall-access is not approved for changes fields/,
    );
  });
  it('keeps each shared block reviewed for explicit field kinds only', () => {
    expect(
      Object.fromEntries(
        sharedLibrary.blocks.map((entry) => [
          entry.block.id,
          entry.walkthroughFields,
        ]),
      ),
    ).toEqual({
      'operative-disclaimer': [],
      'abdominal-wall-access': ['danger'],
    });
  });
});
