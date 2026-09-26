export const MOE_LIST = {
  pageLimit: 100,
  historyStaleMs: 10 * 60 * 1000,
  historyChartHeight: 200,
  rowHeight: 44
} as const;

export const PLAYER_LOOKUP = {
  debounceMs: 300,
  suggestions: 5,
  closestLimit: 8,
  skeletonRows: [0, 1, 2, 3]
} as const;
