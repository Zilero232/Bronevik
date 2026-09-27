import { describe, expect, it } from 'vitest';
import { mock, mockDeep } from 'vitest-mock-extended';

import type { MapHeatmap, Vehicle } from '../../../../../generated';
import type { PrismaService } from '../../../../core';
import type { ReplayTrack } from '../../lib';

import { HEATMAP } from '../../config';
import { emptyGrid } from '../../lib';
import { HeatmapService } from '../heatmap.service';

const track: ReplayTrack = {
  vehicleId: 1,
  accountId: 7,
  name: 'Player',
  team: 1,
  tankId: 11265,
  vehicleType: 'germany:G16_PzVIB_Tiger_II',
  points: [
    [0, 0, 0],
    [1, 10, 10]
  ]
};

const cellCount = HEATMAP.gridSize * HEATMAP.gridSize;

const createService = () => {
  const prisma = mockDeep<PrismaService>();

  prisma.$transaction.mockImplementation(async (run) => (typeof run === 'function' ? run(prisma) : Promise.all(run)));
  prisma.arena.findUnique.mockResolvedValue(null);
  prisma.vehicle.findMany.mockResolvedValue([mock<Vehicle>({ tankId: 11265, tag: 'G16_PzVIB_Tiger_II', type: 'heavyTank' })]);

  return { service: new HeatmapService(prisma), prisma };
};

describe('HeatmapService.get', () => {
  it('returns an empty grid of the configured size when the map has no heatmap yet', async () => {
    const { service, prisma } = createService();

    prisma.mapHeatmap.findUnique.mockResolvedValue(null);

    const heatmap = await service.get({ arenaId: 'a', mode: HEATMAP.allMode, scope: HEATMAP.allScope });

    expect(heatmap.gridSize).toBe(HEATMAP.gridSize);
    expect(heatmap.cells).toHaveLength(cellCount);
    expect(heatmap.cells.every((cell) => cell === 0)).toBe(true);
    expect(heatmap.samples).toBe(0);
    expect(heatmap.updatedAt).toBeNull();
  });

  it('treats a stored row with unreadable cells as empty', async () => {
    const { service, prisma } = createService();
    const row: MapHeatmap = { arenaId: 'a', mode: 'all', scope: 'all', gridSize: 8, samples: 12, data: { cells: 'broken' }, updatedAt: new Date() };

    prisma.mapHeatmap.findUnique.mockResolvedValue(row);

    const heatmap = await service.get({ arenaId: 'a', mode: 'all', scope: 'all' });

    expect(heatmap.gridSize).toBe(HEATMAP.gridSize);
    expect(heatmap.samples).toBe(0);
    expect(heatmap.updatedAt).toBeNull();
  });
});

describe('HeatmapService.apply', () => {
  it('does nothing when another run already claimed the replay', async () => {
    const { service, prisma } = createService();

    prisma.replay.updateMany.mockResolvedValue({ count: 0 });

    expect(await service.apply({ replayId: 'r1', arenaId: 'a', mode: 'ctf', tracks: [track] })).toBe(0);
    expect(prisma.mapHeatmap.upsert).not.toHaveBeenCalled();
  });

  it('writes the all scope and the vehicle class scope for the overall and the battle mode', async () => {
    const { service, prisma } = createService();

    prisma.replay.updateMany.mockResolvedValue({ count: 1 });
    prisma.mapHeatmap.findUnique.mockResolvedValue(null);

    const written = await service.apply({ replayId: 'r1', arenaId: 'a', mode: 'ctf', tracks: [track] });
    const keys = prisma.mapHeatmap.upsert.mock.calls.map(
      ([args]) => `${args.where.arenaId_mode_scope?.mode}/${args.where.arenaId_mode_scope?.scope}`
    );

    expect(written).toBe(keys.length);

    expect(keys.toSorted()).toEqual(
      [`${HEATMAP.allMode}/${HEATMAP.allScope}`, `${HEATMAP.allMode}/heavyTank`, `ctf/${HEATMAP.allScope}`, 'ctf/heavyTank'].toSorted()
    );
  });

  it('adds the new samples on top of a stored grid of the same size', async () => {
    const { service, prisma } = createService();
    const stored: MapHeatmap = {
      arenaId: 'a',
      mode: HEATMAP.allMode,
      scope: HEATMAP.allScope,
      gridSize: HEATMAP.gridSize,
      samples: 5,
      data: { cells: emptyGrid(HEATMAP.gridSize) },
      updatedAt: new Date()
    };

    prisma.replay.updateMany.mockResolvedValue({ count: 1 });
    prisma.mapHeatmap.findUnique.mockResolvedValue(stored);

    await service.apply({ replayId: 'r1', arenaId: 'a', mode: null, tracks: [track] });

    const allScope = prisma.mapHeatmap.upsert.mock.calls.find(([args]) => args.where.arenaId_mode_scope?.scope === HEATMAP.allScope)?.[0];

    expect(Number(allScope?.create.samples)).toBeGreaterThan(0);
    expect(allScope?.update.samples).toBe(stored.samples + Number(allScope?.create.samples));
  });
});
