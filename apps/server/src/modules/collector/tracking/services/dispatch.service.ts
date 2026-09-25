import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { addMinutes, subHours } from 'date-fns';
import { chunk } from 'remeda';

import type { AccountBatchPayload } from '../../contracts';
import type { EnqueueBatchesInput, SweepTier } from '../tracking.types';

import { PrismaService } from '../../../../core';
import { chunkIds } from '../../../../lib/lesta';
import { JOB, QUEUE } from '../../contracts';
import { TRACKING } from '../config';

@Injectable()
export class DispatchService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(QUEUE.poll) private readonly pollQueue: Queue,
    @InjectQueue(QUEUE.sweep) private readonly sweepQueue: Queue
  ) {}

  async dispatchActive(): Promise<number> {
    const now = new Date();

    const due = await this.prisma.player.findMany({
      where: { trackingTier: 'active', OR: [{ nextPollAt: null }, { nextPollAt: { lte: now } }] },
      orderBy: { nextPollAt: { sort: 'asc', nulls: 'first' } },
      select: { accountId: true },
      take: TRACKING.dispatch.maxActivePerTick
    });

    if (due.length === 0) {
      return 0;
    }

    const accountIds = due.map((player) => player.accountId);

    await this.prisma.player.updateMany({
      where: { accountId: { in: accountIds } },
      data: { nextPollAt: addMinutes(now, TRACKING.intervals.activeMinutes) }
    });

    await this.enqueue({ queue: this.pollQueue, name: JOB.poll.batch, accountIds: accountIds.map(Number) });

    return due.length;
  }

  async dispatchSweep(tier: SweepTier): Promise<number> {
    const polledBefore = subHours(new Date(), TRACKING.dispatch.sweepMinAgeHours);
    let cursor = 0n;
    let total = 0;
    let pageSize = 0;

    do {
      const page = await this.prisma.player.findMany({
        where: {
          trackingTier: tier,
          accountId: { gt: cursor },
          OR: [{ lastPolledAt: null }, { lastPolledAt: { lt: polledBefore } }]
        },
        orderBy: { accountId: 'asc' },
        select: { accountId: true },
        take: TRACKING.dispatch.sweepPageSize
      });

      pageSize = page.length;
      cursor = page.at(-1)?.accountId ?? cursor;
      total += pageSize;

      await this.enqueue({
        queue: this.sweepQueue,
        name: JOB.sweep.batch,
        accountIds: page.map((player) => Number(player.accountId)),
        priority: tier === 'dormant' ? TRACKING.dispatch.dormantPriority : undefined
      });
    } while (pageSize === TRACKING.dispatch.sweepPageSize);

    return total;
  }

  async enqueueSweep(accountIds: readonly number[]) {
    await this.enqueue({ queue: this.sweepQueue, name: JOB.sweep.batch, accountIds });
  }

  private async enqueue({ queue, name, accountIds, priority }: EnqueueBatchesInput) {
    const jobs = chunkIds({ ids: accountIds }).map((part) => ({
      name,
      data: { accountIds: part } satisfies AccountBatchPayload,
      opts: { priority }
    }));

    for (const part of chunk(jobs, TRACKING.dispatch.addBulkChunk)) {
      await queue.addBulk(part);
    }
  }
}
