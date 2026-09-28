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
          <span className="step-number">
            <span className="sr-only">Step </span>
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
// Labelled cards for authored list items (e.g. history categories, structures).
export function LabelledCards({
  items,
  labels,
}: {
  items: string[];
  labels: string[];
}) {
  return (
    <dl className="labelled-cards">
      {items.map((item, index) => (
        <div key={item}>
          <dt className="eyebrow">{labels[index]}</dt>
          <dd className="mt-1">{item}</dd>
        </div>
      ))}
    </dl>
  );
}
export function EscalationPoint({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div>
      <p className="font-semibold">{title}</p>
      <p>{text}</p>
    </div>
  );
}
export function ComplicationCards({
  block,
}: {
  block: Extract<ContentBlock, { type: 'table' }>;
}) {
  const [, ...detailColumns] = block.columns;
  return (
    <div>
      <p className="mb-4 text-sm text-dissect-muted">{block.caption}</p>
      <ul className="complication-grid">
        {block.rows.map(([name, ...details]) => (
          <li key={name}>
            <h4 className="font-semibold">{name}</h4>
            <dl>
              {details.map((detail, index) => (
                <div key={detailColumns[index]} className="mt-2">
                  <dt className="eyebrow">{detailColumns[index]}</dt>
                  <dd className="mt-1 text-sm leading-6">{detail}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
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
type PathwayNode = { label: string; href: string; depth?: string };
// Semantic, link-based overview: it orients readers to authored content and
// never states recommendations of its own.
export function DecisionPathway({
  id,
  title,
  caption,
  steps,
  branches,
}: {
  id: string;
  title: string;
  caption: string;
  steps: PathwayNode[];
  branches: PathwayNode[];
}) {
  const node = ({ label, href, depth }: PathwayNode) => (
    <a href={href}>
      <span>{label}</span>
      {depth && <span className="pathway-depth">{depth}</span>}
    </a>
  );
  return (
    <figure className="decision-pathway" aria-labelledby={`pathway-${id}`}>
      <figcaption>
        <h2 id={`pathway-${id}`} className="text-lg font-semibold">
          {title}
        </h2>
        <p className="mt-1 text-sm text-dissect-muted">{caption}</p>
      </figcaption>
      <ol className="pathway-steps">
        {steps.map((step) => (
          <li key={step.href}>{node(step)}</li>
        ))}
      </ol>
      <ul className="pathway-branches" aria-label="Situations covered below">
        {branches.map((branch) => (
          <li key={branch.href}>{node(branch)}</li>
        ))}
      </ul>
    </figure>
  );
}
