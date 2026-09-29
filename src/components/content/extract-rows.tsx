import Link from 'next/link';
import type { ReactNode } from 'react';
import { trainingLevels, type TrainingLevel } from '@/lib/training-level';
import type { ResolvedRow } from '@/lib/topic-pages';
import { LevelContent } from '@/components/topic/topic-depth';

// Display-only capitalisation of a verbatim fragment.
export const sentenceCase = (text: string) =>
  text.charAt(0).toUpperCase() + text.slice(1);
export const joinExtracts = (extracts: { text: string }[]) =>
  extracts.map((extract) => sentenceCase(extract.text)).join(' · ');
export function depthHint(level?: TrainingLevel) {
  const label = trainingLevels.find((entry) => entry.id === level)?.label;
  return label ? `Further detail at ${label} depth` : '';
}
// Level-sensitive content leaves a visible hint rather than vanishing.
export function Gate({
  level,
  hint,
  children,
}: {
  level?: TrainingLevel;
  hint: ReactNode;
  children: ReactNode;
}) {
  return level ? (
    <LevelContent minimumLevel={level} fallback={hint}>
      {children}
    </LevelContent>
  ) : (
    children
  );
}
function RowLink({ row }: { row: ResolvedRow }) {
  return row.href ? (
    <>
      {' '}
      <Link href={row.href} className="row-link">
        {row.linkLabel}
        <span aria-hidden="true"> →</span>
      </Link>
    </>
  ) : null;
}
// Labelled rows of verbatim extracts: run-in labels on narrow containers,
// a label column where there is room.
export function ExtractRows({
  rows,
  numbered,
}: {
  rows: ResolvedRow[];
  numbered?: boolean;
}) {
  return numbered ? (
    <ol className="quick-rows quick-rows-numbered">
      {rows.map((row, index) => (
        <Gate
          key={row.label}
          level={row.minimumLevel}
          hint={<li className="depth-hint">{depthHint(row.minimumLevel)}</li>}
        >
          <li>
            <span className="quick-row-label">
              <span aria-hidden="true">{index + 1} </span>
              {row.label}
            </span>
            <span>
              {joinExtracts(row.extracts)}
              <RowLink row={row} />
            </span>
          </li>
        </Gate>
      ))}
    </ol>
  ) : (
    <dl className="quick-rows">
      {rows.map((row) => (
        <Gate
          key={row.label}
          level={row.minimumLevel}
          hint={
            <div>
              <dt className="quick-row-label">{row.label}</dt>
              <dd className="depth-hint">{depthHint(row.minimumLevel)}</dd>
            </div>
          }
        >
          <div>
            <dt className="quick-row-label">{row.label}</dt>
            <dd>
              {joinExtracts(row.extracts)}
              <RowLink row={row} />
            </dd>
          </div>
        </Gate>
      ))}
    </dl>
  );
}
