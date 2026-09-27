import { Injectable } from '@nestjs/common';

import type { AccountPurgeStore } from '../../../lib/auth';
import type { Owned } from '../../community-core';

import { PrismaService } from '../../../core';
import { EntitlementsService } from '../../billing';
import { CommunityContentService } from '../../community-core';

@Injectable()
export class AccountPurgeService implements AccountPurgeStore {
  constructor(
    private readonly prisma: PrismaService,
    private readonly communityContent: CommunityContentService,
    private readonly entitlements: EntitlementsService
  ) {}

  async purgeAccount({ userId }: Owned): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await this.communityContent.purgeAuthoredBy({ userId, db: tx });

      await tx.subscription.updateMany({
        where: { userId },
        data: { status: 'canceled', cancelAtPeriodEnd: true, savedCardId: null, savedCardTitle: null }
      });

      await tx.apiKey.deleteMany({ where: { referenceId: userId } });
      await tx.webhookEndpoint.deleteMany({ where: { userId } });
      await tx.overlay.deleteMany({ where: { userId } });
      await tx.streamerIntegration.deleteMany({ where: { userId } });
      await tx.streamerProfile.deleteMany({ where: { userId } });
      await tx.notification.deleteMany({ where: { userId } });
      await tx.pushSubscription.deleteMany({ where: { userId } });
      await tx.notificationSettings.deleteMany({ where: { userId } });
      await tx.telegramAccount.deleteMany({ where: { userId } });
      await tx.modDevice.deleteMany({ where: { userId } });
      await tx.userLestaAccount.deleteMany({ where: { userId } });
    });

    this.entitlements.invalidate(userId);
  }
}
