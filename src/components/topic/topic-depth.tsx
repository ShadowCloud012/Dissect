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
  children,
}: {
  minimumLevel: TrainingLevel;
  // A direct link to this anchor reveals it even above the selected depth.
  anchorId?: string;
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
  if (!linked) return null;
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
