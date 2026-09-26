import type { PlaylistReason } from '@otmetki/schemas';

import type { BadgeTone } from '@/ui-kit';

export const ANALYTICS_VIEW = {
  defaultPeriod: 'd90',
  chartHeight: 200,
  skeletonHeight: 320,
  battlesPageSize: 25,
  seedMax: 1_000_000,
  retryAttempts: 1,
  percentScale: 100,
  labelPrecision: 10,
  weekdayAnchor: Date.UTC(1970, 0, 4),
  weekdayOrder: [1, 2, 3, 4, 5, 6, 0],
  breakdownDimensions: ['byTier', 'byClass', 'byNation']
} as const;

export const PLAYLIST_REASON_TONE = {
  closeToMark: 'accent',
  firstWin: 'success',
  longUnplayed: 'steel',
  lowWinRate: 'warning',
  mission: 'premium'
} as const satisfies Record<PlaylistReason, BadgeTone>;
