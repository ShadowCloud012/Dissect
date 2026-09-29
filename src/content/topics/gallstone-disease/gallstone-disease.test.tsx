import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it } from 'vitest';
import { topicRegistry } from '@/content/registry';
import { validateTopic } from '@/schemas/topic';
import { TopicExperience } from '@/components/topic/topic-experience';
import { TrainingLevelSelector } from '@/components/navigation/training-level-selector';
import { gallstoneDisease } from '.';

beforeEach(() => localStorage.clear());
const topic = validateTopic(gallstoneDisease);
const blocks = topic.sections.flatMap((section) => section.blocks);
const block = (id: string) => blocks.find((item) => item.id === id)!;
const base = '/learn/general-surgery/gallstone-disease';

it('is a registered condition, awaiting review, with one linked procedure', () => {
  expect(
    topicRegistry.getTopic('general-surgery', 'gallstone-disease'),
  ).toEqual(topic);
  expect(topic.metadata).toMatchObject({
    contentKind: 'clinical',
    status: 'awaiting-review',
    clinicalReviewer: null,
    lastClinicallyReviewed: null,
    procedures: [
      {
        id: 'laparoscopic-cholecystectomy',
        page: 'laparoscopic-cholecystectomy',
      },
    ],
  });
  // Every source supports content; no numerical risks in patient summaries.
  const used = new Set(blocks.flatMap((item) => item.referenceIds));
  for (const reference of topic.references)
    expect(used.has(reference.id), reference.id).toBe(true);
  expect(JSON.stringify(block('patient-understanding'))).not.toMatch(
    /\d+\s*%|\bin \d+\b/,
  );
});

it('grounds the critical view in the multi-society guideline, with its certainty', () => {
  for (const id of ['cvs-purpose', 'cvs-rationale', 'unclear-anatomy'])
    expect(block(id).referenceIds, id).toContain('safe-cholecystectomy');
  expect(block('subtotal-cholecystectomy').referenceIds[0]).toBe(
    'safe-cholecystectomy',
  );
  expect(JSON.stringify(block('cvs-purpose'))).toMatch(/expert opinion/);
  expect(JSON.stringify(block('unclear-anatomy'))).toMatch(/very low/);
  // Calot's triangle is noted, not treated as an exact synonym.
  expect(block('hepatocystic-triangle')).toMatchObject({
    term: 'Hepatocystic triangle',
  });
  expect(JSON.stringify(block('triangle-terminology'))).toMatch(
    /not exact synonyms/,
  );
  // Alternatives are drainage when surgery is unsuitable, not antibiotics.
  const consent = ['supported-decision', 'patient-understanding'].map((id) =>
    JSON.stringify(block(id)),
  );
  for (const text of consent) {
    expect(text).toMatch(/drain/);
    expect(text).not.toMatch(/antibiotic/i);
  }
});

it('pins the semantically reviewed cholecystectomy walkthrough mapping', () => {
  const mapping = topic.experience!.walkthroughs[0].steps.map((step) => ({
    step: step.label,
    fields: Object.fromEntries(
      step.fields.map((field) => [
        field.kind,
        field.extracts.map((extract) => extract.blockId),
      ]),
    ),
    gaps: step.gaps,
  }));
  expect(mapping).toEqual([
    {
      step: 'Position & access',
      fields: { why: ['positioning-rationale', 'positioning-rationale'] },
      gaps: [],
    },
    {
      step: 'Expose the hepatocystic triangle',
      fields: {
        why: ['exposure-rationale'],
        anatomy: ['hepatocystic-triangle'],
      },
      gaps: [],
    },
    {
      step: 'Achieve the critical view of safety',
      fields: {
        why: ['cvs-purpose', 'cvs-purpose'],
        anatomy: ['biliary-anatomy'],
        danger: ['bile-duct-danger'],
        changes: ['unclear-anatomy'],
      },
      gaps: [],
    },
    {
      step: 'Clip & divide',
      fields: { anatomy: ['biliary-anatomy', 'cystic-artery'] },
      // "Once confirmed" only restates the step: no sourced rationale yet.
      gaps: ['why'],
    },
    {
      step: 'Separate from the liver bed',
      fields: { anatomy: ['gallbladder-structure'] },
      gaps: ['why'],
    },
    {
      step: 'Inspect, retrieve & close',
      fields: { why: ['bleeding-check-rationale', 'closure-rationale'] },
      gaps: [],
    },
  ]);
});

it('quotes every sentence of each absorbed block', () => {
  const normalise = (text: string) =>
    text.toLowerCase().replace(/\s+/g, ' ').replace(/[.]$/, '').trim();
  const containers = [
    ...topic.experience!.walkthroughs.map((walkthrough) => ({
      absorbs: walkthrough.absorbsBlockIds,
      extracts: walkthrough.steps.flatMap((step) =>
        step.fields.flatMap((field) => field.extracts),
      ),
    })),
    ...topic.experience!.briefings.map((briefing) => ({
      absorbs: [
        ...briefing.absorbsBlockIds,
        ...(briefing.replacesBlockId ? [briefing.replacesBlockId] : []),
      ],
      extracts: briefing.rows.flatMap((row) => row.extracts),
    })),
  ];
  for (const { absorbs, extracts } of containers)
    for (const id of absorbs) {
      const source = block(id);
      const text = source.type === 'prose' ? source.paragraphs.join(' ') : '';
      const quoted = extracts
        .filter((extract) => extract.blockId === id)
        .map((extract) => normalise(extract.text));
      for (const sentence of text.split(/(?<=\.)\s+/).map(normalise))
        expect(quoted, `${id}: ${sentence}`).toContain(sentence);
    }
});

