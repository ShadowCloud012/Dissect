export const trainingLevels = [
  { id: 'medical-student', label: 'Medical Student', rank: 0 },
  { id: 'foundation', label: 'FY1/2', rank: 1 },
  { id: 'cst', label: 'CST', rank: 2 },
  { id: 'registrar', label: 'Registrar', rank: 3 },
] as const;

export type TrainingLevel = (typeof trainingLevels)[number]['id'];
export const defaultTrainingLevel: TrainingLevel = trainingLevels[0].id;
export function isTrainingLevel(value: unknown): value is TrainingLevel {
  return trainingLevels.some((level) => level.id === value);
}
export function trainingLevelRank(level: TrainingLevel): number {
  return trainingLevels.find((entry) => entry.id === level)!.rank;
}
export function canShowContent(
  selected: TrainingLevel,
  minimum: TrainingLevel,
  showAdvanced = false,
): boolean {
  return (
    showAdvanced || trainingLevelRank(selected) >= trainingLevelRank(minimum)
  );
}
