'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Only working product areas. Practice, Theatre and Search keep their
// placeholder routes but return here once they are built.
const links = [{ href: '/learn', label: 'Learn' }];

export function PrimaryNavigation() {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary" className="flex self-stretch">
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          aria-current={
            pathname === href || pathname.startsWith(`${href}/`)
              ? 'page'
              : undefined
          }
          className="flex items-center border-b-2 border-transparent px-3 text-sm font-medium text-dissect-muted hover:text-dissect-green-800 aria-[current=page]:border-dissect-green-400 aria-[current=page]:text-dissect-green-800 lg:px-5"
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
