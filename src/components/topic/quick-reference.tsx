import Link from 'next/link';
import type { Topic } from '@/schemas/topic';
import type { ContentBlock } from '@/schemas/content-block';
import type { relatedKinds } from '@/schemas/topic-experience';
import { groupQuickReference, topicHref } from '@/lib/topic-pages';
import { Sources } from '@/components/content/content-renderer';

type RelatedKind = (typeof relatedKinds)[number];

// Renders authored wording verbatim: a whole block, one list item or one
// table row (without its label cell).
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
        <ul className="list-disc space-y-1 pl-5">
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
      return itemIndex !== undefined ? (
        <p>{block.rows[itemIndex].slice(1).join(' ')}</p>
      ) : (
        <ul className="quick-chips">
          {block.rows.map((row) => (
            <li key={row[0]}>{row[0]}</li>
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
    <div className="quick-reference">
      {groupQuickReference(topic).map((group) => (
        <section
          key={group.id}
          aria-labelledby={`quick-${group.id}`}
          className="quick-group"
          data-tone={group.tone}
        >
          <h2 id={`quick-${group.id}`} className="quick-group-title">
            {group.tone === 'alert' && (
              <span aria-hidden="true" className="alert-mark">
                !
              </span>
            )}
            {group.title}
          </h2>
          <div className="quick-entries">
            {group.entries.map((entry) => (
              <article
                key={`${entry.block.id}-${entry.itemIndex ?? 'all'}`}
                className="quick-entry"
              >
                <h3>
                  <Link href={entry.href}>
                    {entry.label}
                    <span className="sr-only">, open {entry.pageTitle}</span>
                    <span aria-hidden="true" className="quick-arrow">
                      →
                    </span>
                  </Link>
                </h3>
                <div className="mt-1 text-sm leading-6">
                  <QuickAnswer
                    block={entry.block}
                    itemIndex={entry.itemIndex}
                  />
                </div>
                {entry.block.localPolicyMayVary && (
                  <p className="mt-1 text-xs font-medium text-dissect-amber">
                    Local policy may vary.
                  </p>
                )}
              </article>
            ))}
          </div>
          <div className="quick-group-footer">
            {group.context && (
              <nav aria-label={`${group.context.title}: go deeper`}>
                <ul className="quick-context-links">
                  {group.context.links.map((link) => (
                    <li key={link.page}>
                      <Link href={`${base}/${link.page}`}>{link.title}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            {group.referenceIds.length > 2 ? (
              // Long source lists stay one tap away without crowding answers.
              <details className="quick-sources">
                <summary className="disclosure-trigger px-2">
                  Sources · {group.referenceIds.length}
                </summary>
                <Sources
                  ids={group.referenceIds}
                  references={topic.references}
                  evidenceHref={`${base}/evidence`}
                />
              </details>
            ) : (
              <Sources
                ids={group.referenceIds}
                references={topic.references}
                evidenceHref={`${base}/evidence`}
              />
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
const relatedKindLabels: Record<RelatedKind, string> = {
  'related-condition': 'Related condition',
  procedure: 'Procedure',
  anatomy: 'Anatomy',
  complication: 'Complications',
  'theatre-skill': 'Theatre skill',
};
export function RelatedContent({
  topic,
  current,
}: {
  topic: Topic;
  current?: string;
}) {
  const related = (topic.experience?.related ?? []).filter(
    (item) => item.page !== current,
  );
  if (related.length === 0) return null;
  return (
    <section aria-labelledby="related-heading" className="related-content">
      <h2 id="related-heading" className="eyebrow">
        Related
      </h2>
      <ul>
        {related.map((item) => (
          <li key={`${item.kind}-${item.page}`}>
            <Link href={`${topicHref(topic.metadata)}/${item.page}`}>
              <span className="eyebrow">{relatedKindLabels[item.kind]}</span>
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
