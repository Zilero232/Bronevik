import type { ApiKey, ApiPlan } from '@bronevik/schemas';

import { apiPlanSchema } from '@bronevik/schemas';
import { addMilliseconds, differenceInSeconds } from 'date-fns';
import { z } from 'zod';

import type { ApiKeyRow, PlanQuota, QuotaRetryAfterInput, RebasedRemainingInput, VerifyFailure } from './api-key.types';

import { toIso } from '../../../../common/lib';
import { API_KEY_PLUGIN } from '../../../../lib/auth';
import { API_KEY_POLICY, API_PLANS } from '../../config';

const keyMetadataSchema = z.object({ plan: apiPlanSchema });

const parseJson = (value: string): unknown => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

export const keyPlanOf = (metadata: unknown): ApiPlan | null => {
  const parsed = keyMetadataSchema.safeParse(typeof metadata === 'string' ? parseJson(metadata) : metadata);

  return parsed.success ? parsed.data.plan : null;
};

export const planQuota = (plan: ApiPlan): PlanQuota => ({
  refillAmount: API_PLANS[plan].requestsPerDay,
  refillInterval: API_KEY_POLICY.quotaRefillMs,
  metadata: { plan }
});

export const rebasedRemaining = ({ plan, remaining, refillAmount }: RebasedRemainingInput): number => {
  const limit = API_PLANS[plan].requestsPerDay;

  if (remaining === null || refillAmount === null) {
    return limit;
  }

  return Math.max(0, limit - Math.max(0, refillAmount - remaining));
};

export const toApiKey = (row: ApiKeyRow): ApiKey => ({
  id: row.id,
  name: row.name ?? '',
  prefix: (row.start ?? '').slice(API_KEY_PLUGIN.prefix.length),
  plan: keyPlanOf(row.metadata) ?? 'free',
  scopes: [],
  createdAt: row.createdAt.toISOString(),
  lastUsedAt: toIso(row.lastRequest),
  expiresAt: toIso(row.expiresAt),
  revokedAt: row.enabled ? null : row.updatedAt.toISOString()
});

export const verifyFailureOf = (code: string | undefined): VerifyFailure => {
  if (API_KEY_POLICY.quotaCodes.has(code ?? '')) {
    return 'quota';
  }

  return API_KEY_POLICY.revokedCodes.has(code ?? '') ? 'revoked' : 'invalid';
};

export const quotaRetryAfterSec = ({ lastRefillAt, createdAt, refillInterval, now }: QuotaRetryAfterInput): number => {
  const refillAt = addMilliseconds(lastRefillAt ?? createdAt, refillInterval ?? API_KEY_POLICY.quotaRefillMs);

  return Math.max(1, differenceInSeconds(refillAt, now, { roundingMethod: 'ceil' }));
};
