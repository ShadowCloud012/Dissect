import type { ButtonHTMLAttributes } from 'react';

export function Button({
  className = '',
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-dissect-sm border border-dissect-border bg-dissect-surface px-4 text-sm font-medium hover:bg-dissect-paper disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
