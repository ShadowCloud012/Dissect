import Link from 'next/link';
import { PrimaryNavigation } from '@/components/navigation/primary-navigation';
import { TrainingLevelSelector } from '@/components/navigation/training-level-selector';

export function AppHeader() {
  return (
    <header className="border-b border-dissect-border bg-dissect-surface">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-4 px-4 sm:px-8 lg:flex-nowrap">
        <Link
          href="/"
          aria-label="Dissect home"
          className="flex min-h-16 items-center text-2xl font-semibold tracking-tight"
        >
          Dis<span className="text-dissect-green-600">sect</span>
        </Link>
        <div className="order-3 w-full lg:order-none lg:w-auto">
          <PrimaryNavigation />
        </div>
        <TrainingLevelSelector />
      </div>
    </header>
  );
}
