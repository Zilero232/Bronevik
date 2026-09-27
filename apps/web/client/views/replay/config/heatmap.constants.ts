export const HEATMAP_VIEW = {
  levels: 6,
  allMode: 'all',
  allScope: 'all',
  staleMs: 5 * 60_000,
  gridDivisions: 10
} as const;

export const HEATMAP_SCOPES = ['all', 'lightTank', 'mediumTank', 'heavyTank', 'atSpg', 'spg'] as const;

export const HEATMAP_SCOPE_CLASS = {
  lightTank: 'lightTank',
  mediumTank: 'mediumTank',
  heavyTank: 'heavyTank',
  atSpg: 'AT-SPG',
  spg: 'SPG'
} as const;
