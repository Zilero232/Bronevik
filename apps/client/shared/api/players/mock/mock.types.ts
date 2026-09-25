import type { RatingScale } from '@bronevik/ratings';
import type { InsightsPeriod, PlayerTankRow, TimeSeriesGranularity, TimeSeriesMetric } from '@bronevik/schemas';

import type { MockPlayer } from '@/shared/mocks';

import type { PlayerTanksFilter } from '../players.types';

export type MockRatingInput = {
  scale: RatingScale;
  value: number;
};

export type MockStatsInput = {
  battles: number;
  winRate: number;
  avgDamage: number;
  wn8: number;
  broneIndex: number;
  random: () => number;
};

export type SynthesizeInput = {
  id: number;
  nickname: string;
};

export type RowOfInput = {
  player: MockPlayer;
  index: number;
};

export type MatchesFilterInput = {
  row: PlayerTankRow;
  filter: PlayerTanksFilter;
};

export type MockTanksInput = {
  accountId: number;
  filter?: PlayerTanksFilter;
};

export type MockHistoryInput = {
  accountId: number;
  metric: TimeSeriesMetric;
  granularity: TimeSeriesGranularity;
};

export type MockActivityInput = {
  accountId: number;
  days: number;
};

export type MockSessionInput = {
  accountId: number;
  sessionId: string;
};

export type MockSessionsInput = {
  accountId: number;
  limit: number;
  offset: number;
};

export type MockInsightsInput = {
  accountId: number;
  period: InsightsPeriod;
};

export type MockPopularInput = {
  days: number;
  limit: number;
};

export type SessionSeedInput = {
  player: MockPlayer;
  random: () => number;
  count: number;
  startedAt: string;
};

export type SessionOfInput = {
  player: MockPlayer;
  offset: number;
};
