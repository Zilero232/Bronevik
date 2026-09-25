import { API_KEY } from '@bronevik/schemas';
import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { ApiKey } from '../../../../../generated';
import type { PrismaService } from '../../../../core';

import { apiKeyPrefix, generateApiKey, hashApiKey } from '../../lib';
import { ApiKeysService } from '../api-keys.service';
import { DeveloperPlanService } from '../developer-plan.service';

const keyRow = (overrides: Partial<ApiKey> = {}): ApiKey => {
  const generated = generateApiKey();

  return {
    id: '00000000-0000-4000-8000-000000000001',
    userId: 'user',
    name: 'bot',
    prefix: generated.prefix,
    keyHash: generated.hash,
    plan: 'free',
    scopes: [],
    lastUsedAt: null,
    expiresAt: null,
    revokedAt: null,
    createdAt: new Date(),
    ...overrides
  };
};

const createService = () => {
  const prisma = mockDeep<PrismaService>();
  const plans = mock<DeveloperPlanService>();

  plans.planFor.mockResolvedValue('free');

  return { service: new ApiKeysService(prisma, plans), prisma, plans };
};

describe('ApiKeysService.create', () => {
  it('stores only the hash of the key it shows once', async () => {
    const { service, prisma } = createService();

    prisma.apiKey.count.mockResolvedValue(0);
    prisma.apiKey.create.mockResolvedValue(keyRow());

    const created = await service.create({ userId: 'user', name: 'bot' });
    const data = prisma.apiKey.create.mock.calls[0]?.[0].data;

    expect(data?.keyHash).toBe(hashApiKey(created.secret));
    expect(data?.keyHash).not.toContain(created.secret);
    expect(apiKeyPrefix(created.secret)).toBe(data?.prefix);
  });

  it('refuses a key over the active-key limit', async () => {
    const { service, prisma } = createService();

    prisma.apiKey.count.mockResolvedValue(API_KEY.maxActivePerUser);

    await expect(service.create({ userId: 'user', name: 'bot' })).rejects.toMatchObject({ response: { code: 'CONFLICT' } });
  });
});

describe('ApiKeysService.authenticate', () => {
  it('rejects a malformed key without touching the database', async () => {
    const { service, prisma } = createService();

    await expect(service.authenticate('nope')).rejects.toMatchObject({ response: { code: 'API_KEY_INVALID' } });
    expect(prisma.apiKey.findUnique).not.toHaveBeenCalled();
  });

  it('rejects a key whose secret does not match the stored hash', async () => {
    const { service, prisma } = createService();
    const stored = keyRow();
    const other = generateApiKey();

    prisma.apiKey.findUnique.mockResolvedValue(stored);

    await expect(service.authenticate(other.key.replace(other.prefix, stored.prefix))).rejects.toMatchObject({
      response: { code: 'API_KEY_INVALID' }
    });
  });

  it('rejects a revoked key and an expired one', async () => {
    const { service, prisma } = createService();
    const generated = generateApiKey();

    prisma.apiKey.findUnique.mockResolvedValueOnce(keyRow({ prefix: generated.prefix, keyHash: generated.hash, revokedAt: new Date() }));

    await expect(service.authenticate(generated.key)).rejects.toMatchObject({ response: { code: 'API_KEY_REVOKED' } });

    prisma.apiKey.findUnique.mockResolvedValueOnce(
      keyRow({ prefix: generated.prefix, keyHash: generated.hash, expiresAt: new Date(Date.now() - 1) })
    );

    await expect(service.authenticate(generated.key)).rejects.toMatchObject({ response: { code: 'API_KEY_REVOKED' } });
  });

  it('resolves the plan from the owner and serves repeats from the cache', async () => {
    const { service, prisma, plans } = createService();
    const generated = generateApiKey();

    plans.planFor.mockResolvedValue('pro');
    prisma.apiKey.findUnique.mockResolvedValue(keyRow({ prefix: generated.prefix, keyHash: generated.hash }));

    const first = await service.authenticate(generated.key);
    const second = await service.authenticate(generated.key);

    expect(first.plan).toBe('pro');
    expect(second).toEqual(first);
    expect(prisma.apiKey.findUnique).toHaveBeenCalledTimes(1);
  });

  it('keeps a partner key on the partner plan', async () => {
    const { service, prisma, plans } = createService();
    const generated = generateApiKey();

    prisma.apiKey.findUnique.mockResolvedValue(keyRow({ prefix: generated.prefix, keyHash: generated.hash, plan: 'partner' }));

    expect((await service.authenticate(generated.key)).plan).toBe('partner');
    expect(plans.planFor).not.toHaveBeenCalled();
  });

  it('forgets a revoked key at once', async () => {
    const { service, prisma } = createService();
    const generated = generateApiKey();
    const stored = keyRow({ prefix: generated.prefix, keyHash: generated.hash });

    prisma.apiKey.findUnique.mockResolvedValue(stored);
    prisma.apiKey.findFirst.mockResolvedValue(stored);

    await service.authenticate(generated.key);
    await service.revoke({ userId: stored.userId, id: stored.id });

    prisma.apiKey.findUnique.mockResolvedValue({ ...stored, revokedAt: new Date() });

    await expect(service.authenticate(generated.key)).rejects.toMatchObject({ response: { code: 'API_KEY_REVOKED' } });
  });
});
