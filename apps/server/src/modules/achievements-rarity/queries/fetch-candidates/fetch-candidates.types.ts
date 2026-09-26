import type { AccountAchievements } from '../../../../../generated';

export type FetchCandidatesInput = {
  now: Date;
  staleBefore: Date;
  limit: number;
};

export type FetchCandidateRow = Pick<AccountAchievements, 'accountId'>;
