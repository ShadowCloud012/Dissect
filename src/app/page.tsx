import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
      <Badge>UK-first surgical education</Badge>
      <h1 className="mt-7 max-w-3xl text-4xl leading-tight font-semibold tracking-tight sm:text-6xl">
        Learn surgery the way{' '}
        <span className="text-dissect-green-600">surgeons think.</span>
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-8 text-dissect-muted">
        A place for surgical reference, thoughtful practice and preparation for
        theatre.
      </p>
      <Link
        href="/learn"
        className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-dissect-md bg-dissect-green-600 px-6 py-3 font-medium text-white shadow-dissect-sm hover:bg-dissect-green-800"
      >
        Explore Learn <ArrowRight size={18} aria-hidden="true" />
      </Link>
      <div className="mt-16 max-w-2xl border-t border-dissect-border pt-8">
        <Alert title="Clinical reference preview">
          The first clinical topic is available in Learn as a draft awaiting
          clinical review.
        </Alert>
      </div>
    </div>
  );
}
