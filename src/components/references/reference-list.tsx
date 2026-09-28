import type { Reference } from '@/schemas/reference';

export function ReferenceItem({ reference }: { reference: Reference }) {
  return (
    <li
      id={`reference-${reference.id}`}
      tabIndex={-1}
      className="scroll-mt-6 border-t border-dissect-border py-4 text-sm leading-6 target:rounded-dissect-sm target:bg-dissect-green-50"
    >
      <p className="font-semibold">{reference.title}</p>
      {reference.organisation && <p>{reference.organisation}</p>}
      {reference.authors && <p>{reference.authors.join(', ')}</p>}
      <p className="text-dissect-muted">
        {reference.publication && `${reference.publication} Â· `}
        {reference.year}
      </p>
      <p className="text-xs text-dissect-green-800">
        Source type: {reference.evidenceType.replaceAll('-', ' ')}
      </p>
      {reference.notes && (
        <p className="mt-2 text-xs text-dissect-muted">{reference.notes}</p>
      )}
      {reference.accessedAt && (
        <p className="text-xs text-dissect-muted">
          Accessed {reference.accessedAt}
        </p>
      )}
      {reference.url && (
        <a
          className="inline-flex min-h-11 items-center text-dissect-green-800 underline underline-offset-4"
          href={reference.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open source
          <span className="sr-only">
            : {reference.title} (opens in a new tab)
          </span>
        </a>
      )}
    </li>
  );
}
export function ReferenceList({ references }: { references: Reference[] }) {
  return (
    <section
      aria-labelledby="references-heading"
      id="references"
      className="scroll-mt-6"
    >
      <h2 id="references-heading" className="mb-3 text-lg font-semibold">
        References
      </h2>
      <p className="mb-3 text-sm text-dissect-muted">
        Source types describe the publication, not evidence certainty. A source
        type does not establish that every linked claim is supported.
      </p>
      <ol className="list-inside list-decimal">
        {references.map((reference) => (
          <ReferenceItem key={reference.id} reference={reference} />
        ))}
      </ol>
    </section>
  );
}
