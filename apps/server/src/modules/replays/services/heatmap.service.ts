import { Injectable } from '@nestjs/common';

import type { VehicleType } from '../../../../generated';
import type { ReplayTrack } from '../lib';
import type { ApplyHeatmapInput, Heatmap, HeatmapQueryInput } from '../replays.types';

import { toJsonValue } from '../../../common/lib';
import { PrismaService } from '../../../core';
import { HEATMAP } from '../config';
import { accumulateTracks, arenaBounds, emptyGrid, fallbackBounds, gridTotal, mergeGrids, readHeatmapCells } from '../lib';

@Injectable()
export class HeatmapService {
  constructor(private readonly prisma: PrismaService) {}

  async get({ arenaId, mode, scope }: HeatmapQueryInput): Promise<Heatmap> {
    const row = await this.prisma.mapHeatmap.findUnique({ where: { arenaId_mode_scope: { arenaId, mode, scope } } });
    const cells = row ? readHeatmapCells(row.data) : null;

    return {
      arenaId,
      mode,
      scope,
      gridSize: row && cells ? row.gridSize : HEATMAP.gridSize,
      samples: row && cells ? row.samples : 0,
      cells: cells ?? emptyGrid(HEATMAP.gridSize),
      updatedAt: row?.updatedAt.toISOString() ?? null
    };
  }

  async apply({ replayId, arenaId, mode, tracks }: ApplyHeatmapInput): Promise<number> {
    const [arena, classes] = await Promise.all([
      this.prisma.arena.findUnique({ where: { arenaId }, select: { data: true } }),
      this.vehicleClasses(tracks)
    ]);

    const bounds = arenaBounds(arena?.data) ?? fallbackBounds(HEATMAP.fallbackHalfSize);
    const scopes = new Map<string, ReplayTrack[]>([[HEATMAP.allScope, [...tracks]]]);

    for (const track of tracks) {
      const vehicleClass = classes.get(track.vehicleId);

      if (vehicleClass) {
        scopes.set(vehicleClass, [...(scopes.get(vehicleClass) ?? []), track]);
      }
    }

    const modes = [...new Set([HEATMAP.allMode, mode ?? HEATMAP.allMode])];
    let written = 0;

    await this.prisma.$transaction(async (tx) => {
      const claimed = await tx.replay.updateMany({ where: { id: replayId, heatmapAppliedAt: null }, data: { heatmapAppliedAt: new Date() } });

      if (claimed.count === 0) {
        return;
      }

      for (const [scope, scopeTracks] of scopes) {
        const add = accumulateTracks({ tracks: scopeTracks, bounds, gridSize: HEATMAP.gridSize });
        const samples = gridTotal(add);

        for (const heatmapMode of modes) {
          const key = { arenaId, mode: heatmapMode, scope };
          const current = await tx.mapHeatmap.findUnique({ where: { arenaId_mode_scope: key } });
          const base = current?.gridSize === HEATMAP.gridSize ? readHeatmapCells(current.data) : null;
          const cells = mergeGrids({ base, add });
          const data = toJsonValue({ cells });

          await tx.mapHeatmap.upsert({
            where: { arenaId_mode_scope: key },
            create: { ...key, gridSize: HEATMAP.gridSize, samples, data },
            update: { gridSize: HEATMAP.gridSize, samples: (base ? (current?.samples ?? 0) : 0) + samples, data }
          });

          written += 1;
        }
      }
    });

    return written;
  }

  private async vehicleClasses(tracks: readonly ReplayTrack[]): Promise<Map<number, VehicleType>> {
    const tankIds = tracks.flatMap((track) => (track.tankId === null ? [] : [track.tankId]));
    const tags = tracks.flatMap((track) => {
      const tag = track.vehicleType?.split(':')[1];

      return tag ? [tag] : [];
    });

    const vehicles = await this.prisma.vehicle.findMany({
      where: { OR: [{ tankId: { in: tankIds } }, { tag: { in: tags } }] },
      select: { tankId: true, tag: true, type: true }
    });

    const byTankId = new Map(vehicles.map((vehicle) => [vehicle.tankId, vehicle.type]));
    const byTag = new Map(vehicles.flatMap((vehicle) => (vehicle.tag ? [[vehicle.tag, vehicle.type] as const] : [])));
    const classes = new Map<number, VehicleType>();

    for (const track of tracks) {
      const type = (track.tankId === null ? undefined : byTankId.get(track.tankId)) ?? byTag.get(track.vehicleType?.split(':')[1] ?? '');

      if (type) {
        classes.set(track.vehicleId, type);
      }
    }

    return classes;
  }
}
