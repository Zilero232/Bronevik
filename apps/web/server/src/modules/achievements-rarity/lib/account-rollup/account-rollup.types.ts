import type { AccountAchievements, Achievement } from '../../../../../generated';

export type AccountRollup = Pick<AccountAchievements, 'completion' | 'held' | 'points'>;

export type AccountRollupInput = {
  counts: Record<string, number>;
  points: ReadonlyMap<string, number>;
  obtainable: ReadonlySet<string>;
};

export type ObtainableRow = Pick<Achievement, 'name' | 'section'>;
