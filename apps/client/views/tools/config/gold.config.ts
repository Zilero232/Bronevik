export const GOLD = {
  creditsPerGold: 400,
  xpPerGold: 25,
  bundles: [500, 1_250, 2_500, 6_500, 12_500, 25_000],
  goldRange: { min: 0, max: 1_000_000, step: 50 },
  creditsRange: { min: 0, max: 400_000_000, step: 10_000 },
  xpRange: { min: 0, max: 25_000_000, step: 1_000 },
  defaults: { gold: 2_500, credits: 1_000_000, xp: 50_000 }
} as const;
