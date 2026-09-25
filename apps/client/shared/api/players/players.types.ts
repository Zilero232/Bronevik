import type {
  InsightsPeriod,
  PlayerInsights,
  PlayerTanksQuery,
  PopularPlayersQuery,
  TimeSeriesGranularity,
  TimeSeriesMetric
} from '@bronevik/schemas';

export type { PlayerMarkRow, PlayerMarks } from '@bronevik/schemas';

export type GroupInsight = PlayerInsights['byClass'][number];
export type TankInsight = PlayerInsights['weakTanks'][number];

export type PlayerTanksFilter = Partial<Pick<PlayerTanksQuery, 'minBattles' | 'nations' | 'period' | 'premium' | 'tiers' | 'types'>>;

export type AccountInput = {
  accountId: number;
  signal?: AbortSignal;
};

export type PlayerLookupInput = {
  idOrNick: string;
  signal?: AbortSignal;
};

export type PlayerTanksInput = AccountInput & {
  filter?: PlayerTanksFilter;
};

export type PlayerHistoryInput = AccountInput & {
  metric: TimeSeriesMetric;
  granularity: TimeSeriesGranularity;
};

export type PlayerActivityInput = AccountInput & {
  days: number;
};

export type PlayerSessionsInput = AccountInput & {
  limit: number;
  offset: number;
};

export type PlayerSessionInput = AccountInput & {
  sessionId: string;
};

export type PlayerInsightsInput = AccountInput & {
  period: InsightsPeriod;
};

export type PopularPlayersInput = Partial<PopularPlayersQuery> & {
  signal?: AbortSignal;
};
