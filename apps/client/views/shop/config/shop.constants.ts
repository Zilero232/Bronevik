export const SHOP = {
  tabs: ['current', 'history', 'returns'],
  pageSize: 24,
  staleMs: 5 * 60_000,
  skeletons: 4,
  soonDays: 14,
  outlookTone: { unknown: 'neutral', overdue: 'warning', soon: 'success', later: 'steel' }
} as const;

export const SHOP_CALENDAR = {
  isoLocale: 'en-CA',
  midnightSuffix: 'T00:00:00Z',
  msPerDay: 86_400_000
} as const;
