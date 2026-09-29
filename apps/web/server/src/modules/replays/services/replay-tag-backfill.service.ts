import { Injectable } from '@nestjs/common';

import type { TagBackfillOutcome } from '../replays.types';

import { PrismaService } from '../../../core';
import { replaySummarySchema } from '../../../lib/replay';
import { REPLAY_TAGGING } from '../config';
import { replayTagColumns } from '../lib';

@Injectable()
export class ReplayTagBackfillService {
  constructor(private readonly prisma: PrismaService) {}

  async run(): Promise<TagBackfillOutcome> {
    const rows = await this.prisma.replay.findMany({
      where: { status: 'parsed', tagsVersion: { lt: REPLAY_TAGGING.version } },
      orderBy: { createdAt: 'asc' },
      take: REPLAY_TAGGING.backfillBatch,
      select: { id: true, summary: true }
    });

    const updates = rows.map((row) => {
      const summary = replaySummarySchema.safeParse(row.summary);

      return { id: row.id, data: summary.success ? replayTagColumns(summary.data) : { tagsVersion: REPLAY_TAGGING.version } };
    });

    if (updates.length > 0) {
      await this.prisma.$transaction(updates.map(({ id, data }) => this.prisma.replay.update({ where: { id }, data })));
    }

    return { tagged: updates.filter(({ data }) => 'tags' in data).length, skipped: updates.filter(({ data }) => !('tags' in data)).length };
  }
}
