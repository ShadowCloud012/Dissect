'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import {
  canShowContent,
  defaultTrainingLevel,
  type TrainingLevel,
} from '@/lib/training-level';
import { useTrainingLevel } from '@/components/navigation/use-training-level';
import { Button } from '@/components/ui/button';

const DepthContext = createContext({
  level: defaultTrainingLevel,
  showAdvanced: false,
});
export function TopicDepth({ children }: { children: ReactNode }) {
  const { level } = useTrainingLevel();
  const [showAdvanced, setShowAdvanced] = useState(false);
  return (
    <DepthContext value={{ level, showAdvanced }}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-dissect-border pb-5">
        <p className="max-w-lg text-sm text-dissect-muted">
          Training level changes depth, not factual truth. Higher-level examples
          remain available.
        </p>
        <Button
          aria-pressed={showAdvanced}
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? 'Hide advanced content' : 'Show advanced content'}
        </Button>
      </div>
      {children}
    </DepthContext>
  );
}
export function LevelContent({
  minimumLevel,
  children,
}: {
  minimumLevel: TrainingLevel;
  children: ReactNode;
}) {
  const { level, showAdvanced } = useContext(DepthContext);
  return canShowContent(level, minimumLevel, showAdvanced) ? children : null;
}
