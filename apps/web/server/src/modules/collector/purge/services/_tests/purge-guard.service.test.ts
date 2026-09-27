import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { DataDeletionRequest } from '../../../../../../generated';
import type { PrismaService } from '../../../../../core';

import { PURGE } from '../../config';
import { PurgeGuardService } from '../purge-guard.service';

const createGuard = () => {
  const prisma = mockDeep<PrismaService>();

  return { prisma, guard: new PurgeGuardService(prisma) };
};

describe('PurgeGuardService.blocked', () => {
  it('answers an empty batch without a query', async () => {
    const { prisma, guard } = createGuard();

    expect(await guard.blocked([])).toEqual(new Set());
    expect(prisma.dataDeletionRequest.findMany).not.toHaveBeenCalled();
  });

  it('blocks accounts with a user or Lesta deletion request that is not failed', async () => {
    const { prisma, guard } = createGuard();

    prisma.dataDeletionRequest.findMany.mockResolvedValue([mock<DataDeletionRequest>({ accountId: 2n })]);

    expect(await guard.blocked([1, 2])).toEqual(new Set([2]));

    expect(prisma.dataDeletionRequest.findMany.mock.calls[0]?.[0]?.where).toMatchObject({
      accountId: { in: [1n, 2n] },
      source: { in: PURGE.blockingSources },
      status: { in: PURGE.blockingStatuses }
    });
  });
});
