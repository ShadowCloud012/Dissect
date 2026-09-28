'use client';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useSyncExternalStore } from 'react';
import type { TopicMetadata } from '@/schemas/topic';
import { topicHref } from '@/lib/topic-pages';
import { EditorialStatus } from '@/components/topic/editorial-status';

type Category = { id: string; title: string };
type BrowserProps = { topics: TopicMetadata[]; categories: Category[] };

// Category views are shareable URLs (?category=…); every topic still links to
// its single canonical route.
const noSubscription = () => () => {};
export function SpecialtyBrowser(props: BrowserProps) {
  const params = useSearchParams();
  // The static HTML is prerendered without a query; read it only after
  // hydration so server and client markup match.
  const hydrated = useSyncExternalStore(
    noSubscription,
    () => true,
    () => false,
  );
  const requested = hydrated ? params.get('category') : null;
  const pathname = usePathname();
  const selected = props.categories.some(
    (category) =>
      category.id === requested &&
      props.topics.some((topic) => topic.categories.includes(category.id)),
  )
    ? requested!
    : 'all';
  return (
    <SpecialtyBrowserView {...props} selected={selected} pathname={pathname} />
  );
}
export function SpecialtyBrowserView({
  topics,
  categories,
  selected,
  pathname,
}: BrowserProps & { selected: string; pathname: string }) {
  const populated = categories.filter((category) =>
    topics.some((topic) => topic.categories.includes(category.id)),
  );
  const empty = categories.filter((category) => !populated.includes(category));
  const visible = topics.filter(
    (topic) => selected === 'all' || topic.categories.includes(selected),
  );
  const count = (id: string) =>
    id === 'all'
      ? topics.length
      : topics.filter((topic) => topic.categories.includes(id)).length;
  return (
    <div className="specialty-browser">
      <nav aria-label="Topic categories" className="category-nav">
        <p className="eyebrow mb-3">Browse categories</p>
        <ul>
          {[{ id: 'all', title: 'All topics' }, ...populated].map(
            (category) => (
              <li key={category.id}>
                <Link
                  href={
                    category.id === 'all'
                      ? pathname
                      : `${pathname}?category=${category.id}`
                  }
                  scroll={false}
                  aria-current={selected === category.id ? 'true' : undefined}
                >
                  {category.title}
                  <span>
                    {count(category.id)}
                    <span className="sr-only">
                      {count(category.id) === 1 ? ' topic' : ' topics'}
                    </span>
                  </span>
                </Link>
              </li>
            ),
          )}
        </ul>
        {empty.length > 0 && (
          <p className="mt-4 text-xs leading-5 text-dissect-muted">
            Awaiting content:{' '}
            {empty.map((category) => category.title).join(' · ')}
          </p>
        )}
      </nav>
      <section aria-label="Available topics" className="min-w-0">
        <p role="status" className="mb-4 text-sm text-dissect-muted">
          {visible.length} {visible.length === 1 ? 'topic' : 'topics'} ·{' '}
          {selected === 'all'
            ? 'All topics'
            : categories.find((category) => category.id === selected)!.title}
        </p>
        {visible.map((topic) => (
          <article key={topic.id} className="topic-listing">
            <ul className="flex flex-wrap gap-2" aria-label="Categories">
              {topic.categories.map((id) => (
                <li key={id} className="taxonomy-tag">
                  {categories.find((category) => category.id === id)!.title}
                </li>
              ))}
            </ul>
            <h2 className="mt-4 text-2xl font-semibold">
              <Link className="related-link" href={topicHref(topic)}>
                {topic.title}
                <span aria-hidden="true">↗</span>
              </Link>
            </h2>
            <p className="my-3 leading-7 text-dissect-muted">{topic.summary}</p>
            <EditorialStatus metadata={topic} />
          </article>
        ))}
      </section>
    </div>
  );
}
