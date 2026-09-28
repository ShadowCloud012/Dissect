import { render, screen, within } from '@testing-library/react';
import { expect, it } from 'vitest';
import { topicRegistry } from '@/content/registry';
import { getSpecialty } from '@/content/specialties';
import { SpecialtyBrowserView } from './specialty-browser';

const specialty = getSpecialty('general-surgery')!;
const topics = topicRegistry.listBySpecialty('general-surgery');

it.each(['emergency-general-surgery', 'colorectal'])(
  'shows the canonical topic in the %s category view',
  (category) => {
    render(
      <SpecialtyBrowserView
        topics={topics}
        categories={specialty.categories}
        selected={category}
        pathname="/learn/general-surgery"
      />,
    );
    const nav = within(
      screen.getByRole('navigation', { name: 'Topic categories' }),
    );
    expect(nav.getByRole('link', { current: true })).toHaveAttribute(
      'href',
      `/learn/general-surgery?category=${category}`,
    );
    // Empty categories do not become navigation.
    expect(nav.queryByRole('link', { name: /Breast/ })).toBeNull();
    expect(
      within(
        screen.getByRole('region', { name: 'Available topics' }),
      ).getByRole('link', { name: /Acute appendicitis/ }),
    ).toHaveAttribute('href', '/learn/general-surgery/acute-appendicitis');
  },
);