it('keeps the basic operation visible and technical judgement at depth', () => {
  for (const id of [
    'operative-sequence',
    'positioning-rationale',
    'exposure-rationale',
    'cvs-purpose',
    'hepatocystic-triangle',
    'bile-duct-danger',
    'cystic-artery',
    'patient-understanding',
  ])
    expect(block(id).minimumLevel, id).toBe('medical-student');
  for (const id of [
    'cvs-criteria',
    'difficult-gallbladder',
    'unclear-anatomy',
    'conversion',
  ])
    expect(block(id).minimumLevel, id).toBe('cst');
  for (const id of ['subtotal-cholecystectomy', 'bile-duct-injury-referral'])
    expect(block(id).minimumLevel, id).toBe('registrar');
  // CVS is defined with its three criteria, not as a slogan.
  expect(block('cvs-criteria')).toMatchObject({
    items: [
      'Clear all fibrofatty tissue from the hepatocystic triangle.',
      'Identify two, and only two, tubular structures entering the gallbladder: the cystic duct and the cystic artery.',
      'Expose the cystic plate by separating the lower third of the gallbladder from the liver bed.',
    ],
  });
});

it('surfaces the procedure from the condition hub and the condition from the procedure', () => {
  const hub = render(<TopicExperience topic={topic} />);
  const related = within(
    screen.getByRole('complementary', { name: 'Related procedure' }),
  );
  expect(
    related.getByRole('link', { name: 'Laparoscopic cholecystectomy' }),
  ).toHaveAttribute('href', `${base}/laparoscopic-cholecystectomy`);
  hub.unmount();
  render(
    <TopicExperience topic={topic} pageSlug="laparoscopic-cholecystectomy" />,
  );
  expect(screen.getByText('Procedure', { selector: 'p' })).toBeVisible();
  expect(
    within(
      screen.getByRole('complementary', { name: 'Clinical context' }),
    ).getByRole('link', { name: 'Gallstone disease and acute cholecystitis' }),
  ).toHaveAttribute('href', base);
});

it('renders the cholecystectomy walkthrough with depth gating and visible gaps', async () => {
  const user = userEvent.setup();
  render(
    <>
      <TrainingLevelSelector />
      <TopicExperience topic={topic} pageSlug="laparoscopic-cholecystectomy" />
    </>,
  );
  expect(
    screen
      .getAllByRole('heading', { level: 4 })
      .map((step) => step.textContent),
  ).toEqual([
    'Step 1: Position & access',
    'Step 2: Expose the hepatocystic triangle',
    'Step 3: Achieve the critical view of safety',
    'Step 4: Clip & divide',
    'Step 5: Separate from the liver bed',
    'Step 6: Inspect, retrieve & close',
  ]);
  const step = (n: number) =>
    within(document.getElementById(`step-cholecystectomy-${n}`)!);
  const field = (n: number, label: string) =>
    step(n).getByText(label, { selector: 'dt' }).nextElementSibling;
  expect(field(3, 'Danger')).toHaveTextContent(
    'Bile duct injury is the most common serious complication',
  );
  expect(field(3, 'Changes the plan')).toHaveTextContent(
    'Further detail at CST depth',
  );
  for (const n of [4, 5])
    expect(field(n, 'Why')).toHaveTextContent(
      'Clinical/editorial content needed',
    );
  // CVS criteria are CST depth; the student sees the step and its purpose.
  expect(screen.queryByText('Two structures only')).toBeNull();
  const plan = within(
    screen.getByRole('region', { name: 'What changes the plan' }),
  );
  const planRow = (label: string) =>
    plan.getByText(label, { selector: 'dt' }).nextElementSibling;
  expect(planRow('Always')).toHaveTextContent(
    'With unclear anatomy or complexity beyond your competence',
  );
  expect(planRow('Conversion')).toHaveTextContent(
    'Further detail at CST depth',
  );
  expect(planRow('Critical view not obtainable')).toHaveTextContent(
    'Further detail at Registrar depth',
  );
  await user.selectOptions(screen.getByRole('combobox'), 'cst');
  expect(screen.getByText('Two structures only')).toBeVisible();
  expect(planRow('Conversion')).toHaveTextContent(
    'Conversion is a judicious clinical decision, not a complication or a failure',
  );
  await user.selectOptions(screen.getByRole('combobox'), 'registrar');
  expect(planRow('Critical view not obtainable')).toHaveTextContent(
    'subtotal cholecystectomy',
  );
});

it('lists unresolved review TODOs on the evidence page', () => {
  render(<TopicExperience topic={topic} pageSlug="evidence" />);
  const todos = within(
    screen.getByRole('region', { name: 'Unresolved clinical-review TODOs' }),
  );
  expect(todos.getByText(/Tokyo Guidelines 2018/)).toBeInTheDocument();
  expect(todos.getByText(/pre-anaesthetic assessment/)).toBeInTheDocument();
  expect(
    screen.getByText('Draft educational content — awaiting clinical review', {
      exact: true,
    }),
  ).toBeVisible();
});
