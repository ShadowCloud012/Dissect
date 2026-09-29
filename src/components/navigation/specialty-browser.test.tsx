import { render, screen, within } from '@testing-library/react';
import { expect, it } from 'vitest';
import { topicRegistry } from '@/content/registry';
import { getSpecialty } from '@/content/specialties';
import { SpecialtyBrowserView } from './specialty-browser';

const specialty = getSpecialty('general-surgery')!;
const props = {
  conditions: topicRegistry.listConditions('general-surgery'),
  procedures: topicRegistry.listProcedures('general-surgery'),
  categories: specialty.categories,
  pathname: '/learn/general-surgery',
};
const base = '/learn/general-surgery';

it('separates conditions from procedures and links each to the other', () => {
  render(<SpecialtyBrowserView {...props} selected="all" />);
  const conditions = within(screen.getByRole('region', { name: 'Conditions' }));
  const procedures = within(screen.getByRole('region', { name: 'Procedures' }));
  expect(
    conditions.getAllByRole('heading', { level: 3 }).map((h) => h.textContent),
  ).toEqual([
    'Acute appendicitis↗',
    'Gallstone disease and acute cholecystitis↗',
  ]);
  expect(
    procedures.getAllByRole('heading', { level: 3 }).map((h) => h.textContent),
  ).toEqual(['Laparoscopic appendicectomy↗', 'Laparoscopic cholecystectomy↗']);
  // Condition → operation, and procedure → clinical context.
  expect(
    conditions.getByRole('link', { name: 'Laparoscopic cholecystectomy' }),
  ).toHaveAttribute(
    'href',
    `${base}/gallstone-disease/laparoscopic-cholecystectomy`,
  );
  expect(
    procedures.getByRole('link', { name: 'Acute appendicitis' }),
  ).toHaveAttribute('href', `${base}/acute-appendicitis`);
  expect(screen.getByRole('status')).toHaveTextContent(
    '2 conditions · 2 procedures · All topics',
  );
});

it.each([
  ['colorectal', ['Acute appendicitis'], ['Laparoscopic appendicectomy']],
  [
    'hpb',
    ['Gallstone disease and acute cholecystitis'],
    ['Laparoscopic cholecystectomy'],
  ],
  [
    'emergency-general-surgery',
    ['Acute appendicitis', 'Gallstone disease and acute cholecystitis'],
    ['Laparoscopic appendicectomy', 'Laparoscopic cholecystectomy'],
  ],
])(
  'filters the %s category view without duplicating pages',
  (category, conditionTitles, procedureTitles) => {
    render(<SpecialtyBrowserView {...props} selected={category} />);
    const nav = within(
      screen.getByRole('navigation', { name: 'Topic categories' }),
    );
    expect(nav.getByRole('link', { current: true })).toHaveAttribute(
      'href',
      `${base}?category=${category}`,
    );
    // Empty categories do not become navigation.
    expect(nav.queryByRole('link', { name: /Breast/ })).toBeNull();
    const titles = (region: string) =>
      within(screen.getByRole('region', { name: region }))
        .getAllByRole('heading', { level: 3 })
        .map((heading) => heading.textContent!.replace('↗', ''));
    expect(titles('Conditions')).toEqual(conditionTitles);
    expect(titles('Procedures')).toEqual(procedureTitles);
  },
);
