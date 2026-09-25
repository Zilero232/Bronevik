import { Injectable } from '@nestjs/common';

import type { RecordEventRow, SnapshotEventRow, SnapshotWindow } from '../social.types';

import { PrismaService } from '../../../core';
import { FEED } from '../config';

@Injectable()
export class SnapshotEventsService {
  constructor(private readonly prisma: PrismaService) {}

  async tankEvents({ accountIds, since, until }: SnapshotWindow): Promise<SnapshotEventRow[]> {
    if (accountIds.length === 0) {
      return [];
    }

    const lookback = new Date(since.getTime() - FEED.lookbackDays * 86_400_000);

    return this.prisma.$queryRaw<SnapshotEventRow[]>`
      SELECT account_id, tank_id, captured_at, marks_on_gun, prev_marks, mark_of_mastery, prev_mastery
      FROM (
        SELECT account_id, tank_id, captured_at, marks_on_gun, mark_of_mastery,
          LAG(marks_on_gun) OVER w AS prev_marks,
          LAG(mark_of_mastery) OVER w AS prev_mastery
        FROM tank_snapshot
        WHERE account_id = ANY(${[...accountIds]}::bigint[])
          AND mode = 'all'::stats_mode
          AND captured_at >= ${lookback}
          AND captured_at < ${until}
        WINDOW w AS (PARTITION BY account_id, tank_id ORDER BY captured_at)
      ) events
      WHERE captured_at >= ${since}
        AND ((marks_on_gun > prev_marks) OR (mark_of_mastery = ${FEED.aceMastery} AND prev_mastery < ${FEED.aceMastery}))
      ORDER BY captured_at DESC
    `;
  }

  async recordEvents({ accountIds, since, until }: SnapshotWindow): Promise<RecordEventRow[]> {
    if (accountIds.length === 0) {
      return [];
    }

    const lookback = new Date(since.getTime() - FEED.lookbackDays * 86_400_000);

    return this.prisma.$queryRaw<RecordEventRow[]>`
      SELECT account_id, captured_at, max_damage, prev_max_damage, max_damage_tank_id
      FROM (
        SELECT account_id, captured_at, max_damage, max_damage_tank_id,
          LAG(max_damage) OVER (PARTITION BY account_id ORDER BY captured_at) AS prev_max_damage
        FROM account_snapshot
        WHERE account_id = ANY(${[...accountIds]}::bigint[])
          AND mode = 'all'::stats_mode
          AND captured_at >= ${lookback}
          AND captured_at < ${until}
      ) records
      WHERE captured_at >= ${since} AND max_damage > prev_max_damage
      ORDER BY captured_at DESC
    `;
  }

  async markCounts(window: SnapshotWindow): Promise<Map<bigint, number>> {
    const events = await this.tankEvents(window);
    const counts = new Map<bigint, number>();

    for (const event of events) {
      if (event.marks_on_gun !== null && event.prev_marks !== null && event.marks_on_gun > event.prev_marks) {
        counts.set(event.account_id, (counts.get(event.account_id) ?? 0) + (event.marks_on_gun - event.prev_marks));
      }
    }

    return counts;
  }
}
