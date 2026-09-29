import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { topicRegistry } from '@/content/registry';
import { resolveAnatomyViews, resolveWalkthroughs } from '@/lib/topic-pages';
import { trainingLevelStorageKey } from '@/lib/training-level-storage';
import { validateTopic } from '@/schemas/topic';
import { anatomyArtwork } from './artwork';
import { TopicDepth } from '@/components/topic/topic-depth';
import { OperativeAnatomy } from './operative-anatomy';

const topic = () =>
  topicRegistry.getTopic('general-surgery', 'gallstone-disease')!;
const view = () => topic().experience!.anatomyViews[0];
const block = (id: string) =>
  topic()
    .sections.flatMap((section) => section.blocks)
    .find((item) => item.id === id)!;
const renderView = () => {
  const [resolved] = resolveAnatomyViews(topic(), 'anatomy');
  // As on the page: depth comes from the topic's training-level context.
  return render(
    <TopicDepth showControls={false}>
      <OperativeAnatomy view={resolved} sources={{}} />
    </TopicDepth>,
  );
};
const button = (name: RegExp | string) => screen.getByRole('button', { name });
const state = (id: string) =>
  document
    .querySelector(`[data-structure="${id}"]`)!
    .getAttribute('data-state');

beforeEach(() => {
  window.location.hash = '';
  localStorage.clear();
});

