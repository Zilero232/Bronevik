import type { PlayerInsights } from '@bronevik/schemas';

export const hasInsights = ({ tips, byClass, byTier, weakTanks, strongTanks }: PlayerInsights) =>
  [tips, byClass, byTier, weakTanks, strongTanks].some((list) => list.length > 0);
