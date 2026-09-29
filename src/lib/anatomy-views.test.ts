import { describe, expect, it } from 'vitest';
import { topicRegistry } from '@/content/registry';
import { validateTopic } from '@/schemas/topic';
import { anatomyArtwork } from '@/components/anatomy/artwork';
import { resolveAnatomyViews, resolveWalkthroughs } from './topic-pages';

const topic = () =>
  topicRegistry.getTopic('general-surgery', 'acute-appendicitis')!;
const view = () => topic().experience!.anatomyViews[0];
const blocks = () => topic().sections.flatMap((section) => section.blocks);

describe('appendicectomy anatomy view', () => {
  it('draws exactly the structures the content describes, each labelled', () => {
    const ids = view().structures.map((structure) => structure.id);
    expect(anatomyArtwork[view().id].structureIds).toEqual(ids);
    for (const structure of view().structures)
      expect(structure.label.trim()).not.toBe('');
  });
  it('sources every statement from a cited block', () => {
    const [resolved] = resolveAnatomyViews(topic(), 'anatomy');
    for (const structure of resolved.structures) {
      expect(structure.referenceIds.length, structure.id).toBeGreaterThan(0);
      for (const field of structure.fields)
        expect(field.referenceIds.length).toBeGreaterThan(0);
    }
    expect(resolved.notes.referenceIds.length).toBeGreaterThan(0);
    // Fields take their source blocks' depth; all current ones are universal.
    const levels = new Set(
      resolved.structures.flatMap((structure) =>
        structure.fields.map((field) => field.minimumLevel),
      ),
    );
    expect([...levels]).toEqual(['medical-student']);
  });
  it('pins the reviewed structure ↔ step mapping', () => {
    expect(
      Object.fromEntries(
        view().structures.map((structure) => [
          structure.id,
          [structure.roles, structure.steps],
        ]),
      ),
    ).toEqual({
      caecum: [['landmark'], [2]],
      'taeniae-coli': [['landmark'], [2, 3]],
      'terminal-ileum': [['landmark'], [2]],
      appendix: [['removed'], [2, 4]],
      'appendix-base': [
        ['landmark', 'controlled'],
        [2, 3, 5],
      ],
      mesoappendix: [
        ['controlled', 'bleeding-risk'],
        [3, 5],
      ],
      'appendicular-artery': [
        ['controlled', 'bleeding-risk'],
        [3, 5],
      ],
      'ileocolic-artery': [['orientation'], [3]],
    });
  });
  it('links steps both ways from the one mapping', () => {
    const [resolved] = resolveAnatomyViews(topic(), 'anatomy');
    expect(
      resolved.steps.map((step) => [step.number, step.structureIds]),
    ).toEqual([
      [
        2,
        [
          'caecum',
          'taeniae-coli',
          'terminal-ileum',
          'appendix',
          'appendix-base',
        ],
      ],
      [
        3,
        [
          'taeniae-coli',
          'appendix-base',
          'mesoappendix',
          'appendicular-artery',
          'ileocolic-artery',
        ],
      ],
      [4, ['appendix']],
      [5, ['appendix-base', 'mesoappendix', 'appendicular-artery']],
    ]);
    // Walkthrough steps with anatomy link back to the view's step anchors.
    const [walkthrough] = resolveWalkthroughs(topic(), 'appendicectomy');
    const anatomyLinks = walkthrough.steps.map((step) =>
      step.links
        .filter((link) => link.label.startsWith('Operative anatomy'))
        .map((link) => link.href.split('#')[1]),
    );
    expect(anatomyLinks).toEqual([
      [],
      ['appendicectomy-anatomy-step-2'],
      ['appendicectomy-anatomy-step-3'],
      ['appendicectomy-anatomy-step-4'],
      ['appendicectomy-anatomy-step-5'],
    ]);
  });
});

describe('anatomy view validation', () => {
  const invalid = () => structuredClone(topic());
  it('rejects paraphrased statements', () => {
    const broken = invalid();
    broken.experience!.anatomyViews[0].structures[0].fields[0].extracts[0].text =
      'The caecum is the start of the colon';
    expect(() => validateTopic(broken)).toThrow(/not verbatim/);
  });
  it('rejects unknown steps and steps that do not quote the structure', () => {
    const unknown = invalid();
    unknown.experience!.anatomyViews[0].structures[0].steps = [9];
    expect(() => validateTopic(unknown)).toThrow(/Unknown anatomy step/);
    // Step 4 (retrieve & assess) quotes nothing about the ileocolic artery.
    const unsupported = invalid();
    unsupported.experience!.anatomyViews[0].structures.find(
      (structure) => structure.id === 'ileocolic-artery',
    )!.steps = [4];
    expect(() => validateTopic(unsupported)).toThrow(
      /Anatomy step not supported by the walkthrough: ileocolic-artery 4/,
    );
  });
  it('keeps role meanings distinct', () => {
    // An intentional operative target is never also "at risk"; its hazard
    // from inadequate control is a separate, quoted bleeding risk.
    for (const structure of view().structures) {
      if (structure.roles.includes('controlled'))
        expect(structure.roles, structure.id).not.toContain('at-risk');
      if (structure.roles.includes('bleeding-risk')) {
        expect(structure.roles).toContain('controlled');
        const risk = structure.fields.find((field) => field.kind === 'risk')!;
        expect(risk.extracts[0].text).toMatch(/bleeding/);
      }
    }
    // A quoted risk without a risk role is also rejected.
    const unlabelled = invalid();
    const artery = unlabelled.experience!.anatomyViews[0].structures.find(
      (structure) => structure.id === 'appendicular-artery',
    )!;
    artery.roles = ['controlled'];
    expect(() => validateTopic(unlabelled)).toThrow(/Risk role and risk field/);
  });
  it('rejects a risk role without a quoted risk, and duplicates', () => {
    const noRisk = invalid();
    noRisk.experience!.anatomyViews[0].structures[0].roles.push('at-risk');
    expect(() => validateTopic(noRisk)).toThrow(/Risk role and risk field/);
    const duplicate = invalid();
    const structures = duplicate.experience!.anatomyViews[0].structures;
    structures.push(structures[0]);
    expect(() => validateTopic(duplicate)).toThrow(
      /Duplicate anatomy structure/,
    );
  });
  it('rejects unknown pages and walkthroughs', () => {
    const page = invalid();
    page.experience!.anatomyViews[0].page = 'missing';
    expect(() => validateTopic(page)).toThrow(/Unknown anatomy view page/);
    const walkthrough = invalid();
    walkthrough.experience!.anatomyViews[0].walkthroughId = 'missing';
    expect(() => validateTopic(walkthrough)).toThrow(
      /Unknown anatomy walkthrough/,
    );
  });
  it('only uses blocks that exist in the topic', () => {
    const known = new Set(blocks().map((block) => block.id));
    for (const structure of view().structures)
      for (const field of structure.fields)
        for (const extract of field.extracts)
          expect(known.has(extract.blockId)).toBe(true);
  });
});
