import type { DeletionSource, DeletionStatus } from '../../../../../generated';

export const PURGE = {
  blockingSources: ['user', 'lesta'] satisfies DeletionSource[],
  blockingStatuses: ['pending', 'processing', 'completed'] satisfies DeletionStatus[],
  dispatchBatch: 50
} as const;
