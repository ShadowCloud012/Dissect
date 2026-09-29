'use client';
import Link from 'next/link';
import { useState, useSyncExternalStore, type ReactNode } from 'react';
import type { ResolvedAnatomyView } from '@/lib/topic-pages';
import {
  depthHint,
  Gate,
  joinExtracts,
} from '@/components/content/extract-rows';
import { anatomyArtwork, type StructureState } from './artwork';

const roleLabels: Record<string, string> = {
  landmark: 'Landmark',
  controlled: 'Controlled and divided',
  removed: 'Removed',
  orientation: 'Orientation',
  'at-risk': 'Structure at risk',
  'bleeding-risk': 'Bleeding risk',
};
const fieldLabels: Record<string, string> = {
  what: 'Structure',
  why: 'Why it matters',
  risk: 'Risk',
};
// Emphasis filters; a filter appears only if some structure has the role.
const filters: [string, string][] = [
  ['landmark', 'Landmarks'],
  ['at-risk', 'Structures at risk'],
  ['bleeding-risk', 'Bleeding risk'],
];
const riskRoles: string[] = ['at-risk', 'bleeding-risk'];
type Selection =
  | { kind: 'none' }
  | { kind: 'structure'; id: string }
  | { kind: 'step'; number: number };

const subscribeToHash = (onChange: () => void) => {
  window.addEventListener('hashchange', onChange);
  return () => window.removeEventListener('hashchange', onChange);
};

