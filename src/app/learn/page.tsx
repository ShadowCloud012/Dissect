import Link from 'next/link';
import { specialties } from '@/content/specialties';
import { topicRegistry } from '@/content/registry';
import { UpcomingSpecialties } from '@/components/navigation/upcoming-specialties';
export const metadata = { title: 'Learn' };
const countLabel = (count: number, word: string) =>
  `${count} ${word}${count === 1 ? '' : 's'}`;
export default function LearnPage() {
  return (
    <div className="browse-page">
      <p className="eyebrow">Dissect / Surgical reference</p>
      <h1 className="browse-title">Learn</h1>
      <p className="browse-intro">
        Start with your specialty. Move from the patient in front of you to the
        operation — its anatomy, steps and decisions — and the care after it.
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
                  {countLabel(
                    topicRegistry.listConditions(specialty.slug).length,
                    'condition',
                  )}{' '}
                  ·{' '}
                  {countLabel(
                    topicRegistry.listProcedures(specialty.slug).length,
                    'procedure',
                  )}
                </p>
              </div>
              <span aria-hidden="true" className="text-2xl">
                ↗
              </span>
            </Link>
          ))}
      </div>
      <UpcomingSpecialties />
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
