export const CODES = {
  tabs: ['active', 'expired'],
  staleMs: 60_000,
  skeletons: 4,
  verdicts: ['working', 'expired'],
  statusTone: { working: 'success', unknown: 'neutral', expired: 'danger' },
  expiringDays: 7,
  freshDays: 3,
  clockMs: 60_000
} as const;
