import type { NotificationSettings } from '@bronevik/schemas';

import { Injectable } from '@nestjs/common';

import type { NotificationSettings as NotificationSettingsRow } from '../../../../generated';
import type { UpdateNotificationsInput } from '../me.types';

import { NOTIFICATION_CHANNEL_FROM_DB, NOTIFICATION_EVENT_FROM_DB, notificationChannelToDb, notificationEventToDb } from '../../../common/lib';
import { PrismaService } from '../../../core';
import { NOTIFICATION_DEFAULTS } from '../config';

@Injectable()
export class NotificationSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async get(userId: string): Promise<NotificationSettings> {
    const row = await this.prisma.notificationSettings.findUnique({ where: { userId } });

    return row ? this.toView(row) : this.defaults();
  }

  async update({ userId, channels, events, quietHours, sessionReport, weeklyDigest }: UpdateNotificationsInput): Promise<NotificationSettings> {
    const data = {
      ...(channels ? { channels: channels.flatMap((channel) => notificationChannelToDb(channel) ?? []) } : {}),
      ...(events ? { events: events.flatMap((event) => notificationEventToDb(event) ?? []) } : {}),
      ...(quietHours === undefined ? {} : { quietHoursStart: quietHours?.start ?? null, quietHoursEnd: quietHours?.end ?? null }),
      ...(sessionReport === undefined ? {} : { sessionReport }),
      ...(weeklyDigest === undefined ? {} : { weeklyDigest })
    };

    const row = await this.prisma.notificationSettings.upsert({
      where: { userId },
      create: {
        userId,
        channels: [...NOTIFICATION_DEFAULTS.channels],
        events: [...NOTIFICATION_DEFAULTS.events],
        sessionReport: NOTIFICATION_DEFAULTS.sessionReport,
        weeklyDigest: NOTIFICATION_DEFAULTS.weeklyDigest,
        ...data
      },
      update: data
    });

    return this.toView(row);
  }

  private toView(row: NotificationSettingsRow): NotificationSettings {
    return {
      channels: row.channels.map((channel) => NOTIFICATION_CHANNEL_FROM_DB[channel]),
      events: row.events.map((event) => NOTIFICATION_EVENT_FROM_DB[event]),
      quietHours:
        row.quietHoursStart !== null && row.quietHoursEnd !== null && row.quietHoursStart !== row.quietHoursEnd
          ? { start: row.quietHoursStart, end: row.quietHoursEnd }
          : null,
      sessionReport: row.sessionReport,
      weeklyDigest: row.weeklyDigest
    };
  }

  private defaults(): NotificationSettings {
    return {
      channels: NOTIFICATION_DEFAULTS.channels.map((channel) => NOTIFICATION_CHANNEL_FROM_DB[channel]),
      events: NOTIFICATION_DEFAULTS.events.map((event) => NOTIFICATION_EVENT_FROM_DB[event]),
      quietHours: null,
      sessionReport: NOTIFICATION_DEFAULTS.sessionReport,
      weeklyDigest: NOTIFICATION_DEFAULTS.weeklyDigest
    };
  }
}
