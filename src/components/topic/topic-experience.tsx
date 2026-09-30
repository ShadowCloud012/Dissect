import Link from 'next/link';
import type { ReactNode } from 'react';
import type { Topic } from '@/schemas/topic';
import { topicPageGroups } from '@/schemas/topic-experience';
import { getSpecialty } from '@/content/specialties';
import {
  topicHref,
  resolveTopicPage,
  localPolicyEntries,
  quickReferenceBlocks,
  resolveBlockLinks,
  resolveBriefings,
  resolveWalkthroughs,
  resolveAnatomyViews,
  selectQuickReference,
  ownProcedureRelations,
  relatedLinks,
  type ProcedureRelation,
} from '@/lib/topic-pages';
import { trainingLevels } from '@/lib/training-level';
import {
  CompactSources,
  ContentRenderer,
} from '@/components/content/content-renderer';
import { OperativeWalkthrough } from '@/components/content/operative-walkthrough';
import { OperativeAnatomy } from '@/components/anatomy/operative-anatomy';
import { BriefingPanel } from '@/components/content/briefing-panel';
import { DecisionPathway } from '@/components/content/surgical-patterns';
import { ReferenceList } from '@/components/references/reference-list';
import { Breadcrumbs } from '@/components/navigation/breadcrumbs';
import { EditorialStatus } from './editorial-status';
import { TopicNavigation } from './topic-navigation';
import { TopicDepth, TrainingLevelSummary } from './topic-depth';
import {
  PatientJourney,
  QuickReference,
  RelatedContent,
} from './quick-reference';

