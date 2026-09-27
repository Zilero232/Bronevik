import type { AnalyticsBattlesQuery, AnalyticsPeriod, AnalyticsQuery, AnalyticsTankQuery, PlaylistQuery, StatLine } from '@otmetki/schemas';

import type { RawTankRow } from './lib';

export type AccountInput = {
  userId: string;
  account?: number;
};

export type AnalyticsInput = AccountInput & AnalyticsQuery;

export type TankAnalyticsInput = AccountInput &
  AnalyticsTankQuery & {
    tankId: number;
  };

export type BattlesInput = AccountInput & AnalyticsBattlesQuery;

export type BattleInput = {
  userId: string;
  id: string;
};

export type PlaylistInput = AccountInput & PlaylistQuery;

export type WindowInput = {
  accountId: bigint;
  from: Date | null;
};

export type TrendInput = WindowInput & {
  granularity: 'month' | 'week';
  tankId?: number;
};

export type PeriodWindow = {
  accountId: bigint;
  period: AnalyticsPeriod;
  from: Date | null;
};

export type TrendRow = RawTankRow & {
  bucket: Date;
};

export type MapRow = RawTankRow & {
  arena_id: string;
  team: number | null;
};

export type MateRow = RawTankRow & {
  mate: bigint;
};

export type TakenInput = {
  accountId: bigint;
  since: Date;
};

export type SessionsInput = {
  window: PeriodWindow;
  totals: StatLine;
};

export type SizedRow = RawTankRow & {
  is_platoon: boolean;
};
