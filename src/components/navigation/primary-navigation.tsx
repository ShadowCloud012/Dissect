'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search } from 'lucide-react';

const links = [
  { href: '/learn', label: 'Learn' },
  { href: '/practice', label: 'Practice' },
  { href: '/theatre', label: 'Theatre' },
  { href: '/search', label: 'Search' },
];

export function PrimaryNavigation() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Primary"
      className="flex w-full border-t border-dissect-subtle lg:w-auto lg:border-t-0"
    >
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          aria-current={
            pathname === href || pathname.startsWith(`${href}/`)
              ? 'page'
              : undefined
          }
          className="flex min-h-14 flex-1 items-center justify-center gap-2 border-b-2 border-transparent px-3 text-sm font-medium text-dissect-muted hover:text-dissect-green-800 aria-[current=page]:border-dissect-green-400 aria-[current=page]:text-dissect-green-800 lg:flex-none lg:px-5"
        >
          {href === '/search' && <Search size={16} aria-hidden="true" />}
          {label}
        </Link>
      ))}
    </nav>
  );
}
