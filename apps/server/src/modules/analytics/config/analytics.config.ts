export const ANALYTICS_WINDOW = {
  periodDays: { d30: 30, d90: 90, y1: 365, all: null },
  timeZone: 'Europe/Moscow',
  weekTrendMaxDays: 90,
  sessions: 12,
  minBreakdownBattles: 1
} as const;

export const TILT = {
  sessionGapMinutes: 45,
  maxSteps: 3,
  minStepBattles: 10,
  dropPoints: 5
} as const;

export const MAP_ADVISOR = {
  minMapBattles: 5,
  highlighted: 3,
  weakDeltaPoints: -3,
  strongDeltaPoints: 3
} as const;

export const PLATOON_CHEMISTRY = {
  maxMates: 20
} as const;

export const ANALYTICS_SQL = {
  epoch: new Date(0),
  randomBattleType: '1',
  randomMode: 'random'
} as const;

export const TANK_ANALYTICS = {
  moePoints: 300
} as const;
