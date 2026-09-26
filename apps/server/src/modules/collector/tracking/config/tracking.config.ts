export const TRACKING = {
  dispatch: {
    maxActivePerTick: 5000,
    sweepPageSize: 5000,
    sweepMinAgeHours: 20,
    addBulkChunk: 1000,
    dormantPriority: 10
  },
  intervals: {
    activeMinutes: 15,
    subscriberMinutes: 5,
    populationHours: 24,
    dormantDays: 7
  },
  lesta: {
    accountExtra: ['statistics.random'],
    tankExtra: ['random'],
    marksFields: ['tank_id', 'achievements'],
    marksAchievement: 'marksOnGun'
  },
  ratingsDebounceMs: 30_000,
  seed: {
    ratingTypes: ['all'],
    rankFields: ['global_rating', 'battles_count', 'wins_ratio'],
    ratingsLimit: 1000,
    clanPages: 50,
    clanPageLimit: 100
  }
} as const;
