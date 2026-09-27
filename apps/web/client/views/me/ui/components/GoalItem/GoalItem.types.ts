import type { Goal } from '@otmetki/schemas';

export type GoalItemProps = {
  goal: Goal;
  index: number;
  onRemove: () => void;
};
