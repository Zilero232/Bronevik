import { Logger } from '@nestjs/common';
import RedisMock from 'ioredis-mock';
import { describe, expect, it, vi } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { ApiKey } from '../../../../../generated';
import type { PrismaService } from '../../../../core';
import type { ApiTierService } from '../api-tier.service';
import type { WebhookEndpointsService } from '../webhook-endpoints.service';

import { EntitlementsBusService } from '../../../billing';
import { API_TIERS } from '../../config';
import { ApiTierSyncService } from '../api-tier-sync.service';

const USED_TODAY = 5;

const plusKey = (overrides: Partial<ApiKey> = {}) =>
  mock<ApiKey>({ id: 'k1', metadata: JSON.stringify({ tier: 'plus' }), remaining: 100, refillAmount: API_TIERS.plus.requestsPerDay, ...overrides });

const createService = () => {
  const prisma = mockDeep<PrismaService>();
  const tiers = mock<ApiTierService>();
  const webhooks = mock<WebhookEndpointsService>();
  const redis = new RedisMock();
  const bus = new EntitlementsBusService(redis);
  const otherProcess = new EntitlementsBusService(redis);

  tiers.tierFor.mockResolvedValue('free');

  prisma.apiKey.findMany.mockResolvedValue([plusKey()]);

  const service = new ApiTierSyncService(prisma, tiers, webhooks, bus);

  service.onModuleInit();

  return { service, prisma, tiers, webhooks, bus, otherProcess };
};

describe('ApiTierSyncService', () => {
  it('downgrades the keys and the webhooks when billing in this process reports an expiry', async () => {
    const { prisma, tiers, webhooks, bus } = createService();

    bus.publish('user');

    await vi.waitFor(() => expect(webhooks.enforceTier).toHaveBeenCalledWith({ userId: 'user', tier: 'free' }));

    expect(tiers.forget).toHaveBeenCalledWith('user');

    expect(prisma.apiKey.update.mock.calls[0]?.[0].data).toMatchObject({
      refillAmount: API_TIERS.free.requestsPerDay,
      metadata: JSON.stringify({ tier: 'free' })
    });
  });

  it('leaves a change made by another process to that process', async () => {
    const { tiers, bus, otherProcess } = createService();

    await bus.onModuleInit();

    const received = new Promise((resolve) => {
      bus.changes$.subscribe(resolve);
    });

    otherProcess.publish('user');

    await expect(received).resolves.toEqual({ userId: 'user', isLocal: false });
    expect(tiers.tierFor).not.toHaveBeenCalled();

    await bus.onModuleDestroy();
  });

  it('stops listening to billing changes on shutdown', async () => {
    const { service, tiers, bus } = createService();

    service.onModuleDestroy();
    bus.publish('user');
    await Promise.resolve();

    expect(tiers.tierFor).not.toHaveBeenCalled();
  });

  it('logs a sync that failed after a billing change instead of crashing', async () => {
    const { tiers, bus } = createService();
    const warn = vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);

    tiers.tierFor.mockRejectedValue(new Error('db down'));
    bus.publish('user');

    await vi.waitFor(() => expect(warn).toHaveBeenCalledWith(expect.stringContaining('db down')));
  });
});

describe('ApiTierSyncService.apply', () => {
  it('leaves keys already on the target tier untouched but still enforces the webhook limit', async () => {
    const { service, prisma, webhooks } = createService();

    prisma.apiKey.findMany.mockResolvedValue([plusKey()]);

    await service.apply({ userId: 'user', tier: 'plus' });

    expect(prisma.apiKey.update).not.toHaveBeenCalled();
    expect(webhooks.enforceTier).toHaveBeenCalledWith({ userId: 'user', tier: 'plus' });
  });

  it('carries the requests already used today over to the new quota', async () => {
    const { service, prisma } = createService();

    prisma.apiKey.findMany.mockResolvedValue([plusKey({ remaining: API_TIERS.plus.requestsPerDay - USED_TODAY })]);

    await service.apply({ userId: 'user', tier: 'free' });

    expect(prisma.apiKey.update.mock.calls[0]?.[0].data).toMatchObject({ remaining: API_TIERS.free.requestsPerDay - USED_TODAY });
  });

  it('leaves nothing for today when more than the new quota was already used', async () => {
    const { service, prisma } = createService();

    prisma.apiKey.findMany.mockResolvedValue([plusKey({ remaining: API_TIERS.plus.requestsPerDay - API_TIERS.free.requestsPerDay - 1 })]);

    await service.apply({ userId: 'user', tier: 'free' });

    expect(prisma.apiKey.update.mock.calls[0]?.[0].data).toMatchObject({ remaining: 0 });
  });
});
