import type { ReactNode } from 'react';
import type { ResolvedBriefing } from '@/lib/topic-pages';
import { ExtractRows } from './extract-rows';

// A compact, labelled panel of verbatim extracts (e.g. theatre prep or
// "what changes the plan"). Absorbed blocks keep their anchors here.
export function BriefingPanel({
  briefing,
  headingLevel: Heading = 'h2',
  sources,
  compactHints,
  headless,
}: {
  briefing: ResolvedBriefing;
  headingLevel?: 'h2' | 'h3';
  sources?: ReactNode;
  compactHints?: boolean;
  // Inside a section already titled for it (e.g. Theatre Prep), omit the
  // panel's own heading and caption rather than repeat them; the absorbed
  // block anchors belong to the panel's home page only.
  headless?: boolean;
}) {
  const Wrapper = headless ? 'div' : 'section';
  return (
    <Wrapper
      aria-labelledby={headless ? undefined : `briefing-${briefing.id}`}
      className="briefing"
      data-variant={briefing.variant}
    >
      {!headless && (
        <>
          {briefing.absorbsBlockIds.map((id) => (
            <span key={id} id={`block-${id}`} className="anchor-target" />
          ))}
          <div className="briefing-head">
            <Heading id={`briefing-${briefing.id}`} className="briefing-title">
              {briefing.title}
            </Heading>
            {briefing.caption && (
              <p className="mt-1 text-sm text-dissect-muted">
                {briefing.caption}
              </p>
            )}
          </div>
        </>
      )}
      <div className="briefing-body @container text-sm leading-6">
        <ExtractRows rows={briefing.rows} compactHints={compactHints} />
      </div>
      {sources && <div className="briefing-foot">{sources}</div>}
    </Wrapper>
  );
}
