import { Inject, Injectable } from '@nestjs/common';
import { subMinutes } from 'date-fns';

import type { WebhookEmitter } from '../../../core';

import { percentOf, ratio, toNumber } from '../../../common/lib';
import { PrismaService, WEBHOOK_EMITTER } from '../../../core';
import { SESSION_CLOSE } from '../config';

@Injectable()
export class SessionCloseService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(WEBHOOK_EMITTER) private readonly webhooks: WebhookEmitter
  ) {}

  async closeIdle(now = new Date()): Promise<number> {
    const sessions = await this.prisma.playSession.findMany({
      where: { status: 'open', lastActivityAt: { lt: subMinutes(now, SESSION_CLOSE.idleMinutes) } },
      orderBy: { lastActivityAt: 'asc' },
      take: SESSION_CLOSE.batchSize,
      include: { player: { select: { clanId: true, nickname: true } } }
    });

    let closed = 0;

    for (const session of sessions) {
      const claimed = await this.prisma.playSession.updateMany({
        where: { id: session.id, status: 'open' },
        data: { status: 'closed', endedAt: session.lastActivityAt }
      });

      if (claimed.count === 0 || session.battles === 0) {
        continue;
      }

      closed += 1;

      await this.webhooks.emit({
        event: 'session.ended',
        subject: { accountIds: [toNumber(session.accountId)], clanIds: session.player.clanId === null ? [] : [toNumber(session.player.clanId)] },
        data: {
          sessionId: session.id,
          accountId: toNumber(session.accountId),
          nickname: session.player.nickname,
          source: session.source,
          startedAt: session.startedAt.toISOString(),
          endedAt: session.lastActivityAt.toISOString(),
          battles: session.battles,
          wins: session.wins,
          winRate: percentOf({ value: session.wins, by: session.battles }),
          avgDamage: ratio({ value: session.damageDealt, by: session.battles }),
          wn8: session.wn8
        }
      });
    }

    return closed;
  }
}
