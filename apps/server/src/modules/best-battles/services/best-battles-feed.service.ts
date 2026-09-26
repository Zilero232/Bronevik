import { Injectable } from '@nestjs/common';

import type { BestBattle, BestBattleRow, BestBattlesPage, BestBattlesQuery, TankScopeInput } from '../best-battles.types';

import { PrismaService } from '../../../core';
import { VehicleCatalogService } from '../../reference';
import { BEST_BATTLES } from '../config';
import { mergeFeed, periodSince } from '../lib';
import { toBestBattle } from '../mappers';
import { modFeedSql, replayFeedSql } from '../queries';
import { BestBattleLookupsService } from './best-battle-lookups.service';

@Injectable()
export class BestBattlesFeedService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly catalog: VehicleCatalogService,
    private readonly lookups: BestBattleLookupsService
  ) {}

  async page(query: BestBattlesQuery, now: Date): Promise<BestBattlesPage> {
    const { period, metric, arenaId, medal, limit } = query;
    const since = periodSince({ period, now });
    const offset = Number(query.cursor ?? 0);
    const tankIds = await this.tankScope(query);
    const head = { period, metric, since: since.toISOString() };

    if (tankIds?.length === 0 || offset >= BEST_BATTLES.maxRank) {
      return { ...head, items: [], nextCursor: null };
    }

    const input = { since, battleTypes: BEST_BATTLES.battleTypes, tankIds, arenaId, medal, metric, take: offset + limit + 1 };
    const [mod, replays] = await Promise.all([
      this.prisma.$queryRaw<BestBattleRow[]>(modFeedSql(input)),
      this.prisma.$queryRaw<BestBattleRow[]>(replayFeedSql(input))
    ]);

    const { rows, nextOffset } = mergeFeed({ rows: [...mod, ...replays], metric, offset, limit });
    const lookups = await this.lookups.lookups({
      tankIds: rows.map((row) => row.tank_id),
      arenaIds: rows.flatMap((row) => (row.arena_id === null ? [] : [row.arena_id])),
      medalNames: rows.flatMap((row) => row.medals)
    });

    return {
      ...head,
      items: rows.flatMap((row): BestBattle[] => {
        const battle = toBestBattle({ row, ...lookups });

        return battle ? [battle] : [];
      }),
      nextCursor: nextOffset === null ? null : String(nextOffset)
    };
  }

  private async tankScope({ tankId, tier, type }: TankScopeInput): Promise<number[] | null> {
    if (tier === undefined && type === undefined) {
      return tankId === undefined ? null : [tankId];
    }

    const entries = await this.catalog.filter({
      ...(tier === undefined ? {} : { tiers: [tier] }),
      ...(type === undefined ? {} : { types: [type] })
    });

    const ids = entries.map((entry) => entry.summary.tankId);

    return tankId === undefined ? ids : ids.filter((id) => id === tankId);
  }
}
