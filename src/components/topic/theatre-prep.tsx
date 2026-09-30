import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Topic } from '@/schemas/topic';
import { getSpecialty } from '@/content/specialties';
import type { ResolvedTheatrePrep } from '@/lib/topic-pages';
import { Breadcrumbs } from '@/components/navigation/breadcrumbs';
import { BriefingPanel } from '@/components/content/briefing-panel';
import {
  depthHint,
  ExtractRows,
  Gate,
  joinExtracts,
} from '@/components/content/extract-rows';
import {
  CompactSources,
  ContentRenderer,
} from '@/components/content/content-renderer';
import { AnatomyGlance } from '@/components/anatomy/anatomy-glance';
import { EditorialStatus } from './editorial-status';
import { LevelContent, TopicDepth } from './topic-depth';

// Editorial section labels only; every clinical line below comes from the
// resolved composition (verbatim extracts, walkthrough, anatomy, plan panel).
const sections = [
  ['patient', 'Patient', 'Patient & indication'],
  ['before', 'Before theatre', 'Before theatre'],
  ['anatomy', 'Anatomy', '30-second anatomy'],
  ['operation', 'Operation', 'Operation in 60 seconds'],
  ['risks', 'Risks', 'Risks in the operative field'],
  ['plan', 'Plan', 'What could change the plan'],
  ['consent', 'Consent', 'Consent snapshot'],
  ['after', 'After', 'After surgery'],
] as const;
type SectionId = (typeof sections)[number][0];
// Role-driven subgroups of the risk section.
const riskGroupTitles = {
  'at-risk': 'Structures to protect',
  'bleeding-risk': 'Bleeding risk',
} as const;

function Section({
  id,
  children,
  more,
}: {
  id: SectionId;
  children: ReactNode;
  more?: ReactNode;
}) {
  const [, , title] = sections.find(([key]) => key === id)!;
  return (
    <section
      id={`prep-${id}`}
      aria-labelledby={`prep-${id}-title`}
      className="prep-section"
    >
      <h2 id={`prep-${id}-title`} className="prep-section-title">
        {title}
      </h2>
      {children}
      {more && <p className="prep-more">{more}</p>}
    </section>
  );
}
const More = ({ href, children }: { href?: string; children: string }) =>
  href ? (
    <Link href={href}>
      {children} <span aria-hidden="true">→</span>
    </Link>
  ) : null;

