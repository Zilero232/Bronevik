import type { ApiTier, ApiTierLimits } from '@otmetki/schemas';

import { API_TIER_LIMITS } from '@otmetki/schemas';
import { millisecondsInDay } from 'date-fns/constants';

export const API_TIERS: Record<ApiTier, ApiTierLimits> = API_TIER_LIMITS;

export const API_KEY_POLICY = {
  quotaRefillMs: millisecondsInDay,
  tierCacheTtlMs: 300_000,
  tierCacheMaxEntries: 5_000,
  quotaCodes: new Set<string>(['USAGE_EXCEEDED']),
  revokedCodes: new Set<string>(['KEY_DISABLED', 'KEY_EXPIRED'])
} as const;
