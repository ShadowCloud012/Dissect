'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Only working product areas. Practice and Theatre keep their placeholder
// routes but return here once they are built.
const links = [
  { href: '/learn', label: 'Learn', compactIcon: false },
  // On phones Search is a labelled magnifier so the header stays one row.
  { href: '/search', label: 'Search', compactIcon: true },
];

export function PrimaryNavigation() {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary" className="flex self-stretch">
      {links.map(({ href, label, compactIcon }) => (
        <Link
          key={href}
          href={href}
          aria-current={
            pathname === href || pathname.startsWith(`${href}/`)
              ? 'page'
              : undefined
          }
          className="flex min-w-11 items-center justify-center border-b-2 border-transparent px-2 text-sm font-medium text-dissect-muted hover:text-dissect-green-800 aria-[current=page]:border-dissect-green-400 aria-[current=page]:text-dissect-green-800 sm:px-3 lg:px-5"
        >
          {compactIcon && (
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="size-[18px] sm:hidden"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
            >
              <circle cx="8.5" cy="8.5" r="5.5" />
              <path d="m13 13 4.5 4.5" strokeLinecap="round" />
            </svg>
          )}
          <span className={compactIcon ? 'sr-only sm:not-sr-only' : undefined}>
            {label}
          </span>
        </Link>
      ))}
    </nav>
  );
}
