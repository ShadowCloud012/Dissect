import type { HTMLAttributes } from 'react';

export function Card({
  className = '',
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-dissect-lg border border-dissect-border bg-dissect-surface p-6 shadow-dissect-sm sm:p-8 ${className}`}
      {...props}
    />
  );
}
