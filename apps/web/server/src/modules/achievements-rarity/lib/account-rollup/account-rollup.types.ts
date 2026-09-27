import type { AccountAchievements } from '../../../../../generated';

export type AccountRollup = Pick<AccountAchievements, 'completion' | 'held' | 'points'>;

export type AccountRollupInput = {
  counts: Record<string, number>;
  points: ReadonlyMap<string, number>;
  obtainable: ReadonlySet<string>;
};
