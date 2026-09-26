import type { AnalyticsBattlesQuery, AnalyticsQuery, AnalyticsTankQuery, PlaylistQuery } from '@otmetki/schemas';

type SignalInput = {
  signal?: AbortSignal;
};

export type AnalyticsAccountInput = SignalInput & {
  account?: number;
};

export type AnalyticsPeriodInput = SignalInput & AnalyticsQuery;

export type AnalyticsTankInput = SignalInput &
  AnalyticsTankQuery & {
    tankId: number;
  };

export type AnalyticsBattlesInput = SignalInput & AnalyticsBattlesQuery;

export type AnalyticsBattleInput = SignalInput & {
  id: string;
};

export type PlaylistInput = SignalInput & PlaylistQuery;
