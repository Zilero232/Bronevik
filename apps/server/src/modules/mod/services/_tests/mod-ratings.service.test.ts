import type { Cache } from 'cache-manager';

import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { AccountRating, AccountTankRating, Player, PlayerTank, PlaySession } from '../../../../../generated';
import type { PrismaService } from '../../../../core';

import { MOD_RATINGS_READ } from '../../config';
import { ModRatingsService } from '../mod-ratings.service';

const ACCOUNT = 12_345n;

const session = (overrides: Partial<PlaySession>) =>
  mock<PlaySession>({
    kind: 'live',
    source: 'mod',
    status: 'open',
    startedAt: new Date('2026-09-27T17:00:00.000Z'),
    endedAt: null,
    battles: 2,
    wins: 1,
    damageDealt: 3000,
    wn8: 1900,
    broneIndex: null,
    ...overrides
  });

const createService = () => {
  const prisma = mockDeep<PrismaService>();
  const cache = mock<Cache>();

  prisma.accountRating.findUnique.mockResolvedValue(
    mock<AccountRating & { player: Player }>({
      battles: 10,
      winRate: 50,
      avgDamage: 1000,
      wn8: 1500,
      eff: 1200,
      broneIndex: 55,
      computedAt: new Date('2026-09-27T09:00:00.000Z'),
      player: mock<Player>({ nickname: 'Tanker' })
    })
  );

  prisma.playSession.findFirst.mockResolvedValue(null);
  prisma.playerTank.findMany.mockResolvedValue([]);
  prisma.accountTankRating.findMany.mockResolvedValue([]);
  prisma.tankSnapshotLatest.findMany.mockResolvedValue([]);

  return { service: new ModRatingsService(prisma, cache), prisma, cache };
};

describe('ModRatingsService.overview', () => {
  it('answers a cached overview without touching the database', async () => {
    const { service, prisma, cache } = createService();
    const cached = { account_id: 12_345, nickname: null, overall: null, session: null };

    cache.get.mockResolvedValue(cached);

    await expect(service.overview(ACCOUNT)).resolves.toBe(cached);
    expect(prisma.accountRating.findUnique).not.toHaveBeenCalled();
  });

  it('reads only the given account and caches the answer briefly', async () => {
    const { service, prisma, cache } = createService();

    prisma.playSession.findFirst.mockResolvedValueOnce(session({}));

    const overview = await service.overview(ACCOUNT);

    expect(overview).toMatchObject({ account_id: 12_345, nickname: 'Tanker', session: { kind: 'live', is_live: true } });
    expect(prisma.accountRating.findUnique.mock.calls[0]?.[0].where).toEqual({ accountId_period: { accountId: ACCOUNT, period: 'overall' } });
    expect(prisma.playSession.findFirst.mock.calls.every(([query]) => query?.where?.accountId === ACCOUNT)).toBe(true);
    expect(cache.set).toHaveBeenCalledWith(`${MOD_RATINGS_READ.overviewKey}${ACCOUNT}`, overview, MOD_RATINGS_READ.cacheTtlMs);
  });

  it('falls back to the latest day rollup when the mod has no live session', async () => {
    const { service, prisma } = createService();

    prisma.playSession.findFirst.mockResolvedValueOnce(null).mockResolvedValueOnce(session({ kind: 'day', source: 'api', status: 'closed' }));

    await expect(service.overview(ACCOUNT)).resolves.toMatchObject({ session: { kind: 'day', source: 'api', is_live: false } });
    expect(prisma.playSession.findFirst.mock.calls.map(([query]) => query?.where?.kind)).toEqual(['live', 'day']);
  });
});

describe('ModRatingsService.tanks', () => {
  it('queries each requested tank once, scoped to the account, and keeps the request order', async () => {
    const { service, prisma } = createService();

    prisma.playerTank.findMany.mockResolvedValue([
      mock<PlayerTank>({ tankId: 7, battles: 4, wins: 2, markOfMastery: 1, marksOnGun: 0, moePercent: 40 }),
      mock<PlayerTank>({ tankId: 3, battles: 10, wins: 6, markOfMastery: 2, marksOnGun: 1, moePercent: 70 })
    ]);

    prisma.accountTankRating.findMany.mockResolvedValue([
      mock<AccountTankRating>({ tankId: 3, battles: 10, winRate: 60, avgDamage: 900, wn8: 1400 })
    ]);

    const result = await service.tanks({ accountId: ACCOUNT, tankIds: [3, 9, 7, 3] });

    expect(result.tanks.map((row) => row.tank_id)).toEqual([3, 7]);
    expect(prisma.playerTank.findMany.mock.calls[0]?.[0]?.where).toEqual({ accountId: ACCOUNT, tankId: { in: [3, 9, 7] } });
    expect(prisma.accountTankRating.findMany.mock.calls[0]?.[0]?.where).toMatchObject({ accountId: ACCOUNT, period: 'overall' });
    expect(prisma.tankSnapshotLatest.findMany.mock.calls[0]?.[0]?.where).toMatchObject({ accountId: ACCOUNT, mode: 'random' });
  });

  it('shares one cache entry between requests naming the same tanks in any order', async () => {
    const first = createService();
    const second = createService();

    await first.service.tanks({ accountId: ACCOUNT, tankIds: [5, 2] });
    await second.service.tanks({ accountId: ACCOUNT, tankIds: [2, 5, 2] });

    expect(first.cache.set.mock.calls[0]?.[0]).toBe(second.cache.set.mock.calls[0]?.[0]);
  });
});
