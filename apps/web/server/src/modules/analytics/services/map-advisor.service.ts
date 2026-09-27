import type { AnalyticsMaps, MapClassRow, MapStat } from '@otmetki/schemas';

import { Injectable } from '@nestjs/common';
import { groupBy } from 'remeda';

import type { AnalyticsInput, MapRow } from '../analytics.types';

import { PrismaService } from '../../../core';
import { ExpectedValuesService, VehicleCatalogService } from '../../reference';
import { ANALYTICS_SQL } from '../config';
import { mapHighlights, periodStart, statLine, winRateDelta } from '../lib';
import { toAggregateRow } from '../mappers';
import { OwnAccountService } from './own-account.service';

@Injectable()
export class MapAdvisorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly catalog: VehicleCatalogService,
    private readonly expected: ExpectedValuesService,
    private readonly accounts: OwnAccountService
  ) {}

  async maps({ userId, account, period }: AnalyticsInput): Promise<AnalyticsMaps> {
    const accountId = await this.accounts.resolve({ userId, account });
    const from = periodStart({ period, now: new Date() });

    const [rows, expected, catalog] = await Promise.all([
      this.prisma.$queryRaw<MapRow[]>`
        SELECT arena_id, tank_id, team::int AS team,
               count(*)::float8 AS battles,
               count(*) FILTER (WHERE result = 'win'::battle_result)::float8 AS wins,
               sum(damage_dealt)::float8 AS damage, sum(frags)::float8 AS frags, sum(spotted)::float8 AS spotted,
               sum(capture_points)::float8 AS cap, sum(dropped_capture_points)::float8 AS def,
               count(*) FILTER (WHERE survived)::float8 AS survived
        FROM battle
        WHERE account_id = ${accountId} AND battle_type = ${ANALYTICS_SQL.randomBattleType} AND started_at >= ${from ?? ANALYTICS_SQL.epoch}
        GROUP BY 1, 2, 3
      `,
      this.expected.all(),
      this.catalog.all()
    ]);

    const typed = rows.map((row) => ({ ...row, aggregate: toAggregateRow(row), vehicleClass: catalog.get(row.tank_id)?.summary.type ?? null }));
    const totals = statLine({ rows: typed.map((row) => row.aggregate), expected });
    const arenas = await this.prisma.arena.findMany({
      where: { arenaId: { in: [...new Set(rows.map((row) => row.arena_id))] } },
      select: { arenaId: true, name: true }
    });

    const nameOf = new Map(arenas.map((arena) => [arena.arenaId, arena.name]));

    const maps: MapStat[] = Object.entries(groupBy(typed, (row) => row.arena_id)).map(([arenaId, group]) => {
      const line = statLine({ rows: group.map((row) => row.aggregate), expected });

      return { arenaId, name: nameOf.get(arenaId) ?? null, ...line, winRateDelta: winRateDelta({ winRate: line.winRate, average: totals.winRate }) };
    });

    const cells: MapClassRow[] = Object.values(groupBy(typed, (row) => `${row.arena_id}|${row.vehicleClass ?? ''}|${row.team ?? ''}`)).flatMap(
      (group) => {
        const first = group[0];

        return first
          ? [
              {
                arenaId: first.arena_id,
                vehicleClass: first.vehicleClass,
                team: first.team,
                ...statLine({ rows: group.map((row) => row.aggregate), expected })
              }
            ]
          : [];
      }
    );

    return {
      accountId: Number(accountId),
      period,
      totals,
      maps: maps.toSorted((left, right) => right.battles - left.battles),
      rows: cells.toSorted((left, right) => right.battles - left.battles),
      ...mapHighlights({ maps })
    };
  }
}
