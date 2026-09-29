export const STRONGHOLD_FETCH = {
  levelKeys: ['stronghold_level', 'level']
} as const;

export const STRONGHOLD = {
  tiers: [6, 8, 10],
  totalKey: (tier: number) => `total_${tier}`,
  winKey: (tier: number) => `win_${tier}`
} as const;
