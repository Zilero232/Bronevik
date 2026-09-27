import type { SeasonReward } from '@otmetki/schemas';

import { SEASON_TRACK, seasonalCosmeticCode } from '@otmetki/schemas';

import type { SeasonRewardsInput, TrackReward } from './season-rewards.types';

export const trackRewards = (season: string): TrackReward[] =>
  SEASON_TRACK.rewards.map((reward) =>
    reward.kind === 'shells'
      ? { kind: 'shells', level: reward.level, amount: reward.amount }
      : { kind: 'cosmetic', level: reward.level, code: seasonalCosmeticCode({ season, slot: reward.slot, grade: reward.grade }) }
  );

export const earnedRewards = ({ season, level }: SeasonRewardsInput): TrackReward[] => trackRewards(season).filter((reward) => reward.level <= level);

export const seasonRewardViews = ({ season, level }: SeasonRewardsInput): SeasonReward[] =>
  trackRewards(season).map((reward) => ({ ...reward, isClaimed: reward.level <= level }));
