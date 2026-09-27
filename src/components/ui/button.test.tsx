import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { Button } from './button';

it('is keyboard-operable and does not submit forms by default', async () => {
  const user = userEvent.setup();
  const clicked = vi.fn();
  render(<Button onClick={clicked}>Continue</Button>);
  const button = screen.getByRole('button', { name: 'Continue' });
  expect(button).toHaveAttribute('type', 'button');
  await user.tab();
  expect(button).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(clicked).toHaveBeenCalledOnce();
});
