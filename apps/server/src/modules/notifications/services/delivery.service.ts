import { InjectQueue } from '@nestjs/bullmq';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { Redis } from 'ioredis';
import { match } from 'ts-pattern';

import type { NotificationSettings } from '../../../../generated';
import type { DeliverPayload, DigestPayload } from '../contracts';
import type { ChannelAvailability, RoutingSettings } from '../lib';
import type { ChannelSendInput, DeliverJob, DeliverToInput } from '../notifications.types';

import { errorMessage } from '../../../common/lib';
import { AppConfigService } from '../../../config';
import { isUniqueViolation, PrismaService, REDIS } from '../../../core';
import { TelegramSenderService } from '../../telegram';
import { NOTIFICATION_DEFAULTS, WEEKLY_DIGEST } from '../config';
import { NOTIFICATIONS_JOB, NOTIFICATIONS_QUEUE } from '../contracts';
import { quietDelayMs, renderDigest, renderNotification, resolveNotificationLocale, routeDigest, routeEvent, splitQuiet } from '../lib';
import { EmailService } from './email.service';
import { WebPushService } from './web-push.service';

@Injectable()
export class DeliveryService {
  private readonly logger = new Logger(DeliveryService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: AppConfigService,
    private readonly telegram: TelegramSenderService,
    private readonly webPush: WebPushService,
    private readonly email: EmailService,
    @Inject(REDIS) private readonly redis: Redis,
    @InjectQueue(NOTIFICATIONS_QUEUE.deliver) private readonly queue: Queue<DeliverPayload>
  ) {}

  async deliver(job: DeliverJob): Promise<number> {
    const { userId, dedupeKey, notification, onlyChannels } = job;
    const user = await this.recipient(userId);

    if (!user) {
      return 0;
    }

    const settings = this.routingSettings(user.notificationSettings);
    const available: ChannelAvailability = {
      telegram: this.telegram.isEnabled && user.telegramAccount !== null,
      webPush: this.webPush.isEnabled && user._count.pushSubscriptions > 0,
      email: false
    };

    const routed = routeEvent({ event: notification.event, settings, available });
    let channels = onlyChannels ? routed.filter((channel) => onlyChannels.includes(channel)) : routed;

    if (!onlyChannels) {
      const delayMs = quietDelayMs({ quietHours: settings.quietHours, now: new Date(), timeZone: user.timezone });
      const { now, later } = splitQuiet({ channels, delayMs });

      if (later.length > 0) {
        await this.queue.add(
          NOTIFICATIONS_JOB.deliver.event,
          { userId, dedupeKey, notification, onlyChannels: later },
          { delay: delayMs, jobId: `${userId}__${dedupeKey}__later`.replaceAll(':', '_') }
        );
      }

      channels = now;
    }

    const locale = resolveNotificationLocale(user.locale);
    const rendered = renderNotification({ notification, locale, webUrl: this.config.get('WEB_URL') });
    const telegramId = user.telegramAccount?.telegramId ?? null;

    const results = await Promise.allSettled(
      channels.map((channel) => this.deliverTo({ userId, channel, dedupeKey, notification, rendered, telegramId, locale }))
    );

    const failures = results.filter((result) => result.status === 'rejected');

    if (failures.length > 0) {
      throw new Error(`${failures.length} of ${channels.length} channels failed for ${userId}/${dedupeKey}`);
    }

    return channels.length;
  }

  async deliverDigest({ userId, weekKey, digest }: DigestPayload): Promise<number> {
    const user = await this.recipient(userId);

    if (!user) {
      return 0;
    }

    const settings = this.routingSettings(user.notificationSettings);
    const telegramId = user.telegramAccount?.telegramId ?? null;
    const channels = routeDigest({
      settings,
      available: { email: this.email.canReach(user.email), telegram: this.telegram.isEnabled && telegramId !== null, webPush: false }
    });

    if (channels.length === 0) {
      return 0;
    }

    const key = `${WEEKLY_DIGEST.dedupePrefix}${userId}:${weekKey}`;
    const claimed = await this.redis.set(key, '1', 'EX', WEEKLY_DIGEST.dedupeTtlSeconds, 'NX');

    if (claimed !== 'OK') {
      return 0;
    }

    const locale = resolveNotificationLocale(user.locale);
    const rendered = renderDigest({ digest, locale, webUrl: this.config.get('WEB_URL') });

    try {
      for (const channel of channels) {
        await match(channel)
          .with('email', () => this.email.sendDigest({ to: user.email, locale, rendered, digest }))
          .with('telegram', () => (telegramId === null ? undefined : this.telegram.sendNotification({ telegramId, locale, ...rendered })))
          .otherwise(() => undefined);
      }
    } catch (error) {
      await this.redis.del(key);

      throw error;
    }

    return channels.length;
  }

  private async deliverTo(input: DeliverToInput): Promise<void> {
    const { userId, channel, dedupeKey, notification, rendered } = input;
    const where = { userId_channel_dedupeKey: { userId, channel, dedupeKey } };
    const existing = await this.prisma.notification.findUnique({ where, select: { id: true, sentAt: true } });

    if (existing?.sentAt) {
      return;
    }

    let id = existing?.id;

    if (!id) {
      try {
        const created = await this.prisma.notification.create({
          data: { userId, channel, dedupeKey, event: notification.event, payload: { ...notification, ...rendered } },
          select: { id: true }
        });

        id = created.id;
      } catch (error) {
        if (isUniqueViolation(error)) {
          return;
        }

        throw error;
      }
    }

    try {
      await this.send(input);
      await this.prisma.notification.update({ where: { id }, data: { sentAt: new Date(), failedAt: null } });
    } catch (error) {
      await this.prisma.notification.update({ where: { id }, data: { failedAt: new Date() } });
      this.logger.warn(`${channel} delivery of ${dedupeKey} to ${userId} failed: ${errorMessage(error)}`);

      throw error;
    }
  }

  private async send({ userId, channel, rendered, telegramId, locale }: ChannelSendInput): Promise<void> {
    await match(channel)
      .with('site', () => undefined)
      .with('telegram', () => (telegramId === null ? undefined : this.telegram.sendNotification({ telegramId, locale, ...rendered })))
      .with('webPush', () => this.webPush.sendToUser({ userId, ...rendered }))
      .with('email', () => undefined)
      .exhaustive();
  }

  private recipient(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        locale: true,
        timezone: true,
        notificationSettings: true,
        telegramAccount: { select: { telegramId: true } },
        _count: { select: { pushSubscriptions: true } }
      }
    });
  }

  private routingSettings(row: NotificationSettings | null): RoutingSettings {
    if (!row) {
      return {
        channels: NOTIFICATION_DEFAULTS.channels,
        events: NOTIFICATION_DEFAULTS.events,
        quietHours: null,
        sessionReport: NOTIFICATION_DEFAULTS.sessionReport,
        weeklyDigest: NOTIFICATION_DEFAULTS.weeklyDigest
      };
    }

    const hasQuiet = row.quietHoursStart !== null && row.quietHoursEnd !== null && row.quietHoursStart !== row.quietHoursEnd;

    return {
      channels: row.channels,
      events: row.events,
      quietHours: hasQuiet ? { start: row.quietHoursStart ?? 0, end: row.quietHoursEnd ?? 0 } : null,
      sessionReport: row.sessionReport,
      weeklyDigest: row.weeklyDigest
    };
  }
}
