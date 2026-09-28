import type { ReactNode } from 'react';
import type { BlockPresentation } from '@/schemas/topic-experience';
import {
  RevisionQuestion,
  OperativeStepList,
  ComplicationCards,
  ConsentPanel,
  LabelledCards,
  EscalationPoint,
} from './surgical-patterns';
import type { ContentBlock } from '@/schemas/content-block';
import type { Reference } from '@/schemas/reference';
import { SourceBadge } from '@/components/references/source-badge';
import { LevelContent } from '@/components/topic/topic-depth';

export function Sources({
  ids,
  references,
  evidenceHref,
}: {
  ids: string[];
  evidenceHref?: string;
  references: Reference[];
}) {
  return (
    <div className="flex flex-wrap gap-x-2">
      {ids.map((id) => {
        const reference = references.find((entry) => entry.id === id);
        if (!reference)
          throw new Error(`Cannot render unknown reference: ${id}`);
        return (
          <SourceBadge
            key={id}
            reference={reference}
            evidenceHref={evidenceHref}
          />
        );
      })}
    </div>
  );
}

// Exhaustive discriminant mapping keeps new block types a deliberate renderer change.
function BlockBody({
  block,
  references,
  evidenceHref,
}: {
  block: ContentBlock;
  evidenceHref?: string;
  references: Reference[];
}): ReactNode {
  switch (block.type) {
    case 'question':
      return (
        <RevisionQuestion question={block.question} answer={block.answer} />
      );
    case 'prose':
      return (
        <div className="space-y-3">
          {block.paragraphs.map((text, index) => (
            <p key={index}>{text}</p>
          ))}
        </div>
      );
    case 'keyPoints':
      return (
        <ul className="list-disc space-y-2 pl-5">
          {block.items.map((text, index) => (
            <li key={index}>{text}</li>
          ))}
        </ul>
      );
    case 'definition':
      return (
        <dl>
          <dt className="font-semibold">{block.term}</dt>
          <dd className="mt-1 text-dissect-muted">{block.meaning}</dd>
        </dl>
      );
    case 'warning':
      return (
        <aside className="rounded-dissect-md border border-dissect-amber/30 bg-dissect-amber-soft p-4 text-dissect-amber">
          <p className="font-semibold">{block.title}</p>
          <p>{block.text}</p>
        </aside>
      );
    case 'clinicalPearl':
      return (
        <aside className="rounded-dissect-md border border-dissect-green-200 bg-dissect-green-50 p-4 text-dissect-green-800">
          <p className="font-semibold">{block.title}</p>
          <p>{block.text}</p>
        </aside>
      );
    case 'checklist':
      return (
        <div>
          <h3 className="font-semibold">{block.title}</h3>
          <ol className="mt-2 list-decimal space-y-2 pl-5">
            {block.items.map((text, index) => (
              <li key={index}>{text}</li>
            ))}
          </ol>
        </div>
      );
    case 'table':
      return (
        <div className="max-w-full overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <caption className="mb-3 text-left font-semibold">
              {block.caption}
            </caption>
            <thead>
              <tr>
                {block.columns.map((column, index) => (
                  <th
                    key={index}
                    scope="col"
                    className="border-b border-dissect-border p-3"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, index) => (
                <tr key={index}>
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="border-b border-dissect-border p-3 align-top"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    case 'claimGroup':
      return (
        <div className="space-y-4">
          {block.claims.map((claim) => (
            <LevelContent key={claim.id} minimumLevel={claim.minimumLevel}>
              <div id={`claim-${claim.id}`}>
                <p>{claim.text}</p>
                {claim.localPolicyMayVary && (
                  <p className="text-sm font-medium text-dissect-amber">
                    Local policy may vary.
                  </p>
                )}
                <Sources
                  ids={claim.referenceIds}
                  references={references}
                  evidenceHref={evidenceHref}
                />
              </div>
            </LevelContent>
          ))}
        </div>
      );
    case 'sourceNote':
      return (
        <aside className="border-l-2 border-dissect-border pl-4 text-sm text-dissect-muted">
          {block.text}
        </aside>
      );
    default: {
      const exhaustive: never = block;
      return exhaustive;
    }
  }
}
export function ContentRenderer({
  blocks,
  references,
  evidenceHref,
  presentation = [],
}: {
  blocks: ContentBlock[];
  evidenceHref?: string;
  presentation?: BlockPresentation[];
  references: Reference[];
}) {
  const styleOf = (block: ContentBlock) =>
    presentation.find((item) => item.blockId === block.id);
  // Consecutive blocks that share a presentation group render as one grid.
  const runs: { group?: string; blocks: ContentBlock[] }[] = [];
  for (const block of blocks) {
    const group = styleOf(block)?.group;
    const last = runs.at(-1);
    if (group && last?.group === group) last.blocks.push(block);
    else runs.push({ group, blocks: [block] });
  }
  const renderBlock = (block: ContentBlock) => {
    const style = styleOf(block);
    return (
      <LevelContent
        key={block.id}
        minimumLevel={block.minimumLevel}
        anchorId={`block-${block.id}`}
      >
        <div
          id={`block-${block.id}`}
          className={`content-block space-y-2 text-base leading-7 wrap-break-word ${style ? `pattern-${style.variant}` : ''}`}
        >
          {style && style.label !== ownTitle(block) && (
            <h3 className="block-label">{style.label}</h3>
          )}
          <StyledBody
            block={block}
            style={style}
            references={references}
            evidenceHref={evidenceHref}
          />
          {block.localPolicyMayVary && (
            <p className="text-sm font-medium text-dissect-amber">
              Local policy may vary.
            </p>
          )}
          {block.referenceIds.length > 0 && (
            <Sources
              ids={block.referenceIds}
              references={references}
              evidenceHref={evidenceHref}
            />
          )}
        </div>
      </LevelContent>
    );
  };
  return (
    <div className="space-y-6">
      {runs.map((run) =>
        run.group ? (
          <div
            key={run.blocks[0].id}
            role="group"
            aria-label={run.group}
            className="block-group"
          >
            <p className="eyebrow" aria-hidden="true">
              {run.group}
            </p>
            <div className="block-group-grid">
              {run.blocks.map(renderBlock)}
            </div>
          </div>
        ) : (
          run.blocks.map(renderBlock)
        ),
      )}
    </div>
  );
}
function ownTitle(block: ContentBlock) {
  if (block.type === 'definition') return block.term;
  return 'title' in block ? block.title : undefined;
}
function StyledBody({
  block,
  style,
  references,
  evidenceHref,
}: {
  block: ContentBlock;
  style?: BlockPresentation;
  evidenceHref?: string;
  references: Reference[];
}) {
  switch (style?.variant) {
    case 'steps':
      if (block.type === 'checklist')
        return (
          <OperativeStepList items={block.items} labels={style.itemLabels} />
        );
      break;
    case 'consent':
      if (block.type === 'checklist')
        return <ConsentPanel items={block.items} labels={style.itemLabels} />;
      break;
    case 'complications':
      if (block.type === 'table') return <ComplicationCards block={block} />;
      break;
    case 'cards':
      if ('items' in block && style.itemLabels)
        return <LabelledCards items={block.items} labels={style.itemLabels} />;
      break;
    case 'escalation':
      if (block.type === 'warning')
        return <EscalationPoint title={block.title} text={block.text} />;
      break;
  }
  return (
    <BlockBody
      block={block}
      references={references}
      evidenceHref={evidenceHref}
    />
  );
}
