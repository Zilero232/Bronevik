import type { GoalProgressInput } from './goal-progress.types';

export const goalProgress = ({ baseline, target, current }: GoalProgressInput): number => {
  if (current === null) {
    return 0;
  }

  if (target === baseline) {
    return current >= target ? 1 : 0;
  }

  return Math.min(1, Math.max(0, (current - baseline) / (target - baseline)));
};
