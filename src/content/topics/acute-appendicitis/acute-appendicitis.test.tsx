import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it } from 'vitest';
import { topicRegistry } from '@/content/registry';
import { TopicLayout } from '@/components/topic/topic-layout';
import { TrainingLevelSelector } from '@/components/navigation/training-level-selector';
import { validateTopic } from '@/schemas/topic';
import { acuteAppendicitis } from '.';

beforeEach(() => localStorage.clear());
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
  ).toEqual([5, 5, 6, 4]);
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
  for (const [level, count] of [
    ['medical-student', 5],
    ['foundation', 10],
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
