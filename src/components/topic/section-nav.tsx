'use client';

import { useSyncExternalStore } from 'react';

function subscribe(callback: () => void) {
  window.addEventListener('hashchange', callback);
  return () => window.removeEventListener('hashchange', callback);
}
function getHash() {
  return window.location.hash;
}
function serverHash() {
  return '';
}
export function SectionNav({
  sections,
}: {
  sections: { id: string; title: string }[];
}) {
  const hash = useSyncExternalStore(subscribe, getHash, serverHash);
  return (
    <nav
      aria-label="Topic sections"
      className="flex flex-wrap gap-1 lg:flex-col"
    >
      {sections.map(({ id, title }, index) => (
        <a
          key={id}
          href={`#section-${id}`}
          aria-current={
            hash === `#section-${id}` || (!hash && index === 0)
              ? 'location'
              : undefined
          }
          className="inline-flex min-h-11 items-center rounded-dissect-sm border-l-2 border-transparent px-3 py-2 text-sm text-dissect-muted hover:bg-dissect-green-50 aria-[current=location]:border-dissect-green-600 aria-[current=location]:bg-dissect-green-50 aria-[current=location]:font-semibold aria-[current=location]:text-dissect-green-800"
        >
          {title}
        </a>
      ))}
    </nav>
  );
}
