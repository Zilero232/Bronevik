import type { AuthService } from '@thallesp/nestjs-better-auth';

import { API_KEY } from '@otmetki/schemas';
import { describe, expect, it, vi } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { ApiKey } from '../../../../../generated';
import type { PrismaService } from '../../../../core';
import type { OtmetkiAuth } from '../../../../lib/auth';

import { API_KEY_PLUGIN } from '../../../../lib/auth';
import { API_PLANS } from '../../config';
import { ApiKeysService } from '../api-keys.service';
import { DeveloperPlanService } from '../developer-plan.service';

const keyRow = (overrides: Partial<ApiKey> = {}): ApiKey => ({
  id: '00000000-0000-4000-8000-000000000001',
  configId: 'default',
  referenceId: 'user',
  name: 'bot',
  start: `${API_KEY_PLUGIN.prefix}AbCdEfGh`,
  prefix: API_KEY_PLUGIN.prefix,
  key: 'hashed',
  permissions: null,
  metadata: JSON.stringify({ plan: 'free' }),
  enabled: true,
  rateLimitEnabled: false,
  rateLimitTimeWindow: null,
  rateLimitMax: null,
  requestCount: 0,
  remaining: API_PLANS.free.requestsPerDay,
  refillInterval: 86_400_000,
  refillAmount: API_PLANS.free.requestsPerDay,
  lastRefillAt: null,
  lastRequest: null,
  expiresAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides
});

const createService = () => {
  const prisma = mockDeep<PrismaService>();
  const plans = mock<DeveloperPlanService>();
  const auth = mockDeep<AuthService<OtmetkiAuth>>();

  plans.planFor.mockResolvedValue('free');
  plans.cachedPlanFor.mockResolvedValue('free');

  return { service: new ApiKeysService(prisma, plans, auth), prisma, plans, auth };
};

const verified = (overrides: Partial<ApiKey> = {}) => {
  const { key: _hash, metadata, ...row } = keyRow(overrides);

  return { valid: true, error: null, key: { ...row, metadata: metadata === null ? null : JSON.parse(metadata), permissions: null } };
};

describe('ApiKeysService.create', () => {
  it('creates the key through the plugin with the daily quota of the owner plan', async () => {
    const { service, prisma, plans, auth } = createService();

    prisma.apiKey.count.mockResolvedValue(0);
    plans.planFor.mockResolvedValue('pro');
    auth.api.createApiKey.mockResolvedValue({ ...keyRow({ metadata: null }), key: 'otm_secret', metadata: { plan: 'pro' }, permissions: null });

    const created = await service.create({ userId: 'user', name: 'bot' });
    const body = auth.api.createApiKey.mock.calls[0]?.[0]?.body;

    expect(body).toMatchObject({ userId: 'user', name: 'bot', refillAmount: API_PLANS.pro.requestsPerDay, metadata: { plan: 'pro' } });
    expect(created.secret).toBe('otm_secret');
    expect(created.key.plan).toBe('pro');
  });

  it('refuses a key over the active-key limit', async () => {
    const { service, prisma, auth } = createService();

    prisma.apiKey.count.mockResolvedValue(API_KEY.maxActivePerUser);

    await expect(service.create({ userId: 'user', name: 'bot' })).rejects.toMatchObject({ response: { code: 'CONFLICT' } });
    expect(auth.api.createApiKey).not.toHaveBeenCalled();
  });

  it('refuses an expiry in the past', async () => {
    const { service } = createService();

    await expect(service.create({ userId: 'user', name: 'bot', expiresAt: new Date(Date.now() - 1_000).toISOString() })).rejects.toMatchObject({
      response: { code: 'VALIDATION_FAILED' }
    });
  });
});

describe('ApiKeysService.revoke', () => {
  it('switches the key off instead of deleting it, keeping its usage history', async () => {
    const { service, prisma, auth } = createService();

    prisma.apiKey.findFirst.mockResolvedValue(keyRow());

    await service.revoke({ userId: 'user', id: keyRow().id });

    expect(auth.api.updateApiKey.mock.calls[0]?.[0]?.body).toMatchObject({ keyId: keyRow().id, userId: 'user', enabled: false });
  });

  it('answers 404 for somebody else’s key', async () => {
    const { service, prisma } = createService();

    prisma.apiKey.findFirst.mockResolvedValue(null);

    await expect(service.revoke({ userId: 'user', id: 'id' })).rejects.toMatchObject({ response: { code: 'NOT_FOUND' } });
  });
});

describe('ApiKeysService.verify', () => {
  it('returns the owner, the plan and the daily budget left', async () => {
    const { service, auth } = createService();

    auth.api.verifyApiKey.mockResolvedValue(verified({ remaining: 42 }));

    await expect(service.verify('otm_key')).resolves.toEqual({
      id: keyRow().id,
      userId: 'user',
      plan: 'free',
      dailyLimit: API_PLANS.free.requestsPerDay,
      dailyRemaining: 42
    });
  });

  it('tells a revoked key from an unknown one', async () => {
    const { service, auth } = createService();

    auth.api.verifyApiKey.mockResolvedValueOnce({ valid: false, error: { code: 'KEY_DISABLED', message: 'disabled' }, key: null });

    await expect(service.verify('otm_key')).rejects.toMatchObject({ response: { code: 'API_KEY_REVOKED' } });

    auth.api.verifyApiKey.mockResolvedValueOnce({ valid: false, error: { code: 'INVALID_API_KEY', message: 'invalid' }, key: null });

    await expect(service.verify('otm_key')).rejects.toMatchObject({ response: { code: 'API_KEY_INVALID' } });
  });

  it('answers 429 with a Retry-After until the refill once the daily quota is used up', async () => {
    const { service, prisma, auth } = createService();

    auth.api.verifyApiKey.mockResolvedValue({ valid: false, error: { code: 'USAGE_EXCEEDED', message: 'used up' }, key: null });
    prisma.apiKey.findUnique.mockResolvedValue(keyRow());

    const error = await service.verify('otm_key').catch((caught: unknown) => caught);

    expect(error).toMatchObject({ response: { code: 'PLAN_LIMIT_REACHED' } });
    expect(error).toMatchObject({ retryAfterSec: expect.any(Number) });
  });

  it('moves the owner keys to a changed plan in the background', async () => {
    const { service, prisma, plans, auth } = createService();

    plans.cachedPlanFor.mockResolvedValue('pro');
    prisma.apiKey.findMany.mockResolvedValue([keyRow()]);
    auth.api.verifyApiKey.mockResolvedValue(verified());

    await service.verify('otm_key');
    await vi.waitFor(() => expect(prisma.apiKey.update).toHaveBeenCalled());

    expect(prisma.apiKey.update.mock.calls[0]?.[0].data).toMatchObject({
      refillAmount: API_PLANS.pro.requestsPerDay,
      metadata: JSON.stringify({ plan: 'pro' })
    });
  });
});
