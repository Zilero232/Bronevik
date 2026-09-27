import type { LevelProgress, LevelProgressInput } from './level-progress.types';

export const levelProgress = ({ current, start, next }: LevelProgressInput): LevelProgress => {
  if (next === null || next <= start) {
    return { value: 1, max: 1, isMax: true };
  }

  return { value: Math.min(Math.max(current - start, 0), next - start), max: next - start, isMax: false };
};
