export const PLAY_MODES = ['onslaught', 'frontline', 'ranked', 'steelHunter'] as const;

export const MODE_RANKS = ['S', 'A', 'B', 'C', 'D'] as const;

export const MODE_META = {
  windowDays: 30,
  minBattles: 20,
  hubLeaders: 5,
  myDefaultDays: 30,
  myMaxDays: 90,
  myTanks: 10,
  totalTankId: 0
} as const;
