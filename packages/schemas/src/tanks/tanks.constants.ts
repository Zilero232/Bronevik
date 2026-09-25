export const TOP_PLAYERS_QUERY = {
  defaultLimit: 25,
  maxLimit: 100,
  defaultMinBattles: 30
} as const;

export const TANK_TREND = {
  defaultDays: 60,
  maxDays: 365,
  minDays: 7
} as const;

export const PATCH_VERDICTS = ['new', 'buff', 'nerf', 'mixed', 'changed'] as const;
