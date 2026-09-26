import type { ApiPlan } from '@bronevik/schemas';

export type ApiKeyRow = {
  id: string;
  name: string | null;
  start: string | null;
  enabled: boolean;
  metadata: unknown;
  createdAt: Date;
  updatedAt: Date;
  lastRequest: Date | null;
  expiresAt: Date | null;
};

export type PlanQuota = {
  refillAmount: number;
  refillInterval: number;
  metadata: { plan: ApiPlan };
};

export type RebasedRemainingInput = {
  plan: ApiPlan;
  remaining: number | null;
  refillAmount: number | null;
};

export type VerifyFailure = 'invalid' | 'quota' | 'revoked';

export type QuotaRetryAfterInput = {
  lastRefillAt: Date | null;
  createdAt: Date;
  refillInterval: number | null;
  now: Date;
};
