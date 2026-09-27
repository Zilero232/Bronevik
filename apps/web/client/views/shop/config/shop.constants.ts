export const SHOP = {
  tabs: ['current', 'history', 'returns'],
  pageSize: 24,
  staleMs: 5 * 60_000,
  skeletons: 4,
  soonDays: 14,
  outlookTone: { unknown: 'neutral', overdue: 'warning', soon: 'success', later: 'steel' }
} as const;
