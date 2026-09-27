import Link from 'next/link';
import { topicRegistry } from '@/content/registry';
import { Badge } from '@/components/ui/badge';
export const metadata = { title: 'Learn' };
export default function LearnPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-20">
      <Badge>Dissect / Learn</Badge>
      <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
        Learn
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-dissect-muted">
        Surgical knowledge, organised around clinical topics and procedures. No
        clinical content is published yet.
      </p>
      <ul className="mt-10 max-w-2xl">
        {topicRegistry.listTopics().map((topic) => (
          <li key={topic.id} className="border-y border-dissect-border py-6">
            <Badge>
              {topic.contentKind === 'non-clinical-demo'
                ? 'NON-CLINICAL DEMO'
                : topic.category}
            </Badge>
            <h2 className="mt-3 text-xl font-semibold">
              <Link
                className="inline-flex min-h-11 items-center text-dissect-green-800 underline underline-offset-4"
                href={`/learn/${topic.specialty}/${topic.slug}`}
              >
                {topic.title}
              </Link>
            </h2>
            <p className="mt-2 leading-7 text-dissect-muted">{topic.summary}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
