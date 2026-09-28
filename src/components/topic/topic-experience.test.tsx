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
it('links the hub to every subpage, related content and a quick-jump bar', () => {
  render(<TopicExperience topic={topic} />);
  const directory = within(
    screen.getByRole('navigation', { name: 'Go deeper' }),
  );
  for (const page of topic.experience!.pages)
    expect(
      directory.getByRole('link', { name: new RegExp(`^${page.title}`) }),
    ).toHaveAttribute(
      'href',
      `/learn/general-surgery/acute-appendicitis/${page.slug}`,
    );
  const related = within(
    screen.getByRole('region', { name: 'Related' }),
  ).getAllByRole('link');
  expect(related.map((link) => link.getAttribute('href'))).toEqual(
    topic.experience!.related.map(
      (item) => `/learn/general-surgery/acute-appendicitis/${item.page}`,
    ),
  );
  const jump = within(screen.getByRole('navigation', { name: 'Quick jump' }));
  expect(jump.getAllByRole('link').map((link) => link.textContent)).toEqual([
    'Overview',
    'Assess',
    'Investigate',
    'Manage',
    'Operate',
    'Complications',
  ]);
  expect(jump.getByRole('link', { name: 'Overview' })).toHaveAttribute(
    'aria-current',
    'page',
  );
});
it('renders a linked management pathway and reveals deep-linked advanced blocks', () => {
  window.location.hash = '#block-abscess-options';
  const { unmount } = render(
    <TopicExperience topic={topic} pageSlug="management" />,
  );
  const pathway = within(
    screen.getByRole('figure', {
      name: 'How the management content fits together',
    }),
  );
  expect(
    pathway.getByRole('link', { name: /Mass or abscess/ }),
  ).toHaveAttribute('href', '#block-abscess-options');
  expect(
    pathway.getByRole('link', { name: /Mass or abscess/ }),
  ).toHaveTextContent('Registrar depth');
  // Registrar block is above the default depth, but the direct link reveals it.
  expect(screen.getByText(/appendiceal mass is treated/)).toBeVisible();
  expect(screen.getByText(/Shown from a direct link/)).toBeVisible();
  expect(screen.queryByText(/APPAC studied/)).not.toBeInTheDocument();
  unmount();
  window.location.hash = '';
});
it('groups investigations and imaging modalities', () => {
  render(<TopicExperience topic={topic} pageSlug="investigations" />);
  const imaging = within(
    screen.getByRole('group', { name: 'Imaging modalities' }),
  );
  // The definition term already names this block, so no duplicate label.
  expect(imaging.getAllByText('Ultrasound')).toHaveLength(1);
  expect(imaging.getByRole('heading', { name: 'MRI' })).toBeVisible();
  expect(
    screen.getByRole('group', { name: 'Bloods & urine' }),
  ).toBeInTheDocument();
});
it('lists local-policy content on the evidence page with deep links', () => {
  render(<TopicExperience topic={topic} pageSlug="evidence" />);
  const list = within(
    screen.getByRole('region', {
      name: 'Content that may vary by local policy',
    }),
  );
  expect(
    list.getByRole('link', { name: /Follow the applicable policy/ }),
  ).toHaveAttribute(
    'href',
    '/learn/general-surgery/acute-appendicitis/management#block-antimicrobial-policy',
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
