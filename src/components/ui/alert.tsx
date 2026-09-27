import type { ReactNode } from 'react';
import { Info } from 'lucide-react';

export function Alert({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-dissect-md border border-dissect-border bg-dissect-paper p-4 text-sm leading-6">
      <Info
        aria-hidden="true"
        size={18}
        className="mt-1 shrink-0 text-dissect-muted"
      />
      <div>
        <p className="font-semibold">{title}</p>
        <div className="text-dissect-muted">{children}</div>
      </div>
    </div>
  );
}