// A procedure-agnostic viewer: the artwork is chosen by view ID, while
// structures, steps and wording come from the validated content.
export function OperativeAnatomy({
  view,
  sources,
  noteSources,
}: {
  view: ResolvedAnatomyView;
  // Source links rendered on the server, per structure.
  sources: Record<string, ReactNode>;
  noteSources?: ReactNode;
}) {
  const artwork = anatomyArtwork[view.id];
  // A link such as …/anatomy#<view>-step-3 opens with that step selected.
  const hash = useSyncExternalStore(
    subscribeToHash,
    () => window.location.hash,
    () => '',
  );
  const hashStep = view.steps.find((step) => `#${step.anchor}` === hash);
  const [choice, setChoice] = useState<{ selection: Selection; hash: string }>({
    selection: { kind: 'none' },
    hash: '',
  });
  // A new hash replaces the reader's earlier choice; their clicks win after.
  const selection: Selection =
    choice.hash === hash
      ? choice.selection
      : hashStep
        ? { kind: 'step', number: hashStep.number }
        : choice.selection;
  const choose = (next: Selection) => setChoice({ selection: next, hash });
  const [mode, setMode] = useState('all');
  const modes: [string, string][] = [
    ['all', 'All structures'],
    ...filters.filter(([role]) =>
      view.structures.some((item) => item.roles.includes(role as never)),
    ),
  ];

  const numberOf = (id: string) =>
    view.structures.findIndex((structure) => structure.id === id) + 1;
  const structure =
    selection.kind === 'structure'
      ? view.structures.find((item) => item.id === selection.id)
      : undefined;
  const step =
    selection.kind === 'step'
      ? view.steps.find((item) => item.number === selection.number)
      : undefined;
  const hasRole = (id: string, role: string) =>
    view.structures
      .find((item) => item.id === id)!
      .roles.includes(role as never);
  // Emphasis: the selected step's structures, else the chosen mode.
  const focus = step
    ? new Set(step.structureIds)
    : mode === 'all'
      ? undefined
      : new Set(
          view.structures
            .filter((item) => item.roles.includes(mode as never))
            .map((item) => item.id),
        );
  const stateOf = (id: string): StructureState =>
    structure?.id === id
      ? 'selected'
      : focus
        ? focus.has(id)
          ? 'emphasised'
          : 'dimmed'
        : 'normal';
  const Artwork = artwork.Component;
  const titleId = `${view.id}-title`;
  return (
    <section
      id={view.id}
      aria-labelledby={titleId}
      className="anatomy-view"
      data-mode={mode}
    >
      <div className="anatomy-head">
        <p className="eyebrow">Operative anatomy · schematic</p>
        <h2 id={titleId} className="text-xl font-semibold">
          {view.title}
        </h2>
        <p className="text-sm text-dissect-muted">{view.caption}</p>
      </div>
      <div
        role="group"
        aria-label="Emphasise structures"
        className="anatomy-modes"
      >
        {modes.map(([id, label]) => (
          <button
            key={id}
            type="button"
            aria-pressed={mode === id && !step}
            onClick={() => {
              setMode(id);
              if (step) choose({ kind: 'none' });
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="anatomy-layout">
        <figure className="anatomy-figure">
          <svg
            viewBox="0 0 320 300"
            role="img"
            aria-label={`Schematic: ${view.title}`}
            aria-describedby={`${view.id}-svg-desc`}
          >
            <desc id={`${view.id}-svg-desc`}>
              {`Numbered structures: ${view.structures
                .map((item, index) => `${index + 1} ${item.label}`)
                .join(', ')}. Select them from the list of structures.`}
            </desc>
            <Artwork
              stateOf={stateOf}
              numberOf={numberOf}
              riskShown={(id) =>
                riskRoles.some(
                  (role) =>
                    (mode === role || structure?.id === id) &&
                    hasRole(id, role),
                )
              }
              onSelect={(id) => choose({ kind: 'structure', id })}
            />
          </svg>
          <figcaption>
            Schematic, not to scale: it shows relationships described in the
            sourced anatomy text on this page. Dashed vessel: posterior to the
            terminal ileum.
          </figcaption>
        </figure>
        {/* Directly under the drawing, where a tap on it is visible. */}
        <div className="anatomy-detail" aria-live="polite">
          {structure ? (
            <>
              <h3 className="text-lg font-semibold">
                <span aria-hidden="true">{numberOf(structure.id)} · </span>
                {structure.label}
              </h3>
              <p className="anatomy-roles">
                {structure.roles.map((role) => roleLabels[role]).join(' · ')}
              </p>
              <dl>
                {structure.fields.map((field) => (
                  <Gate
                    key={field.kind}
                    level={
                      field.minimumLevel === 'medical-student'
                        ? undefined
                        : field.minimumLevel
                    }
                    hint={
                      <div data-kind={field.kind}>
                        <dt>{fieldLabels[field.kind]}</dt>
                        <dd className="depth-hint">
                          {depthHint(field.minimumLevel)}
                        </dd>
                      </div>
                    }
                  >
                    <div data-kind={field.kind}>
                      <dt>{fieldLabels[field.kind]}</dt>
                      <dd>
                        {joinExtracts(field.texts.map((text) => ({ text })))}
                      </dd>
                    </div>
                  </Gate>
                ))}
              </dl>
              {structure.steps.length > 0 && (
                <ul
                  className="anatomy-step-links"
                  aria-label={`Operative steps for ${structure.label}`}
                >
                  {structure.steps.map((item) => (
                    <li key={item.number}>
                      <Link href={item.href}>
                        In the operation: step {item.number} · {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              {sources[structure.id]}
            </>
          ) : step ? (
            <>
              <h3 className="text-lg font-semibold">
                Step {step.number} · {step.label}
              </h3>
              <p className="text-sm text-dissect-muted">
                Structures that matter at this step:
              </p>
              <ul className="anatomy-step-structures">
                {step.structureIds.map((id) => (
                  <li key={id}>
                    <button
                      type="button"
                      onClick={() => choose({ kind: 'structure', id })}
                    >
                      {numberOf(id)} ·{' '}
                      {view.structures.find((item) => item.id === id)!.label}
                    </button>
                  </li>
                ))}
              </ul>
              <p className="anatomy-step-links">
                <Link href={step.href}>
                  Open step {step.number} in the operative walkthrough
                </Link>
              </p>
            </>
          ) : (
            <p className="text-sm text-dissect-muted">
              Select a structure to see what it is, why it matters and the
              operative steps it relates to, or select a step to see its
              structures.
            </p>
          )}
        </div>
        <div className="anatomy-controls">
          <h3 className="eyebrow">Structures</h3>
          <ol className="anatomy-structures">
            {view.structures.map((item, index) => (
              <li key={item.id}>
                <button
                  type="button"
                  aria-pressed={structure?.id === item.id}
                  data-state={stateOf(item.id)}
                  onClick={() => choose({ kind: 'structure', id: item.id })}
                >
                  <span className="anatomy-number" aria-hidden="true">
                    {index + 1}
                  </span>
                  <span>
                    {item.label}
                    <span className="anatomy-roles">
                      {item.roles.map((role) => roleLabels[role]).join(' · ')}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <h3 className="eyebrow mt-4">Operative steps</h3>
          <ol className="anatomy-steps">
            {view.steps.map((item) => (
              <li key={item.number}>
                <button
                  type="button"
                  id={item.anchor}
                  aria-pressed={step?.number === item.number}
                  onClick={() => choose({ kind: 'step', number: item.number })}
                >
                  Step {item.number} · {item.label}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
      {view.notes.texts.length > 0 && (
        <div className="anatomy-note">
          <p>
            <span className="eyebrow">Around the operative field</span>{' '}
            {joinExtracts(view.notes.texts.map((text) => ({ text })))}.
          </p>
          {noteSources}
        </div>
      )}
      <details className="anatomy-text">
        <summary>Structures and steps as text</summary>
        <table>
          <caption className="sr-only">
            Structures in this schematic, their roles and operative steps
          </caption>
          <thead>
            <tr>
              <th scope="col">Structure</th>
              <th scope="col">Role</th>
              <th scope="col">Steps</th>
            </tr>
          </thead>
          <tbody>
            {view.structures.map((item, index) => (
              <tr key={item.id}>
                <th scope="row">
                  {index + 1}. {item.label}
                </th>
                <td>{item.roles.map((role) => roleLabels[role]).join(', ')}</td>
                <td>
                  {item.steps.map((entry) => entry.number).join(', ') || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </section>
  );
}
