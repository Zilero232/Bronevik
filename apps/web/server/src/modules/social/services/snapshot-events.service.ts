import { Injectable } from '@nestjs/common';
import { subDays } from 'date-fns';

import type { RecordEventRow, SnapshotEventRow } from '../queries';
import type { SnapshotWindow } from '../social.types';

import { PrismaService } from '../../../core';
import { FEED } from '../config';
import { isMarkGain } from '../lib';
import { recordEventsSql, tankEventsSql } from '../queries';

@Injectable()
export class SnapshotEventsService {
  constructor(private readonly prisma: PrismaService) {}

  async tankEvents({ accountIds, since, until }: SnapshotWindow): Promise<SnapshotEventRow[]> {
    if (accountIds.length === 0) {
      return [];
    }

    return this.prisma.$queryRaw<SnapshotEventRow[]>(
      tankEventsSql({ accountIds, lookback: subDays(since, FEED.lookbackDays), since, until, aceMastery: FEED.aceMastery })
    );
  }

  async recordEvents({ accountIds, since, until }: SnapshotWindow): Promise<RecordEventRow[]> {
    if (accountIds.length === 0) {
      return [];
    }

    return this.prisma.$queryRaw<RecordEventRow[]>(recordEventsSql({ accountIds, lookback: subDays(since, FEED.lookbackDays), since, until }));
  }

  async markCounts(window: SnapshotWindow): Promise<Map<bigint, number>> {
    const events = await this.tankEvents(window);
    const counts = new Map<bigint, number>();

    for (const event of events) {
      if (isMarkGain(event)) {
        counts.set(event.account_id, (counts.get(event.account_id) ?? 0) + ((event.marks_on_gun ?? 0) - (event.prev_marks ?? 0)));
      }
    }

    return counts;
  }
}
