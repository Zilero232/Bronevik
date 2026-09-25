import type { Redis } from 'ioredis';

import type { LestaClient, LestaFetch, LestaOutcome } from '../../lib/lesta';

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

export type MeteredFetchInput = {
  fetch: LestaFetch;
  record: (outcome: LestaOutcome) => void;
};

export type BudgetInput = {
  requestsPerSecond: number;
  reserve: number;
};

export type CreateLestaClientsInput = {
  applicationId: string;
  redis: Redis;
  budget: BudgetInput;
  fetch?: LestaFetch;
};
