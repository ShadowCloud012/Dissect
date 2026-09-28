import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it } from 'vitest';
import { topicRegistry } from '@/content/registry';
import { TopicLayout } from './topic-layout';
import { TrainingLevelSelector } from '@/components/navigation/training-level-selector';
beforeEach(() => localStorage.clear());
it('renders two depths, reveals advanced blocks and claims, and links sources', async () => {
  const user = userEvent.setup();
  render(
    <>
      <TrainingLevelSelector />
      <TopicLayout
        topic={topicRegistry.getTopic('demo', 'how-dissect-content-works')!}
      />
    </>,
  );
  expect(screen.getByText('Structured topic')).toBeVisible();
  expect(
    screen.queryByText('CST example: content structure'),
  ).not.toBeInTheDocument();
  await user.selectOptions(screen.getByRole('combobox'), 'cst');
  expect(screen.getByText('CST example: content structure')).toBeVisible();
  expect(
    screen.queryByText('Registrar example: one content source'),
  ).not.toBeInTheDocument();
  await user.selectOptions(screen.getByRole('combobox'), 'medical-student');
  await user.click(
    screen.getByRole('button', { name: 'Show advanced content' }),
  );
  expect(
    screen.getByText('Registrar example: one content source'),
  ).toBeVisible();
  expect(
    screen.getByText(
      'Task 02 requires advanced content to remain intentionally revealable.',
    ),
  ).toBeVisible();
  await user.click(
    screen.getByRole('button', { name: 'Hide advanced content' }),
  );
  expect(
    screen.queryByText('Registrar example: one content source'),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByText(
      'Task 02 requires advanced content to remain intentionally revealable.',
    ),
  ).not.toBeInTheDocument();
  expect(
    screen.getAllByRole('link', { name: /Source: Dissect v2/ })[0],
  ).toHaveAttribute('href', '#reference-dissect-blueprint');
  expect(
    screen.getByRole('link', { name: /Open source: Dissect v2/ }),
  ).toHaveAttribute('rel', 'noopener noreferrer');
});
