import Link from 'next/link';
import { PrimaryNavigation } from '@/components/navigation/primary-navigation';
import { TrainingLevelSelector } from '@/components/navigation/training-level-selector';

export function AppHeader() {
  return (
    <header className="border-b border-dissect-border bg-dissect-surface">
      <div className="mx-auto flex min-h-14 max-w-7xl items-stretch gap-x-1 px-4 sm:gap-x-6 sm:px-8 lg:min-h-16">
        <Link
          href="/"
          aria-label="Dissect home"
          className="flex items-center text-lg font-semibold tracking-tight sm:text-2xl"
        >
          Dis<span className="text-dissect-green-600">sect</span>
        </Link>
        <div className="flex flex-1">
          <PrimaryNavigation />
        </div>
        <div className="flex items-center">
          <TrainingLevelSelector />
        </div>
      </div>
    </header>
  );
}
