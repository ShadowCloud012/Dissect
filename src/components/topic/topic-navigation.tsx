'use client';
import Link from 'next/link';
import { useRef } from 'react';
import type { TopicPage } from '@/schemas/topic-experience';

export function TopicNavigation({
  base,
  title,
  pages,
  current,
}: {
  base: string;
  title: string;
  pages: TopicPage[];
  current?: string;
}) {
  const disclosure = useRef<HTMLDetailsElement>(null);
  const links = (
    <>
      <Link href={base} aria-current={!current ? 'page' : undefined}>
        Overview
      </Link>
      {(['Clinical', 'Operative', 'Revision'] as const).map((group) => (
        <div key={group}>
          <p className="eyebrow mt-4 mb-1">{group}</p>
          {pages
            .filter((page) => page.group === group)
            .map((page) => (
              <Link
                key={page.slug}
                href={`${base}/${page.slug}`}
                aria-current={current === page.slug ? 'page' : undefined}
              >
                {page.title}
              </Link>
            ))}
        </div>
      ))}
    </>
  );
  return (
    <>
      <nav aria-label="Topic pages" className="desktop-topic-nav">
        <p className="mb-4 text-sm font-semibold">{title}</p>
        {links}
      </nav>
      <nav aria-label="Mobile topic pages" className="mobile-topic-nav">
        <details ref={disclosure}>
          <summary className="disclosure-trigger">
            <span>In this topic</span>
            <strong>
              {pages.find((page) => page.slug === current)?.title ?? 'Overview'}
            </strong>
          </summary>
          <div
            className="mobile-topic-links"
            onClick={(event) => {
              if ((event.target as HTMLElement).closest('a'))
                disclosure.current?.removeAttribute('open');
            }}
          >
            {links}
          </div>
        </details>
      </nav>
    </>
  );
}
