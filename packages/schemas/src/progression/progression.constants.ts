export const TANK_LEVELS = {
  max: 25,
  firstStepXp: 100,
  stepGrowthXp: 40
} as const;

export const TANK_CHALLENGE_METRICS = ['damageBattles', 'wins', 'spotted', 'frags', 'blocked', 'survived', 'moeBattles', 'battles'] as const;

export const TANK_CHALLENGES = {
  perTank: 3,
  maxTanksPerWeek: 5
} as const;

export const PROGRESSION_REWARDS = {
  challengeShells: 25,
  challengePoints: 100,
  levelShells: 10,
  levelPoints: 30,
  maxLevelShells: 100
} as const;

export const SHELL_REASONS = ['challenge', 'level', 'season', 'purchase'] as const;

export const SEASON = {
  monthsPerSeason: 3,
  codePattern: /^(\d{4})-q([1-4])$/u
} as const;

export const SEASON_TRACK = {
  pointsPerLevel: 300,
  maxLevel: 30,
  rewards: [
    { level: 2, kind: 'shells', amount: 40 },
    { level: 5, kind: 'cosmetic', slot: 'badge', grade: 'bronze' },
    { level: 8, kind: 'shells', amount: 80 },
    { level: 12, kind: 'cosmetic', slot: 'frame', grade: 'silver' },
    { level: 16, kind: 'shells', amount: 120 },
    { level: 20, kind: 'cosmetic', slot: 'banner', grade: 'gold' },
    { level: 25, kind: 'shells', amount: 200 },
    { level: 30, kind: 'cosmetic', slot: 'badge', grade: 'gold' }
  ]
} as const;

export const SEASON_HISTORY = {
  limit: 12
} as const;
