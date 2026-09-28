import Link from 'next/link';
import type { Topic } from '@/schemas/topic';
import { topicPageGroups } from '@/schemas/topic-experience';
import { getSpecialty } from '@/content/specialties';
import {
  topicHref,
  resolveTopicPage,
  localPolicyEntries,
} from '@/lib/topic-pages';
import { trainingLevels } from '@/lib/training-level';
import { ContentRenderer } from '@/components/content/content-renderer';
import { DecisionPathway } from '@/components/content/surgical-patterns';
import { ReferenceList } from '@/components/references/reference-list';
import { Breadcrumbs } from '@/components/navigation/breadcrumbs';
import { EditorialStatus } from './editorial-status';
import { TopicNavigation } from './topic-navigation';
import { TopicDepth, TrainingLevelSummary } from './topic-depth';
import {
  QuickReference,
  ContextPanels,
  RelatedContent,
} from './quick-reference';

export function TopicExperience({
  topic,
  pageSlug,
}: {
  topic: Topic;
  pageSlug?: string;
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
  const index = resolved ? experience.pages.indexOf(resolved.page) : -1;
  const previous = index > 0 ? experience.pages[index - 1] : undefined;
  const next = resolved ? experience.pages[index + 1] : experience.pages[0];
  const pathways = experience.pathways.filter((item) => item.page === pageSlug);
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
        <p className="eyebrow">
          {pageSlug
            ? topic.metadata.title
            : `${specialty.title} / Clinical reference`}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 max-w-3xl text-dissect-muted">
          {resolved?.page.description ?? topic.metadata.summary}
        </p>
        <div className="mt-4">
          <EditorialStatus metadata={topic.metadata} />
        </div>
      </header>
      <div className="topic-columns">
        <TopicNavigation
          base={base}
          title={topic.metadata.title}
          pages={experience.pages}
          current={pageSlug}
        />
        <div className="min-w-0">
          <TopicDepth key={pageSlug ?? 'overview'}>
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
                <QuickReference topic={topic} />
                <ContextPanels topic={topic} />
                <nav
                  aria-labelledby="directory-heading"
                  className="hub-directory"
                >
                  <h2 id="directory-heading" className="text-xl font-semibold">
                    Go deeper
                  </h2>
                  <div className="hub-directory-grid">
                    {topicPageGroups.map((group) => (
                      <section key={group} aria-label={group}>
                        <p className="eyebrow" aria-hidden="true">
                          {group}
                        </p>
                        <ul>
                          {experience.pages
                            .filter((page) => page.group === group)
                            .map((page) => (
                              <li key={page.slug}>
                                <Link href={`${base}/${page.slug}`}>
                                  <span className="font-semibold">
                                    {page.title}
                                  </span>
                                  <span className="text-sm text-dissect-muted">
                                    {page.description}
                                  </span>
                                </Link>
                              </li>
                            ))}
                        </ul>
                      </section>
                    ))}
                  </div>
                </nav>
                <RelatedContent topic={topic} />
                <details className="mt-6 border-t border-dissect-border pt-3">
                  <summary className="disclosure-trigger">
                    At a glance & educational scope
                  </summary>
                  <ContentRenderer
                    blocks={overview.blocks.filter(
                      (block) => block.type !== 'definition',
                    )}
                    references={topic.references}
                    evidenceHref={evidenceHref}
                  />
                </details>
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
            <nav aria-label="Previous and next page" className="page-pager">
              {resolved && (
                <Link href={previous ? `${base}/${previous.slug}` : base}>
                  <span className="eyebrow">Previous</span>
                  {previous?.title ?? 'Overview'}
                </Link>
              )}
              {next && (
                <Link href={`${base}/${next.slug}`} className="text-right">
                  <span className="eyebrow">Next</span>
                  {next.title}
                </Link>
              )}
            </nav>
          </TopicDepth>
        </div>
        <aside aria-label="Topic context" className="topic-context">
          <TrainingLevelSummary />
          <div className="mt-5 border-t border-dissect-border pt-4">
            <p className="eyebrow">Evidence & trust</p>
            <p className="mt-2 text-sm leading-6 text-dissect-muted">
              Sources sit beside the content. Source type does not establish
              claim support.
            </p>
            <Link className="related-link" href={`${base}/evidence`}>
              Sources & review gaps <span aria-hidden="true">↗</span>
            </Link>
          </div>
          {topic.metadata.contentKind === 'clinical' &&
            topic.metadata.status !== 'clinically-reviewed' && (
              <p className="mt-4 text-xs leading-5 text-dissect-muted">
                Educational reference. No clinical sign-off is implied by this
                draft.
              </p>
            )}
          {pageSlug && (
            <Link className="related-link" href={base}>
              Back to overview
            </Link>
          )}
        </aside>
      </div>
    </article>
  );
}
