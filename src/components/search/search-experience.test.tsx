import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { topicRegistry } from '@/content/registry';
import { SearchView } from './search-experience';

const props = {
  documents: topicRegistry.searchDocuments(),
  specialtyTitles: { 'general-surgery': 'General Surgery' },
};

it('starts with guidance and real example searches, focused on the field', () => {
  render(<SearchView {...props} urlQuery="" />);
  expect(screen.getByRole('searchbox')).toHaveFocus();
  expect(screen.getByRole('status')).toHaveTextContent(
    'Try a condition, procedure, anatomy term or complication.',
  );
  const examples = within(
    screen.getByRole('navigation', { name: 'Example searches' }),
  ).getAllByRole('link');
  expect(examples.map((link) => link.getAttribute('href'))).toEqual([
    '/search?q=Appendicitis',
    '/search?q=Lap%20chole',
    '/search?q=Cystic%20duct',
    '/search?q=Bile%20duct%20injury',
  ]);
  expect(screen.queryByRole('list', { name: 'Search results' })).toBeNull();
});

it('shows compact, labelled results with why they matched and review status', async () => {
  render(<SearchView {...props} urlQuery="" />);
  await userEvent.type(screen.getByRole('searchbox'), 'lap chole');
  expect(window.location.search).toBe('?q=lap%20chole');
  expect(screen.getByRole('status')).toHaveTextContent(
    '2 results for “lap chole”',
  );
  const [result] = within(
    screen.getByRole('list', { name: 'Search results' }),
  ).getAllByRole('listitem');
  expect(result).toHaveTextContent('Exact match');
  expect(
    within(result).getByRole('link', { name: 'Laparoscopic cholecystectomy' }),
  ).toHaveAttribute(
    'href',
    '/learn/general-surgery/gallstone-disease/laparoscopic-cholecystectomy',
  );
  expect(result).toHaveTextContent(
    'Procedure · General Surgery · Gallstone disease and acute cholecystitis',
  );
  expect(result).toHaveTextContent('Also known as: lap chole');
  expect(result).toHaveTextContent('Draft · awaiting clinical review');
});

it('labels anatomy results and the matched term', () => {
  render(<SearchView {...props} urlQuery="cystic duct" />);
  const [first] = within(
    screen.getByRole('list', { name: 'Search results' }),
  ).getAllByRole('listitem');
  expect(first).toHaveTextContent(
    'Anatomy — Gallstone disease and acute cholecystitis',
  );
  expect(first).toHaveTextContent('Anatomy · General Surgery');
  expect(first).toHaveTextContent('Matched keyword: cystic duct');
  expect(first).not.toHaveTextContent('Exact match');
});

it('says plainly when nothing matches, without approximate suggestions', () => {
  render(<SearchView {...props} urlQuery="appendisitis" />);
  expect(screen.getByRole('status')).toHaveTextContent(
    'No exact or metadata match for “appendisitis”.',
  );
  expect(screen.queryByRole('list', { name: 'Search results' })).toBeNull();
  expect(
    screen.getByRole('link', { name: 'browse General Surgery' }),
  ).toHaveAttribute('href', '/learn/general-surgery');
});

it('clears with the Clear button or Escape and keeps focus in the field', async () => {
  render(<SearchView {...props} urlQuery="" />);
  const field = screen.getByRole('searchbox');
  await userEvent.type(field, 'appendicitis');
  await userEvent.click(screen.getByRole('button', { name: 'Clear search' }));
  expect(field).toHaveValue('');
  expect(field).toHaveFocus();
  expect(window.location.search).toBe('');
  await userEvent.type(field, 'mesoappendix{Escape}');
  expect(field).toHaveValue('');
  expect(
    screen.queryByRole('button', { name: 'Clear search' }),
  ).not.toBeInTheDocument();
});

it('follows the URL on navigation but keeps its own typing, even when echoes lag', async () => {
  const { rerender } = render(<SearchView {...props} urlQuery="lap chole" />);
  const field = screen.getByRole('searchbox');
  expect(field).toHaveValue('lap chole');
  // Typing writes the URL; a late echo of an earlier write must not undo it.
  await userEvent.clear(field);
  await userEvent.type(field, 'cystic ');
  rerender(<SearchView {...props} urlQuery="cys" />);
  expect(field).toHaveValue('cystic ');
  rerender(<SearchView {...props} urlQuery="cystic" />);
  expect(field).toHaveValue('cystic ');
  // Any other URL (Search nav item, back/forward, a link) replaces the field.
  rerender(<SearchView {...props} urlQuery="" />);
  expect(field).toHaveValue('');
  expect(screen.getByRole('status')).toHaveTextContent(
    'Try a condition, procedure, anatomy term or complication.',
  );
  rerender(<SearchView {...props} urlQuery="biliary colic" />);
  expect(field).toHaveValue('biliary colic');
  expect(screen.getByRole('status')).toHaveTextContent(
    'results for “biliary colic”',
  );
});
