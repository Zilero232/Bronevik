export const RANK_FIELDS = [
  'global_rating',
  'battles_count',
  'wins_ratio',
  'damage_avg',
  'damage_dealt',
  'frags_avg',
  'frags_count',
  'xp_avg',
  'xp_amount',
  'xp_max',
  'spotted_avg',
  'spotted_count',
  'survived_ratio',
  'hits_ratio',
  'capture_points'
] as const;

export const RANKINGS = {
  minBattles: 500,
  exactCandidates: 1200,
  types: ['1', '7', '28', 'all'],
  thresholds: { '1': 5, '7': 25, '28': 100, all: 500 },
  periodDays: { '1': 1, '7': 7, '28': 28, all: null },
  datesKept: 30,
  cachedDays: 2
} as const;
