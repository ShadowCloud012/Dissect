import type { ReactNode } from 'react';
import type { ResolvedBriefing } from '@/lib/topic-pages';
import { ExtractRows } from './extract-rows';

// A compact, labelled panel of verbatim extracts (e.g. theatre prep or
// "what changes the plan"). Absorbed blocks keep their anchors here.
export function BriefingPanel({
  briefing,
  headingLevel: Heading = 'h2',
  sources,
}: {
  briefing: ResolvedBriefing;
  headingLevel?: 'h2' | 'h3';
  sources?: ReactNode;
}) {
  return (
    <section
      aria-labelledby={`briefing-${briefing.id}`}
      className="briefing"
      data-variant={briefing.variant}
    >
      {briefing.absorbsBlockIds.map((id) => (
        <span key={id} id={`block-${id}`} className="anchor-target" />
      ))}
      <div className="briefing-head">
        <Heading id={`briefing-${briefing.id}`} className="briefing-title">
          {briefing.title}
        </Heading>
        {briefing.caption && (
          <p className="mt-1 text-sm text-dissect-muted">{briefing.caption}</p>
        )}
      </div>
      <div className="briefing-body @container text-sm leading-6">
        <ExtractRows rows={briefing.rows} />
      </div>
      {sources && <div className="briefing-foot">{sources}</div>}
    </section>
  );
}
