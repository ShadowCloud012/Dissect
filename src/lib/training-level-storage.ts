import {
  defaultTrainingLevel,
  isTrainingLevel,
  type TrainingLevel,
} from './training-level';

export const trainingLevelStorageKey = 'dissect.training-level';
type StorageReader = Pick<Storage, 'getItem'>;
type StorageWriter = Pick<Storage, 'setItem'>;

export function readTrainingLevel(storage: StorageReader): TrainingLevel {
  const value = storage.getItem(trainingLevelStorageKey);
  return isTrainingLevel(value) ? value : defaultTrainingLevel;
}
export function writeTrainingLevel(
  storage: StorageWriter,
  level: TrainingLevel,
): void {
  storage.setItem(trainingLevelStorageKey, level);
}
