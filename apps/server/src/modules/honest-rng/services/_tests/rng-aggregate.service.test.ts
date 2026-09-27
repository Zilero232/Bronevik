import { subHours } from 'date-fns';
import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { Battle, CollectorState } from '../../../../../generated';
import type { PrismaService } from '../../../../core';

import { moscowCalendarDate } from '../../../../common/lib';
import { HONEST_RNG_AGGREGATE } from '../../config';
import { dailyFromTally, emptyTally, foldBattle } from '../../lib';
import { RngAggregateService } from '../rng-aggregate.service';

const NOW = new Date('2026-09-27T12:00:00Z');
const MARK = { receivedAt: new Date('2026-09-27T10:00:00Z'), id: 'b-5' };

const battle = (id: string, receivedAt: Date) =>
  mock<Battle>({
    id,
    accountId: 1n,
    tankId: 1,
    startedAt: receivedAt,
    receivedAt,
    shots: [{ damage: 400, nominal: 400, shell: 'armor_piercing', outcome: 'damage', distance: 100, fatal: false }],
    shotsFired: 1,
    shotsHit: 1,
    shotsPierced: 1
  });

const createService = (stored: CollectorState | null) => {
  const prisma = mockDeep<PrismaService>();

  prisma.$transaction.mockImplementation(async (run) => (typeof run === 'function' ? run(prisma) : Promise.all(run)));
  prisma.vehicle.findMany.mockResolvedValue([]);
  prisma.collectorState.findUnique.mockResolvedValue(stored);
  prisma.rngDaily.findMany.mockResolvedValue([]);
  prisma.$queryRaw.mockResolvedValue([]);

  return { prisma, service: new RngAggregateService(prisma) };
};

describe('RngAggregateService.compute', () => {
  it('advances the watermark to the last battle it folded', async () => {
    const { prisma, service } = createService(null);
    const last = new Date('2026-09-27T11:00:00Z');

    prisma.$queryRaw.mockResolvedValueOnce([battle('b-1', new Date('2026-09-27T09:00:00Z')), battle('b-2', last)]);

    expect(await service.compute(NOW)).toMatchObject({ battles: 2 });
    expect(prisma.collectorState.upsert.mock.calls[0]?.[0].update.value).toEqual({ receivedAt: last.toISOString(), id: 'b-2' });
  });

  it('adds new battles to the stored day instead of replacing it', async () => {
    const { prisma, service } = createService(null);
    const at = new Date('2026-09-27T09:00:00Z');
    const earlier = foldBattle({ tally: emptyTally(), accountId: '2', shots: [], accuracy: null });

    prisma.rngDaily.findMany.mockResolvedValue([
      dailyFromTally({ day: moscowCalendarDate(at), scope: HONEST_RNG_AGGREGATE.scopes.server, tally: earlier })
    ]);

    prisma.$queryRaw.mockResolvedValueOnce([battle('b-1', at)]);

    await service.compute(NOW);

    const server = prisma.rngDaily.upsert.mock.calls.map(([args]) => args.create).find((row) => row.scope === HONEST_RNG_AGGREGATE.scopes.server);

    expect(server).toMatchObject({ battles: 2, players: [2n, 1n] });
  });
});

describe('RngAggregateService.compute sources', () => {
  const sqlOf = (prisma: ReturnType<typeof createService>['prisma']) => {
    const sql = prisma.$queryRaw.mock.calls[0]?.[0];

    return sql && !('raw' in sql) ? sql : null;
  };

  it('resumes after the stored watermark and waits for battles to settle', async () => {
    const { prisma, service } = createService(
      mock<CollectorState>({ key: HONEST_RNG_AGGREGATE.watermarkKey, value: { receivedAt: MARK.receivedAt.toISOString(), id: MARK.id } })
    );

    await service.compute(NOW);

    expect(sqlOf(prisma)?.values).toEqual(expect.arrayContaining([subHours(NOW, HONEST_RNG_AGGREGATE.settleHours), MARK.receivedAt, MARK.id]));
  });

  it('folds only corroborated mod battles into the public aggregate', async () => {
    const { prisma, service } = createService(null);

    await service.compute(NOW);

    expect(sqlOf(prisma)?.sql).toContain('corroboration');
  });
});
