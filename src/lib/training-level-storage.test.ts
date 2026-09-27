import { beforeEach, expect, it } from 'vitest';
import {
  readTrainingLevel,
  trainingLevelStorageKey,
  writeTrainingLevel,
} from './training-level-storage';
beforeEach(() => localStorage.clear());
it('defaults missing or invalid storage to Medical Student', () => {
  expect(readTrainingLevel(localStorage)).toBe('medical-student');
  localStorage.setItem(trainingLevelStorageKey, 'unknown');
  expect(readTrainingLevel(localStorage)).toBe('medical-student');
});
it('persists and restores a valid selection', () => {
  writeTrainingLevel(localStorage, 'registrar');
  expect(readTrainingLevel(localStorage)).toBe('registrar');
});
