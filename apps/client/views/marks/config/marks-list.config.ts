export const MOE_LIST = {
  pageLimit: 100,
  historyStaleMs: 10 * 60 * 1000,
  sparkPoints: 30,
  sparkDays: 30,
  sparkWidth: 92,
  sparkHeight: 26,
  sparkTone: { up: 'bad', down: 'good', flat: 'steel' },
  historyChartHeight: 240,
  rowHeight: 56
} as const;

export const PLAYER_LOOKUP = {
  debounceMs: 300,
  suggestions: 5,
  closestLimit: 10
} as const;