export function TheatrePrep({
  topic,
  prep,
}: {
  topic: Topic;
  prep: ResolvedTheatrePrep;
}) {
  const specialty = getSpecialty(topic.metadata.specialty)!;
  const sourceProps = {
    references: topic.references,
    evidenceHref: `${prep.condition.href}/evidence`,
  };
  // Rows above the reader's depth are named in one line, not a row each;
  // editorial gaps follow, some only below the depth where content exists.
  const rows = (key: 'patient' | 'before' | 'consent' | 'after') => (
    <>
      <div className="@container text-sm leading-6">
        <ExtractRows rows={prep[key].rows} compactHints />
      </div>
      {prep.gaps
        .filter((gap) => gap.section === key)
        .map((gap) => {
          const note = (
            <div className="prep-gaps">
              <ContentRenderer blocks={[gap.block]} {...sourceProps} />
            </div>
          );
          return gap.belowLevel ? (
            <LevelContent
              key={gap.block.id}
              minimumLevel={gap.belowLevel}
              fallback={note}
            >
              {null}
            </LevelContent>
          ) : (
            <div key={gap.block.id}>{note}</div>
          );
        })}
      <CompactSources ids={prep[key].referenceIds} {...sourceProps} />
    </>
  );
  return (
    <article className="theatre-prep mx-auto max-w-[1200px] px-4 py-5 sm:px-8">
      <Breadcrumbs
        items={[
          { title: 'Learn', href: '/learn' },
          { title: specialty.title, href: `/learn/${specialty.slug}` },
          { title: prep.condition.title, href: prep.condition.href },
          { title: prep.procedure.title, href: prep.procedure.href },
          { title: 'Theatre Prep' },
        ]}
      />
      <header className="topic-header">
        <p className="eyebrow mb-2">5-minute Theatre Prep</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {prep.procedure.title}
        </h1>
        <div className="mt-3">
          <EditorialStatus metadata={topic.metadata} />
        </div>
      </header>
      <nav aria-label="Theatre Prep sections" className="prep-nav">
        <ol>
          {sections.map(([id, short]) => (
            <li key={id}>
              <a href={`#prep-${id}`}>{short}</a>
            </li>
          ))}
        </ol>
      </nav>
      <TopicDepth showControls>
        <div className="prep-grid">
          <Section id="patient">{rows('patient')}</Section>
          <Section id="before">{rows('before')}</Section>
          <Section
            id="anatomy"
            more={<More href={prep.links.anatomy}>Full operative anatomy</More>}
          >
            <AnatomyGlance view={prep.anatomy} />
          </Section>
          <Section
            id="operation"
            more={
              <More href={prep.walkthroughHref}>Open full walkthrough</More>
            }
          >
            <ol className="prep-steps">
              {prep.steps.map((step) => (
                <li key={step.number}>
                  <span className="prep-step-number" aria-hidden="true">
                    {step.number}
                  </span>
                  <p>
                    <Link href={step.href} className="prep-step-label">
                      <span className="sr-only">Step {step.number}: </span>
                      {step.label}
                    </Link>{' '}
                    {step.text}
                  </p>
                </li>
              ))}
            </ol>
          </Section>
          <Section id="risks">
            {prep.riskGroups.map((group) => (
              <div key={group.role} className="prep-risk-group">
                <h3 className="prep-risk-group-title">
                  {riskGroupTitles[group.role]}
                </h3>
                <dl className="prep-risks">
                  {group.entries.map((entry) => (
                    <div key={entry.labels.join()}>
                      <dt>{entry.labels.join(' · ')}</dt>
                      <dd>
                        <Gate
                          level={
                            entry.minimumLevel === 'medical-student'
                              ? undefined
                              : entry.minimumLevel
                          }
                          hint={
                            <span className="depth-hint">
                              {depthHint(entry.minimumLevel)}
                            </span>
                          }
                        >
                          <span>{joinExtracts([{ text: entry.text }])}</span>
                        </Gate>
                        <span className="prep-risk-steps">
                          {entry.steps.map((step) => (
                            <Link
                              key={step.number}
                              href={step.href}
                              title={step.label}
                            >
                              Step {step.number}
                              <span className="sr-only"> · {step.label}</span>
                            </Link>
                          ))}
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
            {prep.anatomy.notes.texts.length > 0 && (
              <p className="mt-2 text-sm leading-6">
                <span className="eyebrow">Around the operative field</span>{' '}
                {joinExtracts(
                  prep.anatomy.notes.texts.map((text) => ({ text })),
                )}
                .
              </p>
            )}
            <CompactSources
              ids={[
                ...new Set([
                  ...prep.risks.flatMap((risk) => risk.referenceIds),
                  ...prep.anatomy.notes.referenceIds,
                ]),
              ]}
              {...sourceProps}
            />
          </Section>
          <Section
            id="plan"
            more={<More href={prep.planHref}>Open in the operation page</More>}
          >
            <BriefingPanel
              briefing={prep.plan}
              compactHints
              headless
              sources={
                <CompactSources ids={prep.plan.referenceIds} {...sourceProps} />
              }
            />
          </Section>
          <Section
            id="consent"
            more={<More href={prep.links.consent}>Full consent page</More>}
          >
            {rows('consent')}
          </Section>
          <Section
            id="after"
            more={
              <>
                <More href={prep.links.aftercare}>Post-op</More>{' '}
                <More href={prep.links.complications}>Complications</More>
              </>
            }
          >
            {rows('after')}
          </Section>
        </div>
      </TopicDepth>
      {/* Destinations not already linked from a section. */}
      <nav aria-label="Go deeper" className="prep-deeper">
        <h2 className="eyebrow">Go deeper</h2>
        <ul>
          <li>
            <Link href={prep.links.overview}>
              {prep.condition.title} overview
            </Link>
          </li>
          <li>
            <Link href={prep.links.walkthrough}>
              {prep.procedure.title}: full page
            </Link>
          </li>
        </ul>
      </nav>
    </article>
  );
}
