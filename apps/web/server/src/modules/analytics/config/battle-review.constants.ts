export const BATTLE_REVIEW = {
  referenceBattles: 100,
  minReferenceBattles: 5,
  lowShare: 0.5,
  earlyDeathShare: 0.33,
  minSpottedReference: 1,
  minAssistReference: 300,
  minShotsForAccuracy: 5,
  lowHitRate: 55,
  minHitsForPenetration: 4,
  lowPenRate: 50,
  meter: 'battleAnalysis'
} as const;

export const HONEST_RNG_WINDOW = {
  minRatio: 0.5,
  maxRatio: 1.5,
  excludedShells: ['high_explosive', 'unknown'],
  distanceEdges: [0, 100, 200, 300, 400]
} as const;

export const STORED_SHOT = {
  shells: ['armor_piercing', 'armor_piercing_cr', 'hollow_charge', 'high_explosive', 'unknown'],
  outcomes: ['damage', 'no_damage', 'miss']
} as const;
