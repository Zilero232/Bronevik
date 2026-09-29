export const CLAN_PAGE = {
  numericId: /^\d{1,12}$/,
  recentEvents: 20,
  recentPeriod: 'd30',
  battlesPerDayDays: 7,
  tagSearchLimit: 10,
  defaultRole: 'private'
} as const;
