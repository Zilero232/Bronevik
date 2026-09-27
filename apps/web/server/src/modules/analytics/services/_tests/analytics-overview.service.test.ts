import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { Battle, PlaySession } from '../../../../../generated';
import type { PrismaService } from '../../../../core';
import type { PlaytimeRow } from '../../../players';
import type { TrendRow } from '../../analytics.types';
import type { RawTankRow } from '../../lib';

import { ExpectedValuesService, VehicleCatalogService } from '../../../reference';
import { AnalyticsOverviewService } from '../analytics-overview.service';
import { OwnAccountService } from '../own-account.service';
import { catalogOf, rawRow, vehicle } from './analytics.fixtures';

const now = new Date('2026-09-26T10:00:00Z');
const tank = vehicle({ tankId: 1, tier: 8 });

const session = (fields: Pick<PlaySession, 'battles' | 'damageDealt' | 'id' | 'wins'>) =>
  Object.assign(mock<PlaySession>(), { startedAt: now, wn8: null, ...fields });

const modBattle = (result: Battle['result']) => Object.assign(mock<Battle>(), { result, startedAt: now });

const cell: PlaytimeRow = { weekday: 6, hour: 13, battles: 4, wins: 2, damage: 4_000 };

type Raw = { totals: RawTankRow[]; trend: TrendRow[]; playtime: PlaytimeRow[] };

const setup = ({ totals, trend, playtime }: Raw) => {
  const prisma = mockDeep<PrismaService>();
  const catalog = mock<VehicleCatalogService>();
  const expected = mock<ExpectedValuesService>();
  const accounts = mock<OwnAccountService>();

  accounts.resolve.mockResolvedValue(7n);
  expected.all.mockResolvedValue(new Map());
  catalog.all.mockResolvedValue(catalogOf(tank));
  prisma.$queryRaw.mockResolvedValueOnce(totals).mockResolvedValueOnce(trend).mockResolvedValueOnce(playtime);
  prisma.battle.findMany.mockResolvedValue([]);
  prisma.battle.count.mockResolvedValue(0);
  prisma.playSession.findMany.mockResolvedValue([]);

  return { prisma, service: new AnalyticsOverviewService(prisma, catalog, expected, accounts) };
};

const playtimeSource = (prisma: ReturnType<typeof setup>['prisma']) => {
  const query = prisma.$queryRaw.mock.calls[2]?.[0];

  if (query === undefined) {
    return '';
  }

  return 'sql' in query ? query.sql : query.join('');
};

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(now);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('AnalyticsOverviewService.overview', () => {
  it('returns empty totals and no sessions without data', async () => {
    const { service } = setup({ totals: [], trend: [], playtime: [] });

    const overview = await service.overview({ userId: 'u', period: 'd30' });

    expect(overview).toMatchObject({ accountId: 7, period: 'd30', modBattles: 0, totals: { battles: 0, winRate: null }, trend: [], sessions: [] });
  });

  it('builds playtime from mod battles when the account has them', async () => {
    const { prisma, service } = setup({ totals: [], trend: [], playtime: [cell] });

    prisma.battle.findMany.mockResolvedValue([modBattle('win'), modBattle('loss')]);
    prisma.battle.count.mockResolvedValue(2);

    const overview = await service.overview({ userId: 'u', period: 'd30' });

    expect(overview.modBattles).toBe(2);
    expect(playtimeSource(prisma)).toContain('FROM battle');
    expect(overview.hours.find((hour) => hour.hour === cell.hour)?.battles).toBe(cell.battles);
  });

  it('falls back to stat deltas for playtime without mod battles', async () => {
    const { prisma, service } = setup({ totals: [], trend: [], playtime: [cell] });

    await service.overview({ userId: 'u', period: 'd30' });

    expect(playtimeSource(prisma)).toContain('FROM tank_battle_delta');
  });

  it('sums the tank totals and breaks them down by known vehicles only', async () => {
    const { service } = setup({
      totals: [rawRow({ tank_id: tank.tankId, battles: 10, wins: 6 }), rawRow({ tank_id: 999, battles: 5, wins: 0 })],
      trend: [],
      playtime: []
    });

    const overview = await service.overview({ userId: 'u', period: 'd30' });

    expect(overview.totals.battles).toBe(15);
    expect(overview.breakdown.byTier).toEqual([expect.objectContaining({ key: String(tank.tier), battles: 10 })]);
  });

  it('orders trend points by bucket', async () => {
    const later = new Date('2026-09-21T00:00:00Z');
    const earlier = new Date('2026-09-14T00:00:00Z');
    const { service } = setup({
      totals: [],
      trend: [
        { ...rawRow({ tank_id: 1, battles: 2, wins: 1 }), bucket: later },
        { ...rawRow({ tank_id: 1, battles: 3, wins: 1 }), bucket: earlier }
      ],
      playtime: []
    });

    const { trend } = await service.overview({ userId: 'u', period: 'd30' });

    expect(trend.map((point) => point.at)).toEqual([earlier.toISOString(), later.toISOString()]);
  });

  it('compares each session to the period totals', async () => {
    const { prisma, service } = setup({ totals: [rawRow({ tank_id: 1, battles: 10, wins: 5, damage: 10_000 })], trend: [], playtime: [] });

    prisma.playSession.findMany.mockResolvedValue([
      session({ id: 'good', battles: 4, wins: 3, damageDealt: 8_000 }),
      session({ id: 'bad', battles: 4, wins: 1, damageDealt: 2_000 })
    ]);

    const { sessions } = await service.overview({ userId: 'u', period: 'd30' });
    const [good, bad] = sessions;

    expect(good?.winRateDelta).toBeGreaterThan(0);
    expect(good?.avgDamageDelta).toBeGreaterThan(0);
    expect(bad?.winRateDelta).toBeLessThan(0);
    expect(bad?.avgDamageDelta).toBeLessThan(0);
  });

  it('leaves session deltas empty when the period has no totals to compare with', async () => {
    const { prisma, service } = setup({ totals: [], trend: [], playtime: [] });

    prisma.playSession.findMany.mockResolvedValue([session({ id: 's', battles: 2, wins: 1, damageDealt: 2_000 })]);

    const { sessions } = await service.overview({ userId: 'u', period: 'all' });

    expect(sessions[0]).toMatchObject({ winRate: 50, winRateDelta: null, avgDamageDelta: null });
  });
});
