export const PLUS = {
  checkoutEnabled: false
} as const;

export const PLUS_FEATURES = [
  'history',
  'analytics',
  'mapAdvisor',
  'battleAnalysis',
  'aiCoach',
  'moeTracker',
  'priorityPolling',
  'progression',
  'overlays',
  'cosmetics',
  'analyticsExport',
  'apiLimits',
  'earlyAccess',
  'hangarExtras',
  'privateCompetitions',
  'streamerAlerts'
] as const;

export const PLUS_LIMITS = {
  linkedAccounts: { free: 2, plus: 10 },
  goals: { free: 3, plus: 10 },
  watchedTanks: { free: 10, plus: 300 },
  watchedPlayers: { free: 10, plus: 100 },
  overlays: { free: 2, plus: 20 },
  storedReplays: { free: 50, plus: 1_000 },
  streamerFollows: { free: 3, plus: 200 },
  historyDays: { free: 90, plus: null },
  aiReviews: { free: { per: 'week', count: 1 }, plus: { per: 'day', count: 5 } }
} as const;

export const PLUS_GRACE = {
  pastDueDays: 3,
  overflowReadOnlyDays: 180
} as const;

export const PLUS_TRIAL = {
  days: 7,
  referralDays: 14
} as const;

export const PLUS_STATES = ['none', 'trial', 'active', 'grace', 'expired'] as const;
