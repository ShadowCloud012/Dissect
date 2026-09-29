'use client';

import { useId } from 'react';
import { isTrainingLevel, trainingLevels } from '@/lib/training-level';
import { useTrainingLevel } from './use-training-level';

export function TrainingLevelSelector() {
  const { level, setLevel } = useTrainingLevel();
  const id = useId();
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <label htmlFor={id} className="sr-only text-dissect-muted sm:not-sr-only">
        {/* Visually hidden on narrow screens; still the select's name. */}
        Training level
      </label>
      <select
        id={id}
        value={level}
        onChange={(event) => {
          if (isTrainingLevel(event.target.value)) setLevel(event.target.value);
        }}
        className="min-h-11 max-w-full rounded-dissect-sm border border-dissect-border bg-dissect-surface px-1.5 text-xs text-dissect-green-800 sm:px-3 sm:text-sm"
      >
        {trainingLevels.map(({ id, label }) => (
          <option key={id} value={id}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
