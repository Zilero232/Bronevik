import { Injectable } from '@nestjs/common';

import type { SubscribePushInput, UnsubscribePushInput } from '../notifications.types';

import { AppConfigService } from '../../../config';
import { PrismaService } from '../../../core';

@Injectable()
export class PushSubscriptionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: AppConfigService
  ) {}

  publicKey(): { publicKey: string | null } {
    return { publicKey: this.config.get('VAPID_PUBLIC_KEY') || null };
  }

  async subscribe({ userId, endpoint, keys, userAgent }: SubscribePushInput): Promise<void> {
    await this.prisma.pushSubscription.upsert({
      where: { endpoint },
      create: { userId, endpoint, p256dh: keys.p256dh, auth: keys.auth, userAgent },
      update: { userId, p256dh: keys.p256dh, auth: keys.auth, userAgent }
    });
  }

  async unsubscribe({ userId, endpoint }: UnsubscribePushInput): Promise<void> {
    await this.prisma.pushSubscription.deleteMany({ where: { userId, endpoint } });
  }
}
