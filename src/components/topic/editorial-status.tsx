import type { ReviewState } from '@/schemas/topic';

export function EditorialStatus({ metadata }: { metadata: ReviewState }) {
  if (metadata.contentKind === 'non-clinical-demo')
    return (
      <p className="text-xs leading-6 text-dissect-muted">
        Demo review date (not a clinical review)
        <br />
        <time dateTime={metadata.demoReviewedAt}>
          {metadata.demoReviewedAt}
        </time>
      </p>
    );
  if (metadata.status === 'clinically-reviewed')
    return (
      <p className="text-sm leading-6">
        Last clinically reviewed{' '}
        <time dateTime={metadata.lastClinicallyReviewed!}>
          {metadata.lastClinicallyReviewed}
        </time>{' '}
        by {metadata.clinicalReviewer}
      </p>
    );
  return (
    <p className="border-l-2 border-dissect-amber bg-dissect-amber-soft px-3 py-2 text-sm font-medium text-dissect-amber">
      {metadata.status === 'awaiting-review'
        ? 'Draft educational content — awaiting clinical review'
        : 'Draft educational content — not clinically reviewed'}
    </p>
  );
}
