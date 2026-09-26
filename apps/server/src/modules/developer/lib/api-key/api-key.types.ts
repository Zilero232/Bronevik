import type { ApiTier } from '@otmetki/schemas';

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

export type TierQuota = {
  refillAmount: number;
  refillInterval: number;
  metadata: { tier: ApiTier };
};

export type RebasedRemainingInput = {
  tier: ApiTier;
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
