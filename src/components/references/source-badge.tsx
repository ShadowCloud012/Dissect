import type { Reference } from '@/schemas/reference';

export function SourceBadge({
  reference,
  evidenceHref = '',
}: {
  reference: Reference;
  evidenceHref?: string;
}) {
  const label = reference.shortTitle ?? reference.title;
  // The visible short label begins the accessible name; the full title follows.
  return (
    <a
      href={`${evidenceHref}#reference-${reference.id}`}
      title={reference.title}
      className="inline-flex min-h-11 items-center rounded-dissect-sm px-2 font-mono text-xs text-dissect-green-800 underline decoration-dissect-green-200 underline-offset-4 hover:bg-dissect-green-50"
    >
      Source: {label}
      {label !== reference.title && (
        <span className="sr-only"> — {reference.title}</span>
      )}
    </a>
  );
}
