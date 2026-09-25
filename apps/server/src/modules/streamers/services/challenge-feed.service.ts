import { challengeConditionSchema } from '@bronevik/schemas';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';
import { unique } from 'remeda';

import type { EvaluatedBattle } from '../lib';
import type { EvaluateInput, ResolveChallengeInput } from '../streamers.types';

import { readRecord } from '../../../common/lib';
import { PrismaService, REDIS } from '../../../core';
import { NotificationService } from '../../notifications';
import { VehicleCatalogService } from '../../reference';
import { CHALLENGE } from '../config';
import { evaluateChallenge } from '../lib';
import { ChatAnnouncerService } from './chat-announcer.service';
import { OverlayPublisherService } from './overlay-publisher.service';
import { StreamerStatsService } from './streamer-stats.service';

@Injectable()
export class ChallengeFeedService {
  private readonly logger = new Logger(ChallengeFeedService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly catalog: VehicleCatalogService,
    private readonly publisher: OverlayPublisherService,
    private readonly announcer: ChatAnnouncerService,
    private readonly stats: StreamerStatsService,
    private readonly notifications: NotificationService,
    @Inject(REDIS) private readonly redis: Redis
  ) {}

  async run(now = new Date()): Promise<number> {
    const cursor = await this.redis.get(CHALLENGE.feedCursorKey);

    if (!cursor) {
      await this.redis.set(CHALLENGE.feedCursorKey, now.toISOString());

      return 0;
    }

    const rows = await this.prisma.battle.findMany({
      where: { receivedAt: { gt: new Date(cursor) } },
      orderBy: { receivedAt: 'asc' },
      take: CHALLENGE.feedBatch,
      select: { accountId: true, receivedAt: true }
    });

    const last = rows.at(-1);

    if (!last) {
      return 0;
    }

    const accountIds = unique(rows.map((row) => row.accountId));

    await Promise.all(accountIds.map((accountId) => this.publisher.publish(accountId)));

    const active = await this.prisma.challenge.findMany({ where: { status: 'active', accountId: { in: accountIds } } });
    let resolved = 0;

    for (const challenge of active) {
      resolved += (await this.evaluate({ challenge, now })) ? 1 : 0;
    }

    await this.redis.set(CHALLENGE.feedCursorKey, last.receivedAt.toISOString());

    return resolved;
  }

  async expire(now = new Date()): Promise<number> {
    const overdue = await this.prisma.challenge.findMany({ where: { status: 'active', expiresAt: { lt: now } } });
    let expired = 0;

    for (const challenge of overdue) {
      const claimed = await this.prisma.challenge.updateMany({
        where: { id: challenge.id, status: 'active' },
        data: { status: 'expired', resolvedAt: now }
      });

      if (claimed.count === 0) {
        continue;
      }

      expired += 1;

      const text = await this.stats.text({
        streamerUserId: challenge.streamerUserId,
        pick: (copy) => copy.challengeExpired,
        values: { title: challenge.title }
      });

      await Promise.all([this.announcer.announce({ streamerUserId: challenge.streamerUserId, text }), this.publisher.publish(challenge.accountId)]);
    }

    return expired;
  }

  async evaluate({ challenge, now }: EvaluateInput): Promise<boolean> {
    const condition = challengeConditionSchema.safeParse(challenge.condition);

    if (!condition.success) {
      this.logger.warn(`challenge ${challenge.id} has an unreadable condition`);

      return false;
    }

    const rows = await this.prisma.battle.findMany({
      where: { accountId: challenge.accountId, startedAt: { gte: challenge.acceptedAt ?? challenge.createdAt } },
      orderBy: { startedAt: 'asc' },
      take: CHALLENGE.feedBatch,
      select: {
        id: true,
        tankId: true,
        startedAt: true,
        result: true,
        damageDealt: true,
        damageAssistedRadio: true,
        damageAssistedTrack: true,
        damageBlocked: true,
        frags: true,
        spotted: true,
        xp: true,
        survived: true,
        moePercent: true
      }
    });

    const battles: EvaluatedBattle[] = await Promise.all(
      rows.map(async (row) => {
        const vehicle = await this.catalog.find(row.tankId);

        return { ...row, tankType: vehicle?.summary.type ?? null, tier: vehicle?.summary.tier ?? null };
      })
    );

    const verdict = evaluateChallenge({ condition: condition.data, battles });

    if (verdict.status === 'active') {
      await this.prisma.challenge.update({
        where: { id: challenge.id },
        data: { progress: { ...readRecord(challenge.progress), ...verdict.progress } }
      });

      return false;
    }

    return this.resolve({ challenge, verdict, now });
  }

  private async resolve({ challenge, verdict, now }: ResolveChallengeInput): Promise<boolean> {
    const isSucceeded = verdict.status === 'succeeded';
    const claimed = await this.prisma.challenge.updateMany({
      where: { id: challenge.id, status: 'active' },
      data: {
        status: isSucceeded ? 'succeeded' : 'failed',
        resolvedAt: now,
        battleId: verdict.decidingBattleId,
        progress: { ...readRecord(challenge.progress), ...verdict.progress }
      }
    });

    if (claimed.count === 0) {
      return false;
    }

    const streamerUserId = challenge.streamerUserId;
    const text = await this.stats.text({
      streamerUserId,
      pick: (copy) => (isSucceeded ? copy.challengeSucceeded : copy.challengeFailed),
      values: { title: challenge.title }
    });

    await Promise.all([
      this.announcer.announce({ streamerUserId, text }),
      this.publisher.publish(challenge.accountId),
      this.notifications.notify({
        userId: streamerUserId,
        notification: { event: 'challengeResolved', challengeId: challenge.id, title: challenge.title, isSucceeded },
        dedupeKey: `challenge-${challenge.id}`
      })
    ]);

    return true;
  }
}
