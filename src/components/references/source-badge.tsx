import type { Reference } from '@/schemas/reference';

export function SourceBadge({
  reference,
  evidenceHref = '',
}: {
  reference: Reference;
  evidenceHref?: string;
}) {
  return (
    <a
      href={`${evidenceHref}#reference-${reference.id}`}
      aria-label={`Source: ${reference.title}`}
      className="inline-flex min-h-11 items-center rounded-dissect-sm px-2 font-mono text-xs text-dissect-green-800 underline decoration-dissect-green-200 underline-offset-4 hover:bg-dissect-green-50"
    >
      Source: {reference.shortTitle ?? reference.title}
    </a>
  );
}
