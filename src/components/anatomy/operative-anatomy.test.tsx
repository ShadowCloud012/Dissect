import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it } from 'vitest';
import { topicRegistry } from '@/content/registry';
import { resolveAnatomyViews } from '@/lib/topic-pages';
import { OperativeAnatomy } from './operative-anatomy';

const topic = topicRegistry.getTopic('general-surgery', 'acute-appendicitis')!;
const [view] = resolveAnatomyViews(topic, 'anatomy');
const renderView = () => render(<OperativeAnatomy view={view} sources={{}} />);
const structureButton = (name: RegExp) => screen.getByRole('button', { name });
const state = (id: string) =>
  document
    .querySelector(`[data-structure="${id}"]`)!
    .getAttribute('data-state');

beforeEach(() => {
  window.location.hash = '';
  localStorage.clear();
});

it('describes the schematic for assistive technology', () => {
  renderView();
  const figure = screen.getByRole('img', {
    name: 'Schematic: The operative field',
  });
  expect(figure).toHaveAccessibleDescription(/1 Caecum, 2 Taeniae coli/);
  expect(screen.getByText(/Schematic, not to scale/)).toBeInTheDocument();
  // An equivalent text table of structures, roles and steps.
  const table = screen.getByRole('table');
  expect(
    within(table).getByRole('rowheader', { name: '6. Mesoappendix' }),
  ).toBeInTheDocument();
});

it('selects structures from the keyboard and shows sourced detail', async () => {
  renderView();
  const meso = structureButton(/^Mesoappendix/);
  meso.focus();
  await userEvent.keyboard('{Enter}');
  expect(meso).toHaveAttribute('aria-pressed', 'true');
  expect(state('mesoappendix')).toBe('selected');
  const detail = screen.getByRole('heading', {
    level: 3,
    name: /Mesoappendix/,
  }).parentElement!;
  expect(detail).toHaveTextContent(
    'The mesoappendix carries the appendicular arterial supply',
  );
  expect(detail).toHaveTextContent('Controlled and divided · Bleeding risk');
  // Structure → operative step.
  expect(
    within(detail).getByRole('link', {
      name: 'In the operation: step 3 · Mesoappendix & base',
    }),
  ).toHaveAttribute(
    'href',
    '/learn/general-surgery/acute-appendicitis/appendicectomy#step-appendicectomy-3',
  );
  // Tab reaches the next structure; Space selects it.
  await userEvent.tab();
  await userEvent.keyboard(' ');
  expect(structureButton(/^Appendicular artery/)).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  expect(meso).toHaveAttribute('aria-pressed', 'false');
});

it('highlights a step’s structures and offers them by name', async () => {
  renderView();
  await userEvent.click(
    screen.getByRole('button', { name: 'Step 3 · Mesoappendix & base' }),
  );
  expect(state('mesoappendix')).toBe('emphasised');
  expect(state('appendix-base')).toBe('emphasised');
  expect(state('caecum')).toBe('dimmed');
  const detail = screen.getByRole('heading', {
    level: 3,
    name: 'Step 3 · Mesoappendix & base',
  }).parentElement!;
  await userEvent.click(
    within(detail).getByRole('button', { name: /Ileocolic artery/ }),
  );
  expect(structureButton(/^Ileocolic artery/)).toHaveAttribute(
    'aria-pressed',
    'true',
  );
});

it('filters by landmark or bleeding risk, with a non-colour cue for risk', async () => {
  renderView();
  // Only roles present in this view get a filter: no structure here is
  // "at risk" of injury, so that filter is absent.
  expect(
    within(screen.getByRole('group', { name: 'Emphasise structures' }))
      .getAllByRole('button')
      .map((button) => button.textContent),
  ).toEqual(['All structures', 'Landmarks', 'Bleeding risk']);
  await userEvent.click(screen.getByRole('button', { name: 'Landmarks' }));
  expect(state('caecum')).toBe('emphasised');
  expect(state('mesoappendix')).toBe('dimmed');
  await userEvent.click(screen.getByRole('button', { name: 'Bleeding risk' }));
  expect(screen.getByRole('button', { name: 'Bleeding risk' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  expect(state('appendicular-artery')).toBe('emphasised');
  expect(state('mesoappendix')).toBe('emphasised');
  expect(state('appendix-base')).toBe('dimmed');
  // Risk structures are drawn dashed, not only in a different colour.
  expect(
    document.querySelector('[data-structure="mesoappendix"]'),
  ).toHaveAttribute('data-risk');
  expect(
    document.querySelector('[data-structure="caecum"]'),
  ).not.toHaveAttribute('data-risk');
});

it('opens with the step named in the URL hash', () => {
  window.location.hash = '#appendicectomy-anatomy-step-2';
  renderView();
  expect(
    screen.getByRole('button', { name: 'Step 2 · Explore & identify' }),
  ).toHaveAttribute('aria-pressed', 'true');
  expect(state('terminal-ileum')).toBe('emphasised');
  expect(state('mesoappendix')).toBe('dimmed');
});

it('selects a structure by tapping the drawing', async () => {
  renderView();
  await userEvent.click(
    document.querySelector(
      '[data-structure="terminal-ileum"] .anatomy-marker',
    )!,
  );
  expect(structureButton(/^Terminal ileum/)).toHaveAttribute(
    'aria-pressed',
    'true',
  );
});
