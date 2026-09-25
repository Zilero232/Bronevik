import type { Goal } from '@bronevik/schemas';

export type GoalItemProps = {
  goal: Goal;
  index: number;
  onRemove: () => void;
};
