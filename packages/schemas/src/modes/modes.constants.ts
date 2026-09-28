export const PLAY_MODES = ['onslaught', 'frontline', 'ranked', 'steelHunter'] as const;

export const CAREER_MODES = ['frontline', 'ranked', 'strongholdSkirmish', 'strongholdDefense', 'globalmap'] as const;

export const CAREER_MODE_SOURCES = ['stored', 'live', 'none'] as const;

export const MODE_RANKS = ['S', 'A', 'B', 'C', 'D'] as const;

export const MODE_META = {
  windowDays: 30,
  minBattles: 20,
  hubLeaders: 5,
  myDefaultDays: 30,
  myMaxDays: 90,
  myTanks: 10,
  totalTankId: 0,
  careerTanks: 10
} as const;
