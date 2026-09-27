'use client';

import { useState } from 'react';

export function TrainingLevelSelector() {
  const [level, setLevel] = useState('medical-student');
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <label htmlFor="training-level" className="text-dissect-muted">
        Training level
      </label>
      <select
        id="training-level"
        value={level}
        onChange={(event) => setLevel(event.target.value)}
        className="min-h-11 max-w-full rounded-dissect-sm border border-dissect-border bg-dissect-surface px-3 text-sm text-dissect-green-800"
      >
        <option value="medical-student">Medical Student</option>
        <option value="foundation">FY1/2</option>
        <option value="cst">CST</option>
        <option value="registrar">Registrar</option>
      </select>
    </div>
  );
}
