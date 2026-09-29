import Link from 'next/link';
import type { ReactNode } from 'react';
import type { ResolvedWalkthrough } from '@/lib/topic-pages';
import { walkthroughFieldKinds } from '@/schemas/topic-experience';
import { depthHint, Gate, joinExtracts } from './extract-rows';

export const walkthroughFieldLabels: Record<
  (typeof walkthroughFieldKinds)[number],
  string
> = {
  why: 'Why',
  anatomy: 'Anatomy',
  danger: 'Danger',
  changes: 'Changes the plan',
};
type Step = ResolvedWalkthrough['steps'][number];

// Why / Anatomy / Danger / Changes the plan for one step. Level-sensitive
// fields leave a depth hint; unsupported fields are shown as editorial gaps.
function StepFields({ step }: { step: Step }) {
  return (
    <dl className="walkthrough-fields">
      {walkthroughFieldKinds.map((kind) => {
        const field = step.fields.find((entry) => entry.kind === kind);
        const label = walkthroughFieldLabels[kind];
        if (field)
          return (
            <Gate
              key={kind}
              level={
                field.minimumLevel === 'medical-student'
                  ? undefined
                  : field.minimumLevel
              }
              hint={
                <div data-kind={kind}>
                  <dt>{label}</dt>
                  <dd className="depth-hint">
                    {depthHint(field.minimumLevel)}
                  </dd>
                </div>
              }
            >
              <div data-kind={kind}>
                <dt>{label}</dt>
                <dd>{joinExtracts(field.extracts)}</dd>
              </div>
            </Gate>
          );
        if (step.gaps.includes(kind))
          return (
            <div key={kind} data-kind={kind} data-gap="">
              <dt>{label}</dt>
              <dd>Clinical/editorial content needed</dd>
            </div>
          );
        return null;
      })}
    </dl>
  );
}
// One step as a standalone preview (e.g. on the homepage).
export function WalkthroughStepPreview({ step }: { step: Step }) {
  return (
    <div className="walkthrough-step walkthrough-step-preview">
      <span className="walkthrough-marker" aria-hidden="true">
        {String(step.number).padStart(2, '0')}
      </span>
      <div className="min-w-0">
        <p className="walkthrough-title">{step.label}</p>
        <p className="walkthrough-text">{step.text}</p>
        <StepFields step={step} />
      </div>
    </div>
  );
}
// Step → Why → Anatomy → Danger → What changes the plan, as a connected
// timeline. Each field quotes authored content.
export function OperativeWalkthrough({
  walkthrough,
  sources,
}: {
  walkthrough: ResolvedWalkthrough;
  sources?: ReactNode;
}) {
  return (
    <div className="walkthrough">
      {walkthrough.absorbsBlockIds.map((id) => (
        <span key={id} id={`block-${id}`} className="anchor-target" />
      ))}
      <div className="walkthrough-head">
        <h3 className="text-lg font-semibold">Operative walkthrough</h3>
        <p className="eyebrow" aria-hidden="true">
          Step · Why · Anatomy · Danger · Changes the plan
        </p>
      </div>
      <ol className="walkthrough-steps">
        {walkthrough.steps.map((step) => (
          <li key={step.anchor} id={step.anchor} className="walkthrough-step">
            <span className="walkthrough-marker" aria-hidden="true">
              {String(step.number).padStart(2, '0')}
            </span>
            <div className="min-w-0">
              <h4 className="walkthrough-title">
                <span className="sr-only">Step {step.number}: </span>
                {step.label}
              </h4>
              <p className="walkthrough-text">{step.text}</p>
              <StepFields step={step} />
              {step.links.length > 0 && (
                <ul
                  className="walkthrough-links"
                  aria-label={`Connected to step ${step.number}`}
                >
                  {step.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ol>
      {sources && <div className="walkthrough-foot">{sources}</div>}
    </div>
  );
}
