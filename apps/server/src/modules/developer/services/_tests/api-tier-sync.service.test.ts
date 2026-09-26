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

const createService = () => {
  const prisma = mockDeep<PrismaService>();
  const tiers = mock<ApiTierService>();
  const webhooks = mock<WebhookEndpointsService>();
  const redis = new RedisMock();
  const bus = new EntitlementsBusService(redis);
  const otherProcess = new EntitlementsBusService(redis);

  tiers.tierFor.mockResolvedValue('free');

  prisma.apiKey.findMany.mockResolvedValue([
    mock<ApiKey>({ id: 'k1', metadata: JSON.stringify({ tier: 'plus' }), remaining: 100, refillAmount: API_TIERS.plus.requestsPerDay })
  ]);

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
});
