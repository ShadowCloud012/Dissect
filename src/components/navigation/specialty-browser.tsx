'use client';
import Link from 'next/link';
import { useState } from 'react';
import type { TopicMetadata } from '@/schemas/topic';
import { topicHref } from '@/lib/topic-pages';
import { EditorialStatus } from '@/components/topic/editorial-status';

export function SpecialtyBrowser({
  topics,
  categories,
}: {
  topics: TopicMetadata[];
  categories: { id: string; title: string }[];
}) {
  const [selected, setSelected] = useState('all');
  const populated = categories.filter((category) =>
    topics.some((topic) => topic.categories.includes(category.id)),
  );
  const visible = topics.filter(
    (topic) => selected === 'all' || topic.categories.includes(selected),
  );
  return (
    <div className="specialty-browser">
      <nav aria-label="Topic categories" className="category-nav">
        <p className="eyebrow mb-3">Browse categories</p>
        {[{ id: 'all', title: 'All topics' }, ...populated].map((category) => (
          <button
            key={category.id}
            type="button"
            aria-pressed={selected === category.id}
            onClick={() => setSelected(category.id)}
          >
            {category.title}
            <span>
              {category.id === 'all'
                ? topics.length
                : topics.filter((topic) =>
                    topic.categories.includes(category.id),
                  ).length}
            </span>
          </button>
        ))}
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
            <div className="flex flex-wrap gap-2">
              {topic.categories.map((id) => (
                <span key={id} className="taxonomy-tag">
                  {categories.find((category) => category.id === id)!.title}
                </span>
              ))}
            </div>
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
