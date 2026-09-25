import type { Queue } from 'bullmq';

import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { PrismaService } from '../../../../core';

import { HYPERTABLE } from '../../../../core';
import { PurgeService } from '../services';

const requestId = '00000000-0000-4000-8000-000000000001';

const createPurge = () => {
  const prisma = mockDeep<PrismaService>();

  prisma.$transaction.mockImplementation(async (run) => run(prisma));

  return { prisma, purge: new PurgeService(prisma, mock<Queue>()) };
};

const statuses = (prisma: ReturnType<typeof createPurge>['prisma']) => prisma.dataDeletionRequest.update.mock.calls.map(([{ data }]) => data.status);

describe('PurgeService.purgeAccount', () => {
  it('deletes the account from every hypertable and closes the request', async () => {
    const { prisma, purge } = createPurge();

    await purge.purgeAccount({ accountId: 5, requestId });

    expect(prisma.$executeRawUnsafe).toHaveBeenCalledTimes(Object.values(HYPERTABLE).length);
    expect(prisma.player.deleteMany).toHaveBeenCalledWith({ where: { accountId: 5n } });
    expect(statuses(prisma)).toEqual(['processing', 'completed']);
  });

  it('marks the request failed and rethrows so the job retries', async () => {
    const { prisma, purge } = createPurge();

    prisma.player.deleteMany.mockRejectedValue(new Error('lock timeout'));

    await expect(purge.purgeAccount({ accountId: 5, requestId })).rejects.toThrow('lock timeout');
    expect(statuses(prisma)).toEqual(['processing', 'failed']);
  });
});
