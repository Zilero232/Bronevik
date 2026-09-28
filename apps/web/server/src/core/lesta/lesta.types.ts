import type { Redis } from 'ioredis';

import type { LestaClient, LestaClientOptions, LestaOutcome } from '../../lib/lesta';

export type LestaClients = {
  priority: LestaClient;
  bulk: LestaClient;
};

export type RecordLestaInput = {
  outcome: LestaOutcome;
};

export type LestaOutcomeRecorder = {
  recordLesta: (input: RecordLestaInput) => void;
};

export type BudgetInput = {
  requestsPerSecond: number;
  reserve: number;
  egress?: string;
};

export type BucketKeys = {
  global: string;
  bulk: string;
};

export type CreateLestaClientsInput = {
  applicationId: string;
  baseUrl?: string;
  redis: Redis;
  budget: BudgetInput;
} & Pick<LestaClientOptions, 'onOutcome'>;
