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
    accountFields: [
      'account_id',
      'nickname',
      'clan_id',
      'global_rating',
      'created_at',
      'last_battle_time',
      'updated_at',
      'statistics.all',
      'statistics.random'
    ],
    tankExtra: ['random'],
    tankFields: ['tank_id', 'account_id', 'mark_of_mastery', 'max_frags', 'max_xp', 'all', 'random'],
    marksFields: ['tank_id', 'achievements'],
    marksAchievement: 'marksOnGun'
  },
  lock: {
    scope: 'poll'
  },
  transaction: {
    maxWaitMs: 5_000,
    timeoutMs: 15_000
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
