import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it } from 'vitest';
import { topicRegistry } from '@/content/registry';
import { TopicExperience } from './topic-experience';
import { TrainingLevelSelector } from '@/components/navigation/training-level-selector';
const topic = topicRegistry.getTopic('general-surgery', 'acute-appendicitis')!;
beforeEach(() => localStorage.clear());
it('renders grouped quick reference, led by theatre, with essentials at every level', () => {
  render(
    <>
      <TrainingLevelSelector />
      <TopicExperience topic={topic} />
    </>,
  );
  const groups = screen
    .getAllByRole('region')
    .map((region) => region.getAttribute('aria-labelledby'))
    .filter((id) => id?.startsWith('quick-'));
  expect(groups).toEqual([
    'quick-snapshot',
    'quick-do-not-miss',
    'quick-before-theatre',
    'quick-theatre',
    'quick-after-surgery',
  ]);
  const snapshot = within(
    screen.getByRole('region', { name: 'Clinical snapshot' }),
  );
  // Overview names the "what" using verbatim extracts in labelled rows.
  const row = (label: string) =>
    snapshot.getByText(label, { selector: 'dt' }).nextElementSibling;
  expect(row('Typical')).toHaveTextContent(
    'Central abdominal pain moving to the right lower abdomen · The pattern is not universal',
  );
  expect(row('Bloods')).toHaveTextContent('FBC · CRP · U&Es and creatinine');
  expect(row('Urine')).toHaveTextContent(
    'Urine testing · Pregnancy testing when pregnancy is possible',
  );
  expect(row('Imaging')).toHaveTextContent('Ultrasound · CT · MRI');
  expect(row('Options')).toHaveTextContent(
    'Antibiotics alone can be an option in selected uncomplicated disease',
  );
  expect(snapshot.getByRole('link', { name: /^Presentation/ })).toHaveAttribute(
    'href',
    '/learn/general-surgery/acute-appendicitis/assessment',
  );
  // Sources from every extracted block stay reachable, listed once per group.
  expect(snapshot.getByText(/^Sources · \d+$/)).toBeInTheDocument();
  expect(
    snapshot.getAllByRole('link', { name: /^Source: Cochrane MRI/ }),
  ).toHaveLength(1);
  const alert = within(screen.getByRole('region', { name: 'Do not miss' }));
  // Foundation-level deterioration content is essential at every level.
  expect(
    alert.getByRole('heading', { name: /Do not miss deterioration/ }),
  ).toBeVisible();
  const before = within(screen.getByRole('region', { name: 'Before theatre' }));
  for (const label of ['Preparation', 'Consent discussion', 'Not yet covered'])
    expect(
      before.getByRole('heading', { name: new RegExp(`^${label}`) }),
    ).toBeVisible();
  // Missing pre-op content is an explicit editorial gap, not advice.
  expect(before.getByText(/No fasting rule/)).toBeVisible();
  const theatre = within(
    screen.getByRole('region', { name: 'Going to theatre' }),
  );
  for (const label of [
    'Anatomy & landmarks',
    'The operation',
    'Danger areas',
    'What can change the plan',
  ])
    expect(
      theatre.getByRole('heading', { name: new RegExp(`^${label}`) }),
    ).toBeVisible();
  // The operative sequence stays sequential.
  expect(
    theatre.getAllByRole('listitem').filter((item) => item.closest('ol')),
  ).toHaveLength(5);
  const journey = within(
    screen.getByRole('navigation', { name: 'Patient journey' }),
  );
  expect(journey.getAllByRole('link').map((link) => link.textContent)).toEqual([
    'Assessment',
    'Investigations',
    'Decision',
    'Pre-op',
    'Theatre',
    'Recovery',
  ]);
  expect(journey.getByRole('link', { name: 'Pre-op' })).toHaveAttribute(
    'href',
    '#quick-before-theatre',
  );
  expect(theatre.getByRole('link', { name: /^Danger areas/ })).toHaveAttribute(
    'href',
    '/learn/general-surgery/acute-appendicitis/anatomy#block-structures-at-risk',
  );
  expect(
    within(
      screen.getByRole('region', { name: 'After surgery · on the ward' }),
    ).getByRole('navigation', { name: 'On the ward: go deeper' }),
  ).toBeInTheDocument();
  // Hub content is not level-gated, so the depth toolbar is omitted.
  expect(
    screen.queryByRole('button', { name: /advanced content/ }),
  ).not.toBeInTheDocument();
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
it('keeps basic operative understanding universal and gates technical rows by depth', async () => {
  const user = userEvent.setup();
  render(
    <>
      <TrainingLevelSelector />
      <TopicExperience topic={topic} />
    </>,
  );
  const theatre = within(
    screen.getByRole('region', { name: 'Going to theatre' }),
  );
  const row = (label: string) =>
    theatre.getByText(label, { selector: 'dt' }).nextElementSibling;
  // Universal: findings can change the approach; seek senior help.
  expect(row('Findings')).toHaveTextContent(
    'Poor visualisation or difficult anatomy may require a changed approach',
  );
  expect(row('Seek help')).toBeVisible();
  // Conversion/strategy reasoning is CST depth, with a visible hint below it.
  expect(row('Strategy')).toHaveTextContent('Further detail at CST depth');
  expect(theatre.queryByText(/Device choice/)).not.toBeInTheDocument();
  const after = within(
    screen.getByRole('region', { name: 'After surgery · on the ward' }),
  );
  expect(
    after.getByText('Antibiotics', { selector: 'dt' }).nextElementSibling,
  ).toHaveTextContent('Further detail at FY1/2 depth');
  await user.selectOptions(screen.getByRole('combobox'), 'cst');
  expect(row('Strategy')).toHaveTextContent(
    'Including conversion · Device choice and strategy depend on findings and expertise',
  );
  expect(
    after.getByText('Antibiotics', { selector: 'dt' }).nextElementSibling,
  ).toHaveTextContent('Distinguish prophylaxis from treatment');
});
it('keeps every subpage one tap away from the hub and exposes a quick-jump bar', () => {
  render(<TopicExperience topic={topic} />);
  const directory = within(
    screen.getByRole('navigation', { name: 'All pages in this topic' }),
  );
  for (const page of topic.experience!.pages)
    expect(directory.getByRole('link', { name: page.title })).toHaveAttribute(
      'href',
      `/learn/general-surgery/acute-appendicitis/${page.slug}`,
    );
  // Related links would duplicate the hub directory, so they live on subpages.
  expect(
    screen.queryByRole('region', { name: 'Related' }),
  ).not.toBeInTheDocument();
  const jump = within(screen.getByRole('navigation', { name: 'Quick jump' }));
  expect(jump.getAllByRole('link').map((link) => link.textContent)).toEqual([
    'Overview',
    'Assess',
    'Investigate',
    'Manage',
    'Anatomy',
    'Operate',
    'Complications',
  ]);
  expect(jump.getByRole('link', { name: 'Overview' })).toHaveAttribute(
    'aria-current',
    'page',
  );
});
it('shows related content and a route back to the overview on subpages', () => {
  render(<TopicExperience topic={topic} pageSlug="management" />);
  const related = within(
    screen.getByRole('region', { name: 'Related' }),
  ).getAllByRole('link');
  expect(related.map((link) => link.getAttribute('href'))).toEqual(
    topic.experience!.related.map(
      (item) => `/learn/general-surgery/acute-appendicitis/${item.page}`,
    ),
  );
  expect(
    screen.getByRole('link', { name: /Acute appendicitis overview/ }),
  ).toHaveAttribute('href', '/learn/general-surgery/acute-appendicitis');
  expect(
    screen.getByRole('navigation', { name: 'Previous and next page' }),
  ).toBeInTheDocument();
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
