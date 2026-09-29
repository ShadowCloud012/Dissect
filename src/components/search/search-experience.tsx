'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useId, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import type { SearchDocument } from '@/lib/search-documents';
import {
  matchLabels,
  resultKindLabels,
  searchIndex,
  type SearchResult,
} from '@/lib/search';

// Real terms from the current content, not trending or popular searches.
const examples = [
  'Appendicitis',
  'Lap chole',
  'Cystic duct',
  'Bile duct injury',
];
const noSubscription = () => () => {};
const searchHref = (query: string) =>
  query ? `/search?q=${encodeURIComponent(query)}` : '/search';

type SearchProps = {
  documents: SearchDocument[];
  specialtyTitles: Record<string, string>;
};
// Reads ?q= so searches are shareable. The page is static and results are
// ranked in the browser, so search itself needs JavaScript.
export function SearchExperience(props: SearchProps) {
  const params = useSearchParams();
  // The page is prerendered without a query; read it after hydration.
  const hydrated = useSyncExternalStore(
    noSubscription,
    () => true,
    () => false,
  );
  return (
    <SearchView {...props} urlQuery={hydrated ? (params.get('q') ?? '') : ''} />
  );
}
export function SearchView({
  documents,
  specialtyTitles,
  urlQuery,
}: SearchProps & { urlQuery: string }) {
  // The URL is the source of truth. The field keeps exactly what was typed
  // (including trailing spaces) while the URL echoes our own writes; any
  // other URL change — a link, the Search nav item, back/forward — replaces
  // the field. `pending` lists written queries not yet echoed back, since
  // the router can deliver them a render later.
  const [field, setField] = useState({
    value: urlQuery,
    seen: urlQuery,
    pending: [] as string[],
  });
  let current = field;
  if (urlQuery !== field.seen) {
    const echo = field.pending.indexOf(urlQuery);
    current =
      echo >= 0
        ? { ...field, seen: urlQuery, pending: field.pending.slice(echo + 1) }
        : { value: urlQuery, seen: urlQuery, pending: [] };
    setField(current);
  }
  const query = current.value;
  const input = useRef<HTMLInputElement>(null);
  const statusId = useId();
  const results = useMemo(
    () => searchIndex(documents, query, specialtyTitles),
    [documents, query, specialtyTitles],
  );
  // Keep the URL shareable without adding history entries per keystroke.
  function update(next: string) {
    const written = next.trim();
    const last = current.pending.at(-1) ?? current.seen;
    setField({
      ...current,
      value: next,
      pending:
        written === last ? current.pending : [...current.pending, written],
    });
    if (written !== last)
      window.history.replaceState(null, '', searchHref(written));
  }
  const trimmed = query.trim();
  return (
    <div className="search-page">
      <form
        role="search"
        action="/search"
        className="search-form"
        onSubmit={(event) => event.preventDefault()}
      >
        <label htmlFor="search-input" className="eyebrow">
          Search conditions, procedures, anatomy and complications
        </label>
        <div className="search-field">
          <input
            ref={input}
            id="search-input"
            name="q"
            type="search"
            // The only purpose of this page is to search.
            autoFocus
            autoComplete="off"
            spellCheck={false}
            value={query}
            aria-describedby={statusId}
            onChange={(event) => update(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape' && query) {
                event.preventDefault();
                update('');
              }
            }}
          />
          {query && (
            <button
              type="button"
              className="search-clear"
              aria-label="Clear search"
              onClick={() => {
                update('');
                input.current?.focus();
              }}
            >
              Clear
            </button>
          )}
        </div>
      </form>
      <p id={statusId} role="status" className="search-status">
        {!trimmed
          ? 'Try a condition, procedure, anatomy term or complication.'
          : results.length
            ? `${results.length} ${results.length === 1 ? 'result' : 'results'} for “${trimmed}”`
            : `No exact or metadata match for “${trimmed}”.`}
      </p>
      {!trimmed && (
        <nav aria-label="Example searches" className="search-examples">
          <ul>
            {examples.map((example) => (
              <li key={example}>
                {/* A navigation like any other: the URL fills the field. */}
                <Link href={searchHref(example)}>{example}</Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
      {trimmed && results.length === 0 && (
        <p className="search-empty">
          Search matches names, alternative names, keywords, headings, anatomy
          and complication terms, not approximate spellings. Try another term,
          or <Link href="/learn/general-surgery">browse General Surgery</Link>.
        </p>
      )}
      {results.length > 0 && (
        <ol aria-label="Search results" className="search-results">
          {results.map((result) => (
            <SearchResultRow key={result.id} result={result} />
          ))}
        </ol>
      )}
    </div>
  );
}

function SearchResultRow({ result }: { result: SearchResult }) {
  const { match } = result;
  return (
    <li className="search-result" data-kind={result.kind}>
      {result.exact && <p className="search-exact">Exact match</p>}
      <Link href={result.href} className="search-result-title">
        {result.title}
      </Link>
      <p className="search-result-meta">
        <span className="search-kind">{resultKindLabels[result.kind]}</span>
        {[
          result.specialty,
          // A procedure names its condition; subpage titles already do.
          ...(result.kind === 'procedure' && result.parent
            ? [result.parent]
            : []),
        ].map((part) => ` · ${part}`)}
      </p>
      {match.field !== 'title' && (
        <p className="search-result-match">
          {matchLabels[match.field]}: <mark>{match.term}</mark>
        </p>
      )}
      {result.status !== 'clinically-reviewed' && (
        <p className="search-result-status">
          {result.status === 'awaiting-review'
            ? 'Draft · awaiting clinical review'
            : 'Draft · not clinically reviewed'}
        </p>
      )}
    </li>
  );
}
