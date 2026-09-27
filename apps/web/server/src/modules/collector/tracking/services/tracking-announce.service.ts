import { Inject, Injectable } from '@nestjs/common';

import type { WebhookEmitter } from '../../../../core';
import type { GainedMark } from '../lib/marks-gain';

import { entitledSubscriptionWhere } from '../../../../common/lib';
import { markGainedKey, PrismaService, WEBHOOK_EMITTER } from '../../../../core';

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
        dedupeKey: markGainedKey(mark),
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

  async subscribers(accountIds: readonly bigint[]): Promise<Set<number>> {
    const links = await this.prisma.userLestaAccount.findMany({
      where: { accountId: { in: [...accountIds] }, user: { subscriptions: { some: entitledSubscriptionWhere(new Date()) } } },
      select: { accountId: true },
      distinct: ['accountId']
    });

    return new Set(links.map((link) => Number(link.accountId)));
  }
}
