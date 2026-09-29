import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';

import type { PurgeAccountPayload } from '../../contracts';

import { errorMessage } from '../../../../common/lib';
import { HYPERTABLE, PrismaService } from '../../../../core';
import { JOB, QUEUE } from '../../contracts';
import { PURGE } from '../config';

@Injectable()
export class PurgeService {
  private readonly logger = new Logger(PurgeService.name);

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(QUEUE.purge) private readonly queue: Queue
  ) {}

  async dispatch(): Promise<number> {
    const now = new Date();

    const expired = await this.prisma.player.findMany({
      where: { purgeAfter: { lte: now } },
      orderBy: { purgeAfter: 'asc' },
      select: { accountId: true },
      take: PURGE.dispatchBatch
    });

    const open = await this.prisma.dataDeletionRequest.findMany({
      where: { accountId: { in: expired.map((player) => player.accountId) }, status: { in: ['pending', 'processing'] } },
      select: { accountId: true }
    });

    const queued = new Set(open.map((request) => request.accountId));

    await this.prisma.dataDeletionRequest.createMany({
      data: expired
        .filter((player) => !queued.has(player.accountId))
        .map((player) => ({ accountId: player.accountId, source: 'retention' as const, reason: 'purge_after reached' }))
    });

    const pending = await this.prisma.dataDeletionRequest.findMany({
      where: { status: 'pending' },
      orderBy: { requestedAt: 'asc' },
      take: PURGE.dispatchBatch
    });

    await this.queue.addBulk(
      pending.map((request) => ({
        name: JOB.purge.account,
        data: { accountId: Number(request.accountId), requestId: request.id } satisfies PurgeAccountPayload,
        opts: { jobId: `purge-${request.id}` }
      }))
    );

    return pending.length;
  }

  async purgeAccount({ accountId, requestId }: PurgeAccountPayload) {
    const id = BigInt(accountId);

    if (requestId) {
      await this.prisma.dataDeletionRequest.update({ where: { id: requestId }, data: { status: 'processing' } });
    }

    try {
      await this.prisma.$transaction(async (tx) => {
        for (const table of Object.values(HYPERTABLE)) {
          await tx.$executeRawUnsafe(`DELETE FROM ${table} WHERE account_id = $1`, id);
        }

        await tx.clanMemberEvent.deleteMany({ where: { accountId: id } });
        await tx.weeklyChallengeProgress.deleteMany({ where: { accountId: id } });
        await tx.clanAttendance.deleteMany({ where: { accountId: id } });
        await tx.recruitCandidate.deleteMany({ where: { accountId: id } });
        await tx.competitionEntry.deleteMany({ where: { accountId: id } });
        await tx.replay.updateMany({ where: { accountId: id }, data: { accountId: null } });
        await tx.$executeRaw`UPDATE replay SET player_account_ids = array_remove(player_account_ids, ${id}) WHERE player_account_ids @> ARRAY[${id}]::bigint[]`;
        await tx.$executeRaw`UPDATE rng_daily SET players = array_remove(players, ${id}) WHERE players @> ARRAY[${id}]::bigint[]`;
        await tx.player.deleteMany({ where: { accountId: id } });
      });

      if (requestId) {
        await this.prisma.dataDeletionRequest.update({
          where: { id: requestId },
          data: { status: 'completed', completedAt: new Date(), error: null }
        });
      }

      this.logger.log(`purged account ${accountId}`);
    } catch (error) {
      if (requestId) {
        await this.prisma.dataDeletionRequest.update({ where: { id: requestId }, data: { status: 'failed', error: errorMessage(error) } });
      }

      throw error;
    }
  }
}
