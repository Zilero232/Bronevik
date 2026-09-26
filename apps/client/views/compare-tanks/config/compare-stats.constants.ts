import type { TankServerStatsRow } from '@bronevik/schemas';

export const COMPARE_STATS = ['winRate', 'winRateDiff', 'avgDamage', 'battles'] as const;

export type CompareStatKey = (typeof COMPARE_STATS)[number];

export const COMPARE_STAT_VALUE: Record<CompareStatKey, (row: TankServerStatsRow) => number> = {
  winRate: ({ winRate }) => winRate,
  winRateDiff: ({ winRateDiff }) => winRateDiff,
  avgDamage: ({ avgDamage }) => avgDamage,
  battles: ({ battles }) => battles
};

export const COMPARE_STAT_FORMAT: Record<CompareStatKey, Intl.NumberFormatOptions> = {
  winRate: { minimumFractionDigits: 2, maximumFractionDigits: 2 },
  winRateDiff: { signDisplay: 'exceptZero', minimumFractionDigits: 2, maximumFractionDigits: 2 },
  avgDamage: { maximumFractionDigits: 0 },
  battles: { notation: 'compact', maximumFractionDigits: 1 }
};
