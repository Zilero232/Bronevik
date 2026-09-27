import type { DeletionSource, DeletionStatus, TrackingTier } from '../../../../generated';

export const ACHIEVEMENTS_FETCH = {
  batch: 1000,
  refreshDays: 7,
  backfillRuns: 50,
  tiers: ['active', 'population'] satisfies TrackingTier[],
  blockingSources: ['user', 'lesta'] satisfies DeletionSource[],
  blockingStatuses: ['pending', 'processing', 'completed'] satisfies DeletionStatus[]
} as const;
