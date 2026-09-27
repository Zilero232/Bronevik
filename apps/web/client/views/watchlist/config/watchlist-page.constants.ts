import type { WatchlistDigest } from '@otmetki/schemas';

export const WATCHLIST_PAGE = {
  digestOrder: ['off', 'daily', 'weekly', 'hourly'],
  skeletonHeights: [96, 320],
  iconSize: 14,
  initialSorting: [{ id: 'lastBattle', desc: true }]
} as const satisfies {
  digestOrder: readonly WatchlistDigest[];
  skeletonHeights: readonly number[];
  iconSize: number;
  initialSorting: readonly { id: string; desc: boolean }[];
};
