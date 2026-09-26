import type { AuthService } from '@thallesp/nestjs-better-auth';

import { API_KEY } from '@otmetki/schemas';
import { describe, expect, it, vi } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { ApiKey } from '../../../../../generated';
import type { PrismaService } from '../../../../core';
import type { OtmetkiAuth } from '../../../../lib/auth';

import { API_KEY_PLUGIN } from '../../../../lib/auth';
import { API_TIERS } from '../../config';
import { ApiKeysService } from '../api-keys.service';
import { ApiTierSyncService } from '../api-tier-sync.service';
import { ApiTierService } from '../api-tier.service';

const keyRow = (overrides: Partial<ApiKey> = {}): ApiKey => ({
  id: '00000000-0000-4000-8000-000000000001',
  configId: 'default',
  referenceId: 'user',
  name: 'bot',
  start: `${API_KEY_PLUGIN.prefix}AbCdEfGh`,
  prefix: API_KEY_PLUGIN.prefix,
  key: 'hashed',
  permissions: null,
  metadata: JSON.stringify({ tier: 'free' }),
  enabled: true,
  rateLimitEnabled: false,
  rateLimitTimeWindow: null,
  rateLimitMax: null,
  requestCount: 0,
  remaining: API_TIERS.free.requestsPerDay,
  refillInterval: 86_400_000,
  refillAmount: API_TIERS.free.requestsPerDay,
  lastRefillAt: null,
  lastRequest: null,
  expiresAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides
});

const createService = () => {
  const prisma = mockDeep<PrismaService>();
  const tiers = mock<ApiTierService>();
  const auth = mockDeep<AuthService<OtmetkiAuth>>();
  const tierSync = mock<ApiTierSyncService>();

  prisma.$transaction.mockImplementation(async (run) => (typeof run === 'function' ? run(prisma) : Promise.all(run)));

  tiers.tierFor.mockResolvedValue('free');
  tiers.cachedTierFor.mockResolvedValue('free');

  return { service: new ApiKeysService(prisma, tiers, tierSync, auth), prisma, tiers, auth, tierSync };
};

const verified = (overrides: Partial<ApiKey> = {}) => {
  const { key: _hash, metadata, ...row } = keyRow(overrides);

  return { valid: true, error: null, key: { ...row, metadata: metadata === null ? null : JSON.parse(metadata), permissions: null } };
};

describe('ApiKeysService.create', () => {
  it('creates the key through the plugin with the daily quota of the owner tier', async () => {
    const { service, prisma, tiers, auth } = createService();

    prisma.apiKey.count.mockResolvedValue(0);
    tiers.tierFor.mockResolvedValue('plus');
    auth.api.createApiKey.mockResolvedValue({ ...keyRow({ metadata: null }), key: 'otm_secret', metadata: { tier: 'plus' }, permissions: null });

    const created = await service.create({ userId: 'user', name: 'bot' });
    const body = auth.api.createApiKey.mock.calls[0]?.[0]?.body;

    expect(body).toMatchObject({ userId: 'user', name: 'bot', refillAmount: API_TIERS.plus.requestsPerDay, metadata: { tier: 'plus' } });
    expect(created.secret).toBe('otm_secret');
    expect(created.key.tier).toBe('plus');
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
  it('returns the owner, the tier and the daily budget left', async () => {
    const { service, auth } = createService();

    auth.api.verifyApiKey.mockResolvedValue(verified({ remaining: 42 }));

    await expect(service.verify('otm_key')).resolves.toEqual({
      id: keyRow().id,
      userId: 'user',
      tier: 'free',
      dailyLimit: API_TIERS.free.requestsPerDay,
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

  it('moves the owner keys to a changed tier in the background', async () => {
    const { service, tiers, auth, tierSync } = createService();

    tiers.cachedTierFor.mockResolvedValue('plus');
    auth.api.verifyApiKey.mockResolvedValue(verified());

    await service.verify('otm_key');
    await vi.waitFor(() => expect(tierSync.apply).toHaveBeenCalledWith({ userId: 'user', tier: 'plus' }));
  });
});
