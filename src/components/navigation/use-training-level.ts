'use client';

import { useSyncExternalStore } from 'react';
import { defaultTrainingLevel, type TrainingLevel } from '@/lib/training-level';
import {
  readTrainingLevel,
  writeTrainingLevel,
} from '@/lib/training-level-storage';

const changeEvent = 'dissect:training-level';
let memoryLevel = defaultTrainingLevel;
let storageWriteFailed = false;
function subscribe(callback: () => void) {
  window.addEventListener(changeEvent, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(changeEvent, callback);
    window.removeEventListener('storage', callback);
  };
}
function getSnapshot() {
  if (storageWriteFailed) return memoryLevel;
  try {
    return readTrainingLevel(window.localStorage);
  } catch {
    return memoryLevel;
  }
}
function getServerSnapshot() {
  return defaultTrainingLevel;
}
function setLevel(level: TrainingLevel) {
  memoryLevel = level;
  try {
    writeTrainingLevel(window.localStorage, level);
    storageWriteFailed = false;
  } catch {
    storageWriteFailed = true; /* Restricted storage still permits in-memory selection. */
  }
  window.dispatchEvent(new Event(changeEvent));
}
export function useTrainingLevel() {
  const level = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { level, setLevel };
}
