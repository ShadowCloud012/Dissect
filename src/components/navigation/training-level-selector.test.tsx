import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it } from 'vitest';
import { TrainingLevelSelector } from './training-level-selector';

it('offers every training level and keeps selection local to the mounted UI', async () => {
  const user = userEvent.setup();
  const { unmount } = render(<TrainingLevelSelector />);
  const selector = screen.getByRole('combobox', { name: 'Training level' });
  expect(selector).toHaveValue('medical-student');
  expect(
    screen.getAllByRole('option').map((option) => option.textContent),
  ).toEqual(['Medical Student', 'FY1/2', 'CST', 'Registrar']);
  await user.selectOptions(selector, 'registrar');
  expect(selector).toHaveValue('registrar');
  unmount();
  render(<TrainingLevelSelector />);
  expect(screen.getByRole('combobox', { name: 'Training level' })).toHaveValue(
    'medical-student',
  );
});
