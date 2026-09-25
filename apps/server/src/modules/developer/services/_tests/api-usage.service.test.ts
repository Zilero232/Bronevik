import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { PrismaService } from '../../../../core';

import { ApiKeysService } from '../api-keys.service';
import { ApiUsageService } from '../api-usage.service';
import { DeveloperPlanService } from '../developer-plan.service';

const createService = () => {
  const prisma = mockDeep<PrismaService>();

  return { service: new ApiUsageService(prisma, mock<ApiKeysService>(), mock<DeveloperPlanService>()), prisma };
};

describe('ApiUsageService.flush', () => {
  it('writes one row per key, day and endpoint however many requests there were', async () => {
    const { service, prisma } = createService();

    service.record({ keyId: 'key', endpoint: 'GET /v1/tanks', latencyMs: 10, failed: false });
    service.record({ keyId: 'key', endpoint: 'GET /v1/tanks', latencyMs: 30, failed: true });
    service.recordThrottled({ keyId: 'key', endpoint: 'GET /v1/tanks' });

    await service.flush();

    expect(prisma.apiUsageDaily.upsert).toHaveBeenCalledTimes(1);
    expect(prisma.apiUsageDaily.upsert.mock.calls[0]?.[0].create).toMatchObject({ requests: 2, errors: 1, throttled: 1, latencyMsTotal: 40n });
  });

  it('marks the key as used', async () => {
    const { service, prisma } = createService();

    service.record({ keyId: 'key', endpoint: 'GET /v1/tanks', latencyMs: 1, failed: false });

    await service.flush();

    expect(prisma.apiKey.updateMany).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 'key' } }));
  });

  it('writes nothing twice', async () => {
    const { service, prisma } = createService();

    service.record({ keyId: 'key', endpoint: 'GET /v1/tanks', latencyMs: 1, failed: false });

    await service.flush();
    await service.flush();

    expect(prisma.apiUsageDaily.upsert).toHaveBeenCalledTimes(1);
  });

  it('keeps going when the database is down', async () => {
    const { service, prisma } = createService();

    prisma.apiUsageDaily.upsert.mockRejectedValue(new Error('down'));
    service.record({ keyId: 'key', endpoint: 'GET /v1/tanks', latencyMs: 1, failed: false });

    await expect(service.flush()).resolves.toBeUndefined();
  });
});
