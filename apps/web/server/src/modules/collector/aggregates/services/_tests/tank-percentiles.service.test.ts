import { BRONYA_INDEX } from '@otmetki/ratings';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mock } from 'vitest-mock-extended';

import type { PercentileRow } from '../../aggregates.types';

import { BRONYA_REFERENCE, parseBronyaReference } from '../../../../reference';
import { ReferenceTablesService } from '../reference-tables.service';
import { TankPercentilesService } from '../tank-percentiles.service';
import { createPrisma, queryValues } from './aggregates.fixtures';

const NOW = new Date('2026-09-26T15:30:00Z');

const rising = (from: number) => BRONYA_INDEX.quantileLevels.map((_, index) => from + index);

const row: PercentileRow = {
  tank_id: 1,
  players: BRONYA_REFERENCE.minPlayers,
  damage: rising(1000),
  win_rate: rising(45),
  frags: rising(0),
  spotted: rising(0),
  defence: rising(0)
};

const createPercentiles = (rows: PercentileRow[]) => {
  const prisma = createPrisma();
  const tables = mock<ReferenceTablesService>();

  prisma.$queryRaw.mockResolvedValue(rows);

  return { prisma, tables, service: new TankPercentilesService(prisma, tables) };
};

describe('TankPercentilesService.compute', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('asks only for tanks with enough battles and players', async () => {
    const { prisma, service } = createPercentiles([]);

    await service.compute();

    expect(queryValues(prisma)).toEqual(expect.arrayContaining([BRONYA_REFERENCE.minTankBattles, BRONYA_REFERENCE.minPlayers]));
  });

  it('writes a reference that the rating tables can read back', async () => {
    const { prisma, service } = createPercentiles([row]);

    expect(await service.compute()).toEqual({ tanks: 1 });

    const [written] = [prisma.tankPercentile.createMany.mock.calls[0]?.[0]?.data ?? []].flat();
    const parsed = parseBronyaReference({ tankId: row.tank_id, value: written?.percentiles });

    expect(parsed?.quantiles).toEqual({ damage: row.damage, winRate: row.win_rate, frags: row.frags, spotted: row.spotted, defence: row.defence });
  });

  it('replaces only today’s rows of its own distribution', async () => {
    const { prisma, service } = createPercentiles([row]);

    await service.compute();

    expect(prisma.tankPercentile.deleteMany.mock.calls[0]?.[0]?.where).toEqual({
      distribution: BRONYA_REFERENCE.distribution,
      date: new Date('2026-09-26T00:00:00Z')
    });
  });

  it('drops the cached rating tables so the next rating uses the new reference', async () => {
    const { tables, service } = createPercentiles([]);

    await service.compute();

    expect(tables.invalidate).toHaveBeenCalledOnce();
  });
});
