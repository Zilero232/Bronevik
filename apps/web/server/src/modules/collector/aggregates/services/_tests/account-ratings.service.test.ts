import { describe, expect, it } from 'vitest';
import { mock } from 'vitest-mock-extended';

import type { Player, TankSnapshotLatest } from '../../../../../../generated';
import type { ReferenceTables } from '../../aggregates.types';

import { AGGREGATES } from '../../config';
import { AccountRatingsService } from '../account-ratings.service';
import { ReferenceTablesService } from '../reference-tables.service';
import { createPrisma } from './aggregates.fixtures';

const emptyTables: ReferenceTables = { expected: new Map(), tiers: new Map(), references: new Map() };
const [preferredMode, fallbackMode] = AGGREGATES.ratingModes;

const createRatings = ({ player = true, modes = [] }: { player?: boolean; modes?: string[] }) => {
  const prisma = createPrisma();
  const tables = mock<ReferenceTablesService>();

  prisma.player.findUnique.mockResolvedValue(player ? mock<Player>({ accountId: 1n }) : null);

  for (const mode of AGGREGATES.ratingModes) {
    prisma.tankSnapshotLatest.findFirst.mockResolvedValueOnce(modes.includes(mode) ? mock<TankSnapshotLatest>({ tankId: 1 }) : null);
  }

  prisma.accountSnapshot.findMany.mockResolvedValue([]);
  prisma.tankSnapshot.findMany.mockResolvedValue([]);
  prisma.tankSnapshotLatest.findMany.mockResolvedValue([]);
  tables.tables.mockResolvedValue(emptyTables);

  return { prisma, service: new AccountRatingsService(prisma, tables) };
};

describe('AccountRatingsService.compute', () => {
  it('skips an account that is not stored', async () => {
    const { prisma, service } = createRatings({ player: false });

    expect(await service.compute({ accountId: 1 })).toEqual({ skipped: true });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('skips an account without any tank snapshots', async () => {
    const { prisma, service } = createRatings({ modes: [] });

    expect(await service.compute({ accountId: 1 })).toEqual({ skipped: true });
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('rates from the preferred mode when it has snapshots', async () => {
    const { service } = createRatings({ modes: [preferredMode, fallbackMode] });

    expect(await service.compute({ accountId: 1 })).toMatchObject({ mode: preferredMode });
  });

  it('falls back to the next mode when the preferred one has no snapshots', async () => {
    const { prisma, service } = createRatings({ modes: [fallbackMode] });

    expect(await service.compute({ accountId: 1 })).toMatchObject({ mode: fallbackMode });
    expect(prisma.tankSnapshot.findMany.mock.calls[0]?.[0]?.where).toMatchObject({ mode: fallbackMode });
  });

  it('replaces the stored ratings in one transaction and reports what it wrote', async () => {
    const { prisma, service } = createRatings({ modes: [preferredMode] });

    const result = await service.compute({ accountId: 1 });
    const written = prisma.accountRating.createMany.mock.calls[0]?.[0]?.data;
    const tanks = prisma.accountTankRating.createMany.mock.calls[0]?.[0]?.data;

    expect(prisma.$transaction).toHaveBeenCalledOnce();
    expect(prisma.accountRating.deleteMany.mock.calls[0]?.[0]?.where).toEqual({ accountId: 1n });
    expect(result).toMatchObject({ periods: Array.isArray(written) ? written.length : -1, tanks: Array.isArray(tanks) ? tanks.length : -1 });
  });
});

describe('AccountRatingsService.compute retention', () => {
  it('keeps a tank in the overall rating after retention dropped its snapshot history', async () => {
    const { prisma, service } = createRatings({ modes: [preferredMode] });
    const capturedAt = new Date('2024-01-01T00:00:00Z');

    prisma.tankSnapshotLatest.findMany.mockResolvedValue([
      mock<TankSnapshotLatest>({
        tankId: 1,
        capturedAt,
        battles: 100,
        wins: 55,
        losses: 45,
        damageDealt: 150_000,
        damageReceived: 100_000,
        frags: 90,
        spotted: 120,
        xp: 70_000,
        survived: 30,
        hits: 700,
        shots: 900,
        capturePoints: 10,
        droppedCapturePoints: 40
      })
    ]);

    await service.compute({ accountId: 1 });

    const written = prisma.accountRating.createMany.mock.calls[0]?.[0]?.data;
    const overall = (Array.isArray(written) ? written : []).find((row) => row.period === 'overall');

    expect(overall?.battles).toBe(100);
  });
});
