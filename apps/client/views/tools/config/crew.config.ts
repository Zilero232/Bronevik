export const CREW_XP = {
  levelBase: 50,
  levelGrowth: 100,
  maxLevel: 100,
  upcomingSkills: 3,
  bonuses: {
    premium: 1.5,
    accelerated: 2,
    reserve: 3
  },
  skillRange: { min: 1, max: 8, step: 1 },
  percentRange: { min: 0, max: 99, step: 1 },
  xpRange: { min: 0, max: 10_000, step: 10 },
  bookRange: { min: 0, max: 5_000_000, step: 5_000 },
  defaults: { skill: 1, percent: 40, xpPerBattle: 1_000, bookXp: 0 }
} as const;

export const CREW_BONUSES = ['premium', 'accelerated', 'reserve'] as const;

export type CrewBonus = (typeof CREW_BONUSES)[number];