describe('cholecystectomy anatomy data', () => {
  it('draws exactly the structures the content describes, with unique IDs', () => {
    const ids = view().structures.map((structure) => structure.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(anatomyArtwork['cholecystectomy-anatomy'].structureIds).toEqual(ids);
  });
  it('pins the reviewed roles and step mapping', () => {
    expect(
      Object.fromEntries(
        view().structures.map((structure) => [
          structure.id,
          [structure.roles, structure.steps],
        ]),
      ),
    ).toEqual({
      gallbladder: [['removed'], [2, 5, 6]],
      'hepatocystic-triangle': [['landmark'], [2, 3]],
      'cystic-duct': [['controlled'], [3, 4]],
      'cystic-artery': [['controlled'], [3, 4]],
      'common-hepatic-duct': [['at-risk'], [3, 4]],
      'common-bile-duct': [['at-risk'], [3, 4]],
    });
  });
  it('explains each structure at risk with a quoted bile duct injury risk', () => {
    for (const structure of view().structures.filter((item) =>
      item.roles.includes('at-risk'),
    )) {
      const risk = structure.fields.find((field) => field.kind === 'risk')!;
      expect(risk.extracts).toEqual([
        expect.objectContaining({ blockId: 'bile-duct-danger' }),
      ]);
      // …and links to the complication it describes.
      expect(structure.links).toEqual([
        expect.objectContaining({
          page: 'complications',
          blockId: 'complications-table',
        }),
      ]);
    }
  });
  it('never marks an intentionally divided structure as at risk, in any view', () => {
    for (const slug of ['acute-appendicitis', 'gallstone-disease'])
      for (const anatomy of topicRegistry.getTopic('general-surgery', slug)!
        .experience!.anatomyViews)
        for (const structure of anatomy.structures)
          if (structure.roles.includes('controlled'))
            expect(structure.roles, structure.id).not.toContain('at-risk');
  });
  it('rejects an at-risk role on a controlled structure without a quoted risk', () => {
    const invalid = structuredClone(topic());
    invalid
      .experience!.anatomyViews[0].structures.find(
        (structure) => structure.id === 'cystic-duct',
      )!
      .roles.push('at-risk');
    expect(() => validateTopic(invalid)).toThrow(/Risk role and risk field/);
  });
});

describe('critical view of safety as anatomy', () => {
  it('ties the criteria only to the triangle, cystic duct and cystic artery', () => {
    const cvs = view()
      .structures.filter((structure) =>
        structure.fields.some((field) =>
          field.extracts.some((extract) => extract.blockId === 'cvs-criteria'),
        ),
      )
      .map((structure) => structure.id);
    expect(cvs).toEqual([
      'hepatocystic-triangle',
      'cystic-duct',
      'cystic-artery',
    ]);
    // The criteria keep their explicit textbook source and CST depth.
    expect(block('cvs-criteria')).toMatchObject({
      minimumLevel: 'cst',
      referenceIds: ['lapchole-textbook'],
    });
    const [resolved] = resolveAnatomyViews(topic(), 'anatomy');
    for (const structure of resolved.structures)
      for (const field of structure.fields)
        if (field.kind === 'identify')
          expect(field.minimumLevel, structure.id).toBe('cst');
  });
  it('keeps the guideline’s evidence limitation beside the safety wording', () => {
    const duct = view().structures.find((item) => item.id === 'cystic-duct')!;
    const why = duct.fields.find((field) => field.kind === 'why')!;
    expect(why.extracts.map((extract) => extract.text).join(' ')).toMatch(
      /rests on expert opinion, not direct comparative evidence/,
    );
    expect(block('cvs-purpose').referenceIds[0]).toBe('safe-cholecystectomy');
  });
  it('links step 3 (the critical view) to its structures and back', () => {
    const [resolved] = resolveAnatomyViews(topic(), 'anatomy');
    expect(
      resolved.steps.find((step) => step.number === 3)!.structureIds,
    ).toEqual([
      'hepatocystic-triangle',
      'cystic-duct',
      'cystic-artery',
      'common-hepatic-duct',
      'common-bile-duct',
    ]);
    const [walkthrough] = resolveWalkthroughs(
      topic(),
      'laparoscopic-cholecystectomy',
    );
    expect(
      walkthrough.steps.map((step) =>
        step.links
          .filter((link) => link.label.startsWith('Operative anatomy'))
          .map((link) => link.href.split('#')[1]),
      ),
    ).toEqual([
      [],
      ['cholecystectomy-anatomy-step-2'],
      ['cholecystectomy-anatomy-step-3'],
      ['cholecystectomy-anatomy-step-4'],
      ['cholecystectomy-anatomy-step-5'],
      ['cholecystectomy-anatomy-step-6'],
    ]);
  });
});

describe('cholecystectomy anatomy interaction', () => {
  it('offers only the filters its roles support', () => {
    renderView();
    expect(
      within(screen.getByRole('group', { name: 'Emphasise structures' }))
        .getAllByRole('button')
        .map((item) => item.textContent),
    ).toEqual(['All structures', 'Landmarks', 'Structures at risk']);
  });
  it('shows a structure at risk distinctly from a controlled one', async () => {
    renderView();
    await userEvent.click(button(/^Common bile duct/));
    let detail = screen.getByRole('heading', {
      level: 3,
      name: /Common bile duct/,
    }).parentElement!;
    expect(detail).toHaveTextContent('Structure at risk');
    expect(detail).toHaveTextContent(
      'Bile duct injury is the most common serious complication',
    );
    expect(
      within(detail).getByRole('link', {
        name: 'Complications: bile duct or organ injury',
      }),
    ).toHaveAttribute(
      'href',
      '/learn/general-surgery/gallstone-disease/complications#block-complications-table',
    );
    expect(
      document.querySelector('[data-structure="common-bile-duct"]'),
    ).toHaveAttribute('data-risk');
    await userEvent.click(button(/^Cystic duct/));
    detail = screen.getByRole('heading', {
      level: 3,
      name: /Cystic duct/,
    }).parentElement!;
    expect(detail).toHaveTextContent('Controlled and divided');
    expect(detail).not.toHaveTextContent('Structure at risk');
    expect(
      document.querySelector('[data-structure="cystic-duct"]'),
    ).not.toHaveAttribute('data-risk');
    // The critical-view criterion is gated at CST depth, with a visible hint.
    expect(detail).toHaveTextContent('Further detail at CST depth');
    expect(detail).not.toHaveTextContent('two, and only two');
    await userEvent.click(button(/^Cystic artery/));
    expect(button(/^Cystic artery/)).toHaveAttribute('aria-pressed', 'true');
  });
  it('opens with the critical-view step named in the URL hash', () => {
    localStorage.setItem(trainingLevelStorageKey, 'cst');
    window.location.hash = '#cholecystectomy-anatomy-step-3';
    renderView();
    expect(
      button('Step 3 · Achieve the critical view of safety'),
    ).toHaveAttribute('aria-pressed', 'true');
    expect(state('common-bile-duct')).toBe('emphasised');
    expect(state('gallbladder')).toBe('dimmed');
  });
  it('reveals the criterion for a CST reader', async () => {
    localStorage.setItem(trainingLevelStorageKey, 'cst');
    renderView();
    await userEvent.click(button(/^Hepatocystic triangle/));
    const detail = screen.getByRole('heading', {
      level: 3,
      name: /Hepatocystic triangle/,
    }).parentElement!;
    expect(detail).toHaveTextContent('How it is identified');
    expect(detail).toHaveTextContent(
      'Clear all fibrofatty tissue from the hepatocystic triangle',
    );
    expect(
      within(detail).getByRole('link', {
        name: 'The three criteria of the critical view (CST depth)',
      }),
    ).toHaveAttribute(
      'href',
      '/learn/general-surgery/gallstone-disease/laparoscopic-cholecystectomy#block-cvs-criteria',
    );
  });
  it('filters structures at risk with a non-colour cue', async () => {
    renderView();
    await userEvent.click(button('Structures at risk'));
    expect(state('common-hepatic-duct')).toBe('emphasised');
    expect(state('cystic-duct')).toBe('dimmed');
    for (const id of ['common-hepatic-duct', 'common-bile-duct'])
      expect(
        document.querySelector(`[data-structure="${id}"]`),
      ).toHaveAttribute('data-risk');
  });
});
