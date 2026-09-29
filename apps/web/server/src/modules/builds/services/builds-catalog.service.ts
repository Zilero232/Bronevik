import type { BuildsCatalog, BuildsCatalogEntry } from '@otmetki/schemas';

import { Injectable } from '@nestjs/common';
import { BUILD_USAGE } from '@otmetki/schemas';
import { sortBy, unique } from 'remeda';

import type { BuildsCatalogInput, CatalogUsageRow } from '../builds.types';

import { PrismaService } from '../../../core';
import { VehicleCatalogService } from '../../reference';
import { TankDifficultyService } from '../../tanks';
import { catalogPicksOf, resolvePicks, toProvisionOption } from '../mappers';
import { BuildDataService } from './build-data.service';

@Injectable()
export class BuildsCatalogService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vehicles: VehicleCatalogService,
    private readonly data: BuildDataService,
    private readonly difficulty: TankDifficultyService
  ) {}

  async catalog({ mode, difficulties, ...filter }: BuildsCatalogInput): Promise<BuildsCatalog> {
    const cohort = BUILD_USAGE.catalogCohort;

    const [catalogVehicles, rows, allowed] = await Promise.all([
      this.vehicles.filter(filter),
      this.prisma.$queryRaw<CatalogUsageRow[]>`
        SELECT DISTINCT ON (tank_id)
          tank_id AS "tankId", battles, players, win_rate AS "winRate", avg_damage AS "avgDamage", usage, computed_at AS "computedAt"
        FROM build_usage_aggregate
        WHERE mode = ${mode}::game_mode AND cohort = ${cohort}::build_cohort
        ORDER BY tank_id, computed_at DESC
      `,
      difficulties?.length ? this.difficulty.matching(difficulties) : Promise.resolve(null)
    ]);

    const vehicles = allowed ? catalogVehicles.filter((entry) => allowed.has(entry.summary.tankId)) : catalogVehicles;
    const byTank = new Map(rows.map((row) => [row.tankId, { row, picks: catalogPicksOf({ usage: row.usage, battles: row.battles }) }]));
    const ids = unique([...byTank.values()].flatMap(({ picks }) => [...picks.equipment, ...picks.consumables].map((pick) => pick.id)));
    const options = new Map((await this.data.provisionsByIds(ids)).map((provision) => [provision.provisionId, toProvisionOption(provision)]));

    const entries = vehicles.map(({ summary }): BuildsCatalogEntry => {
      const entry = byTank.get(summary.tankId);
      const isEnough = (entry?.row.battles ?? 0) >= BUILD_USAGE.minSample;

      return {
        vehicle: summary,
        battles: entry?.row.battles ?? 0,
        players: entry?.row.players ?? 0,
        isEnough,
        winRate: isEnough ? (entry?.row.winRate ?? null) : null,
        avgDamage: isEnough ? (entry?.row.avgDamage ?? null) : null,
        topEquipment: entry ? resolvePicks({ picks: entry.picks.equipment, options }) : [],
        topConsumables: entry ? resolvePicks({ picks: entry.picks.consumables, options }) : [],
        computedAt: entry?.row.computedAt.toISOString() ?? null
      };
    });

    return {
      mode,
      cohort,
      minSample: BUILD_USAGE.minSample,
      entries: sortBy(entries, [(entry) => entry.battles, 'desc'], [(entry) => entry.vehicle.tier, 'desc'], [(entry) => entry.vehicle.name, 'asc'])
    };
  }
}
