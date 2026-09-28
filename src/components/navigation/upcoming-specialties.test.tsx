import { render, screen, within } from '@testing-library/react';
import { expect, it } from 'vitest';
import { specialties } from '@/content/specialties';
import { UpcomingSpecialties } from './upcoming-specialties';

it('shows unavailable specialties as non-interactive placeholders only', () => {
  render(<UpcomingSpecialties />);
  const section = within(
    screen.getByRole('region', { name: /not yet available/ }),
  );
  const items = section.getAllByRole('listitem');
  expect(items.map((item) => item.firstChild?.textContent)).toEqual([
    'ENT',
    'Urology',
    'Trauma & Orthopaedics',
    'Vascular Surgery',
  ]);
  for (const item of items)
    expect(item).toHaveTextContent(/Coming later — no content available yet/);
  expect(section.queryAllByRole('link')).toHaveLength(0);
  expect(section.queryByText(/topic/)).toBeNull();
  // Placeholders are never registered, so no routes or counts can exist.
  expect(specialties.map((specialty) => specialty.title)).toEqual([
    'General Surgery',
  ]);
});
