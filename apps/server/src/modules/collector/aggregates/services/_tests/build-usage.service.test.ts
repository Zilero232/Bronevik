import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { Battle } from '../../../../../../generated';
import type { PrismaService } from '../../../../../core';

import { BuildUsageService } from '../build-usage.service';

const loadout = {
  optionalDevices: [1, 2, null],
  consumables: [10],
  directives: [],
  shells: [{ shellId: 100, count: 30 }],
  fieldModifications: [],
  crew: [],
  gameplayId: 0
};

const battle = (fields: Pick<Battle, 'accountId' | 'battleType' | 'result'>) =>
  Object.assign(mock<Battle>({ ...fields, damageDealt: 2_000 }), { loadout });

const createService = () => {
  const prisma = mockDeep<PrismaService>();

  prisma.gameVersion.findFirst.mockResolvedValue(null);
  prisma.$queryRaw.mockResolvedValue([{ account_id: 1n, rank: 0 }]);
  prisma.$transaction.mockResolvedValue([]);
  prisma.buildUsageAggregate.deleteMany.mockResolvedValue({ count: 2 });

  return { prisma, service: new BuildUsageService(prisma) };
};

describe('BuildUsageService', () => {
  it('writes one row per mode and cohort of every tank and drops the stale ones', async () => {
    const { prisma, service } = createService();

    prisma.battle.findMany
      .mockResolvedValueOnce([mock<Battle>({ tankId: 7 })])
      .mockResolvedValueOnce([
        battle({ accountId: 1n, battleType: '1', result: 'win' }),
        battle({ accountId: 2n, battleType: '1', result: 'loss' }),
        battle({ accountId: 2n, battleType: '43', result: 'win' }),
        battle({ accountId: 3n, battleType: '2', result: 'win' })
      ]);

    const result = await service.compute();

    expect(result).toEqual({ tanks: 1, groups: 4, removed: 2, gameVersion: 'unknown' });
    expect(prisma.buildUsageAggregate.upsert).toHaveBeenCalledTimes(4);

    expect(prisma.buildUsageAggregate.upsert.mock.calls.map(([args]) => `${args.create.mode}:${args.create.cohort}:${args.create.players}`)).toEqual([
      'random:all:2',
      'random:top10:1',
      'random:top1:1',
      'onslaught:all:1'
    ]);
  });
});
