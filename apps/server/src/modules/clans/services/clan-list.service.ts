import type { ClanListPage, ClanListQuery } from '@otmetki/schemas';

import { Injectable } from '@nestjs/common';

import type { ClanListRow } from '../clans.types';

import { Prisma } from '../../../../generated';
import { clampPercent, ratingValue, toNumber } from '../../../common/lib';
import { PrismaService } from '../../../core';
import { CLAN_LIST_SORT } from '../config';
import { toClanSummary } from '../mappers';

@Injectable()
export class ClanListService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: ClanListQuery): Promise<ClanListPage> {
    const pattern = query.search ? `%${query.search.replaceAll(/[%_\\]/g, (char) => `\\${char}`)}%` : null;
    const sort = Prisma.raw(CLAN_LIST_SORT[query.sort ?? 'members']);
    const order = Prisma.raw(query.order === 'asc' ? 'ASC' : 'DESC');

    const rows = await this.prisma.$queryRaw<ClanListRow[]>`
      SELECT c.clan_id AS "clanId", c.tag, c.name, c.color, c.motto, c.emblems, c.members_count AS "membersCount",
             c.created_at AS "createdAt", c.is_disbanded AS "isDisbanded",
             s.avg_wn8 AS "avgWn8", s.avg_win_rate AS "avgWinRate", s.active_members_7d AS "activeMembers7d",
             s.elo_rating_10 AS "eloRating10", c.stronghold_level AS "strongholdLevel", count(*) OVER () AS total
      FROM clan c
      LEFT JOIN LATERAL (
        SELECT avg_wn8, avg_win_rate, active_members_7d, elo_rating_10
        FROM clan_snapshot
        WHERE clan_id = c.clan_id
        ORDER BY captured_at DESC
        LIMIT 1
      ) s ON true
      WHERE NOT c.is_disbanded
        AND (${pattern}::text IS NULL OR c.tag ILIKE ${pattern} OR c.name ILIKE ${pattern})
        AND (${query.minMembers ?? null}::int IS NULL OR c.members_count >= ${query.minMembers ?? null}::int)
        AND (${query.minWn8 ?? null}::float8 IS NULL OR s.avg_wn8 >= ${query.minWn8 ?? null}::float8)
        AND (${query.minWinRate ?? null}::float8 IS NULL OR s.avg_win_rate >= ${query.minWinRate ?? null}::float8)
        AND (${query.minStrongholdLevel ?? null}::int IS NULL OR c.stronghold_level >= ${query.minStrongholdLevel ?? null}::int)
      ORDER BY ${sort} ${order} NULLS LAST, c.clan_id
      LIMIT ${query.limit} OFFSET ${query.offset}
    `;

    return {
      items: rows.map((row) => ({
        clan: toClanSummary(row),
        avgWn8: ratingValue({ kind: 'wn8', value: row.avgWn8 }),
        avgWinRate: clampPercent(row.avgWinRate),
        activeMembers7d: row.activeMembers7d,
        eloRating10: row.eloRating10,
        strongholdLevel: row.strongholdLevel
      })),
      total: rows[0] ? toNumber(rows[0].total) : 0,
      limit: query.limit,
      offset: query.offset
    };
  }
}
