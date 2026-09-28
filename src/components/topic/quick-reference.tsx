import Link from 'next/link';
import type { Topic } from '@/schemas/topic';
import type { ContentBlock } from '@/schemas/content-block';
import { selectQuickReference, topicHref } from '@/lib/topic-pages';
import { Sources } from '@/components/content/content-renderer';

function QuickAnswer({
  block,
  itemIndex,
}: {
  block: ContentBlock;
  itemIndex?: number;
}) {
  switch (block.type) {
    case 'prose':
      return <p>{block.paragraphs.join(' ')}</p>;
    case 'keyPoints':
    case 'checklist':
      return itemIndex !== undefined ? (
        <p>{block.items[itemIndex]}</p>
      ) : (
        <ul>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    case 'warning':
    case 'clinicalPearl':
    case 'sourceNote':
      return <p>{block.text}</p>;
    case 'definition':
      return <p>{block.meaning}</p>;
    case 'table':
      return (
        <ul className="flex flex-wrap gap-2">
          {block.rows.map((row) => (
            <li
              className="border border-dissect-border px-2 py-1 text-sm"
              key={row[0]}
            >
              {row[0]}
            </li>
          ))}
        </ul>
      );
    default:
      return null;
  }
}
export function QuickReference({ topic }: { topic: Topic }) {
  const base = topicHref(topic.metadata);
  return (
    <section aria-labelledby="quick-heading">
      <div className="mb-4 flex items-baseline justify-between gap-2">
        <h2 id="quick-heading" className="text-2xl font-semibold">
          Quick reference
        </h2>
        <span className="eyebrow">Essentials for every level</span>
      </div>
      <div className="quick-grid">
        {selectQuickReference(topic).map(
          ({ block, label, page, itemIndex }) => (
            <div key={block.id}>
              <article
                className={
                  block.type === 'warning'
                    ? 'quick-answer quick-warning'
                    : 'quick-answer'
                }
              >
                <h3>
                  <Link href={`${base}/${page}#block-${block.id}`}>
                    {label}
                    <span aria-hidden="true"> ↗</span>
                  </Link>
                </h3>
                <div className="mt-2 text-sm leading-6">
                  <QuickAnswer block={block} itemIndex={itemIndex} />
                </div>
                {block.localPolicyMayVary && (
                  <p className="mt-2 text-xs text-dissect-amber">
                    Local policy may vary.
                  </p>
                )}
                <Sources
                  ids={block.referenceIds}
                  references={topic.references}
                  evidenceHref={`${base}/evidence`}
                />
              </article>
            </div>
          ),
        )}
      </div>
    </section>
  );
}
export function ContextPanels({ topic }: { topic: Topic }) {
  return (
    <div className="context-panels">
      {topic.experience?.contexts.map((context) => (
        <section key={context.id} aria-labelledby={`context-${context.id}`}>
          <p className="eyebrow">Use in context</p>
          <h2
            id={`context-${context.id}`}
            className="mt-2 text-xl font-semibold"
          >
            {context.title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-dissect-muted">
            {context.description}
          </p>
          <ul className="mt-3">
            {context.links.map((link) => (
              <li key={link.page}>
                <Link
                  className="related-link"
                  href={`${topicHref(topic.metadata)}/${link.page}`}
                >
                  {link.title}
                  <span aria-hidden="true">↗</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
