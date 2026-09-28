import Link from 'next/link';
import type { Topic } from '@/schemas/topic';
import { getSpecialty } from '@/content/specialties';
import { topicHref, resolveTopicPage } from '@/lib/topic-pages';
import { ContentRenderer } from '@/components/content/content-renderer';
import { ReferenceList } from '@/components/references/reference-list';
import { Breadcrumbs } from '@/components/navigation/breadcrumbs';
import { EditorialStatus } from './editorial-status';
import { TopicNavigation } from './topic-navigation';
import { TopicDepth, TrainingLevelSummary } from './topic-depth';
import { QuickReference, ContextPanels } from './quick-reference';

export function TopicExperience({
  topic,
  pageSlug,
}: {
  topic: Topic;
  pageSlug?: string;
}) {
  const base = topicHref(topic.metadata);
  const experience = topic.experience!;
  const resolved = pageSlug ? resolveTopicPage(topic, pageSlug) : undefined;
  const evidenceHref = pageSlug === 'evidence' ? '' : `${base}/evidence`;
  const title = resolved?.page.title ?? topic.metadata.title;
  const notes = topic.sections
    .flatMap((section) => section.blocks)
    .filter(
      (block) =>
        block.type === 'sourceNote' &&
        block.text.startsWith('Clinical-review TODO'),
    );
  return (
    <article className="topic-experience mx-auto max-w-[1440px] px-4 py-5 sm:px-8">
      <Breadcrumbs
        items={[
          { title: 'Learn', href: '/learn' },
          {
            title: getSpecialty(topic.metadata.specialty)!.title,
            href: `/learn/${topic.metadata.specialty}`,
          },
          { title: topic.metadata.title, href: pageSlug ? base : undefined },
          ...(pageSlug ? [{ title }] : []),
        ]}
      />
      <header className="topic-header">
        <p className="eyebrow">
          {pageSlug
            ? topic.metadata.title
            : 'General Surgery / Clinical reference'}
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
                    blocks={topic.sections
                      .find((section) => section.id === 'overview')!
                      .blocks.filter((block) => block.type === 'definition')}
                    references={topic.references}
                    evidenceHref={evidenceHref}
                  />
                </div>
                <QuickReference topic={topic} />
                <ContextPanels topic={topic} />
                <details className="mt-6 border-t border-dissect-border pt-3">
                  <summary className="disclosure-trigger">
                    At a glance & educational scope
                  </summary>
                  <ContentRenderer
                    blocks={topic.sections
                      .find((section) => section.id === 'overview')!
                      .blocks.filter((block) => block.type !== 'definition')}
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
                        <ReferenceList references={topic.references} />
                      </>
                    )}
                  </section>
                ))}
                <nav aria-label="Continue reading" className="page-directory">
                  {experience.pages
                    .filter(
                      (page) =>
                        page.slug !== pageSlug &&
                        page.group === resolved.page.group,
                    )
                    .map((page) => (
                      <Link key={page.slug} href={`${base}/${page.slug}`}>
                        {page.title} <span aria-hidden="true">→</span>
                      </Link>
                    ))}
                </nav>
              </>
            )}
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
          <p className="mt-4 text-xs leading-5 text-dissect-muted">
            Educational reference. No clinical sign-off is implied by this
            draft.
          </p>
          <Link className="related-link" href={base}>
            Back to overview
          </Link>
        </aside>
      </div>
    </article>
  );
}
