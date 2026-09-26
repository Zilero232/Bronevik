import { Injectable } from '@nestjs/common';
import { subDays } from 'date-fns';

import type { MarksGainRow, PlayerActivityInput, PlayerActivityRow, SessionSumRow } from '../watchlist.types';

import { PrismaService } from '../../../core';
import { WATCHLIST_DIGEST_RUN } from '../config';

@Injectable()
export class WatchlistActivityService {
  constructor(private readonly prisma: PrismaService) {}

  async activity({ accountIds, since }: PlayerActivityInput): Promise<Map<bigint, PlayerActivityRow>> {
    if (accountIds.length === 0) {
      return new Map();
    }

    const ids = [...accountIds];
    const lookback = subDays(since, WATCHLIST_DIGEST_RUN.marksLookbackDays);

    const [sessions, marks] = await Promise.all([
      this.prisma.$queryRaw<SessionSumRow[]>`
        SELECT account_id, sum(battles)::int AS battles, sum(wins)::int AS wins, sum(damage_dealt)::float8 AS damage, max(last_activity_at) AS last_at
        FROM play_session
        WHERE account_id = ANY(${ids}::bigint[]) AND source = 'api' AND last_activity_at >= ${since} AND battles > 0
        GROUP BY account_id
      `,
      this.prisma.$queryRaw<MarksGainRow[]>`
        SELECT account_id, count(*)::int AS marks
        FROM (
          SELECT
            account_id,
            tank_id,
            max(marks_on_gun) FILTER (WHERE captured_at >= ${since}) AS after_marks,
            (array_agg(marks_on_gun ORDER BY captured_at DESC) FILTER (WHERE captured_at < ${since}))[1] AS before_marks
          FROM tank_snapshot
          WHERE account_id = ANY(${ids}::bigint[]) AND mode = 'random' AND captured_at >= ${lookback} AND marks_on_gun IS NOT NULL
          GROUP BY account_id, tank_id
        ) changes
        WHERE before_marks IS NOT NULL AND after_marks > before_marks
        GROUP BY account_id
      `
    ]);

    const sessionOf = new Map(sessions.map((row) => [BigInt(row.account_id), row]));
    const marksOf = new Map(marks.map((row) => [BigInt(row.account_id), row.marks]));

    return new Map(
      ids.map((accountId) => {
        const session = sessionOf.get(accountId);

        return [
          accountId,
          {
            accountId,
            battles: session?.battles ?? 0,
            wins: session?.wins ?? 0,
            damage: session?.damage ?? 0,
            lastBattleAt: session?.last_at ?? null,
            marksGained: marksOf.get(accountId) ?? 0
          }
        ];
      })
    );
  }
}
