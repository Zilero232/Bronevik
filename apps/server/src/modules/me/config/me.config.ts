export const GOALS = {
  maxDurationDays: 366
} as const;

export const FAVORITES = {
  maxCount: 200
} as const;

export const NOTIFICATION_DEFAULTS = {
  channels: ['site'],
  events: ['moeGained', 'moeThresholdDropped', 'sessionFinished', 'goalReached'],
  sessionReport: true,
  weeklyDigest: false
} as const;
