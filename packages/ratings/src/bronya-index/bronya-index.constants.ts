export const BRONYA_INDEX = {
  scale: 10_000,
  neutralScore: 0.5,
  priorBattles: 20,
  quantileLevels: [0.05, 0.1, 0.25, 0.5, 0.75, 0.9, 0.95, 0.99],
  weights: {
    damage: 0.45,
    winRate: 0.2,
    frags: 0.15,
    spotted: 0.1,
    defence: 0.1
  }
} as const;

export const BRONYA_COMPONENTS = ['damage', 'winRate', 'frags', 'spotted', 'defence'] as const;
