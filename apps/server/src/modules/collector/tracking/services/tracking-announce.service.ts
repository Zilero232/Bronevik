import { Inject, Injectable } from '@nestjs/common';

import type { WebhookEmitter } from '../../../../core';
import type { GainedMark } from '../lib/marks-gain';

import { entitledSubscriptionWhere } from '../../../../common/lib';
import { PrismaService, WEBHOOK_EMITTER } from '../../../../core';

@Injectable()
export class TrackingAnnounceService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(WEBHOOK_EMITTER) private readonly webhooks: WebhookEmitter
  ) {}

  async announceMarks(gained: readonly GainedMark[]): Promise<void> {
    for (const mark of gained) {
      const player = await this.prisma.player.findUnique({ where: { accountId: mark.accountId }, select: { clanId: true, nickname: true } });

      await this.webhooks.emit({
        event: 'mark.gained',
        subject: { accountIds: [Number(mark.accountId)], clanIds: player?.clanId ? [Number(player.clanId)] : [] },
        data: {
          accountId: Number(mark.accountId),
          nickname: player?.nickname ?? null,
          tankId: mark.tankId,
          marks: mark.marks,
          previousMarks: mark.previous,
          percent: null,
          source: 'api'
        }
      });
    }
  }

  async isSubscriber(accountId: bigint): Promise<boolean> {
    const links = await this.prisma.userLestaAccount.count({
      where: {
        accountId,
        user: { subscriptions: { some: entitledSubscriptionWhere(new Date()) } }
      }
    });

    return links > 0;
  }
}
