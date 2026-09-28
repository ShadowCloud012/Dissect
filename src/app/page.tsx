import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { topicRegistry } from '@/content/registry';
import { specialties } from '@/content/specialties';
import { resolveTopicPage, topicHref } from '@/lib/topic-pages';
import { Sources } from '@/components/content/content-renderer';
import { EditorialStatus } from '@/components/topic/editorial-status';
import { UpcomingSpecialties } from '@/components/navigation/upcoming-specialties';

const flagship = topicRegistry.getTopic(
  'general-surgery',
  'acute-appendicitis',
)!;
const flagshipHref = topicHref(flagship.metadata);

// Resolve homepage links against the registry so they can only point at pages
// (and blocks on those pages) that exist.
function link(slug: string, blockId?: string, title?: string) {
  const resolved = resolveTopicPage(flagship, slug);
  if (!resolved) throw new Error(`Homepage links to a missing page: ${slug}`);
  if (
    blockId &&
    !resolved.sections.some((section) =>
      section.blocks.some((block) => block.id === blockId),
    )
  )
    throw new Error(`Homepage links to a missing block: ${blockId}`);
  return {
    title: title ?? resolved.page.title,
    href: `${flagshipHref}/${slug}${blockId ? `#block-${blockId}` : ''}`,
  };
}
// Ward → theatre → ward: the order a patient's surgical journey follows.
const journey = [
  {
    title: 'Understand the patient',
    description: 'Presentation, assessment and the decision to operate.',
    links: [link('assessment'), link('management')],
  },
  {
    title: 'Prepare for theatre',
    description: 'The consent conversation and the perioperative plan.',
    links: [
      link('consent'),
      link('appendicectomy', 'operative-preparation', 'Preparation'),
    ],
  },
  {
    title: 'Understand the anatomy',
    description: 'Landmarks and relationships you will actually see.',
    links: [link('anatomy')],
  },
  {
    title: 'Follow the operation',
    description: 'The sequence, step by step, and why each step matters.',
    links: [link('appendicectomy', 'operative-sequence', 'Operative steps')],
  },
  {
    title: 'Decisions & danger areas',
    description: 'What is at risk, and what can change the plan.',
    links: [
      link('anatomy', 'structures-at-risk', 'Danger areas'),
      link('appendicectomy', 'operative-judgement', 'What can change the plan'),
    ],
  },
  {
    title: 'After surgery',
    description: 'Review on the ward, recovery and complications.',
    links: [link('post-op'), link('complications')],
  },
];
const reinforce = [link('hot-seat'), link('evidence')];

// A verbatim authored block from the flagship operation page.
const outline = flagship.sections
  .flatMap((section) => section.blocks)
  .find((block) => block.id === 'operation-outline');

export default function HomePage() {
  const available = specialties.filter(
    (specialty) => topicRegistry.countTopics(specialty.slug) > 0,
  );
  return (
    <div className="home">
      <section aria-labelledby="home-title" className="home-hero">
        <div>
          <p className="eyebrow">Dissect · UK-first surgical education</p>
          <h1 id="home-title" className="home-title">
            Know the patient.{' '}
            <span className="text-dissect-green-800">
              Understand the operation.
            </span>
          </h1>
          <p className="home-lead">
            Dissect bridges the gap between learning a condition and
            understanding what actually happens in theatre — the anatomy, the
            steps, the decisions, and the care either side.
          </p>
          <div className="home-actions">
            <Link href={flagshipHref} className="action-primary">
              Open {flagship.metadata.title}
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/learn/general-surgery" className="action-secondary">
              Explore General Surgery
            </Link>
          </div>
        </div>
        {outline?.type === 'prose' && (
          <figure className="home-preview">
            <figcaption>
              <span className="eyebrow">
                {flagship.metadata.title} / Appendicectomy
              </span>
              <span className="mt-1 block font-semibold">The operation</span>
            </figcaption>
            <blockquote>{outline.paragraphs.join(' ')}</blockquote>
            <Sources
              ids={outline.referenceIds}
              references={flagship.references}
              evidenceHref={`${flagshipHref}/evidence`}
            />
            <div className="home-preview-foot">
              <EditorialStatus metadata={flagship.metadata} />
              <Link
                href={link('appendicectomy', 'operative-sequence').href}
                className="related-link"
              >
                Follow the operative steps
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </figure>
        )}
      </section>

      <section aria-labelledby="journey-heading" className="home-section">
        <div className="home-section-head">
          <h2 id="journey-heading" className="home-heading">
            From the ward to theatre and back
          </h2>
          <p className="text-dissect-muted">
            Each topic follows the patient: the same sourced content, from the
            first assessment through the operation to recovery.
          </p>
        </div>
        <ol className="home-journey">
          {journey.map((step, index) => (
            <li key={step.title}>
              <span className="home-journey-number" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <h3 className="font-semibold">{step.title}</h3>
                <p className="mt-1 text-sm text-dissect-muted">
                  {step.description}
                </p>
                <ul className="home-journey-links">
                  {step.links.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href}>{item.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
        <div className="home-reinforce">
          <p className="text-sm text-dissect-muted">
            Then reinforce it — revision questions and the sources behind every
            page.
          </p>
          <ul className="home-journey-links">
            {reinforce.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="specialty-heading" className="home-section">
        <div className="home-section-head">
          <h2 id="specialty-heading" className="home-heading">
            Specialties
          </h2>
          <p className="text-dissect-muted">
            Content is added one topic at a time.
          </p>
        </div>
        <ul className="home-specialties">
          {available.map((specialty) => {
            const count = topicRegistry.countTopics(specialty.slug);
            return (
              <li key={specialty.id}>
                <Link href={`/learn/${specialty.slug}`}>
                  <span className="text-xl font-semibold">
                    {specialty.title}
                  </span>
                  <span className="text-sm text-dissect-muted">
                    {specialty.description}
                  </span>
                  <span className="font-mono text-xs text-dissect-green-800">
                    {count} {count === 1 ? 'topic' : 'topics'} available
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <UpcomingSpecialties headingLevel="h3" />
      </section>

      <section aria-labelledby="trust-heading" className="home-section">
        <h2 id="trust-heading" className="home-heading">
          How the content is built
        </h2>
        <dl className="home-trust">
          <div>
            <dt>UK-first sources</dt>
            <dd>
              NICE, RCS and NHS sources, with international guidelines where
              relevant.
            </dd>
          </div>
          <div>
            <dt>Source-linked</dt>
            <dd>
              Clinical statements link to their references, with limitations
              stated on each topic&rsquo;s evidence page.
            </dd>
          </div>
          <div>
            <dt>Depth by training level</dt>
            <dd>
              Medical student to registrar. Level changes depth, not factual
              truth.
            </dd>
          </div>
          <div>
            <dt>Visible review status</dt>
            <dd>
              Each topic shows its clinical-review status. Drafts stay labelled
              until a named clinician has reviewed them.
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
