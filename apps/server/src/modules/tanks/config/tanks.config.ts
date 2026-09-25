import { TOP_PLAYERS_QUERY } from '@bronevik/schemas';

export const TIER_LIST = {
  bands: [
    { rank: 'S', share: 0.05 },
    { rank: 'A', share: 0.15 },
    { rank: 'B', share: 0.3 },
    { rank: 'C', share: 0.3 },
    { rank: 'D', share: 0.15 },
    { rank: 'F', share: 0.05 }
  ],
  trendThreshold: 0.5,
  trendPeriod: 'd30',
  defaultMinBattles: 100
} as const;

export const TOP_PLAYERS = {
  defaultMinBattles: TOP_PLAYERS_QUERY.defaultMinBattles,
  detailLimit: 10
} as const;

export const TANK_PROFILES = {
  stock: 'stock',
  top: 'top'
} as const;

export const TANK_TREND_SQL = {
  timeZone: 'Europe/Moscow'
} as const;
