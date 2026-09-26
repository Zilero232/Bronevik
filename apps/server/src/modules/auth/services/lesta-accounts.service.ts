import { Inject, Injectable, Logger } from '@nestjs/common';

import type { LestaAccountStore, LinkLestaAccountInput } from '../../../lib/auth';
import type { LestaClient } from '../../../lib/lesta';

import { errorMessage } from '../../../common/lib';
import { LESTA_CLIENT, PrismaService } from '../../../core';
import { CollectorProducerService } from '../../collector';

@Injectable()
export class LestaAccountsService implements LestaAccountStore {
  private readonly logger = new Logger(LestaAccountsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly collector: CollectorProducerService,
    @Inject(LESTA_CLIENT) private readonly lesta: LestaClient
  ) {}

  async findUserId(accountId: number): Promise<string | null> {
    const link = await this.prisma.userLestaAccount.findUnique({ where: { accountId: BigInt(accountId) }, select: { userId: true } });

    return link?.userId ?? null;
  }

  async link({ userId, accountId, nickname, accessToken, expiresAt }: LinkLestaAccountInput): Promise<void> {
    const id = BigInt(accountId);

    await this.prisma.$transaction(async (tx) => {
      await tx.player.upsert({
        where: { accountId: id },
        create: { accountId: id, nickname, trackingTier: 'active' },
        update: { nickname, trackingTier: 'active' }
      });

      await tx.playerNickname.upsert({
        where: { accountId_nickname: { accountId: id, nickname } },
        create: { accountId: id, nickname },
        update: { lastSeenAt: new Date() }
      });

      const hasPrimary = await tx.userLestaAccount.count({ where: { userId, isPrimary: true, NOT: { accountId: id } } });

      await tx.userLestaAccount.upsert({
        where: { accountId: id },
        create: { userId, accountId: id, accessToken, tokenExpiresAt: expiresAt, isPrimary: hasPrimary === 0 },
        update: { userId, accessToken, tokenExpiresAt: expiresAt }
      });
    });

    await this.collector.enrol({ accountId, priority: 'high', reason: 'login' });
  }

  async revokeTokens(userId: string): Promise<void> {
    const links = await this.prisma.userLestaAccount.findMany({ where: { userId, accessToken: { not: null } } });

    await Promise.allSettled(
      links.map(async (link) => {
        if (link.accessToken) {
          await this.lesta.auth.logout({ accessToken: link.accessToken }).catch((error: unknown) => {
            this.logger.warn(`Lesta token of ${link.accountId} was not revoked: ${errorMessage(error)}`);
          });
        }
      })
    );

    await this.prisma.userLestaAccount.updateMany({ where: { userId }, data: { accessToken: null, tokenExpiresAt: null } });
  }
}
