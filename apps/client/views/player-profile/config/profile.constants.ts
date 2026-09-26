import type { RatingPeriod } from '@bronevik/schemas';

export const PROFILE_TABS = ['overview', 'tanks', 'sessions', 'marks', 'achievements', 'charts', 'insights', 'history'] as const;

export const PROFILE_PERIODS: readonly RatingPeriod[] = ['overall', '1000', '30d', '7d', '24h'];

export const DEFAULT_PERIOD: RatingPeriod = 'overall';

export const SESSIONS = {
  pageSize: 20,
  skeletonHeight: 480
} as const;

export const PROFILE_SKELETON = {
  panels: 4,
  headerHeight: 168,
  tabsHeight: 36,
  panelHeight: 240
} as const;

export const FIGURE_FORMAT = {
  integer: { maximumFractionDigits: 0 },
  percent: { maximumFractionDigits: 2, minimumFractionDigits: 2 }
} as const satisfies Record<string, Intl.NumberFormatOptions>;
