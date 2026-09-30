'use client';
import { useState } from 'react';
import type { ResolvedAnatomyView } from '@/lib/topic-pages';
import {
  depthHint,
  Gate,
  joinExtracts,
} from '@/components/content/extract-rows';
import { AnatomyFigure } from './anatomy-figure';
import { roleLabels } from './roles';

// Roles in the order a quick briefing needs them.
const roleOrder = [
  'landmark',
  'controlled',
  'removed',
  'at-risk',
  'bleeding-risk',
  'orientation',
];
const riskRoles = ['at-risk', 'bleeding-risk'];

// A compact, same-data summary of an anatomy view: the drawing, structures
// grouped by role, and a structure's own "what" when selected (its quoted
// risk is already in the page's risk section). The full viewer stays on the
// anatomy page.
export function AnatomyGlance({ view }: { view: ResolvedAnatomyView }) {
  const [selected, setSelected] = useState<string | null>(null);
  const numberOf = (id: string) =>
    view.structures.findIndex((structure) => structure.id === id) + 1;
  const structure = view.structures.find((item) => item.id === selected);
  // Each structure appears once, under its first role in roleOrder; any
  // other roles are listed with it.
  const primary = (roles: readonly string[]) =>
    roleOrder.find((role) => roles.includes(role))!;
  const groups = roleOrder
    .map((role) => ({
      role,
      structures: view.structures.filter(
        (item) => primary(item.roles) === role,
      ),
    }))
    .filter((group) => group.structures.length > 0);
  return (
    <div className="anatomy-glance">
      <AnatomyFigure
        view={view}
        stateOf={(id) =>
          id === selected ? 'selected' : selected ? 'dimmed' : 'normal'
        }
        numberOf={numberOf}
        riskShown={(id) =>
          view.structures
            .find((item) => item.id === id)!
            .roles.some((role) => riskRoles.includes(role))
        }
        onSelect={(id) => setSelected(id === selected ? null : id)}
      />
      <div className="min-w-0">
        <dl className="anatomy-glance-key">
          {groups.map((group) => (
            <div key={group.role}>
              <dt>{roleLabels[group.role]}</dt>
              <dd>
                <ul>
                  {group.structures.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        aria-pressed={selected === item.id}
                        onClick={() =>
                          setSelected(selected === item.id ? null : item.id)
                        }
                      >
                        <span className="anatomy-number" aria-hidden="true">
                          {numberOf(item.id)}
                        </span>
                        {item.label}
                        {item.roles.length > 1 && (
                          <span className="anatomy-glance-also">
                            {item.roles
                              .filter((role) => role !== group.role)
                              .map((role) => roleLabels[role])
                              .join(' · ')}
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
        <div className="anatomy-glance-detail" aria-live="polite">
          {structure &&
            structure.fields
              .filter((field) => field.kind === 'what')
              .map((field, index) => (
                <Gate
                  key={index}
                  level={
                    field.minimumLevel === 'medical-student'
                      ? undefined
                      : field.minimumLevel
                  }
                  hint={
                    <p className="depth-hint">
                      {depthHint(field.minimumLevel)}
                    </p>
                  }
                >
                  <p data-kind={field.kind}>
                    <span className="eyebrow">{structure.label}</span>{' '}
                    {joinExtracts(field.texts.map((text) => ({ text })))}
                  </p>
                </Gate>
              ))}
        </div>
      </div>
    </div>
  );
}
