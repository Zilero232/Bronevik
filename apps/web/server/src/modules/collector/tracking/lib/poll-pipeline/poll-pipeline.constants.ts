import { WORKER_CONCURRENCY } from '../../../config';

export const POLL_PIPELINE = {
  accountConcurrency: WORKER_CONCURRENCY.accountsPerJob,
  marksTiers: ['active']
} as const;
