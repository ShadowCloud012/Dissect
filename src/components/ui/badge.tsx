import type { HTMLAttributes } from 'react';

export function Badge({
  className = '',
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`inline-flex rounded-dissect-sm bg-dissect-green-50 px-2 py-1 font-mono text-xs text-dissect-green-800 ${className}`}
      {...props}
    />
  );
}
