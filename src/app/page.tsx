import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { topicRegistry } from '@/content/registry';
import { specialties } from '@/content/specialties';
import { linkHref, resolveWalkthroughs, topicHref } from '@/lib/topic-pages';
import type { TopicLink } from '@/schemas/topic-experience';
import { EditorialStatus } from '@/components/topic/editorial-status';
import { UpcomingSpecialties } from '@/components/navigation/upcoming-specialties';
import {
  walkthroughFieldLabels,
  WalkthroughStepPreview,
} from '@/components/content/operative-walkthrough';

// The flagship module demonstrates the product; the homepage describes the
// product. Example links are validated topic links, so none can dangle.
const flagship = topicRegistry.getTopic(
  'general-surgery',
  'acute-appendicitis',
)!;
const flagshipHref = topicHref(flagship.metadata);
function example(link: TopicLink) {
  const page = flagship.experience?.pages.find(
    (entry) => entry.slug === link.page,
  );
  const walkthrough = flagship.experience?.walkthroughs.find(
    (entry) => entry.page === link.page,
  );
  const blockOnPage =
    !link.blockId ||
    flagship.sections.some(
      (section) =>
        page?.sectionIds.includes(section.id) &&
        section.blocks.some((block) => block.id === link.blockId),
    );
  if (!page || !blockOnPage || (link.step && !walkthrough))
    throw new Error(
      `Homepage example links to a missing target: ${link.label}`,
    );
  return { label: link.label, href: linkHref(flagship, link) };
}
const capabilities = [
  {
    title: 'Understand the patient',
    description: 'Clinical orientation without unnecessary hunting.',
    example: { label: 'Topic overview', href: flagshipHref },
  },
  {
    title: 'Prepare for theatre',
    description: 'Pre-op, consent, anatomy and what to expect.',
    example: example({
      label: '5-minute theatre prep',
      page: 'appendicectomy',
    }),
  },
  {
    title: 'Understand the anatomy',
    description: 'Only the anatomy that matters for the operation.',
    example: example({ label: 'Operative anatomy', page: 'anatomy' }),
  },
  {
    title: 'Follow the operation',
    description: 'A clear operative sequence with rationale and danger areas.',
    example: example({
      label: 'Operative walkthrough',
      page: 'appendicectomy',
      step: 1,
    }),
  },
  {
    title: 'Understand decisions',
    description:
      'What can change the approach when reality differs from the textbook.',
    example: example({
      label: 'What changes the plan',
      page: 'appendicectomy',
      blockId: 'operative-judgement',
    }),
  },
  {
    title: 'After surgery',
    description: 'Post-op care, complications and follow-up.',
    example: example({ label: 'Post-op & complications', page: 'post-op' }),
  },
];
const reinforce = [
  example({ label: 'Hot Seat', page: 'hot-seat' }),
  example({ label: 'Evidence', page: 'evidence' }),
];
const fieldDescriptions = {
  why: 'Why this part of the operation matters.',
  anatomy: 'The structure or landmark involved.',
  danger: 'What could be injured, or the safety principle.',
  changes: 'Findings or difficulty that can alter the approach.',
};
// A real step from the flagship walkthrough, shown at introductory depth.
const previewStep = resolveWalkthroughs(flagship, 'appendicectomy')[0]
  ?.steps[2];

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
            Dissect bridges the gap between understanding the patient and
            understanding what actually happens in surgery — what you will see,
            why each step matters, and what can change the plan.
          </p>
          <div className="home-actions">
            <Link href="/learn/general-surgery" className="action-primary">
              Explore General Surgery
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link
              href={capabilities[3].example.href}
              className="action-secondary"
            >
              See an operative walkthrough
            </Link>
          </div>
        </div>
        <aside aria-labelledby="flagship-heading" className="home-flagship">
          <p className="eyebrow">Flagship module · General Surgery</p>
          <h2 id="flagship-heading" className="mt-1 text-xl font-semibold">
            <Link href={flagshipHref} className="hover:underline">
              {flagship.metadata.title}
            </Link>
          </h2>
          <p className="mt-1 text-sm text-dissect-muted">
            From assessment to laparoscopic appendicectomy and recovery.
          </p>
          <div className="mt-3">
            <EditorialStatus metadata={flagship.metadata} />
          </div>
          <ul className="home-flagship-links">
            <li>
              <Link href={flagshipHref}>Overview</Link>
            </li>
            <li>
              <Link href={capabilities[1].example.href}>Theatre prep</Link>
            </li>
            <li>
              <Link href={capabilities[3].example.href}>Walkthrough</Link>
            </li>
          </ul>
        </aside>
      </section>

      <section aria-labelledby="jobs-heading" className="home-section">
        <div className="home-section-head">
          <h2 id="jobs-heading" className="home-heading">
            From the ward to theatre and back
          </h2>
          <p className="text-dissect-muted">
            Every module follows the same surgical episode, with the same
            sourced content at the depth you need.
          </p>
        </div>
        <ol className="home-journey">
          {capabilities.map((capability, index) => (
            <li key={capability.title}>
              <span className="home-journey-number" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0">
                <h3 className="font-semibold">{capability.title}</h3>
                <p className="mt-1 text-sm text-dissect-muted">
                  {capability.description}
                </p>
                <p className="home-example">
                  <span className="eyebrow">Example</span>
                  <Link href={capability.example.href}>
                    {capability.example.label}
                  </Link>
                </p>
              </div>
            </li>
          ))}
        </ol>
        <div className="home-reinforce">
          <p className="text-sm text-dissect-muted">
            Then check your understanding of the case and the operation, and the
            sources behind every page.
          </p>
          <ul className="home-journey-links">
            {reinforce.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {previewStep && (
        <section aria-labelledby="operation-heading" className="home-section">
          <div className="home-operation">
            <div>
              <h2 id="operation-heading" className="home-heading">
                How an operation is taught
              </h2>
              <p className="mt-3 text-dissect-muted">
                Each operative step is broken down the same way. Where the
                sourced content does not yet support a field, Dissect says so
                instead of filling the gap.
              </p>
              <dl className="home-legend">
                <div>
                  <dt>Step</dt>
                  <dd>What happens.</dd>
                </div>
                {(
                  Object.keys(fieldDescriptions) as Array<
                    keyof typeof fieldDescriptions
                  >
                ).map((kind) => (
                  <div key={kind}>
                    <dt>{walkthroughFieldLabels[kind]}</dt>
                    <dd>{fieldDescriptions[kind]}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <figure className="home-preview">
              <figcaption className="eyebrow">
                Example · Laparoscopic appendicectomy, step {previewStep.number}
              </figcaption>
              <WalkthroughStepPreview step={previewStep} />
              <Link
                href={capabilities[3].example.href}
                className="related-link"
              >
                Open the full walkthrough <span aria-hidden="true">→</span>
              </Link>
            </figure>
          </div>
        </section>
      )}

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
            const conditions = topicRegistry.listConditions(specialty.slug);
            const procedures = topicRegistry.listProcedures(specialty.slug);
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
                    {conditions.length}{' '}
                    {conditions.length === 1 ? 'condition' : 'conditions'} ·{' '}
                    {procedures.length}{' '}
                    {procedures.length === 1 ? 'procedure' : 'procedures'}
                  </span>
                </Link>
                {/* Current pathways: each condition with its operation. */}
                <ul
                  className="home-pathways"
                  aria-label={`Current ${specialty.title} pathways`}
                >
                  {conditions.map((condition) => (
                    <li key={condition.id}>
                      <Link href={condition.href}>{condition.title}</Link>
                      {condition.procedures.map((procedure) => (
                        <span key={procedure.id}>
                          <span
                            aria-hidden="true"
                            className="text-dissect-muted"
                          >
                            {' '}
                            →{' '}
                          </span>
                          <span className="sr-only">, operation: </span>
                          <Link href={procedure.href}>{procedure.title}</Link>
                        </span>
                      ))}
                    </li>
                  ))}
                </ul>
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
              The same surgical episode at a different professional depth, from
              medical student to registrar.
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
