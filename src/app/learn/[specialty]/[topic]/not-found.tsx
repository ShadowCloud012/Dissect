import Link from 'next/link';

export default function TopicNotFound() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <h1 className="text-3xl font-semibold">Topic not found</h1>
      <p className="mt-4 text-dissect-muted">
        This topic is not available in the content registry.
      </p>
      <Link
        className="mt-6 inline-flex min-h-11 items-center text-dissect-green-800 underline"
        href="/learn"
      >
        Return to Learn
      </Link>
    </div>
  );
}
