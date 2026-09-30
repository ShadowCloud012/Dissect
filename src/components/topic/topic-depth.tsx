'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import {
  canShowContent,
  defaultTrainingLevel,
  trainingLevels,
  type TrainingLevel,
} from '@/lib/training-level';
import { useTrainingLevel } from '@/components/navigation/use-training-level';
import { Button } from '@/components/ui/button';

const DepthContext = createContext({
  level: defaultTrainingLevel,
  showAdvanced: false,
});
export function TopicDepth({
  children,
  showControls = true,
}: {
  children: ReactNode;
  // Pages without level-gated content can omit the toolbar.
  showControls?: boolean;
}) {
  const { level } = useTrainingLevel();
  const [showAdvanced, setShowAdvanced] = useState(false);
  return (
    <DepthContext value={{ level, showAdvanced }}>
      {showControls && (
        <div className="depth-toolbar">
          <p className="text-sm text-dissect-muted">
            Training level changes depth, not factual truth.
          </p>
          <Button
            aria-pressed={showAdvanced}
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Hide advanced content' : 'Show advanced content'}
          </Button>
        </div>
      )}
      {children}
    </DepthContext>
  );
}
// One line naming the rows above the reader's depth, instead of one hint row
// each, so a dense briefing stays scannable without hiding what exists.
export function HiddenAtDepth({
  rows,
}: {
  rows: { label: string; level: TrainingLevel }[];
}) {
  const { level, showAdvanced } = useContext(DepthContext);
  const hidden = rows.filter(
    (row) => !canShowContent(level, row.level, showAdvanced),
  );
  if (hidden.length === 0) return null;
  const byLevel = trainingLevels
    .map((entry) => ({
      label: entry.label,
      rows: hidden.filter((row) => row.level === entry.id),
    }))
    .filter((group) => group.rows.length > 0);
  return (
    <p className="depth-summary">
      {byLevel.map((group, index) => (
        <span key={group.label}>
          {index > 0 && ' · '}
          Also at {group.label} depth:{' '}
          {group.rows.map((row) => row.label).join(', ')}
        </span>
      ))}
    </p>
  );
}
export function TrainingLevelSummary() {
  const { level } = useTrainingLevel();
  return (
    <p className="text-sm text-dissect-muted">
      Current depth:{' '}
      <span className="font-medium text-dissect-ink">
        {trainingLevels.find((entry) => entry.id === level)!.label}
      </span>
      . Change this in the header or reveal advanced content.
    </p>
  );
}
function subscribeToHash(callback: () => void) {
  window.addEventListener('hashchange', callback);
  window.addEventListener('popstate', callback);
  return () => {
    window.removeEventListener('hashchange', callback);
    window.removeEventListener('popstate', callback);
  };
}
function useHash() {
  return useSyncExternalStore(
    subscribeToHash,
    () => window.location.hash,
    () => '',
  );
}
export function LevelContent({
  minimumLevel,
  anchorId,
  fallback = null,
  children,
}: {
  minimumLevel: TrainingLevel;
  // A direct link to this anchor reveals it even above the selected depth.
  anchorId?: string;
  // Shown instead when the content is above the selected depth.
  fallback?: ReactNode;
  children: ReactNode;
}) {
  const { level, showAdvanced } = useContext(DepthContext);
  const hash = useHash();
  const allowed = canShowContent(level, minimumLevel, showAdvanced);
  const linked = !allowed && !!anchorId && hash === `#${anchorId}`;
  useEffect(() => {
    if (linked) document.getElementById(anchorId!)?.scrollIntoView();
  }, [linked, anchorId]);
  if (allowed) return children;
  if (!linked) return fallback;
  return (
    <div className="linked-depth">
      <p className="eyebrow">
        Shown from a direct link · above your selected depth (
        {trainingLevels.find((entry) => entry.id === minimumLevel)!.label})
      </p>
      {children}
    </div>
  );
}
