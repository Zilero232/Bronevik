import { Injectable } from '@nestjs/common';

import type { SubscribePushInput, UnsubscribePushInput } from '../notifications.types';

import { AppNotFoundException } from '../../../common/exceptions';
import { AppConfigService } from '../../../config';
import { PrismaService } from '../../../core';
import { vapidDetails } from '../lib';

@Injectable()
export class PushSubscriptionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: AppConfigService
  ) {}

  publicKey(): { publicKey: string | null } {
    return { publicKey: this.vapid()?.publicKey ?? null };
  }

  async subscribe({ userId, endpoint, keys, userAgent }: SubscribePushInput): Promise<void> {
    if (!this.vapid()) {
      throw new AppNotFoundException('INTEGRATION_UNAVAILABLE', 'Web push is not configured on this server');
    }

    await this.prisma.pushSubscription.upsert({
      where: { endpoint },
      create: { userId, endpoint, p256dh: keys.p256dh, auth: keys.auth, userAgent },
      update: { userId, p256dh: keys.p256dh, auth: keys.auth, userAgent }
    });
  }

  async unsubscribe({ userId, endpoint }: UnsubscribePushInput): Promise<void> {
    await this.prisma.pushSubscription.deleteMany({ where: { userId, endpoint } });
  }

  private vapid() {
    return vapidDetails({
      VAPID_PUBLIC_KEY: this.config.get('VAPID_PUBLIC_KEY'),
      VAPID_PRIVATE_KEY: this.config.get('VAPID_PRIVATE_KEY'),
      VAPID_SUBJECT: this.config.get('VAPID_SUBJECT')
    });
  }
}
