'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { topicPageGroups, type TopicPage } from '@/schemas/topic-experience';

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
      {topicPageGroups.map((group) => (
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
  const quickJump = pages.filter((page) => page.quickJump);
  const jump = useRef<HTMLElement>(null);
  // Keep the current quick-jump link visible in the horizontal row.
  useEffect(() => {
    const row = jump.current;
    const active = row?.querySelector<HTMLElement>('[aria-current="page"]');
    if (row && active)
      row.scrollLeft = active.offsetLeft - row.offsetLeft - row.clientWidth / 2;
  }, [current]);
  return (
    <>
      <nav aria-label="Topic pages" className="desktop-topic-nav">
        <p className="mb-4 text-sm font-semibold">{title}</p>
        {links}
      </nav>
      <div className="mobile-topic-bar">
        {quickJump.length > 0 && (
          <nav aria-label="Quick jump" className="quick-jump" ref={jump}>
            <ul>
              <li>
                <Link href={base} aria-current={!current ? 'page' : undefined}>
                  Overview
                </Link>
              </li>
              {quickJump.map((page) => (
                <li key={page.slug}>
                  <Link
                    href={`${base}/${page.slug}`}
                    aria-current={current === page.slug ? 'page' : undefined}
                  >
                    {page.shortTitle ?? page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
        <nav aria-label="Mobile topic pages" className="mobile-topic-nav">
          <details
            ref={disclosure}
            onKeyDown={(event) => {
              if (event.key === 'Escape' && disclosure.current?.open) {
                disclosure.current.removeAttribute('open');
                disclosure.current.querySelector('summary')?.focus();
              }
            }}
          >
            <summary className="disclosure-trigger">
              All pages
              <span className="sr-only">
                , current:{' '}
                {pages.find((page) => page.slug === current)?.title ??
                  'Overview'}
              </span>
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
      </div>
    </>
  );
}
