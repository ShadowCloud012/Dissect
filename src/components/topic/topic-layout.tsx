import type { Topic } from '@/schemas/topic';
import { ContentRenderer } from '@/components/content/content-renderer';
import { ReferenceList } from '@/components/references/reference-list';
import { Badge } from '@/components/ui/badge';
import { SectionNav } from './section-nav';
import { TopicDepth, TrainingLevelSummary } from './topic-depth';
import { EditorialStatus } from './editorial-status';

export function TopicLayout({ topic }: { topic: Topic }) {
  const { metadata, sections, references } = topic;
  return (
    <article className="mx-auto max-w-7xl px-4 py-8 sm:px-8">
      <header className="mb-8 max-w-3xl">
        <Badge>
          {metadata.contentKind === 'non-clinical-demo'
            ? 'NON-CLINICAL DEMO'
            : metadata.categories.join(' / ')}
        </Badge>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          {metadata.title}
        </h1>
        <p className="mt-3 text-lg leading-8 text-dissect-muted">
          {metadata.summary}
        </p>
        {metadata.contentKind === 'clinical' && (
          <div className="mt-5">
            <EditorialStatus metadata={metadata} />
          </div>
        )}
      </header>
      <div className="grid min-w-0 gap-8 lg:grid-cols-[180px_minmax(0,1fr)_260px]">
        <div className="self-start lg:sticky lg:top-6 lg:max-h-[calc(100dvh-3rem)] lg:overflow-y-auto">
          <p className="mb-2 font-mono text-xs text-dissect-muted">
            ON THIS PAGE
          </p>
          <SectionNav
            sections={sections.map(({ id, title }) => ({ id, title }))}
          />
          <a
            href="#references"
            className="inline-flex min-h-11 items-center px-3 text-sm text-dissect-green-800 underline underline-offset-4"
          >
            References ({references.length})
          </a>
        </div>
        <div className="min-w-0">
          <TopicDepth>
            {sections.map((section) => (
              <section
                key={section.id}
                id={`section-${section.id}`}
                tabIndex={-1}
                aria-labelledby={`heading-${section.id}`}
                className="mb-10 scroll-mt-6 border-t border-dissect-border pt-6 target:border-dissect-green-600"
              >
                <h2
                  id={`heading-${section.id}`}
                  className="text-2xl font-semibold"
                >
                  {section.title}
                </h2>
                {section.summary && (
                  <p className="mt-2 text-sm text-dissect-muted">
                    {section.summary}
                  </p>
                )}
                <div className="mt-5">
                  <ContentRenderer
                    blocks={section.blocks}
                    references={references}
                  />
                </div>
                {section.showReferences && (
                  <div className="mt-6">
                    <ReferenceList references={references} />
                  </div>
                )}
              </section>
            ))}
          </TopicDepth>
        </div>
        <aside
          aria-label="Topic context"
          className="min-w-0 space-y-6 border-t border-dissect-border pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-5"
        >
          <TrainingLevelSummary />
          {metadata.contentKind === 'non-clinical-demo' && (
            <EditorialStatus metadata={metadata} />
          )}
          {sections.some((section) => section.showReferences) ? (
            <p className="text-sm leading-6 text-dissect-muted">
              Sources are linked beside the content. Full details and editorial
              limitations appear in Evidence and references.
            </p>
          ) : (
            <ReferenceList references={references} />
          )}
        </aside>
      </div>
    </article>
  );
}
