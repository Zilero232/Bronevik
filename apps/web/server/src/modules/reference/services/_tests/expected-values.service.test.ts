import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { Wn8ExpectedValue } from '../../../../../generated';
import type { PrismaService } from '../../../../core';

import { ExpectedValuesService } from '../expected-values.service';

const ROW = mock<Wn8ExpectedValue>({ tankId: 1, expDamage: 1800, expSpotted: 1.2, expFrags: 0.9, expDefense: 0.6, expWinRate: 52 });

const createService = (rows: Wn8ExpectedValue[]) => {
  const prisma = mockDeep<PrismaService>();

  prisma.wn8ExpectedValue.findMany.mockResolvedValue(rows);

  return { service: new ExpectedValuesService(prisma), prisma };
};

describe('ExpectedValuesService.all', () => {
  it('maps stored rows to the WN8 expected-values table', async () => {
    const { service } = createService([ROW]);

    expect((await service.all()).get(1)).toEqual({ tankId: 1, expDamage: 1800, expSpot: 1.2, expFrag: 0.9, expDef: 0.6, expWinRate: 52 });
  });

  it('caches a loaded table', async () => {
    const { service, prisma } = createService([ROW]);

    await service.all();
    await service.all();

    expect(prisma.wn8ExpectedValue.findMany).toHaveBeenCalledOnce();
  });

  it('returns an empty table and retries later when nothing is stored', async () => {
    const { service, prisma } = createService([]);

    expect((await service.all()).size).toBe(0);
    await service.all();

    expect(prisma.wn8ExpectedValue.findMany).toHaveBeenCalledTimes(2);
  });
});
