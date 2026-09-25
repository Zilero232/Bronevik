export const TIMESCALE = {
  compressAfterDays: 14,
  snapshotRetentionMonths: 24,
  deltaRetentionMonths: 24,
  dailyStatsRetentionMonths: 0,
  refreshIntervalMinutes: 30
} as const;