export function TopicExperience({
  topic,
  pageSlug,
  procedures = ownProcedureRelations(topic),
}: {
  topic: Topic;
  pageSlug?: string;
  // Procedures related to this condition, from the registry; defaults to the
  // ones this topic owns.
  procedures?: ProcedureRelation[];
}) {
  const base = topicHref(topic.metadata);
  const experience = topic.experience!;
  const specialty = getSpecialty(topic.metadata.specialty)!;
  const resolved = pageSlug ? resolveTopicPage(topic, pageSlug) : undefined;
  const evidenceHref = pageSlug === 'evidence' ? '' : `${base}/evidence`;
  const title = resolved?.page.title ?? topic.metadata.title;
  const blocks = topic.sections.flatMap((section) => section.blocks);
  const notes = blocks.filter(
    (block) =>
      block.type === 'sourceNote' &&
      block.text.startsWith('Clinical-review TODO'),
  );
  const overview = topic.sections.find((section) => section.id === 'overview')!;
  // Blocks already drawn on by the hub quick reference.
  const surfaced = new Set(
    selectQuickReference(topic)
      .flatMap(quickReferenceBlocks)
      .map((block) => block.id),
  );
  const index = resolved ? experience.pages.indexOf(resolved.page) : -1;
  const previous = index > 0 ? experience.pages[index - 1] : undefined;
  const next = resolved ? experience.pages[index + 1] : experience.pages[0];
  const pathways = experience.pathways.filter((item) => item.page === pageSlug);
  const sourceProps = { references: topic.references, evidenceHref };
  // Richer operative renderings stand in for the blocks they represent.
  const replacements: Record<string, ReactNode> = {};
  for (const walkthrough of pageSlug
    ? resolveWalkthroughs(topic, pageSlug)
    : []) {
    for (const id of walkthrough.absorbsBlockIds) replacements[id] = null;
    replacements[walkthrough.block.id] = (
      <OperativeWalkthrough
        walkthrough={walkthrough}
        sources={
          <CompactSources ids={walkthrough.referenceIds} {...sourceProps} />
        }
      />
    );
  }
  const briefings = pageSlug ? resolveBriefings(topic, pageSlug) : [];
  for (const briefing of briefings) {
    if (!briefing.replacesBlockId) continue;
    replacements[briefing.replacesBlockId] = (
      <BriefingPanel
        briefing={briefing}
        headingLevel="h3"
        sources={
          <CompactSources ids={briefing.referenceIds} {...sourceProps} />
        }
      />
    );
    for (const id of briefing.absorbsBlockIds) replacements[id] = null;
  }
  const blockLinks = resolveBlockLinks(topic);
  const anatomyViews = pageSlug ? resolveAnatomyViews(topic, pageSlug) : [];
  // Anatomy views that illustrate this page's operative walkthrough.
  const anatomyForPage = (experience.anatomyViews ?? []).filter((view) =>
    experience.walkthroughs.some(
      (walkthrough) =>
        walkthrough.id === view.walkthroughId && walkthrough.page === pageSlug,
    ),
  );
  // Condition ↔ procedure: a condition hub surfaces its operations, and a
  // procedure page surfaces the conditions it belongs to.
  const currentProcedure = procedures.find(
    (procedure) => procedure.page === pageSlug,
  );
  const depthLabel = (blockId: string) => {
    const level = blocks.find((block) => block.id === blockId)!.minimumLevel;
    return level === trainingLevels[0].id
      ? undefined
      : `${trainingLevels.find((entry) => entry.id === level)!.label} depth`;
  };
  return (
    <article className="topic-experience mx-auto max-w-[1440px] px-4 py-5 sm:px-8">
      <Breadcrumbs
        items={[
          { title: 'Learn', href: '/learn' },
          { title: specialty.title, href: `/learn/${specialty.slug}` },
          { title: topic.metadata.title, href: pageSlug ? base : undefined },
          ...(pageSlug ? [{ title }] : []),
        ]}
      />
      <header className="topic-header">
        {/* The mobile breadcrumb already names the parent; skip the eyebrow. */}
        {currentProcedure ? (
          <p className="eyebrow mb-2">Procedure</p>
        ) : (
          <p className="eyebrow mb-2 hidden sm:block">
            {pageSlug ? topic.metadata.title : `${specialty.title} / Condition`}
          </p>
        )}
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p
          className={`mt-2 max-w-3xl text-dissect-muted ${pageSlug ? '' : 'hidden sm:block'}`}
        >
          {resolved?.page.description ?? topic.metadata.summary}
        </p>
        <div className="mt-3">
          <EditorialStatus metadata={topic.metadata} />
        </div>
        {currentProcedure && (
          <aside aria-label="Clinical context" className="kind-link">
            <span className="eyebrow">Clinical context</span>
            {currentProcedure.conditions.map((condition) => (
              <Link key={condition.id} href={condition.href}>
                {condition.title}
              </Link>
            ))}
            {/* One line on phones, leaving room for the Theatre Prep entry. */}
            <span className="hidden text-sm text-dissect-muted sm:inline">
              Presentation, investigations and management of the condition
              behind this operation.
            </span>
          </aside>
        )}
        {currentProcedure?.theatrePrepHref && (
          <p className="prep-entry">
            <Link href={currentProcedure.theatrePrepHref}>Theatre Prep</Link>
            <span>Get ready for this operation in 5 minutes.</span>
          </p>
        )}
      </header>
      <div className="topic-columns">
        <TopicNavigation
          base={base}
          title={topic.metadata.title}
          pages={experience.pages}
          current={pageSlug}
        />
        <div className="min-w-0">
          <TopicDepth key={pageSlug ?? 'overview'} showControls={!!pageSlug}>
            {!resolved ? (
              <>
                <div className="hub-definition">
                  <ContentRenderer
                    blocks={overview.blocks.filter(
                      (block) => block.type === 'definition',
                    )}
                    references={topic.references}
                    evidenceHref={evidenceHref}
                  />
                </div>
                {procedures.map((procedure) => (
                  <aside
                    key={procedure.id}
                    aria-label="Related procedure"
                    className="kind-link"
                  >
                    <span className="eyebrow">Related procedure</span>
                    <Link href={procedure.href}>{procedure.title}</Link>
                    {procedure.theatrePrepHref && (
                      <Link
                        href={procedure.theatrePrepHref}
                        className="kind-link-secondary hidden sm:inline-flex"
                      >
                        Theatre Prep
                      </Link>
                    )}
                    {/* One line on phones so the snapshot stays in view. */}
                    <span className="hidden text-sm text-dissect-muted sm:inline">
                      {procedure.summary}
                    </span>
                  </aside>
                ))}
                <PatientJourney topic={topic} />
                <QuickReference topic={topic} />
                <nav
                  aria-labelledby="directory-heading"
                  className="hub-directory"
                >
                  <h2 id="directory-heading" className="eyebrow">
                    All pages in this topic
                  </h2>
                  <div className="hub-directory-grid">
                    {topicPageGroups.map((group) => (
                      <section key={group} aria-labelledby={`dir-${group}`}>
                        <h3
                          id={`dir-${group}`}
                          className="text-sm font-semibold"
                        >
                          {group}
                        </h3>
                        <ul>
                          {experience.pages
                            .filter((page) => page.group === group)
                            .map((page) => (
                              <li key={page.slug}>
                                <Link href={`${base}/${page.slug}`}>
                                  {page.title}
                                </Link>
                              </li>
                            ))}
                        </ul>
                      </section>
                    ))}
                  </div>
                </nav>
                {/* Overview blocks not already surfaced above (e.g. scope notes). */}
                <div className="mt-8">
                  <ContentRenderer
                    blocks={overview.blocks.filter(
                      (block) =>
                        block.type !== 'definition' && !surfaced.has(block.id),
                    )}
                    references={topic.references}
                    evidenceHref={evidenceHref}
                  />
                </div>
              </>
            ) : (
              <>
                {resolved.sections.length > 1 && (
                  <nav aria-label="On this page" className="section-jumps">
                    {resolved.sections.map((section) => (
                      <a key={section.id} href={`#section-${section.id}`}>
                        {section.title}
                      </a>
                    ))}
                  </nav>
                )}
                {briefings
                  .filter((briefing) => !briefing.replacesBlockId)
                  .map((briefing) => (
                    <BriefingPanel
                      key={briefing.id}
                      briefing={briefing}
                      sources={
                        <CompactSources
                          ids={briefing.referenceIds}
                          {...sourceProps}
                        />
                      }
                    />
                  ))}
                {anatomyForPage.map((view) => (
                  <p key={view.id} className="anatomy-link">
                    <Link href={`${base}/${view.page}#${view.id}`}>
                      Operative anatomy (schematic)
                    </Link>{' '}
                    — which structures matter at each step
                  </p>
                ))}
                {anatomyViews.map((view) => (
                  <OperativeAnatomy
                    key={view.id}
                    view={view}
                    sources={Object.fromEntries(
                      view.structures.map((structure) => [
                        structure.id,
                        <CompactSources
                          key={structure.id}
                          ids={structure.referenceIds}
                          {...sourceProps}
                        />,
                      ]),
                    )}
                    noteSources={
                      <CompactSources
                        ids={view.notes.referenceIds}
                        {...sourceProps}
                      />
                    }
                  />
                ))}
                {pathways.map((pathway) => (
                  <DecisionPathway
                    key={pathway.id}
                    id={pathway.id}
                    title={pathway.title}
                    caption={pathway.caption}
                    steps={pathway.steps.map((step) => ({
                      label: step.label,
                      href: `#block-${step.blockId}`,
                      depth: depthLabel(step.blockId),
                    }))}
                    branches={pathway.branches.map((branch) => ({
                      label: branch.label,
                      href: `#block-${branch.blockId}`,
                      depth: depthLabel(branch.blockId),
                    }))}
                  />
                ))}
                {resolved.sections.map((section) => (
                  <section
                    key={section.id}
                    id={`section-${section.id}`}
                    aria-labelledby={`heading-${section.id}`}
                    className="topic-section"
                  >
                    <h2
                      id={`heading-${section.id}`}
                      className="mb-4 text-xl font-semibold"
                    >
                      {section.title}
                    </h2>
                    {section.summary && (
                      <p className="mb-4 text-sm text-dissect-muted">
                        {section.summary}
                      </p>
                    )}
                    <ContentRenderer
                      blocks={section.blocks}
                      references={topic.references}
                      evidenceHref={evidenceHref}
                      presentation={experience.presentation}
                      replacements={replacements}
                      blockLinks={blockLinks}
                    />
                    {section.showReferences && (
                      <>
                        <section
                          aria-labelledby="review-todos"
                          className="my-8"
                        >
                          <h3 id="review-todos" className="mb-4 font-semibold">
                            Unresolved clinical-review TODOs
                          </h3>
                          <ContentRenderer
                            blocks={notes}
                            references={topic.references}
                          />
                        </section>
                        <section
                          aria-labelledby="local-policy-heading"
                          className="my-8"
                        >
                          <h3
                            id="local-policy-heading"
                            className="mb-2 font-semibold"
                          >
                            Content that may vary by local policy
                          </h3>
                          <p className="mb-3 text-sm text-dissect-muted">
                            Check these against your local guidance.
                          </p>
                          <ul className="local-policy-list">
                            {localPolicyEntries(topic).map((entry) => (
                              <li key={entry.anchor}>
                                <Link
                                  href={`${base}/${entry.page.slug}#${entry.anchor}`}
                                >
                                  {entry.label}
                                  <span className="text-dissect-muted">
                                    {' '}
                                    · {entry.page.title}
                                  </span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </section>
                        <ReferenceList references={topic.references} />
                      </>
                    )}
                  </section>
                ))}
              </>
            )}
            {resolved && (
              <nav aria-label="Previous and next page" className="page-pager">
                <Link href={previous ? `${base}/${previous.slug}` : base}>
                  <span className="eyebrow">Previous</span>
                  {previous?.title ?? 'Overview'}
                </Link>
                {next && (
                  <Link href={`${base}/${next.slug}`} className="text-right">
                    <span className="eyebrow">Next</span>
                    {next.title}
                  </Link>
                )}
              </nav>
            )}
          </TopicDepth>
        </div>
        <aside aria-label="Topic context" className="topic-context">
          {pageSlug && (
            <Link className="related-link mb-4" href={base}>
              <span>
                <span aria-hidden="true">← </span>
                {topic.metadata.title} overview
              </span>
            </Link>
          )}
          {pageSlug && (
            <RelatedContent links={relatedLinks(topic, procedures, pageSlug)} />
          )}
          <TrainingLevelSummary />
          <div className="mt-5 border-t border-dissect-border pt-4">
            <p className="eyebrow">Evidence & trust</p>
            {/* Explanatory repeats are rail-only; the draft banner and source
                links already carry this on narrower screens. */}
            <p className="mt-2 hidden text-sm leading-6 text-dissect-muted xl:block">
              Sources sit beside the content. Source type does not establish
              claim support.
            </p>
            <Link className="related-link" href={`${base}/evidence`}>
              Sources & review gaps <span aria-hidden="true">↗</span>
            </Link>
          </div>
          {topic.metadata.contentKind === 'clinical' &&
            topic.metadata.status !== 'clinically-reviewed' && (
              <p className="mt-4 hidden text-xs leading-5 text-dissect-muted xl:block">
                Educational reference. No clinical sign-off is implied by this
                draft.
              </p>
            )}
        </aside>
      </div>
    </article>
  );
}
