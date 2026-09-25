import type { MapDetail, MapList, MapsQuery, MapStats } from '@bronevik/schemas';

import { Injectable } from '@nestjs/common';

import type { BattleSideRow, WinnerRow } from '../lib';

import { AppNotFoundException } from '../../../common/exceptions';
import { PrismaService } from '../../../core';
import { statsFromBattles, statsFromReplays, toMapDetail, toMapSummary } from '../lib';

@Injectable()
export class MapsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: MapsQuery): Promise<MapList> {
    const arenas = await this.prisma.arena.findMany({
      where: {
        isActive: true,
        ...(query.mode ? { modes: { has: query.mode } } : {}),
        ...(query.search ? { name: { contains: query.search, mode: 'insensitive' } } : {})
      },
      orderBy: { name: 'asc' }
    });

    return arenas.map(toMapSummary);
  }

  async detail(idOrSlug: string): Promise<MapDetail> {
    const arena = await this.prisma.arena.findFirst({ where: { OR: [{ arenaId: idOrSlug }, { slug: idOrSlug }] } });

    if (!arena) {
      throw new AppNotFoundException('NOT_FOUND', `No map ${idOrSlug}`);
    }

    return toMapDetail({ arena, stats: await this.stats(arena.arenaId) });
  }

  private async stats(arenaId: string): Promise<MapStats | null> {
    const battles = await this.prisma.$queryRaw<BattleSideRow[]>`
      SELECT DISTINCT ON (arena_unique_id) team, result
      FROM battle
      WHERE arena_id = ${arenaId} AND team IS NOT NULL
      ORDER BY arena_unique_id, received_at
    `;

    const fromBattles = statsFromBattles(battles);

    if (fromBattles) {
      return fromBattles;
    }

    const replays = await this.prisma.$queryRaw<WinnerRow[]>`
      SELECT (summary->>'winnerTeam')::int AS winner, count(DISTINCT coalesce(arena_unique_id::text, id))::float8 AS battles
      FROM replay
      WHERE arena_id = ${arenaId} AND status = 'parsed'::replay_status AND summary IS NOT NULL
      GROUP BY 1
    `;

    return statsFromReplays(replays);
  }
}
