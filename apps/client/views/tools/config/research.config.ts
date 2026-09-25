export const RESEARCH_COSTS: Readonly<Record<number, { xp: number; credits: number }>> = {
  1: { xp: 0, credits: 0 },
  2: { xp: 300, credits: 3_500 },
  3: { xp: 1_300, credits: 42_000 },
  4: { xp: 3_600, credits: 130_000 },
  5: { xp: 9_500, credits: 370_000 },
  6: { xp: 19_500, credits: 925_000 },
  7: { xp: 36_000, credits: 1_380_000 },
  8: { xp: 62_000, credits: 2_450_000 },
  9: { xp: 110_000, credits: 3_500_000 },
  10: { xp: 185_000, credits: 6_100_000 }
};

export const RESEARCH = {
  premiumBonus: 0.5,
  defaults: {
    currentXp: 12_000,
    freeXp: 5_000,
    credits: 1_200_000,
    xpPerBattle: 1_100,
    creditsPerBattle: 28_000,
    battlesPerDay: 15
  },
  ranges: {
    xp: { min: 0, max: 1_000_000, step: 100 },
    credits: { min: 0, max: 100_000_000, step: 1_000 },
    xpPerBattle: { min: 0, max: 5_000, step: 10 },
    creditsPerBattle: { min: 0, max: 200_000, step: 500 },
    battlesPerDay: { min: 1, max: 100, step: 1 }
  }
} as const;
