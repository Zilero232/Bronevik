export const MOCK_MEDALS = {
  warrior: { frags: 6 },
  scout: { spotted: 9 },
  steelwall: { blocked: 1000, hitsReceived: 11 },
  invader: { capture: 80 },
  defender: { dropped: 70 },
  mainGun: { minDamage: 1000, hpFactor: 3 },
  evileye: { radio: 2500 },
  radleyWalters: { frags: 8, minTier: 5 },
  lafayettePool: { frags: 10 },
  kolobanov: { frags: 5, chance: 0.08 },
  orlik: { frags: 3, chance: 0.2 },
  billotte: { frags: 2, receivedShare: 0.8, chance: 0.3 },
  crucial: { frags: 3, chance: 0.05 }
} as const;

export const MOCK_SHOTS = {
  maxShots: 200,
  rollDeviation: 0.11,
  spread: 0.25,
  premiumPierceShare: 0.2,
  distance: {
    SPG: [280, 720],
    'AT-SPG': [120, 520],
    heavyTank: [40, 360],
    mediumTank: [90, 460],
    lightTank: [110, 470]
  },
  shells: {
    ARMOR_PIERCING: 'armor_piercing',
    ARMOR_PIERCING_CR: 'armor_piercing_cr',
    HOLLOW_CHARGE: 'hollow_charge',
    HIGH_EXPLOSIVE: 'high_explosive'
  }
} as const;

export const MOCK_QUEUE = {
  tierBaseSec: [30, 42, 38, 34, 26, 24, 22, 20, 17, 19, 12, 38],
  hourFactor: [1.5, 1.8, 2.3, 2.8, 3.1, 3.2, 2.9, 2.4, 1.9, 1.6, 1.4, 1.3, 1.2, 1.2, 1.15, 1.1, 1, 0.95, 0.85, 0.75, 0.7, 0.72, 0.85, 1.1],
  modeFactor: { random: 1, ranked: 2.2, frontline: 1.5, comp7: 2.6 },
  sigma: 0.35,
  minSec: 3,
  maxSec: 900
} as const;

export const MOCK_ARENA_WEIGHT = {
  floor: 0.3,
  tierBands: [3, 7]
} as const;
