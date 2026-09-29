import { minutesToMilliseconds } from 'date-fns';

export const MOE_LIST = {
  pageLimit: 100,
  historyStaleMs: minutesToMilliseconds(10),
  historyChartHeight: 200,
  rowHeight: 44,
  pinWidth: 40
} as const;

export const PLAYER_LOOKUP = {
  debounceMs: 300,
  suggestions: 5,
  closestLimit: 8,
  skeletonRows: [0, 1, 2, 3]
} as const;
