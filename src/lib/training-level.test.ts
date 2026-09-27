import { expect, it } from 'vitest';
import {
  canShowContent,
  trainingLevelRank,
  trainingLevels,
} from './training-level';
it('orders training depth and includes lower/equal levels or explicitly revealed content', () => {
  for (const selected of trainingLevels)
    for (const minimum of trainingLevels) {
      expect(trainingLevelRank(selected.id)).toBe(selected.rank);
      expect(canShowContent(selected.id, minimum.id)).toBe(
        selected.rank >= minimum.rank,
      );
      expect(canShowContent(selected.id, minimum.id, true)).toBe(true);
    }
});
