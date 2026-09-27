import { describe, expect, it } from 'vitest';
import { mockDeep } from 'vitest-mock-extended';

import type { PrismaService } from '../../../../core';

import { WatchlistActivityService } from '../watchlist-activity.service';

const since = new Date('2026-09-25T10:00:00Z');
const lastAt = new Date('2026-09-26T08:00:00Z');

const setup = () => {
  const prisma = mockDeep<PrismaService>();

  return { prisma, service: new WatchlistActivityService(prisma) };
};

describe('WatchlistActivityService.activity', () => {
  it('returns an empty map without querying when nobody is followed', async () => {
    const { prisma, service } = setup();

    expect((await service.activity({ accountIds: [], since })).size).toBe(0);
    expect(prisma.$queryRaw).not.toHaveBeenCalled();
  });

  it('merges session totals and gained marks per account', async () => {
    const { prisma, service } = setup();

    prisma.$queryRaw
      .mockResolvedValueOnce([{ account_id: 1n, battles: 5, wins: 3, damage: 9_000, last_at: lastAt }])
      .mockResolvedValueOnce([{ account_id: 1n, marks: 2 }]);

    const activity = await service.activity({ accountIds: [1n], since });

    expect(activity.get(1n)).toEqual({ accountId: 1n, battles: 5, wins: 3, damage: 9_000, lastBattleAt: lastAt, marksGained: 2 });
  });

  it('reports zeros and no last battle for a followed account with no activity', async () => {
    const { prisma, service } = setup();

    prisma.$queryRaw.mockResolvedValueOnce([]).mockResolvedValueOnce([]);

    const activity = await service.activity({ accountIds: [1n, 2n], since });

    expect(activity.get(2n)).toEqual({ accountId: 2n, battles: 0, wins: 0, damage: 0, lastBattleAt: null, marksGained: 0 });
    expect([...activity.keys()]).toEqual([1n, 2n]);
  });

  it('matches raw rows whose account id comes back as a number', async () => {
    const { prisma, service } = setup();

    prisma.$queryRaw.mockResolvedValueOnce([{ account_id: 7, battles: 1, wins: 1, damage: 100, last_at: lastAt }]).mockResolvedValueOnce([]);

    const activity = await service.activity({ accountIds: [7n], since });

    expect(activity.get(7n)?.battles).toBe(1);
  });
});
