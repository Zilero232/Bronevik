export const TANK_STATUSES = ['researchable', 'premium', 'collector', 'reward', 'removed'] as const;

export const TANK_SOURCES = ['techTree', 'inGameShop', 'premiumShop', 'collectorShop', 'clanWars', 'subscription', 'lootboxes', 'reward'] as const;

export const TANK_ROLES = [
  'HT_assault',
  'HT_break',
  'HT_universal',
  'HT_support',
  'MT_universal',
  'MT_sniper',
  'MT_assault',
  'MT_support',
  'LT_universal',
  'LT_wheeled',
  'ATSPG_sniper',
  'ATSPG_assault',
  'ATSPG_support',
  'ATSPG_universal',
  'SPG',
  'SPG_assault',
  'SPG_flame'
] as const;

export const ECONOMY_ACCOUNTS = ['all', 'premium', 'standard'] as const;

export const TANK_ECONOMY = {
  windowDays: 30,
  minDays: 7,
  maxDays: 90,
  accountTanksLimit: 20
} as const;

export const LEARNING_CURVE = {
  bucketStarts: [0, 50, 100, 250],
  windowDays: 90
} as const;

export const LEARNING_DIFFICULTIES = ['easy', 'moderate', 'hard', 'hardcore'] as const;
