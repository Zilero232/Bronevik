import type { Request } from 'express';

import type { AuthenticatedApiKey } from '../developer';
import type { UsageCounters } from './lib';

export type ApiRequest = Request & {
  apiKey?: AuthenticatedApiKey;
};

export type RecordUsageInput = {
  keyId: string;
  endpoint: string;
  latencyMs: number;
  failed: boolean;
};

export type RecordThrottledInput = {
  keyId: string;
  endpoint: string;
};

export type LogErrorInput = {
  keyId: string;
  method: string;
  path: string;
  status: number;
  code: string | null;
  message: string | null;
};

export type SecondBudget = {
  limit: number;
  remaining: number;
};

export type AddUsageInput = {
  keyId: string;
  endpoint: string;
  counters: UsageCounters;
};

export type UsageBufferEntry = AddUsageInput & {
  day: string;
};
