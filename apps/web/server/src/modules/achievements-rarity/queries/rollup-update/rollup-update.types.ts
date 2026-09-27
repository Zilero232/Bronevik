import type { AccountAchievements } from '../../../../../generated';

export type RollupRow = Pick<AccountAchievements, 'accountId' | 'completion' | 'held' | 'points'>;

export type RollupUpdateInput = {
  rows: readonly RollupRow[];
  computedAt: Date;
};
