import Link from 'next/link';
import type { Topic } from '@/schemas/topic';
import type { ContentBlock } from '@/schemas/content-block';
import { ExtractRows } from '@/components/content/extract-rows';
import type { relatedKinds } from '@/schemas/topic-experience';
import {
  groupQuickReference,
  topicHref,
  topicJourney,
} from '@/lib/topic-pages';
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
type QuickGroup = ReturnType<typeof groupQuickReference>[number];
type QuickEntry = QuickGroup['entries'][number];
function QuickEntryCard({ entry }: { entry: QuickEntry }) {
  const note = entry.kind === 'block' && entry.block.type === 'sourceNote';
  return (
    <article className="quick-entry" data-note={note || undefined}>
      <h3>
        <Link href={entry.href}>
          {entry.label}
          <span className="sr-only">, open {entry.pageTitle}</span>
          <span aria-hidden="true" className="quick-arrow">
            →
          </span>
        </Link>
      </h3>
      <div className="text-sm leading-6">
        {entry.kind === 'extracts' ? (
          <ExtractRows rows={entry.rows} numbered={entry.numbered} />
        ) : (
          <QuickAnswer block={entry.block} itemIndex={entry.itemIndex} />
        )}
      </div>
      {entry.localPolicyMayVary && (
        <p className="mt-1 text-xs font-medium text-dissect-amber">
          Local policy may vary.
        </p>
      )}
    </article>
  );
}
const phaseLabels = { before: 'Before', during: 'In', after: 'After' };
export function QuickReference({ topic }: { topic: Topic }) {
  const groups = groupQuickReference(topic);
  // Consecutive phased groups share one Before → In → After sequence, a
  // pattern other procedures can reuse.
  const runs: { phased: boolean; groups: QuickGroup[] }[] = [];
  for (const group of groups) {
    const last = runs.at(-1);
    if (last && last.phased === !!group.phase) last.groups.push(group);
    else runs.push({ phased: !!group.phase, groups: [group] });
  }
  return (
    <div className="quick-reference">
      {runs.map((run) =>
        run.phased ? (
          <div key={run.groups[0].id} className="periop-sequence">
            {run.groups.map((group) => (
              <QuickGroupSection key={group.id} topic={topic} group={group} />
            ))}
          </div>
        ) : (
          run.groups.map((group) => (
            <QuickGroupSection key={group.id} topic={topic} group={group} />
          ))
        ),
      )}
    </div>
  );
}
function QuickGroupSection({
  topic,
  group,
}: {
  topic: Topic;
  group: QuickGroup;
}) {
  const base = topicHref(topic.metadata);
  return (
    <section
      aria-labelledby={`quick-${group.id}`}
      className="quick-group"
      data-tone={group.tone}
      data-phase={group.phase}
    >
      <h2 id={`quick-${group.id}`} className="quick-group-title">
        {group.tone === 'alert' && (
          <span aria-hidden="true" className="alert-mark">
            !
          </span>
        )}
        {group.phase && (
          <span aria-hidden="true" className="phase-marker">
            {phaseLabels[group.phase]}
          </span>
        )}
        {group.title}
      </h2>
      <div className="quick-entries">
        {group.entries.map((entry) => (
          <QuickEntryCard key={`${entry.label}-${entry.page}`} entry={entry} />
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
  );
}
// Where the learner is in the surgical episode — orientation, not an algorithm.
export function PatientJourney({ topic }: { topic: Topic }) {
  const steps = topicJourney(topic);
  if (steps.length === 0) return null;
  return (
    <nav aria-label="Patient journey" className="patient-journey">
      <ol>
        {steps.map((step) => (
          <li key={step.label}>
            <Link href={step.href}>{step.label}</Link>
          </li>
        ))}
      </ol>
    </nav>
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
