import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it } from 'vitest';
import { topicRegistry } from '@/content/registry';
import { TopicExperience } from './topic-experience';
import { TrainingLevelSelector } from '@/components/navigation/training-level-selector';
const topic = topicRegistry.getTopic('general-surgery', 'acute-appendicitis')!;
beforeEach(() => localStorage.clear());
it('renders a concise hub, essential deterioration at every level and contextual links', () => {
  render(
    <>
      <TrainingLevelSelector />
      <TopicExperience topic={topic} />
    </>,
  );
  expect(
    screen.getByRole('heading', { name: 'Quick reference' }),
  ).toBeVisible();
  expect(
    screen.getByRole('heading', { name: 'Do not miss deterioration' }),
  ).toBeVisible();
  expect(screen.getByRole('heading', { name: 'On the ward' })).toBeVisible();
  expect(
    screen.getByRole('heading', { name: 'Going to theatre' }),
  ).toBeVisible();
  expect(screen.getAllByRole('combobox')).toHaveLength(1);
  expect(
    screen.queryByRole('heading', { name: 'References' }),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole('navigation', { name: 'Breadcrumb' }),
  ).toHaveTextContent('General Surgery');
  const nav = within(screen.getByRole('navigation', { name: 'Topic pages' }));
  expect(nav.getByRole('link', { name: 'Overview' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  expect(nav.getByText('Clinical')).toBeInTheDocument();
});
it('keeps depth cumulative on subpages and supports active recall with accessible sources', async () => {
  const user = userEvent.setup();
  render(
    <>
      <TrainingLevelSelector />
      <TopicExperience topic={topic} pageSlug="hot-seat" />
    </>,
  );
  const bank = within(screen.getByRole('region', { name: 'Hot Seat' }));
  expect(bank.getAllByRole('heading', { level: 3 })).toHaveLength(5);
  const answer = screen.getByText(/Early visceral pain can give way/);
  expect(answer).not.toBeVisible();
  await user.click(bank.getAllByText('Reveal model answer')[0]);
  expect(answer).toBeVisible();
  await user.selectOptions(screen.getByRole('combobox'), 'cst');
  expect(bank.getAllByRole('heading', { level: 3 })).toHaveLength(16);
  await user.click(
    screen.getByRole('button', { name: 'Show advanced content' }),
  );
  expect(bank.getAllByRole('heading', { level: 3 })).toHaveLength(20);
  expect(bank.getAllByRole('link', { name: /Source:/ })[0]).toHaveAttribute(
    'href',
    '/learn/general-surgery/acute-appendicitis/evidence#reference-appendix-anatomy',
  );
});
it('preserves draft status and exposes the bibliography on its own page', () => {
  render(<TopicExperience topic={topic} pageSlug="evidence" />);
  expect(screen.getByRole('heading', { name: 'References' })).toBeVisible();
  expect(
    screen.getByText('Mauro Podda, Marco Ceresoli, Belinda De Simone'),
  ).toBeVisible();
  expect(
    screen.getByText('Draft educational content — awaiting clinical review', {
      exact: true,
    }),
  ).toBeVisible();
  expect(
    screen.queryByText(/last clinically reviewed/i),
  ).not.toBeInTheDocument();
});
