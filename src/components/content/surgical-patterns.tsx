import type { ContentBlock } from '@/schemas/content-block';

export function RevisionQuestion({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <div className="revision-question">
      <p className="eyebrow">Active recall</p>
      <h3 className="mt-2 text-lg font-semibold">{question}</h3>
      <details className="mt-3">
        <summary className="disclosure-trigger">Reveal model answer</summary>
        <p className="border-t border-dissect-border pt-3">
          <span className="font-medium">Model answer: </span>
          {answer}
        </p>
      </details>
    </div>
  );
}
export function OperativeStepList({
  items,
  labels,
}: {
  items: string[];
  labels?: string[];
}) {
  return (
    <ol className="operative-steps">
      {items.map((item, index) => (
        <li key={item}>
          <span className="step-number" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
          <details open>
            <summary className="disclosure-trigger">
              {labels?.[index] ?? `Step ${index + 1}`}
            </summary>
            <p>{item}</p>
          </details>
        </li>
      ))}
    </ol>
  );
}
export function ComplicationCards({
  block,
}: {
  block: Extract<ContentBlock, { type: 'table' }>;
}) {
  return (
    <div>
      <p className="mb-4 text-sm text-dissect-muted">{block.caption}</p>
      <dl className="complication-grid">
        {block.rows.map(([name, description]) => (
          <div key={name}>
            <dt className="font-semibold">{name}</dt>
            <dd className="mt-2 text-sm leading-6">{description}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
export function ConsentPanel({
  items,
  labels,
}: {
  items: string[];
  labels?: string[];
}) {
  return (
    <ol className="consent-panel">
      {items.map((item, index) => (
        <li key={item}>
          <span className="eyebrow" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div>
            {labels?.[index] && (
              <h4 className="mb-1 font-semibold">{labels[index]}</h4>
            )}
            <p>{item}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
