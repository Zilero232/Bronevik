export const RARITY_POINTS = {
  min: 10,
  max: 1000,
  exponent: 0.5
} as const;

export const RARITY_TIERS = [
  { tier: 'legendary', below: 0.01 },
  { tier: 'epic', below: 0.05 },
  { tier: 'rare', below: 0.2 },
  { tier: 'uncommon', below: 0.5 }
] as const;

export const RARITY_TIER_NAMES = ['legendary', 'epic', 'rare', 'uncommon', 'common'] as const;
