export const REPLAY_TAGS = ['kolobanov', 'comeback', 'raider', 'highCaliber', 'warrior'] as const;

export const REPLAY_TAG_RULES = {
  kolobanov: { minEnemiesAlive: 5 },
  comeback: { minDeficit: 4 },
  raider: { minCapturePoints: 50 },
  highCaliber: { minShareOfEnemyHealth: 0.2 },
  warrior: { minFrags: 6 }
} as const;

export const REPLAY_MASTERY_LEVELS = [1, 2, 3, 4] as const;
