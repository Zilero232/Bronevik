import { Injectable } from '@nestjs/common';

import type { BestBattlesFacets, BestBattlesFacetsQuery } from '../best-battles.types';
import type { FacetCountRow, FacetTotalsRow } from '../queries';

import { PrismaService } from '../../../core';
import { BEST_BATTLES } from '../config';
import { periodSince } from '../lib';
import { toArena, toMedal } from '../mappers';
import { facetArenasSql, facetMedalsSql, facetTanksSql, facetTotalsSql } from '../queries';
import { BestBattleLookupsService } from './best-battle-lookups.service';

@Injectable()
export class BestBattlesFacetsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly lookups: BestBattleLookupsService
  ) {}

  async facets({ period }: BestBattlesFacetsQuery, now: Date): Promise<BestBattlesFacets> {
    const since = periodSince({ period, now });
    const scope = { since, battleTypes: BEST_BATTLES.battleTypes };
    const [totals, medalRows, tankRows, arenaRows] = await Promise.all([
      this.prisma.$queryRaw<FacetTotalsRow[]>(facetTotalsSql(scope)),
      this.prisma.$queryRaw<FacetCountRow[]>(facetMedalsSql({ ...scope, take: BEST_BATTLES.facetMedals })),
      this.prisma.$queryRaw<FacetCountRow[]>(facetTanksSql({ ...scope, take: BEST_BATTLES.facetTanks })),
      this.prisma.$queryRaw<FacetCountRow[]>(facetArenasSql({ ...scope, take: BEST_BATTLES.facetArenas }))
    ]);

    const { vehicles, arenas, medals } = await this.lookups.lookups({
      tankIds: tankRows.map((row) => Number(row.key)),
      arenaIds: arenaRows.map((row) => row.key),
      medalNames: medalRows.map((row) => row.key)
    });

    return {
      period,
      since: since.toISOString(),
      battles: totals[0]?.battles ?? 0,
      topDamage: totals[0]?.top_damage ?? null,
      medals: medalRows.map((row) => ({ ...toMedal({ name: row.key, medals }), battles: row.battles })),
      tanks: tankRows.flatMap((row) => {
        const vehicle = vehicles.get(Number(row.key));

        return vehicle ? [{ vehicle, battles: row.battles }] : [];
      }),
      arenas: arenaRows.flatMap((row) => {
        const arena = toArena({ arenaId: row.key, fallback: null, arenas });

        return arena ? [{ ...arena, battles: row.battles }] : [];
      }),
      computedAt: now.toISOString()
    };
  }
}
