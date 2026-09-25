import { Injectable, Logger } from '@nestjs/common';
import { sendNotification, WebPushError } from 'web-push';

import type { WebPushInput } from '../notifications.types';

import { AppConfigService } from '../../../config';
import { PrismaService } from '../../../core';
import { WEB_PUSH } from '../config';

@Injectable()
export class WebPushService {
  private readonly logger = new Logger(WebPushService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: AppConfigService
  ) {}

  get isEnabled(): boolean {
    return Boolean(this.config.get('VAPID_PUBLIC_KEY') && this.config.get('VAPID_PRIVATE_KEY') && this.config.get('VAPID_SUBJECT'));
  }

  async sendToUser({ userId, title, body, url }: WebPushInput): Promise<void> {
    if (!this.isEnabled) {
      return;
    }

    const subscriptions = await this.prisma.pushSubscription.findMany({ where: { userId } });
    const payload = JSON.stringify({ title, body, url });
    const vapidDetails = {
      subject: this.config.get('VAPID_SUBJECT'),
      publicKey: this.config.get('VAPID_PUBLIC_KEY'),
      privateKey: this.config.get('VAPID_PRIVATE_KEY')
    };

    const results = await Promise.allSettled(
      subscriptions.map((subscription) =>
        sendNotification({ endpoint: subscription.endpoint, keys: { p256dh: subscription.p256dh, auth: subscription.auth } }, payload, {
          TTL: WEB_PUSH.ttlSeconds,
          vapidDetails
        })
      )
    );

    const gone = subscriptions.filter((subscription, index) => {
      const result = results[index];

      return result?.status === 'rejected' && result.reason instanceof WebPushError && WEB_PUSH.goneStatuses.includes(result.reason.statusCode);
    });

    if (gone.length > 0) {
      await this.prisma.pushSubscription.deleteMany({ where: { id: { in: gone.map((subscription) => subscription.id) } } });
      this.logger.log(`removed ${gone.length} expired push subscriptions of ${userId}`);
    }

    const failed = results.filter((result) => result.status === 'rejected').length - gone.length;

    if (failed > 0 && failed === subscriptions.length - gone.length) {
      throw new Error(`web push to ${userId} failed on every subscription`);
    }
  }
}
