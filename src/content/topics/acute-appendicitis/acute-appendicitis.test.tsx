import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it } from 'vitest';
import { topicRegistry } from '@/content/registry';
import { TopicLayout } from '@/components/topic/topic-layout';
import { TrainingLevelSelector } from '@/components/navigation/training-level-selector';
import { validateTopic } from '@/schemas/topic';
import { acuteAppendicitis } from '.';

beforeEach(() => localStorage.clear());
it('preserves the audited source scopes and research metadata', () => {
  const topic = validateTopic(acuteAppendicitis);
  const blocks = topic.sections.flatMap((section) => section.blocks);
  const block = (id: string) => blocks.find((item) => item.id === id);
  expect(block('relevant-history')?.referenceIds).toEqual([
    'appendicitis-textbook',
  ]);
  expect(block('anaesthetic-history')?.referenceIds).toEqual([
    'nhs-anaesthesia',
  ]);
  expect(block('peritonitis-plan')?.referenceIds).toEqual([
    'wses-source-control',
    'nice-sepsis',
  ]);
  expect(JSON.stringify(block('abscess-options'))).toContain(
    'paediatric patient information',
  );
  expect(JSON.stringify(block('abscess-options'))).toContain(
    'adult management details remain a clinical-review TODO',
  );
  expect(JSON.stringify(block('complications-table'))).not.toMatch(
    /decompression|transfusion|drainage/,
  );
  for (const id of ['mesoappendix', 'artery-question', 'base-question']) {
    expect(block(id)?.referenceIds).toContain('appendectomy-textbook');
  }
  // Theatre-first depth: core operative anatomy, danger areas and the
  // sequence are student-level; judgement and strategy changes stay advanced.
  expect(
    Object.fromEntries(
      [
        'appendix-origin',
        'mesoappendix',
        'structures-at-risk',
        'operation-outline',
        'operative-sequence',
        'operative-judgement',
        'unexpected-findings',
      ].map((id) => [id, block(id)?.minimumLevel]),
    ),
  ).toEqual({
    'appendix-origin': 'medical-student',
    mesoappendix: 'medical-student',
    'structures-at-risk': 'medical-student',
    'operation-outline': 'medical-student',
    'operative-sequence': 'medical-student',
    'operative-judgement': 'cst',
    'unexpected-findings': 'registrar',
  });
  for (const id of ['wses-2025', 'appac-follow-up', 'cochrane-mri']) {
    const reference = topic.references.find((item) => item.id === id);
    expect(reference?.authors?.length).toBeGreaterThan(0);
    expect(reference?.publication).toBeTruthy();
  }
});
it('pins the semantically reviewed walkthrough mapping', () => {
  // Verbatim validation proves the words exist; this reviewed mapping records
  // that each source was authored for the role it fills. Changing it needs a
  // deliberate semantic review, not just a matching sentence.
  const topic = validateTopic(acuteAppendicitis);
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
      fields: {
        why: ['positioning-rationale', 'positioning-rationale'],
        danger: ['abdominal-wall-access', 'abdominal-wall-access'],
      },
      gaps: [],
    },
    {
      step: 'Explore & identify',
      fields: {
        anatomy: ['identification-landmarks', 'appendix-origin'],
        danger: ['structures-at-risk'],
        changes: ['operative-judgement'],
      },
      // Only a superseded guideline stated the purpose of exploration.
      gaps: ['why'],
    },
    {
      step: 'Mesoappendix & base',
      fields: {
        why: ['artery-question', 'base-division'],
        anatomy: ['mesoappendix', 'appendicular-artery', 'appendix-origin'],
        danger: ['structures-at-risk'],
      },
      gaps: [],
    },
    {
      step: 'Retrieve & assess',
      fields: { why: ['specimen-histology'] },
      gaps: [],
    },
    {
      step: 'Inspect & close',
      fields: { why: ['vessel-control', 'final-inspection'] },
      gaps: [],
    },
  ]);
  // Rationale blocks written for the walkthrough are purpose statements
  // with their own references, never a borrowed related fact.
  const blocks = topic.sections.flatMap((section) => section.blocks);
  const block = (id: string) => blocks.find((item) => item.id === id)!;
  for (const id of [
    'positioning-rationale',
    'base-division',
    'specimen-histology',
    'final-inspection',
    'vessel-control',
  ])
    expect(block(id).referenceIds.length, id).toBeGreaterThan(0);
  // The one rationale drawn from Hot Seat was authored as a "why" question.
  const artery = topic.sections
    .flatMap((section) => section.blocks)
    .find((block) => block.id === 'artery-question');
  expect(artery).toMatchObject({
    question: 'Why identify the mesoappendix before dividing it?',
    minimumLevel: 'medical-student',
  });
});
it('quotes every sentence of each absorbed block, so no authored content is lost', () => {
  const topic = validateTopic(acuteAppendicitis);
  const blocks = topic.sections.flatMap((section) => section.blocks);
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
      // unexpected-findings is represented by rows at two depths.
      absorbs: briefing.absorbsBlockIds.filter(
        (id) => id !== 'unexpected-findings',
      ),
      extracts: briefing.rows.flatMap((row) => row.extracts),
    })),
  ];
  for (const { absorbs, extracts } of containers)
    for (const id of absorbs) {
      const source = blocks.find((block) => block.id === id)!;
      const text = source.type === 'prose' ? source.paragraphs.join(' ') : '';
      const quoted = extracts
        .filter((extract) => extract.blockId === id)
        .map((extract) => normalise(extract.text));
      for (const sentence of text.split(/(?<=\.)\s+/).map(normalise))
        expect(quoted, `${id}: ${sentence}`).toContain(sentence);
    }
});
it('keeps operative technique at the right depth and labels superseded sources', () => {
  const topic = validateTopic(acuteAppendicitis);
  const blocks = topic.sections.flatMap((section) => section.blocks);
  const block = (id: string) => blocks.find((item) => item.id === id)!;
  const level = (id: string) => block(id).minimumLevel;
  // Basic rationale, anatomy and danger are visible to medical students.
  for (const id of [
    'positioning-rationale',
    'identification-landmarks',
    'base-division',
    'specimen-histology',
    'final-inspection',
    'vessel-control',
    'appendicular-artery',
    'appendix-position',
    'abdominal-wall-access',
    'access-technique',
    'patient-understanding',
  ])
    expect(level(id), id).toBe('medical-student');
  // Technique nuance and plan-changing judgement stay advanced.
  for (const id of [
    'technique-variation',
    'difficult-position',
    'inflamed-tissue',
    'complex-findings',
    'conversion-consideration',
  ])
    expect(level(id), id).toBe('cst');
  // The superseded guideline supports terminology only: no operative block
  // (or Hot Seat answer) relies on it for a current recommendation.
  const operativeSections = [
    'surgical-anatomy',
    'laparoscopic-appendicectomy',
    'postoperative-care',
    'complications',
    'consent',
  ];
  const operativeBlocks = topic.sections
    .filter((section) => operativeSections.includes(section.id))
    .flatMap((section) => section.blocks);
  for (const item of operativeBlocks)
    expect(item.referenceIds, item.id).not.toContain('wses-2020-terminology');
  expect(
    blocks
      .filter((item) => item.referenceIds.includes('wses-2020-terminology'))
      .map((item) => item.id),
  ).toEqual(['severity', 'severity-question']);
  // Unverified operative topics are an explicit review TODO, not content.
  expect(
    JSON.stringify(blocks.find((item) => item.id === 'operative-sources-todo')),
  ).toMatch(/normal appendix.*phlegmon or abscess/);
  // Current arterial nomenclature, applied consistently.
  const text = JSON.stringify(topic.sections);
  expect(text).not.toMatch(/ileoca?ecal artery/i);
  expect(block('appendicular-artery')).toMatchObject({
    referenceIds: ['ileocolic-anatomy'],
    paragraphs: [
      'The ileocolic artery is the most inferior branch of the superior mesenteric artery. The appendicular artery is described as arising from the inferior branch of the ileocolic artery; it runs within the mesoappendix, close to its free margin, and passes posterior to the terminal ileum.',
    ],
  });
  // The abstract supports short courses in complicated disease, not that
  // intra-operative grading determines antibiotic use; no such claim is made.
  expect(text).not.toMatch(/grading the severity|severity at operation/i);
  // Evidence-comparison claims are not made from descriptive sources.
  expect(text).not.toMatch(/randomised trials found/i);
  // The patient summary carries no numerical risks.
  const patient = blocks.find((block) => block.id === 'patient-understanding')!;
  expect(JSON.stringify(patient)).not.toMatch(/\d+\s*%|\bin \d+\b/);
});
it('registers the ordered clinical topic, with complete reference linkage and twenty levelled questions', () => {
  const topic = validateTopic(acuteAppendicitis);
  expect(
    topicRegistry.getTopic('general-surgery', 'acute-appendicitis'),
  ).toEqual(topic);
  expect(topic.sections.map((section) => section.title)).toEqual([
    'Overview',
    'Presentation',
    'Assessment',
    'Differential diagnoses',
    'Investigations',
    'Imaging',
    'Diagnosis and severity',
    'Management',
    'Special situations',
    'Surgical anatomy',
    'Laparoscopic appendicectomy',
    'Postoperative care',
    'Complications',
    'Consent',
    'Hot Seat',
    'Evidence and references',
  ]);
  const questions = topic.sections
    .flatMap((section) => section.blocks)
    .filter((block) => block.type === 'question');
  expect(questions).toHaveLength(20);
  expect(
    ['medical-student', 'foundation', 'cst', 'registrar'].map(
      (level) =>
        questions.filter((question) => question.minimumLevel === level).length,
    ),
  ).toEqual([6, 5, 5, 4]);
  const used = new Set(
    topic.sections.flatMap((section) =>
      section.blocks.flatMap((block) => block.referenceIds),
    ),
  );
  for (const reference of topic.references) {
    expect(reference.url).toMatch(/^https:\/\//);
    expect(
      used.has(reference.id),
      `${reference.id} should support content`,
    ).toBe(true);
  }
  expect(topic.metadata).toMatchObject({
    status: 'awaiting-review',
    clinicalReviewer: null,
    lastClinicallyReviewed: null,
  });
});
it('shows one control, cumulative question depths, advanced reveal and no false review date', async () => {
  const user = userEvent.setup();
  render(
    <>
      <TrainingLevelSelector />
      <TopicLayout topic={validateTopic(acuteAppendicitis)} />
    </>,
  );
  expect(
    screen.getAllByRole('combobox', { name: 'Training level' }),
  ).toHaveLength(1);
  expect(
    screen.queryByText(/last clinically reviewed/i),
  ).not.toBeInTheDocument();
  expect(
    screen.getAllByText(/Draft educational content — awaiting clinical review/)
      .length,
  ).toBeGreaterThan(0);
  const bank = within(screen.getByRole('region', { name: 'Hot Seat' }));
  expect(screen.getByText('JAMA Surgery · 2026')).toBeInTheDocument();
  expect(
    screen.getByText(
      /Source types describe the publication, not evidence certainty/,
    ),
  ).toBeInTheDocument();
  expect(
    screen.getByText('Mauro Podda, Marco Ceresoli, Belinda De Simone'),
  ).toBeInTheDocument();
  for (const [level, count] of [
    ['medical-student', 6],
    ['foundation', 11],
    ['cst', 16],
    ['registrar', 20],
  ] as const) {
    await user.selectOptions(screen.getByRole('combobox'), level);
    expect(bank.getAllByRole('heading', { level: 3 })).toHaveLength(count);
  }
  await user.selectOptions(screen.getByRole('combobox'), 'medical-student');
  await user.click(
    screen.getByRole('button', { name: 'Show advanced content' }),
  );
  expect(bank.getAllByRole('heading', { level: 3 })).toHaveLength(20);
  expect(bank.getAllByText('Model answer:', { selector: 'span' })).toHaveLength(
    20,
  );
});
