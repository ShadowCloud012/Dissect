import type { Metadata } from 'next';
import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/dm-sans/latin-600.css';
import '@fontsource/dm-mono/latin-400.css';
import '@/styles/globals.css';
import { AppHeader } from '@/components/layout/app-header';

export const metadata: Metadata = {
  title: { default: 'Dissect | Surgical education', template: '%s | Dissect' },
  description: 'A UK-first surgical education and reference platform.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <body className="flex min-h-screen flex-col">
        <a
          href="#main-content"
          className="sr-only fixed top-3 left-3 z-50 rounded-dissect-sm bg-dissect-surface p-3 focus:not-sr-only focus:fixed"
        >
          Skip to content
        </a>
        <AppHeader />
        <main id="main-content" tabIndex={-1} className="flex-1">
          {children}
        </main>
        <footer className="border-t border-dissect-border px-5 py-6 text-xs leading-6 text-dissect-muted sm:px-8">
          <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-x-8 gap-y-2">
            <p>Dissect · Surgical education</p>
            <p>Foundation preview · No clinical content published</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
