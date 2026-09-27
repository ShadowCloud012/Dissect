import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it, vi } from 'vitest';
import { trainingLevels } from '@/lib/training-level';
import { trainingLevelStorageKey } from '@/lib/training-level-storage';
import { TrainingLevelSelector } from './training-level-selector';

beforeEach(() => localStorage.clear());
it('offers shared training levels and restores selection after remount', async () => {
  const user = userEvent.setup();
  const { unmount } = render(<TrainingLevelSelector />);
  const selector = screen.getByRole('combobox', { name: 'Training level' });
  expect(selector).toHaveValue('medical-student');
  expect(
    screen.getAllByRole('option').map((option) => option.textContent),
  ).toEqual(trainingLevels.map(({ label }) => label));
  await user.selectOptions(selector, 'registrar');
  expect(selector).toHaveValue('registrar');
  unmount();
  render(<TrainingLevelSelector />);
  expect(screen.getByRole('combobox', { name: 'Training level' })).toHaveValue(
    'registrar',
  );
});

it('synchronises two selectors and recovers from storage write restrictions', async () => {
  const user = userEvent.setup();
  render(
    <>
      <TrainingLevelSelector />
      <TrainingLevelSelector />
    </>,
  );
  const [first, second] = screen.getAllByRole('combobox');
  expect(first.id).not.toBe(second.id);
  const blocked = vi
    .spyOn(Storage.prototype, 'setItem')
    .mockImplementation(() => {
      throw new Error('Storage denied');
    });
  await user.selectOptions(first, 'cst');
  expect(second).toHaveValue('cst');
  blocked.mockRestore();
  await user.selectOptions(second, 'foundation');
  expect(first).toHaveValue('foundation');
  expect(localStorage.getItem(trainingLevelStorageKey)).toBe('foundation');
});
