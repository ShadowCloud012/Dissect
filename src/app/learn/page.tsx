import Link from 'next/link';
import { specialties } from '@/content/specialties';
import { topicRegistry } from '@/content/registry';
export const metadata = { title: 'Learn' };
export default function LearnPage() {
  return (
    <div className="browse-page">
      <p className="eyebrow">Dissect / Surgical reference</p>
      <h1 className="browse-title">Learn</h1>
      <p className="browse-intro">
        Start with your specialty. Move from the clinical question to the
        operation, the evidence and the next thing to revise.
      </p>
      <div className="mt-10 border-t border-dissect-border">
        {specialties
          .filter((specialty) => topicRegistry.countTopics(specialty.slug) > 0)
          .map((specialty) => (
            <Link
              className="specialty-link"
              key={specialty.id}
              href={`/learn/${specialty.slug}`}
            >
              <span className="eyebrow">Specialty</span>
              <div>
                <h2 className="text-2xl font-semibold">{specialty.title}</h2>
                <p className="mt-2 text-dissect-muted">
                  {specialty.description}
                </p>
                <p className="mt-4 font-mono text-xs">
                  {topicRegistry.countTopics(specialty.slug)} topic · Reference,
                  operative learning &amp; revision
                </p>
              </div>
              <span aria-hidden="true" className="text-2xl">
                ↗
              </span>
            </Link>
          ))}
      </div>
      <p className="mt-8 text-sm text-dissect-muted">
        More specialties will be added as reviewed content becomes available.
      </p>
      <details className="mt-12 text-sm">
        <summary className="disclosure-trigger">
          About the content format
        </summary>
        <Link
          className="related-link"
          href="/learn/demo/how-dissect-content-works"
        >
          Explore the non-clinical content demonstration
        </Link>
      </details>
    </div>
  );
}
