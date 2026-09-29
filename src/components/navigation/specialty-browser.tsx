'use client';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useSyncExternalStore } from 'react';
import type { DiscoveryEntry } from '@/lib/topic-registry';
import { EditorialStatus } from '@/components/topic/editorial-status';

type Category = { id: string; title: string };
type BrowserProps = {
  conditions: DiscoveryEntry[];
  procedures: DiscoveryEntry[];
  categories: Category[];
};

// Category views are shareable URLs (?category=…); every condition and
// procedure still links to its single canonical route.
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
      props.conditions.some((entry) => entry.categories.includes(category.id)),
  )
    ? requested!
    : 'all';
  return (
    <SpecialtyBrowserView {...props} selected={selected} pathname={pathname} />
  );
}
const plural = (count: number, word: string) =>
  `${count} ${word}${count === 1 ? '' : 's'}`;
export function SpecialtyBrowserView({
  conditions,
  procedures,
  categories,
  selected,
  pathname,
}: BrowserProps & { selected: string; pathname: string }) {
  const all = [...conditions, ...procedures];
  const populated = categories.filter((category) =>
    all.some((entry) => entry.categories.includes(category.id)),
  );
  const empty = categories.filter((category) => !populated.includes(category));
  const inView = (entry: DiscoveryEntry) =>
    selected === 'all' || entry.categories.includes(selected);
  const visibleConditions = conditions.filter(inView);
  const visibleProcedures = procedures.filter(inView);
  const count = (id: string) =>
    all.filter((entry) => id === 'all' || entry.categories.includes(id)).length;
  const title = (id: string) =>
    categories.find((category) => category.id === id)!.title;
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
                    <span className="sr-only"> conditions and procedures</span>
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
      <div className="min-w-0">
        <p role="status" className="mb-4 text-sm text-dissect-muted">
          {plural(visibleConditions.length, 'condition')} ·{' '}
          {plural(visibleProcedures.length, 'procedure')} ·{' '}
          {selected === 'all' ? 'All topics' : title(selected)}
        </p>
        <div className="discovery-columns">
          <section aria-labelledby="conditions-heading" className="min-w-0">
            <h2 id="conditions-heading" className="discovery-heading">
              Conditions
            </h2>
            <p className="discovery-intro">
              Understand the patient: presentation, investigations and
              management.
            </p>
            {visibleConditions.map((entry) => (
              <article key={entry.id} className="topic-listing">
                <ul className="flex flex-wrap gap-2" aria-label="Categories">
                  {entry.categories.map((id) => (
                    <li key={id} className="taxonomy-tag">
                      {title(id)}
                    </li>
                  ))}
                </ul>
                <h3 className="mt-3 text-xl font-semibold">
                  <Link className="related-link" href={entry.href}>
                    {entry.title}
                    <span aria-hidden="true">↗</span>
                  </Link>
                </h3>
                <p className="my-2 leading-7 text-dissect-muted">
                  {entry.summary}
                </p>
                {entry.procedures.map((procedure) => (
                  <p key={procedure.id} className="discovery-link">
                    <span className="eyebrow">Operation</span>
                    <Link href={procedure.href}>{procedure.title}</Link>
                  </p>
                ))}
                <EditorialStatus metadata={entry.metadata} />
              </article>
            ))}
          </section>
          <section aria-labelledby="procedures-heading" className="min-w-0">
            <h2 id="procedures-heading" className="discovery-heading">
              Procedures
            </h2>
            <p className="discovery-intro">
              Prepare for theatre: anatomy, operative steps and what changes the
              plan.
            </p>
            {visibleProcedures.map((entry) => (
              <article key={entry.id} className="topic-listing">
                <p className="eyebrow">Procedure</p>
                <h3 className="mt-2 text-xl font-semibold">
                  <Link className="related-link" href={entry.href}>
                    {entry.title}
                    <span aria-hidden="true">↗</span>
                  </Link>
                </h3>
                <p className="my-2 leading-7 text-dissect-muted">
                  {entry.summary}
                </p>
                {entry.conditions.map((condition) => (
                  <p key={condition.id} className="discovery-link">
                    <span className="eyebrow">Clinical context</span>
                    <Link href={condition.href}>{condition.title}</Link>
                  </p>
                ))}
                <EditorialStatus metadata={entry.metadata} />
              </article>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}
